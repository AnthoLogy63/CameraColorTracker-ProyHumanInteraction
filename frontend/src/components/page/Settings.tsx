/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable consistent-return */
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from './SettingsContext';

function Settings() {
  const navigate = useNavigate();
  const {
    red,
    green,
    blue,
    threshold,
    setRed,
    setGreen,
    setBlue,
    setThreshold,
  } = useSettings();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const frameRate = 5; // Límite de FPS para optimización
  let lastFrameTime = 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Acceso a la cámara
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        setStreaming(true);
      })
      .catch((err) => {
        console.error('Error al acceder a la cámara:', err);
      });

    return () => {
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const processFrame = (time: number) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !streaming) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (time - lastFrameTime < 1000 / frameRate) {
        requestAnimationFrame(processFrame);
        return;
      }

      lastFrameTime = time;

      const processWidth = 320; // Resolución para procesamiento
      const processHeight = 240;
      const displayWidth = 640; // Resolución para mostrar
      const displayHeight = 480;

      // Guardar el estado del contexto
      ctx.save();

      // Voltear horizontalmente
      ctx.scale(-1, 1);
      ctx.translate(-processWidth, 0);

      // Dibujar la imagen de la cámara en baja resolución para procesamiento
      ctx.drawImage(video, 0, 0, processWidth, processHeight);

      // Restaurar el estado del contexto
      ctx.restore();

      const frame = ctx.getImageData(0, 0, processWidth, processHeight);
      const { data } = frame;

      // Procesar los píxeles
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const isWithinThreshold = Math.abs(r - red) <= threshold
          && Math.abs(g - green) <= threshold
          && Math.abs(b - blue) <= threshold;

        if (isWithinThreshold) {
          // Blanco
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          // Negro
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
      }

      const processedImage = new ImageData(data, processWidth, processHeight);

      // Limpiar el canvas y escalar la imagen procesada
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.putImageData(processedImage, 0, 0);

      // Escalar el contenido al tamaño del canvas
      ctx.drawImage(canvas, 0, 0, processWidth, processHeight, 0, 0, displayWidth, displayHeight);

      requestAnimationFrame(processFrame);
    };

    processFrame(0);
  }, [red, green, blue, threshold, streaming]);

  const handleRedChange
  : React.ChangeEventHandler<HTMLInputElement> = (event) => setRed(Number(event.target.value));
  const handleGreenChange
  : React.ChangeEventHandler<HTMLInputElement> = (event) => setGreen(Number(event.target.value));
  const handleBlueChange
  : React.ChangeEventHandler<HTMLInputElement> = (event) => setBlue(Number(event.target.value));
  const handleThresholdChange
  : React.ChangeEventHandler<
  HTMLInputElement
  > = (event) => setThreshold(Number(event.target.value));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <h1 className="text-4xl font-bold text-white mb-8">Opciones</h1>

      <div className="bg-gray-800 rounded-lg p-6 space-y-4 w-full max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-white">
            <span>Rojo</span>
            <input
              type="range"
              min="0"
              max="255"
              value={red}
              onChange={handleRedChange}
              className="slider w-60"
            />
            <span>{red}</span>
          </div>

          <div className="flex items-center justify-between text-white">
            <span>Verde</span>
            <input
              type="range"
              min="0"
              max="255"
              value={green}
              onChange={handleGreenChange}
              className="slider w-60"
            />
            <span>{green}</span>
          </div>

          <div className="flex items-center justify-between text-white">
            <span>Azul</span>
            <input
              type="range"
              min="0"
              max="255"
              value={blue}
              onChange={handleBlueChange}
              className="slider w-60"
            />
            <span>{blue}</span>
          </div>

          <div className="flex items-center justify-between text-white">
            <span>Umbral</span>
            <input
              type="range"
              min="0"
              max="100"
              value={threshold}
              onChange={handleThresholdChange}
              className="slider w-60"
            />
            <span>{threshold}</span>
          </div>
        </div>

        <div className="flex flex-col items-center text-white space-y-4">
          <div className="flex items-center">
            <span className="mr-4">Color Resultante:</span>
            <div
              className="w-16 h-16 border-2 border-gray-500"
              style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
            />
          </div>
          <span className="mb-2">Vista Previa:</span>
          <video
            ref={videoRef}
            className="hidden"
          />
          <canvas
            ref={canvasRef}
            className="w-[640px] h-[480px] border-2 border-gray-500"
            width="640"
            height="480"
          />
        </div>
      </div>
    </div>
  );
}

export default Settings;

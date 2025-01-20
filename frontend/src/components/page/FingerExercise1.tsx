/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useSettings } from './SettingsContext';

import FingerStep1 from '../../assets/images/finger_ex1_step1.png';
import FingerStep2 from '../../assets/images/finger_ex1_step2.png';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

function FingerExercise1() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [text, setText] = useState('¡Ejercicio 1!');
  const [showText, setShowText] = useState(true);

  const { red, green, blue } = useSettings();

  useEffect(() => {
    const getCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing the camera: ', error);
      }
    };

    getCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const detectColor = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const frame = ctx.getImageData(0, 0, width, height);
      const { data } = frame;
      const detectedPixels: { x: number; y: number }[] = [];
  
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
  
        // Comparar el color con los valores de SettingsContext
        if (Math.abs(r - red) < 30 && Math.abs(g - green) < 30 && Math.abs(b - blue) < 30) {
          const x = (i / 4) % width;
          const y = Math.floor((i / 4) / width);
          detectedPixels.push({ x, y });
        }
      }
  
      if (detectedPixels.length > 0) { // Solo dibujar si isDrawing es true
        // Dividir los píxeles detectados en dos grupos
        const midpoint = Math.floor(detectedPixels.length / 2);
        const group1 = detectedPixels.slice(0, midpoint);
        const group2 = detectedPixels.slice(midpoint);
  
        // Función para calcular el centro de un grupo de píxeles
        const calculateCenter = (group: { x: number; y: number }[]) => {
          const centerX = group.reduce((sum, pixel) => sum + pixel.x, 0) / group.length;
          const centerY = group.reduce((sum, pixel) => sum + pixel.y, 0) / group.length;
          return { centerX, centerY };
        };
  
        // Calcular los centros de los dos grupos
        const center1 = calculateCenter(group1);
        const center2 = calculateCenter(group2);
  
        // Calcular los radios de los círculos basados en el área de cada grupo
        const radius1 = Math.sqrt(group1.length / Math.PI) * 1.3;
        const radius2 = Math.sqrt(group2.length / Math.PI) * 1.3;
  
        // Ajustar los centros para que los círculos no se salgan del canvas
        const adjustedCenter1X = Math.min(center1.centerX, CANVAS_WIDTH - radius1);
        const adjustedCenter1Y = Math.min(center1.centerY, CANVAS_HEIGHT - radius1);
        const adjustedCenter2X = Math.min(center2.centerX, CANVAS_WIDTH - radius2);
        const adjustedCenter2Y = Math.min(center2.centerY, CANVAS_HEIGHT - radius2);
  
        // Dibujar los círculos en el canvas de dibujo
        const drawingCtx = drawingCanvasRef.current?.getContext('2d');
        if (drawingCtx) {
          drawingCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Limpiar el canvas
  
          // Primer círculo
          drawingCtx.beginPath();
          drawingCtx.arc(adjustedCenter1X, adjustedCenter1Y, radius1, 0, Math.PI * 2);
          drawingCtx.strokeStyle = 'red'; // Color del círculo
          drawingCtx.lineWidth = 3;
          drawingCtx.stroke();
  
          // Segundo círculo
          drawingCtx.beginPath();
          drawingCtx.arc(adjustedCenter2X, adjustedCenter2Y, radius2, 0, Math.PI * 2);
          drawingCtx.strokeStyle = 'blue'; // Color del círculo
          drawingCtx.lineWidth = 3;
          drawingCtx.stroke();
        }
      }
    };
  
    // Dibuja los frames del video en el canvas y detecta el color
    useEffect(() => {
      const processFrame = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const drawingCanvas = drawingCanvasRef.current;
        if (video && canvas && drawingCanvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
  
            // Dibuja el video en el canvas (efecto espejo)
            ctx.save();
            ctx.scale(-1, 1); // Efecto espejo
            ctx.translate(-canvas.width, 0);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();
  
            // Detectar color y dibujar círculo
            detectColor(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
  
            // Solicitar el próximo frame
            requestAnimationFrame(processFrame);
          }
        }
      };
  
      requestAnimationFrame(processFrame);
    }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowText(false);
      setTimeout(() => {
        setText('Sigue los pasos ubicados en la zona izquierda de la pantalla');
        setShowText(true);
      }, 500);
    }, 3000);

    const timer2 = setTimeout(() => {
      setShowText(false);
      setTimeout(() => {
        setText('');
      }, 500);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <button
        onClick={() => navigate('/finger-session')}
        className="absolute top-4 left-4 text-white hover:text-blue-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>
      <h1 className="absolute top-20 left-1/2 transform -translate-x-1/2 text-5xl font-bold text-white text-center mb-4 z-10">
        Primer Ejercicio de Dedos
      </h1>
      <div className="flex w-full max-w-6xl items-center space-x-20">
        {/* Tutorial */}
        <div className="bg-gray-700 w-1/4 h-[27rem] rounded-lg shadow-lg p-6 flex flex-col">
          <h2 className="text-gray-100 font-bold text-3xl text-center mb-5">P A S O S</h2>
          <div className="grid grid-rows-2 gap-5 flex-grow">
            <div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-white text-center font-bold text-lg transition-all cursor-pointer hover:brightness-75 hover:scale-95 transform duration-300">
              <img src={FingerStep1} alt="Paso 1" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-white text-center font-bold text-lg transition-all cursor-pointer hover:brightness-75 hover:scale-95 transform duration-300">
              <img src={FingerStep2} alt="Paso 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Contenido de la cámara */}
        <div className="relative bg-white rounded-lg shadow-lg w-3/4 overflow-hidden">
          <button
            onClick={() => navigate('/settings')}  // Redirige a la página de configuración
            className="absolute top-4 right-4 text-white hover:scale-110 transition-transform duration-300 z-50"
            type="button"
          >
            <Settings className="h-8 w-8" /> {/* Icono de configuración */}
          </button>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
            autoPlay
            playsInline
          />
          
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'none' }} />

          <canvas
            ref={drawingCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="absolute top-0 left-0"
            style={{ pointerEvents: 'none' }}
          />

          {text && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
              <h1
                className={`text-5xl font-bold text-white text-center mb-4 transition-opacity duration-500 ${
                  showText ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {text}
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Botones para Ejercicio */}
      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {/* Botón Ejercicio 1 */}
        <button
          onClick={() => navigate('/finger-exercise-1')}
          className="px-9 py-5 rounded-full bg-green-600 text-white font-semibold text-2xl hover:bg-green-700 transition-colors"
          type="button"
        >
          Ejercicio 1
        </button>

        {/* Circulitos de separación */}
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>

        {/* Botón Ejercicio 2 */}
        <button
          onClick={() => navigate('/finger-exercise-2')}
          className="px-9 py-5 rounded-full bg-gray-600 text-white font-semibold text-2xl hover:bg-gray-700 transition-colors"
          type="button"
        >
          Ejercicio 2
        </button>
      </div>
    </div>
  );
}

export default FingerExercise1;

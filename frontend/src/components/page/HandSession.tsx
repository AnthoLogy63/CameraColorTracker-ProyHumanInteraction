import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FastForward, Settings } from 'lucide-react';  // Asegúrate de importar el ícono de lápiz
import { useSettings } from './SettingsContext';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;

function HandSession() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [text, setText] = useState('¡Hola!');
  const [showText, setShowText] = useState(true);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const { red, green, blue } = useSettings();

  const updateText = (newText: string, show: boolean) => {
    setShowText(false);
    setTimeout(() => {
      setText(newText);
      setShowText(show);
    }, 500);
  };

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

  // Detecta el color y dibuja un círculo sobre la zona detectada
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

    requestAnimationFrame(processFrame); // Iniciar el procesamiento de frames
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => updateText('¡Bienvenido a la sesión de rehabilitación para manos!', true), 3000),
      setTimeout(() => updateText('En la parte inferior puedes seleccionar el ejercicio que deseas realizar.', true), 8000),
      setTimeout(() => updateText('Estos ejercicios están diseñados para ayudarte a fortalecer la muñeca y mejorar la sensibilidad.', true), 12000),
      setTimeout(() => updateText('Durante cada ejercicio, sigue los pasos que se mostrarán en la zona izquierda de la pantalla.', true), 16000),
      setTimeout(() => updateText('En la cámara, aparecerán líneas de guía que deberás seguir para completar los ejercicios correctamente.', true), 20000),
      setTimeout(() => updateText('Recuerda que se recomienda realizar estos ejercicios al menos 3 veces al día para obtener mejores resultados.', true), 24000),
      setTimeout(() => updateText('Si lo deseas, puedes probar el funcionamiento del canvas directamente con tu cámara actual.', true), 28000),
      setTimeout(() => updateText('¡Buena suerte en tu rehabilitación!', true), 32000),
      setTimeout(() => {
        setText('');
        setShowText(false);
      }, 35000),
    ];

    timersRef.current = timers;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const skipTexts = () => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
    setShowText(false);
    setText('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <button
        onClick={() => navigate('/rehabilitation')}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      {/* Encabezado fuera de la cámara */}
      <h1 className="absolute top-10 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-white text-center z-10">
        Rehabilitación para manos
      </h1>

      {/* Contenedor de la cámara */}
      <div className="flex w-full max-w-6xl items-center justify-center mb-6 mt-10">
        <div className="relative bg-white rounded-lg shadow-lg w-[1000px] h-[700px] overflow-hidden">
          
          {/* Icono de configuración para ir a Settings y editar el color */}
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
            width="1000"
            height="700"
            autoPlay
            playsInline
          />
          {/* Canvas para la detección */}
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ display: 'none' }} />

          {/* Canvas para dibujar el círculo */}
          <canvas
            ref={drawingCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="absolute top-0 left-0"
            style={{ pointerEvents: 'none' }} // No bloquea la interacción con la cámara
          />
          {text && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-black bg-opacity-50 p-4">
              <h1
                className={`text-5xl font-bold text-white text-center mb-4 transition-opacity duration-500 ${showText ? 'opacity-100' : 'opacity-0'}`}
              >
                {text}
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Botones para ir a los ejercicios */}
      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={() => navigate('/hand-exercise-1')}
          className="px-9 py-5 rounded-full bg-gray-600 text-white font-semibold text-2xl hover:bg-gray-700 transition-colors"
          type="button"
        >
          Ejercicio 1
        </button>
        <div className="flex items-center space-x-4">
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
          <div className="w-4 h-4 rounded-full bg-white" />
        </div>
        <button
          onClick={() => navigate('/hand-exercise-2')}
          className="px-9 py-5 rounded-full bg-gray-600 text-white font-semibold text-2xl hover:bg-gray-700 transition-colors"
          type="button"
        >
          Ejercicio 2
        </button>
      </div>

      {/* Botón de saltar */}
      <button
        onClick={skipTexts}
        className="absolute bottom-9 right-9 p-5 rounded-full bg-yellow-600 text-white hover:bg-yellow-700 transition-colors shadow-lg"
        type="button"
      >
        <FastForward className="h-9 w-9" />
      </button>
    </div>
  );
}

export default HandSession;

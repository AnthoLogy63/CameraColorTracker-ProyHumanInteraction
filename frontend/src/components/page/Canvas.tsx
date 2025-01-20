/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from './SettingsContext';

function Canvas() {
  const navigate = useNavigate();
  const { red, green, blue } = useSettings();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const streamRef = useRef<MediaStream>();
  const intervalRef = useRef<NodeJS.Timeout>();

  let brushColor = 'black';

  const clearAreaRef = useRef({
    x: 20, y: 800, width: 220, height: 100,
  });
  const yellowAreaRef = useRef({
    x: 43, y: 25, width: 220, height: 100,
  });
  const greenAreaRef = useRef({
    x: 267, y: 25, width: 220, height: 100,
  });
  const redAreaRef = useRef({
    x: 490, y: 25, width: 220, height: 100,
  });
  const blueAreaRef = useRef({
    x: 713, y: 25, width: 220, height: 100,
  });
  const purpleAreaRef = useRef({
    x: 935, y: 25, width: 220, height: 100,
  }); // Nueva área para el color morado
  const blackAreaRef = useRef({
    x: 970, y: 785, width: 220, height: 100,
  });

  const drawClearArea = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = 'transparent';
    const clearArea = clearAreaRef.current;
    ctx.lineWidth = 2;
    ctx.strokeRect(clearArea.x, clearArea.y, clearArea.width + 50, clearArea.height);
    ctx.restore();
  };

  const drawYellowArea = (ctx: CanvasRenderingContext2D) => {
    const yellowArea = yellowAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.globalAlpha = 0;
    ctx.fillRect(yellowArea.x, yellowArea.y, yellowArea.width, yellowArea.height);
    ctx.restore();
  };

  const drawGreenArea = (ctx: CanvasRenderingContext2D) => {
    const greenArea = greenAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'green';
    ctx.globalAlpha = 0;
    ctx.fillRect(greenArea.x, greenArea.y, greenArea.width, greenArea.height);
    ctx.restore();
  };

  const drawRedArea = (ctx: CanvasRenderingContext2D) => {
    const redArea = redAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.globalAlpha = 0;
    ctx.fillRect(redArea.x, redArea.y, redArea.width, redArea.height);
    ctx.restore();
  };

  const drawBlueArea = (ctx: CanvasRenderingContext2D) => {
    const blueArea = blueAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.globalAlpha = 0;
    ctx.fillRect(blueArea.x, blueArea.y, blueArea.width, blueArea.height);
    ctx.restore();
  };

  const drawPurpleArea = (ctx: CanvasRenderingContext2D) => {
    const purpleArea = purpleAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'purple'; // Color morado
    ctx.globalAlpha = 0;
    ctx.fillRect(purpleArea.x, purpleArea.y, purpleArea.width, purpleArea.height);
    ctx.restore();
  };

  const drawBlackArea = (ctx: CanvasRenderingContext2D) => {
    const blackArea = blackAreaRef.current;
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0;
    ctx.fillRect(blackArea.x, blackArea.y, blackArea.width, blackArea.height);
    ctx.restore();
  };

  const clearCanvas = () => {
    const drawingCanvas = drawingCanvasRef.current as HTMLCanvasElement;
    const drawingCtx = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  };

  const handleNavigateBack = () => {
    clearCanvas();
    navigate('/game-options');
  };

  const detectColor = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const frame = ctx.getImageData(0, 0, width, height);
    const { data } = frame;
    const detectedPixels = [];

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

    if (detectedPixels.length > 0) {
      const centerX = detectedPixels
        .reduce((sum, pixel) => sum + pixel.x, 0) / detectedPixels.length;
      const centerY = detectedPixels
        .reduce((sum, pixel) => sum + pixel.y, 0) / detectedPixels.length;

      if (isDrawingRef.current) {
        const {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          x, y, width, height,
        } = clearAreaRef.current;

        if (
          centerX >= x
          && centerX <= x + width
          && centerY >= y
          && centerY <= y + height
        ) {
          clearCanvas();
        } else {
          const drawingCanvas = drawingCanvasRef.current as HTMLCanvasElement;
          const drawingCtx = drawingCanvas.getContext('2d') as CanvasRenderingContext2D;

          drawingCtx.lineWidth = 5;
          drawingCtx.lineCap = 'round';
          drawingCtx.strokeStyle = brushColor;

          drawingCtx.beginPath();
          drawingCtx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
          drawingCtx.lineTo(centerX, centerY);
          drawingCtx.stroke();
        }
      }

      const area = detectedPixels.length;
      const radius = Math.sqrt(area / Math.PI) * 1.3;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      lastPositionRef.current = { x: centerX, y: centerY };
      isDrawingRef.current = true;

      const yellowArea = yellowAreaRef.current;
      if (
        centerX >= yellowArea.x
        && centerX <= yellowArea.x + yellowArea.width
        && centerY >= yellowArea.y
        && centerY <= yellowArea.y + yellowArea.height
      ) {
        brushColor = 'yellow';
      }

      const greenArea = greenAreaRef.current;
      if (
        centerX >= greenArea.x
        && centerX <= greenArea.x + greenArea.width
        && centerY >= greenArea.y
        && centerY <= greenArea.y + greenArea.height
      ) {
        brushColor = 'green';
      }

      const redArea = redAreaRef.current;
      if (
        centerX >= redArea.x
        && centerX <= redArea.x + redArea.width
        && centerY >= redArea.y
        && centerY <= redArea.y + redArea.height
      ) {
        brushColor = 'red';
      }

      const blueArea = blueAreaRef.current;
      if (
        centerX >= blueArea.x
        && centerX <= blueArea.x + blueArea.width
        && centerY >= blueArea.y
        && centerY <= blueArea.y + blueArea.height
      ) {
        brushColor = 'blue';
      }

      const purpleArea = purpleAreaRef.current;
      if (
        centerX >= purpleArea.x
        && centerX <= purpleArea.x + purpleArea.width
        && centerY >= purpleArea.y
        && centerY <= purpleArea.y + purpleArea.height
      ) {
        brushColor = 'purple';
      }

      const blackArea = blackAreaRef.current;
      if (
        centerX >= blackArea.x
        && centerX <= blackArea.x + blackArea.width
        && centerY >= blackArea.y
        && centerY <= blackArea.y + blackArea.height
      ) {
        brushColor = 'black';
      }
    } else {
      isDrawingRef.current = false;
    }
  };

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            const canvas = canvasRef.current as HTMLCanvasElement;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

            intervalRef.current = setInterval(() => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.save();
              ctx.scale(-1, 1);

              if (videoRef.current && videoRef.current.readyState >= 2) {
                ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
              }
              ctx.restore();
              detectColor(ctx, canvas.width, canvas.height);
              drawClearArea(ctx);
              drawYellowArea(ctx);
              drawGreenArea(ctx);
              drawRedArea(ctx);
              drawBlueArea(ctx);
              drawPurpleArea(ctx);
              drawBlackArea(ctx);
            }, 100);
          };
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={handleNavigateBack}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-8">
          &quot;Dibuja lo que sientes, no solo lo que ves&quot;
        </h1>
        <div className="bg-white rounded-lg p-4 max-w-4xl mx-auto relative">
          <video ref={videoRef} className="hidden" autoPlay playsInline />
          <canvas
            ref={canvasRef}
            className="w-full border-2 border-gray-300 rounded"
            width="1200"
            height="900"
          >
            Canvas not supported
          </canvas>
          <canvas
            ref={drawingCanvasRef}
            className="absolute top-0 left-0 w-full h-full"
            width="1200"
            height="900"
          />

          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '10px',
              padding: '10px',
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'translateX(-50%)',
            }}
          >
            <button
              onClick={() => { brushColor = 'yellow'; }}
              className="bg-[#F7D63B] text-white px-14 py-5 rounded text-2xl flex justify-center items-center min-w-[120px] max-w-[150px]"
              type="button"
            >
              Amarillo
            </button>

            <button
              onClick={() => { brushColor = 'green'; }}
              className="bg-green-500 text-white px-14 py-5 rounded text-2xl flex justify-center items-center min-w-[120px] max-w-[150px]"
              type="button"
            >
              Verde
            </button>

            <button
              onClick={() => { brushColor = 'red'; }}
              className="bg-[#F7665E] text-white px-14 py-5 rounded text-2xl flex justify-center items-center min-w-[120px] max-w-[150px]"
              type="button"
            >
              Rojo
            </button>

            <button
              onClick={() => { brushColor = 'blue'; }}
              className="bg-blue-500 text-white px-14 py-5 rounded text-2xl flex justify-center items-center min-w-[120px] max-w-[150px]"
              type="button"
            >
              Azul
            </button>

            <button
              onClick={() => { brushColor = 'purple'; }}
              className="bg-purple-500 text-white px-14 py-5 rounded text-2xl flex justify-center items-center min-w-[120px] max-w-[150px]"
              type="button"
            >
              Morado
            </button>
          </div>

          <div
            style={{
              position: 'absolute',
              left: '10px',
              bottom: '10px',
              padding: '10px',
              display: 'flex',
              width: 'calc(100% - 20px)',
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={clearCanvas}
              className="bg-[#e8e3e3] text-[#000000] px-16 py-5 rounded text-2xl flex justify-center items-center min-w-[120px] max-w-[150px]"
              type="button"
            >
              Borrar
            </button>

            <button
              onClick={() => { brushColor = 'black'; }}
              className="bg-[#4a4a4a] text-[#ffffff] px-16 py-5 rounded text-2xl flex justify-center items-center min-w-[120px] max-w-[150px]"
              type="button"
            >
              Negro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Canvas;

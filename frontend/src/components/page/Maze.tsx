/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
} from 'lucide-react';
import Modal from './Modal';
import { useSettings } from './SettingsContext';

type Position = {
  x: number;
  y: number;
};

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  NULL,
}

const gridSizeX = 12; // Tamaño del laberinto
const gridSizeY = 10; // Tamaño del laberinto
const cellSize = 60; // Tamaño de cada celda en píxeles

const initialPosition: Position = {
  x: 0,
  y: gridSizeY - 1,
};

function Maze() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);
  const [mazeGrid] = useState([
    // Ejemplo de un laberinto
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  ]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mazeRef = useRef<HTMLCanvasElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastMove, setLastMove] = useState<Direction>(Direction.NULL);

  const drawMaze = () => {
    const canvas = mazeRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el laberinto
    mazeGrid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const x = cellIndex * cellSize;
        const y = rowIndex * cellSize;

        // Dibujar paredes o espacios
        ctx.fillStyle = cell ? '#1F2937' : '#F3F4F9'; // Color de las paredes y los caminos
        ctx.fillRect(x, y, cellSize, cellSize);

        // Borde de las celdas
        ctx.strokeStyle = '#E5E7EB';
        ctx.strokeRect(x, y, cellSize, cellSize);
      });
    });

    // Dibujar al jugador
    const playerX = position.x * cellSize + cellSize / 2;
    const playerY = position.y * cellSize + cellSize / 2;
    ctx.fillStyle = '#4ADE80'; // Color del jugador
    ctx.beginPath();
    ctx.arc(playerX, playerY, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();
  };

  const { red, green, blue } = useSettings();

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 500;

  const W_1_BOX = 300;
  const W_2_BOX = 80;

  const H_1_BOX = 80;
  const H_2_BOX = 300;

  const SIZES_BOXES = [
    {
      x: (CANVAS_WIDTH - W_1_BOX) / 2,
      y: CANVAS_HEIGHT - ((CANVAS_HEIGHT - (H_2_BOX + H_1_BOX * 2)) / 2) - H_1_BOX,
      width: W_1_BOX,
      height: H_1_BOX,
      direction: Direction.DOWN,
    },
    {
      x: (CANVAS_WIDTH - W_1_BOX) / 2,
      y: (CANVAS_HEIGHT - (H_2_BOX + H_1_BOX * 2)) / 2,
      width: W_1_BOX,
      height: H_1_BOX,
      direction: Direction.UP,
    },
    {
      x: CANVAS_WIDTH - ((CANVAS_WIDTH - (W_1_BOX + 2 * W_2_BOX)) / 2) - W_2_BOX,
      y: 100,
      width: W_2_BOX,
      height: H_2_BOX,
      direction: Direction.RIGHT,
    },
    {
      x: (CANVAS_WIDTH - (W_1_BOX + 2 * W_2_BOX)) / 2,
      y: 100,
      width: W_2_BOX,
      height: H_2_BOX,
      direction: Direction.LEFT,
    },
  ];

  const createBotton = (createBottonProps: {
    ctx: CanvasRenderingContext2D
    x: number
    y: number
    width: number
    height: number
    direction: Direction
  }) => {
    const {
      ctx, x, y, width, height, direction,
    } = createBottonProps;

    // Button background
    ctx.strokeStyle = 'black'; // Black border
    ctx.lineWidth = 2; // Border thickness
    ctx.fillStyle = 'rgba(180, 180, 180, 0.4)'; // Transparent white background

    // Draw rounded rectangle
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 10);
    ctx.fill(); // Fill transparent background
    ctx.stroke(); // Draw border

    // Draw arrow
    ctx.fillStyle = 'black'; // Arrow color
    ctx.beginPath();

    // Calculate arrow coordinates based on direction
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    switch (direction) {
      case Direction.UP:
        ctx.moveTo(centerX, centerY - 20);
        ctx.lineTo(centerX - 15, centerY + 10);
        ctx.lineTo(centerX + 15, centerY + 10);
        break;
      case Direction.DOWN:
        ctx.moveTo(centerX, centerY + 20);
        ctx.lineTo(centerX - 15, centerY - 10);
        ctx.lineTo(centerX + 15, centerY - 10);
        break;
      case Direction.LEFT:
        ctx.moveTo(centerX - 20, centerY);
        ctx.lineTo(centerX + 10, centerY - 15);
        ctx.lineTo(centerX + 10, centerY + 15);
        break;
      case Direction.RIGHT:
        ctx.moveTo(centerX + 20, centerY);
        ctx.lineTo(centerX - 10, centerY - 15);
        ctx.lineTo(centerX - 10, centerY + 15);
        break;
      default:
        break;
    }

    ctx.closePath();
    ctx.fill();
  };

  const createBottons = () => {
    const ctx = drawingCanvasRef.current?.getContext('2d') as CanvasRenderingContext2D;

    SIZES_BOXES.forEach((s) => createBotton({ ctx, ...s }));
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

      const area = detectedPixels.length;
      const radius = Math.sqrt(area / Math.PI) * 1.3;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();

      const matchDirection = SIZES_BOXES.find((s) => (
        s.x <= centerX
        && centerX <= s.x + s.width
        && s.y <= centerY
        && centerY <= s.y + s.height
      ));

      // Nueva lógica de movimiento con setState callback
      setLastMove((prevLastMove) => {
        if (matchDirection) {
          if (prevLastMove !== matchDirection.direction) {
            // Si no es el mismo movimiento que el último, realiza el movimiento
            setPosition((prevPosition) => {
              const { x, y } = prevPosition;
              let newCol = x;
              let newRow = y;

              if (matchDirection.direction === Direction.UP) newRow -= 1;
              else if (matchDirection.direction === Direction.DOWN) newRow += 1;
              else if (matchDirection.direction === Direction.LEFT) newCol -= 1;
              else if (matchDirection.direction === Direction.RIGHT) newCol += 1;

              if (
                newCol >= 0
                && newCol < gridSizeX
                && newRow >= 0
                && newRow < gridSizeY
                && !mazeGrid[newRow][newCol]
              ) {
                return { x: newCol, y: newRow };
              }
              return prevPosition;
            });

            // Devuelve la nueva dirección
            return matchDirection.direction;
          }
          // Si es el mismo movimiento, mantén el estado actual
          return prevLastMove;
        }
        // Si no está en ningún botón, resetea a NULL
        return prevLastMove !== Direction.NULL ? Direction.NULL : prevLastMove;
      });
    }
  };

  useEffect(() => {
    drawMaze();
  }, [position, mazeGrid]);

  // Configuración de la cámara y dibujo en canvas
  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
              // Usar requestAnimationFrame en lugar de setInterval
              const processFrame = () => {
                ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
                ctx.save();
                ctx.scale(-1, 1); // Efecto espejo
                ctx.translate(-canvasRef.current!.width, 0); // Ajusta posición tras el espejo
                ctx.drawImage(
                  videoRef.current!,
                  0,
                  0,
                  canvasRef.current!.width,
                  canvasRef.current!.height,
                );
                ctx.restore();
                detectColor(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

                // Solicitar el próximo frame de animación
                requestAnimationFrame(processFrame);
              };

              // Iniciar el procesamiento de frames
              requestAnimationFrame(processFrame);
            }
          }
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    setupCamera();
    createBottons();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Gana el juego si llega al objetivo
  useEffect(() => {
    if (position.x === gridSizeX - 1 && position.y === 0) {
      setShowModal(true);
    }
  }, [position]);

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white w-full flex flex-col items-center">
      <button
        onClick={() => navigate('/game-options')}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Maze</h1>
      </div>

      <div className="grid lg:grid-cols-2 w-full max-w-4xl gap-10">
        <canvas
          ref={mazeRef}
          width={gridSizeX * cellSize}
          height={gridSizeY * cellSize}
          className="border-2 border-gray-500 w-full"
        />

        <div className="w-full relative">
          <video ref={videoRef} className="hidden" autoPlay playsInline />
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-2 border-gray-500 rounded-lg w-full" />
          <canvas
            ref={drawingCanvasRef}
            className="absolute top-0 left-0 w-full"
            width="600"
            height="500"
          />
        </div>
      </div>

      <Modal
        title="Congratulations!"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="text-center">
          <p>Game Over</p>
          <button
            onClick={() => {
              setPosition(initialPosition);
              setShowModal(false);
            }}
            type="button"
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>

        </div>
      </Modal>
    </div>
  );
}

export default Maze;

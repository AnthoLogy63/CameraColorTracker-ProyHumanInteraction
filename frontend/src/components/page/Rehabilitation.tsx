/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Hand, Pointer,
} from 'lucide-react';

function Rehabilitation() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate('/game-options')}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>
      <div className="text-center w-full max-w-7xl ">
        <h1 className="text-6xl font-bold text-white mb-8">Rehabilitación</h1>

        <div className="grid grid-cols-2 gap-10 w-11/12 mx-auto">
          {/* Sección de la mano */}
          <div
            className="bg-green-600 rounded-lg p-6 cursor-pointer hover:bg-green-700 transition-colors transform hover:scale-105 w-full"
            onClick={() => navigate('/hand-session')}
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Hand className="mr-2" />
              MANOS
            </h2>
            <p className="text-gray-200 mb-4">Realiza una serie de ejercicios para mejorar la movilidad y fuerza de la mano.</p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2121/2121078.png"
              alt="Mano"
              className="w-44 h-44 mx-auto"
            />
          </div>

          <div
            className="bg-yellow-600 rounded-lg p-6 cursor-pointer hover:bg-yellow-700 transition-colors transform hover:scale-105 w-full"
            onClick={() => navigate('/finger-session')}
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
              <Pointer className="mr-2" />
              DEDOS
            </h2>
            <p className="text-gray-200 mb-4">Ejercita y fortalece los dedos mediante sesiones específicas de rehabilitación.</p>
            <img
              src="https://cdn-icons-png.flaticon.com/512/6907/6907294.png"
              alt="Dedos"
              className="w-44 h-44 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rehabilitation;

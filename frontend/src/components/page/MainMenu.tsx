import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Settings as SettingsIcon, LogOut } from 'lucide-react';

function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-8 animate-pulse">
            Active Hand
          </h1>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/game-options')}
            className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            type="button"
          >
            <Play className="mr-2 h-6 w-6" />
            Iniciar
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            type="button"
          >
            <SettingsIcon className="mr-2 h-6 w-6" />
            Opciones
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full group relative flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            type="button"
          >
            <LogOut className="mr-2 h-6 w-6" />
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;

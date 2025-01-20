/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function VideoGames() {
  const navigate = useNavigate();
  const games = [
    {
      title: 'Canvas',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300',
      description: 'Survive in the mystical forest',
    },

    {
      title: 'Laberinto',
      image: 'https://img.freepik.com/vector-gratis/patron-laberinto-circular-estilo-3d-fondo-amarillo-encontrar-atajos-ocultos_1017-53803.jpg?t=st=1730690128~exp=1730693728~hmac=1d980057e065acc1c403853f8b2107b49b5262ae687b44fa88a24d476541a54f&w=740',
      description: 'realiza el laberinto sin chocar con las paredes',
    },

    {
      title: 'Sigue la pista',
      image: 'https://img.freepik.com/vector-gratis/ilustracion-concepto-preparacion-parto_114360-16571.jpg?t=st=1730690321~exp=1730693921~hmac=47eb0eb6e4e0a4820e6fa037f355c69a58b069d9fa15061934347b0d745800bf&w=740',
      description: 'Realiza las indicaciones',
    },
  ];

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={() => navigate('/game-options')}
        className="absolute top-4 left-4 text-white hover:text-purple-400 transition-colors"
        type="button"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Video Games</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
              <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-gray-300">{game.description}</p>
                <button
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  type="button"
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoGames;

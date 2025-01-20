import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainMenu from '@/components/page/MainMenu';
import GameOptions from '@/components/page/GameOptions';
import Canvas from '@/components/page/Canvas';
import VideoGames from '@/components/page/VideoGames';
import Rehabilitation from '@/components/page/Rehabilitation';
import Settings from '@/components/page/Settings';
import HandSession from './components/page/HandSession';
import HandExercise1 from './components/page/HandExercise1';
import HandExercise2 from './components/page/HandExercise2';
import ArmSession from './components/page/ArmSession';
import FingerSession from './components/page/FingerSession';
import FingerExercise1 from './components/page/FingerExercise1';
import FingerExercise2 from './components/page/FingerExercise2';
import Maze from './components/page/Maze';

function App() {
  return (
    <HashRouter basename="/">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game-options" element={<GameOptions />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/videogames" element={<VideoGames />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/laberinto" element={<Maze />} />
          <Route path="/rehabilitation" element={<Rehabilitation />} />
          <Route path="/hand-session" element={<HandSession />} />
          <Route path="/hand-exercise-1" element={<HandExercise1 />} />
          <Route path="/hand-exercise-2" element={<HandExercise2 />} />
          <Route path="/arm-session" element={<ArmSession />} />
          <Route path="/finger-session" element={<FingerSession />} />
          <Route path="/finger-exercise-1" element={<FingerExercise1 />} />
          <Route path="/finger-exercise-2" element={<FingerExercise2 />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

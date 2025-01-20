/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useContext, useState } from 'react';

// Definir la forma de los datos que gestionará el contexto
interface SettingsContextType {
  rgbColor: string; // El color actual en formato 'rgb(r, g, b)'
  red: number;
  green: number;
  blue: number;
  threshold: number; // Tolerancia para detección de color
  setRed: (value: number) => void;
  setGreen: (value: number) => void;
  setBlue: (value: number) => void;
  setThreshold: (value: number) => void;
  generateBlackAndWhitePreview:
  (frameData: Uint8ClampedArray, width: number, height: number) => Uint8ClampedArray;
}

// Crear el contexto
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Crear el proveedor
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);
  const [threshold, setThreshold] = useState(50); // Valor inicial del umbral

  const rgbColor = `rgb(${red}, ${green}, ${blue})`;

  // Función para generar una vista en blanco y negro basada en el color seleccionado y el umbral
  const generateBlackAndWhitePreview = (
    frameData: Uint8ClampedArray,
  ): Uint8ClampedArray => {
    const output = new Uint8ClampedArray(frameData.length);

    for (let i = 0; i < frameData.length; i += 4) {
      const r = frameData[i];
      const g = frameData[i + 1];
      const b = frameData[i + 2];

      // Calcular la diferencia entre el color actual y el color seleccionado
      const colorDistance = Math.sqrt(
        (r - red) ** 2 + (g - green) ** 2 + (b - blue) ** 2,
      );

      if (colorDistance <= threshold) {
        // Si está dentro del umbral, se muestra como blanco
        output[i] = 255;
        output[i + 1] = 255;
        output[i + 2] = 255;
        output[i + 3] = 255; // Alpha
      } else {
        // Si no, se muestra como negro
        output[i] = 0;
        output[i + 1] = 0;
        output[i + 2] = 0;
        output[i + 3] = 255; // Alpha
      }
    }

    return output;
  };

  return (
    <SettingsContext.Provider
      value={{
        rgbColor,
        red,
        green,
        blue,
        threshold,
        setRed,
        setGreen,
        setBlue,
        setThreshold,
        generateBlackAndWhitePreview,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Crear un hook para usar el contexto fácilmente
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe usarse dentro de un SettingsProvider');
  }
  return context;
};

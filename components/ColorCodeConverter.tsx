'use client';

import { useState } from 'react';

export default function ColorCodeConverter() {
  const [hex, setHex] = useState('#3b82f6');

  const hexToRgb = (hexStr: string) => {
    let cleanHex = hexStr.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((char) => char + char).join('');
    }
    if (cleanHex.length !== 6) return null;

    const num = parseInt(cleanHex, 16);
    if (isNaN(num)) return null;

    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Color</label>
          <input
            type="color"
            value={hex.startsWith('#') && hex.length === 7 ? hex : '#3b82f6'}
            onChange={(e) => setHex(e.target.value)}
            className="w-16 h-12 p-1 border rounded-lg cursor-pointer bg-white"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">HEX Color Code</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#3b82f6"
            className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div
        className="w-full h-24 rounded-lg border shadow-inner transition-colors"
        style={{ backgroundColor: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '#ffffff' }}
      />

      {rgb && hsl ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
          <div className="p-3 border rounded-lg bg-gray-50">
            <strong>HEX:</strong> {hex.toUpperCase()}
          </div>
          <div className="p-3 border rounded-lg bg-gray-50">
            <strong>RGB:</strong> rgb({rgb.r}, {rgb.g}, {rgb.b})
          </div>
          <div className="p-3 border rounded-lg bg-gray-50">
            <strong>HSL:</strong> hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
          </div>
        </div>
      ) : (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> Invalid HEX color code.
        </div>
      )}
    </div>
  );
}
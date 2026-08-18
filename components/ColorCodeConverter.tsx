'use client';

import { useState } from 'react';

export default function ColorCodeConverter() {
  const [hex, setHex] = useState('#3b82f6');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const hexToRgb = (hexStr: string) => {
    let cleanHex = hexStr.replace('#', '').trim();
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

  const hexValue = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;
  const rgbValue = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '';
  const hslValue = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '';

  const handleCopy = async (text: string, fieldName: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePresetSelect = (presetHex: string) => {
    setHex(presetHex);
  };

  return (
    <div className="space-y-4 text-gray-100">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Color Palette Presets</label>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => handlePresetSelect('#3B82F6')}
            className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            Blue
          </button>
          <button
            onClick={() => handlePresetSelect('#10B981')}
            className="px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 transition"
          >
            Green
          </button>
          <button
            onClick={() => handlePresetSelect('#EF4444')}
            className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-500 transition"
          >
            Red
          </button>
          <button
            onClick={() => handlePresetSelect('#8B5CF6')}
            className="px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-500 transition"
          >
            Purple
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium mb-2">Picker</label>
          <input
            type="color"
            value={hex.startsWith('#') && hex.length === 7 ? hex : '#3b82f6'}
            onChange={(e) => setHex(e.target.value)}
            className="w-16 h-12 p-1 border rounded-lg cursor-pointer bg-gray-900 border-gray-700"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">HEX Color Code</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#3b82f6"
            className="w-full p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 border-gray-700 text-gray-100"
          />
        </div>
      </div>

      <div
        className="w-full h-24 rounded-lg border border-gray-700 shadow-inner transition-colors flex items-center justify-center font-mono text-sm font-bold"
        style={{
          backgroundColor: rgb ? rgbValue : '#111827',
          color: hsl && hsl.l > 50 ? '#000000' : '#ffffff',
        }}
      >
        {rgb ? `${hexValue} | ${rgbValue}` : 'Invalid Color'}
      </div>

      {rgb && hsl ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
          <div className="p-3 border rounded-lg bg-gray-900 border-gray-700 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 block">HEX</span>
              <strong className="text-gray-100">{hexValue}</strong>
            </div>
            <button
              onClick={() => handleCopy(hexValue, 'hex')}
              className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
            >
              {copiedField === 'hex' ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="p-3 border rounded-lg bg-gray-900 border-gray-700 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 block">RGB</span>
              <strong className="text-gray-100">{rgbValue}</strong>
            </div>
            <button
              onClick={() => handleCopy(rgbValue, 'rgb')}
              className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
            >
              {copiedField === 'rgb' ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="p-3 border rounded-lg bg-gray-900 border-gray-700 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 block">HSL</span>
              <strong className="text-gray-100">{hslValue}</strong>
            </div>
            <button
              onClick={() => handleCopy(hslValue, 'hsl')}
              className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
            >
              {copiedField === 'hsl' ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 border border-red-800 bg-red-950 text-red-300 rounded-lg text-sm font-mono">
          <strong>Error:</strong> Please enter a valid 3-digit or 6-digit HEX color code.
        </div>
      )}
    </div>
  );
}
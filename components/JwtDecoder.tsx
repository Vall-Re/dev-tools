'use client';

import { useState } from 'react';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  const decodeJwt = () => {
    if (!token.trim()) return;
    setError('');
    
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT structure. A valid JWT must contain 3 parts separated by dots.');
      setHeader('');
      setPayload('');
      return;
    }

    try {
      const base64UrlDecode = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const decodedHeader = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
      const decodedPayload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);

      setHeader(decodedHeader);
      setPayload(decodedPayload);
    } catch (err: unknown) {
      setError('Failed to parse JWT payload or header: ' + (err as Error).message);
      setHeader('');
      setPayload('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Encoded JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT token here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
          className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={decodeJwt}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Decode JWT
      </button>

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono">
          <strong>Error:</strong> {error}
        </div>
      )}

      {header && (
        <div>
          <label className="block text-sm font-medium mb-2">Header</label>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-red-400 font-mono text-sm overflow-x-auto">
            {header}
          </pre>
        </div>
      )}

      {payload && (
        <div>
          <label className="block text-sm font-medium mb-2">Payload</label>
          <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto">
            {payload}
          </pre>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect, useCallback } from 'react';

interface TokenStatus {
  isExpired: boolean;
  expDate?: string;
  iatDate?: string;
  timeRemaining?: string;
}

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<TokenStatus | null>(null);
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjI1MjQ2MDgwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

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

  const parseToken = useCallback((jwtToken: string) => {
    if (!jwtToken.trim()) {
      setHeader('');
      setPayload('');
      setError('');
      setStatus(null);
      return;
    }

    const parts = jwtToken.trim().split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT structure. A valid JWT must contain 3 parts separated by dots.');
      setHeader('');
      setPayload('');
      setStatus(null);
      return;
    }

    try {
      const decodedHeaderObj = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayloadObj = JSON.parse(base64UrlDecode(parts[1]));

      setHeader(JSON.stringify(decodedHeaderObj, null, 2));
      setPayload(JSON.stringify(decodedPayloadObj, null, 2));
      setError('');

      const now = Math.floor(Date.now() / 1000);
      let isExpired = false;
      let expDate: string | undefined;
      let iatDate: string | undefined;
      let timeRemaining: string | undefined;

      if (decodedPayloadObj.exp) {
        const expTime = Number(decodedPayloadObj.exp);
        expDate = new Date(expTime * 1000).toLocaleString();
        if (expTime < now) {
          isExpired = true;
          timeRemaining = 'Expired';
        } else {
          const diff = expTime - now;
          const days = Math.floor(diff / 86400);
          const hours = Math.floor((diff % 86400) / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          timeRemaining = `${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m`;
        }
      }

      if (decodedPayloadObj.iat) {
        iatDate = new Date(Number(decodedPayloadObj.iat) * 1000).toLocaleString();
      }

      if (decodedPayloadObj.exp || decodedPayloadObj.iat) {
        setStatus({ isExpired, expDate, iatDate, timeRemaining });
      } else {
        setStatus(null);
      }
    } catch (err: unknown) {
      setError('Failed to parse JWT payload or header: ' + (err as Error).message);
      setHeader('');
      setPayload('');
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    parseToken(token);
  }, [token, parseToken]);

  const handleCopyHeader = async () => {
    if (!header) return;
    await navigator.clipboard.writeText(header);
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  const handleCopyPayload = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleClear = () => {
    setToken('');
    setHeader('');
    setPayload('');
    setError('');
    setStatus(null);
  };

  const handleLoadSample = () => {
    setToken(sampleJwt);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Encoded JWT Token</label>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleLoadSample}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Load Sample
          </button>
          <span>|</span>
          <button
            onClick={handleClear}
            className="text-gray-500 hover:underline dark:text-gray-400"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste JWT token here (e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
        className="w-full h-32 p-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
      />

      {error && (
        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg text-sm font-mono dark:bg-red-950 dark:border-red-800 dark:text-red-300">
          <strong>Error:</strong> {error}
        </div>
      )}

      {status && (
        <div className={`p-3 border rounded-lg text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-3 ${
          status.isExpired 
            ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200'
        }`}>
          <div>
            <span className="opacity-70 block">Token Status</span>
            <strong>{status.isExpired ? 'Expired' : 'Active / Valid'}</strong>
          </div>
          {status.iatDate && (
            <div>
              <span className="opacity-70 block">Issued At (iat)</span>
              <strong>{status.iatDate}</strong>
            </div>
          )}
          {status.expDate && (
            <div>
              <span className="opacity-70 block">Expires At (exp)</span>
              <strong>{status.expDate} ({status.timeRemaining})</strong>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {header && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Header (Algorithm & Token Type)</label>
              <button
                onClick={handleCopyHeader}
                className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transition font-medium dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                {copiedHeader ? 'Copied!' : 'Copy Header'}
              </button>
            </div>
            <pre className="w-full p-3 border rounded-lg bg-gray-900 text-red-400 font-mono text-sm overflow-x-auto max-h-96">
              {header}
            </pre>
          </div>
        )}

        {payload && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Payload (Data & Claims)</label>
              <button
                onClick={handleCopyPayload}
                className="px-2 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition font-medium"
              >
                {copiedPayload ? 'Copied!' : 'Copy Payload'}
              </button>
            </div>
            <pre className="w-full p-3 border rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto max-h-96">
              {payload}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
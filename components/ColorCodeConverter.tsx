'use client';

import { useMemo, useState } from 'react';

type InputMode = 'hex' | 'rgb' | 'hsl' | 'hsv';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface ConversionResult {
  rgb: RGB | null;
  error: string;
}

const clampByte = (value: number) =>
  Math.max(0, Math.min(255, Math.round(value)));

const normalizeHue = (value: number) => {
  if (value === 360) return 0;
  return value;
};

const rgbToHex = ({ r, g, b }: RGB) =>
  `#${[r, g, b]
    .map((value) =>
      clampByte(value).toString(16).padStart(2, '0')
    )
    .join('')
    .toUpperCase()}`;

const parseHex = (input: string): RGB | null => {
  const value = input.trim().replace(/^#/, '');

  if (!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)) {
    return null;
  }

  const expanded =
    value.length === 3
      ? value
          .split('')
          .map((character) => character + character)
          .join('')
      : value;

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
};

const unwrapFunction = (
  input: string,
  functionName: string
) => {
  const trimmed = input.trim();

  const match = trimmed.match(
    new RegExp(`^${functionName}\\((.*)\\)$`, 'i')
  );

  return match ? match[1] : trimmed;
};

const parseRgb = (input: string): RGB | null => {
  const parts = unwrapFunction(input, 'rgb')
    .split(',')
    .map((part) => part.trim());

  if (parts.length !== 3) return null;

  const values = parts.map(Number);

  if (
    values.some(
      (value) =>
        !Number.isFinite(value) ||
        value < 0 ||
        value > 255
    )
  ) {
    return null;
  }

  return {
    r: clampByte(values[0]),
    g: clampByte(values[1]),
    b: clampByte(values[2]),
  };
};

const parsePercentage = (value: string) => {
  const normalized = value.trim().replace(/%$/, '');

  if (normalized === '') return null;

  const number = Number(normalized);

  if (
    !Number.isFinite(number) ||
    number < 0 ||
    number > 100
  ) {
    return null;
  }

  return number;
};

const parseHslLike = (
  input: string,
  functionName: 'hsl' | 'hsv'
) => {
  const parts = unwrapFunction(input, functionName)
    .split(',')
    .map((part) => part.trim());

  if (parts.length !== 3) return null;

  const hue = Number(parts[0]);
  const saturation = parsePercentage(parts[1]);
  const third = parsePercentage(parts[2]);

  if (
    !Number.isFinite(hue) ||
    hue < 0 ||
    hue > 360 ||
    saturation === null ||
    third === null
  ) {
    return null;
  }

  return {
    h: normalizeHue(hue),
    s: saturation,
    third,
  };
};

const hslToRgb = ({ h, s, l }: HSL): RGB => {
  const hue = normalizeHue(h) / 60;
  const saturation = s / 100;
  const lightness = l / 100;

  const chroma =
    (1 - Math.abs(2 * lightness - 1)) * saturation;

  const x =
    chroma *
    (1 - Math.abs((hue % 2) - 1));

  const m = lightness - chroma / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hue >= 0 && hue < 1) {
    rPrime = chroma;
    gPrime = x;
  } else if (hue < 2) {
    rPrime = x;
    gPrime = chroma;
  } else if (hue < 3) {
    gPrime = chroma;
    bPrime = x;
  } else if (hue < 4) {
    gPrime = x;
    bPrime = chroma;
  } else if (hue < 5) {
    rPrime = x;
    bPrime = chroma;
  } else {
    rPrime = chroma;
    bPrime = x;
  }

  return {
    r: clampByte((rPrime + m) * 255),
    g: clampByte((gPrime + m) * 255),
    b: clampByte((bPrime + m) * 255),
  };
};

const hsvToRgb = ({ h, s, v }: HSV): RGB => {
  const hue = normalizeHue(h) / 60;
  const saturation = s / 100;
  const value = v / 100;

  const chroma = value * saturation;
  const x =
    chroma *
    (1 - Math.abs((hue % 2) - 1));
  const m = value - chroma;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (hue >= 0 && hue < 1) {
    rPrime = chroma;
    gPrime = x;
  } else if (hue < 2) {
    rPrime = x;
    gPrime = chroma;
  } else if (hue < 3) {
    gPrime = chroma;
    bPrime = x;
  } else if (hue < 4) {
    gPrime = x;
    bPrime = chroma;
  } else if (hue < 5) {
    rPrime = x;
    bPrime = chroma;
  } else {
    rPrime = chroma;
    bPrime = x;
  }

  return {
    r: clampByte((rPrime + m) * 255),
    g: clampByte((gPrime + m) * 255),
    b: clampByte((bPrime + m) * 255),
  };
};

const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  const lightness = (max + min) / 2;

  let hue = 0;

  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  if (hue < 0) hue += 360;

  const saturation =
    delta === 0
      ? 0
      : delta /
        (1 - Math.abs(2 * lightness - 1));

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
};

const rgbToHsv = ({ r, g, b }: RGB): HSV => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;

  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  if (hue < 0) hue += 360;

  return {
    h: Math.round(hue),
    s: Math.round(
      max === 0 ? 0 : (delta / max) * 100
    ),
    v: Math.round(max * 100),
  };
};

const parseInput = (
  mode: InputMode,
  input: string
): ConversionResult => {
  if (!input.trim()) {
    return {
      rgb: null,
      error: 'Enter a color value.',
    };
  }

  if (mode === 'hex') {
    const rgb = parseHex(input);

    return rgb
      ? { rgb, error: '' }
      : {
          rgb: null,
          error:
            'Enter a valid 3-digit or 6-digit HEX value, such as #FFF or #3B82F6.',
        };
  }

  if (mode === 'rgb') {
    const rgb = parseRgb(input);

    return rgb
      ? { rgb, error: '' }
      : {
          rgb: null,
          error:
            'Enter RGB values from 0 to 255, such as rgb(59, 130, 246).',
        };
  }

  if (mode === 'hsl') {
    const value = parseHslLike(input, 'hsl');

    if (!value) {
      return {
        rgb: null,
        error:
          'Enter HSL as hsl(H, S%, L%) with H from 0–360 and S/L from 0–100%.',
      };
    }

    return {
      rgb: hslToRgb({
        h: value.h,
        s: value.s,
        l: value.third,
      }),
      error: '',
    };
  }

  const value = parseHslLike(input, 'hsv');

  if (!value) {
    return {
      rgb: null,
      error:
        'Enter HSV as hsv(H, S%, V%) with H from 0–360 and S/V from 0–100%.',
    };
  }

  return {
    rgb: hsvToRgb({
      h: value.h,
      s: value.s,
      v: value.third,
    }),
    error: '',
  };
};

export default function ColorCodeConverter() {
  const [mode, setMode] =
    useState<InputMode>('hex');
  const [input, setInput] =
    useState('#3B82F6');
  const [copiedField, setCopiedField] =
    useState<string | null>(null);

  const conversion = useMemo(
    () => parseInput(mode, input),
    [mode, input]
  );

  const rgb = conversion.rgb;

  const values = useMemo(() => {
    if (!rgb) return null;

    const hsl = rgbToHsl(rgb);
    const hsv = rgbToHsv(rgb);

    return {
      hex: rgbToHex(rgb),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    };
  }, [rgb]);

  const handleCopy = async (
    text: string,
    fieldName: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);

      window.setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch {
      setCopiedField(null);
    }
  };

  const handleModeChange = (
    nextMode: InputMode
  ) => {
    if (values) {
      const nextValue = values[nextMode];

      setInput(nextValue);
    } else {
      if (nextMode === 'hex') {
        setInput('#3B82F6');
      } else if (nextMode === 'rgb') {
        setInput('rgb(59, 130, 246)');
      } else if (nextMode === 'hsl') {
        setInput('hsl(217, 91%, 60%)');
      } else {
        setInput('hsv(217, 76%, 96%)');
      }
    }

    setMode(nextMode);
    setCopiedField(null);
  };

  const handlePresetSelect = (
    presetHex: string
  ) => {
    setMode('hex');
    setInput(presetHex);
    setCopiedField(null);
  };

  const handlePickerChange = (
    value: string
  ) => {
    setMode('hex');
    setInput(value.toUpperCase());
    setCopiedField(null);
  };

  const previewTextColor = rgb
    ? (rgb.r * 299 +
        rgb.g * 587 +
        rgb.b * 114) /
        1000 >
      150
      ? '#000000'
      : '#FFFFFF'
    : '#F8FAFC';

  const fieldConfig = values
    ? [
        {
          key: 'hex',
          label: 'HEX',
          value: values.hex,
        },
        {
          key: 'rgb',
          label: 'RGB',
          value: values.rgb,
        },
        {
          key: 'hsl',
          label: 'HSL',
          value: values.hsl,
        },
        {
          key: 'hsv',
          label: 'HSV',
          value: values.hsv,
        },
      ]
    : [];

  return (
    <div className="space-y-6 text-text-primary">
      <div className="space-y-3">
        <p className="text-sm font-medium">
          Color Palette Presets
        </p>

        <div className="flex flex-wrap gap-2">
          {[
            ['Blue', '#3B82F6'],
            ['Green', '#10B981'],
            ['Red', '#EF4444'],
            ['Purple', '#8B5CF6'],
            ['Black', '#000000'],
            ['White', '#FFFFFF'],
          ].map(([label, color]) => (
            <button
              key={color}
              type="button"
              onClick={() =>
                handlePresetSelect(color)
              }
              className="rounded-lg border border-border bg-surface-800 px-3 py-1.5 text-xs font-medium transition hover:border-brand-cyan"
            >
              <span
                className="mr-2 inline-block size-3 rounded-full border border-white/20 align-middle"
                style={{
                  backgroundColor: color,
                }}
                aria-hidden="true"
              />

              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <div>
          <label
            htmlFor="color-picker"
            className="mb-2 block text-sm font-medium"
          >
            Picker
          </label>

          <input
            id="color-picker"
            type="color"
            value={
              values
                ? values.hex.toLowerCase()
                : '#3b82f6'
            }
            onChange={(event) =>
              handlePickerChange(event.target.value)
            }
            className="h-12 w-20 cursor-pointer rounded-lg border border-border bg-surface-900 p-1"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="color-input"
            className="block text-sm font-medium"
          >
            Color value
          </label>

          <div className="grid gap-2 sm:grid-cols-[130px_1fr]">
            <select
              value={mode}
              onChange={(event) =>
                handleModeChange(
                  event.target.value as InputMode
                )
              }
              aria-label="Input color format"
              className="rounded-lg border border-border bg-surface-900 px-3 py-3 text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
            >
              <option value="hex">HEX</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
              <option value="hsv">HSV</option>
            </select>

            <input
              id="color-input"
              type="text"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
                setCopiedField(null);
              }}
              spellCheck={false}
              className="w-full rounded-lg border border-border bg-surface-900 p-3 font-mono text-sm text-text-primary outline-none transition focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20"
            />
          </div>

          <p className="text-xs text-text-muted">
            Alpha/transparency values are not included.
          </p>
        </div>
      </div>

      {conversion.error ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4"
        >
          <p className="font-mono text-xs uppercase tracking-wide text-danger">
            Invalid color
          </p>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {conversion.error}
          </p>
        </div>
      ) : null}

      {rgb && values ? (
        <>
          <div
            className="flex h-28 w-full items-center justify-center rounded-xl border border-border px-4 text-center font-mono text-sm font-semibold shadow-inner transition-colors"
            style={{
              backgroundColor: values.hex,
              color: previewTextColor,
            }}
          >
            {values.hex}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {fieldConfig.map((field) => (
              <div
                key={field.key}
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-surface-900 p-4"
              >
                <div className="min-w-0">
                  <span className="block text-xs text-text-muted">
                    {field.label}
                  </span>

                  <strong className="mt-1 block truncate font-mono text-sm text-text-primary">
                    {field.value}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      field.value,
                      field.key
                    )
                  }
                  className="shrink-0 rounded-lg border border-success/30 bg-success/10 px-2.5 py-1.5 text-xs font-medium text-success transition hover:bg-success/15"
                >
                  {copiedField === field.key
                    ? 'Copied!'
                    : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

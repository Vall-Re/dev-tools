export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
}

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify your JSON data instantly in your browser.',
    category: 'Formatters',
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode Base64 strings back to plain text.',
    category: 'Encoders',
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    description: 'Safely encode and decode URLs for web requests.',
    category: 'Encoders',
  },
];
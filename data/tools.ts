export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  aboutText: string;
  faqs: { question: string; answer: string }[];
}

export const tools: Tool[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify your JSON data instantly in your browser.',
    category: 'Formatters',
    aboutText: 'JSON (JavaScript Object Notation) is a lightweight format for storing and transporting data. Our free online JSON Formatter helps you clean up messy JSON code, validate structure, and identify syntax errors instantly without uploading data to external servers.',
    faqs: [
      {
        question: 'Is my JSON data safe?',
        answer: 'Yes, all formatting and validation processes happen entirely in your browser using JavaScript. No data is sent to any server.',
      },
      {
        question: 'What is the difference between Format and Minify?',
        answer: 'Formatting adds indentation and newlines to make code readable for humans. Minifying removes all extra whitespace to reduce file size.',
      },
    ],
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode Base64 strings back to plain text.',
    category: 'Encoders',
    aboutText: 'Base64 encoding schemes are commonly used when there is a need to encode binary data that needs to be stored and transferred over media designed to deal with textual data.',
    faqs: [
      {
        question: 'Is Base64 encryption?',
        answer: 'No, Base64 is an encoding format, not an encryption method. Anyone can easily decode a Base64 string back to original text.',
      },
      {
        question: 'Where is Base64 used?',
        answer: 'It is widely used for embedding images directly in HTML/CSS, sending binary data in email attachments, and basic HTTP authentication.',
      },
    ],
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    description: 'Safely encode and decode URLs for web requests.',
    category: 'Encoders',
    aboutText: 'URL encoding (also known as percent-encoding) converts characters into a format that can be safely transmitted over the Internet within query parameters.',
    faqs: [
      {
        question: 'Why do URLs need encoding?',
        answer: 'URLs can only be sent over the Internet using the ASCII character set. Special characters like spaces, question marks, and ampersands must be encoded.',
      },
      {
        question: 'Is URL encoding case-sensitive?',
        answer: 'Percent-encoded characters (like %20) use hexadecimal digits where letters can be uppercase or lowercase, though uppercase is standard.',
      },
    ],
  },
];
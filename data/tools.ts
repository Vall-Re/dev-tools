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
  {
    slug: 'html-entity-encoder-decoder',
    name: 'HTML Entity Encoder / Decoder',
    description: 'Convert special characters to HTML entities or decode them back to plain text.',
    category: 'Encoders',
    aboutText: 'HTML entities are used to display reserved HTML characters (like <, >, &) or special symbols safely in web browsers without breaking the page layout.',
    faqs: [
      {
        question: 'Why should I encode HTML entities?',
        answer: 'Encoding special characters prevents XSS (Cross-Site Scripting) vulnerabilities and ensures browsers render symbols correctly.',
      },
    ],
  },
    {
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    description: 'Generate random Version-4 UUIDs (Universally Unique Identifiers) instantly.',
    category: 'Generators',
    aboutText: 'A UUID (Universally Unique Identifier) is a 128-bit label used for information in computer systems. Version 4 UUIDs are generated using cryptographically secure random numbers.',
    faqs: [
      {
        question: 'Are generated UUIDs unique?',
        answer: 'Yes, UUID v4 uses 122 random bits. The probability of generating duplicate UUIDs is so low that it is practically impossible.',
      },
      {
        question: 'Is there a difference between UUID and GUID?',
        answer: 'GUID (Globally Unique Identifier) is Microsoft implementation of the RFC 4122 UUID standard. Functionally, they are identical.',
      },
    ],
  },
  {
    slug: 'css-minifier',
    name: 'CSS Minifier & Formatter',
    description: 'Minify CSS code to reduce file size or format it for readability.',
    category: 'Formatters',
    aboutText: 'CSS minification removes unnecessary whitespace, comments, and formatting characters to make stylesheets smaller and speed up page load times.',
    faqs: [
      {
        question: 'How does CSS minification improve performance?',
        answer: 'By removing comments, extra spaces, and unused characters, minified CSS files are smaller in size, which decreases network download times.',
      },
    ],
  },
  {
    slug: 'md5-hash-generator',
    name: 'MD5 Hash Generator',
    description: 'Generate 128-bit MD5 hashes from any text input instantly.',
    category: 'Generators',
    aboutText: 'The MD5 message-digest algorithm is a widely used hash function producing a 128-bit hash value. It is commonly used to verify data integrity.',
    faqs: [
      {
        question: 'Is MD5 secure for password hashing?',
        answer: 'No, MD5 is cryptographically broken and vulnerable to collision attacks. It should not be used for secure password storage or sensitive cryptography.',
      },
      {
        question: 'Can MD5 hashes be decrypted?',
        answer: 'MD5 is a one-way hashing function, not encryption. It cannot be mathematically decrypted, though simple hashes can be looked up via rainbow tables.',
      },
    ],
  },
  {
    slug: 'js-minifier',
    name: 'JS Minifier & Formatter',
    description: 'Minify JavaScript code to reduce file size or apply basic formatting.',
    category: 'Formatters',
    aboutText: 'JavaScript minification removes comments, extra whitespace, and unnecessary formatting to decrease script sizes and speed up website execution.',
    faqs: [
      {
        question: 'Does minification change JavaScript logic?',
        answer: 'No, minification only removes unnecessary characters such as white spaces and comments without altering code execution behavior.',
      },
    ],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Token (JWT) headers and payloads instantly.',
    category: 'Encoders',
    aboutText: 'JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. Our online JWT Decoder parses token header and payload claims directly in your browser without sending tokens to any remote server.',
    faqs: [
      {
        question: 'Is it safe to paste my JWT token here?',
        answer: 'Yes, all decoding is performed locally inside your browser using client-side JavaScript. Tokens are never uploaded or stored anywhere.',
      },
      {
        question: 'Can this tool verify the JWT signature?',
        answer: 'This tool decodes and displays the header and payload data. Signature verification requires validating secret keys or public certs on your server or authentication provider.',
      },
    ],
  },
  {
    slug: 'sha256-hash-generator',
    name: 'SHA-256 Hash Generator',
    description: 'Generate secure 256-bit SHA-2 cryptographic hashes from string data.',
    category: 'Generators',
    aboutText: 'SHA-256 is a cryptographic hash function that produces a unique 256-bit (32-byte) message digest. It is widely used in digital signatures, blockchain consensus mechanisms, and data verification.',
    faqs: [
      {
        question: 'Is SHA-256 secure?',
        answer: 'Yes, SHA-256 is currently considered collision-resistant and cryptographically secure for data integrity verification.',
      },
      {
        question: 'Can SHA-256 hashes be reversed?',
        answer: 'No, SHA-256 is a one-way hashing function. It is mathematically impossible to retrieve the original input directly from the hash digest.',
      },
    ],
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions online with live pattern matching.',
    category: 'Utilities',
    aboutText: 'Regular expressions (regex) are patterns used to match character combinations in strings. Our free online Regex Tester helps developers quickly build, validate, and test regular expressions in real-time.',
    faqs: [
      {
        question: 'What do common Regex flags mean?',
        answer: 'The "g" flag stands for global search (find all matches), "i" for case-insensitive search, and "m" for multi-line search.',
      },
      {
        question: 'Is my input string processed on a server?',
        answer: 'No, all regular expression evaluations run client-side in your browser using standard JavaScript RegExp engines.',
      },
    ],
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and clean up messy SQL queries with standardized keywords and line breaks.',
    category: 'Formatters',
    aboutText: 'SQL Formatter takes raw or minified SQL statements and formats them into readable, structured code with capitalized keywords and organized line breaks.',
    faqs: [
      {
        question: 'Does this tool support all SQL dialects?',
        answer: 'Yes, it formats standard SQL syntax compatible with MySQL, PostgreSQL, SQLite, SQL Server, and Oracle databases.',
      },
      {
        question: 'Is my database query data sent to any server?',
        answer: 'No, all SQL string manipulations happen entirely inside your web browser for complete privacy.',
      },
    ],
  },
  {
    slug: 'csv-to-json-converter',
    name: 'CSV to JSON Converter',
    description: 'Convert CSV table data into a clean, structured JSON array of objects instantly.',
    category: 'Converters',
    aboutText: 'CSV to JSON Converter transforms comma-separated text data into JSON structures, making it simple to process spreadsheet or database exports inside web applications.',
    faqs: [
      {
        question: 'How are headers handled during conversion?',
        answer: 'The first line of the CSV input is treated as the key names for each JSON object generated in the output array.',
      },
      {
        question: 'Is my CSV data kept private?',
        answer: 'Yes, all data parsing is handled directly in your browser without uploading files to external servers.',
      },
    ],
  },
  {
    slug: 'json-to-csv-converter',
    name: 'JSON to CSV Converter',
    description: 'Convert JSON arrays into downloadable or copyable CSV spreadsheet format.',
    category: 'Converters',
    aboutText: 'JSON to CSV Converter effortlessly transforms JSON objects into comma-separated values (CSV) suitable for Excel, Google Sheets, or data export tasks.',
    faqs: [
      {
        question: 'What JSON format is required?',
        answer: 'The input must be a JSON array containing key-value objects.',
      },
      {
        question: 'Is my data secure?',
        answer: 'Yes, conversion is performed locally in your browser without uploading data anywhere.',
      },
    ],
  },
  {
    slug: 'markdown-to-html-converter',
    name: 'Markdown to HTML Converter',
    description: 'Convert raw Markdown text into clean HTML code with live preview.',
    category: 'Converters',
    aboutText: 'Markdown to HTML Converter turns headings, bold/italic text, links, code tags, and lists into semantic HTML markup instantly inside your browser.',
    faqs: [
      {
        question: 'Can I see how the converted HTML looks?',
        answer: 'Yes, the tool displays both the raw HTML code output and a live rendered HTML preview side-by-side.',
      },
      {
        question: 'Is my text processed securely?',
        answer: 'All Markdown parsing happens locally in your web browser without sending data to external servers.',
      },
    ],
  },
  {
    slug: 'url-parser',
    name: 'URL Parser',
    description: 'Parse and extract protocol, hostname, path, port, and query string parameters from URLs.',
    category: 'Utilities',
    aboutText: 'URL Parser breaks down complex web addresses into individual components including host, protocol, path, fragment hash, and formatted query string parameter key-value pairs.',
    faqs: [
      {
        question: 'Do I need to include http:// or https://?',
        answer: 'Yes, full valid URLs with a protocol schema (such as https:// or http://) are required for accurate parsing.',
      },
      {
        question: 'Is my URL input processed on a server?',
        answer: 'No, URL parsing uses the browser standard URL API client-side, ensuring complete privacy.',
      },
    ],
  },
  {
    slug: 'color-code-converter',
    name: 'Color Code Converter',
    description: 'Convert color codes between HEX, RGB, and HSL formats with live color preview.',
    category: 'Utilities',
    aboutText: 'Color Code Converter allows developers and designers to seamlessly convert color values between HEX, RGB, and HSL spaces with visual color feedback.',
    faqs: [
      {
        question: 'Which color formats are supported?',
        answer: 'The converter supports standard HEX strings, RGB tuples, and HSL color space values.',
      },
      {
        question: 'Is conversion done client-side?',
        answer: 'Yes, all mathematical transformations run locally inside your browser.',
      },
    ],
  },
];
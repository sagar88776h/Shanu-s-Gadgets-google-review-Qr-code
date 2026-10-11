const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'public', 'logo.jpg');
const destPath = path.join(__dirname, 'src', 'assets', 'logoBase64.js');

const buffer = fs.readFileSync(srcPath);
const base64 = buffer.toString('base64');
const content = `// Auto-generated logo data URI for offline QR canvas & standee rendering
export const SHANU_LOGO_SRC = "/logo.jpg";
export const SHANU_LOGO_DATA_URL = "data:image/jpeg;base64,${base64}";
`;

fs.writeFileSync(destPath, content, 'utf-8');
console.log('Successfully created logoBase64.js!');

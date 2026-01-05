const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '20260103 (1).xls.csv');

try {
    const content = fs.readFileSync(filePath, 'utf-8'); // Try utf-8 first
    console.log('--- UTF-8 READ PREVIEW ---');
    const lines = content.split('\n');

    lines.slice(0, 50).forEach((line, index) => {
        if (line.trim().length > 10) {
            console.log(`[Line ${index}] ${line.substring(0, 100)}...`);
        }
    });

} catch (e) {
    console.error('Error reading file:', e);
}

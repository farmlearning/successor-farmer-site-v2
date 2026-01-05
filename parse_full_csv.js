const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '20260103 (1).xls.csv');

// Regex flexible enough to catch lines with dates and likely looking data
// Matches lines having something that looks like a date: YYYY-MM-DD
const DATE_REGEX = /(\d{4}-\d{2}-\d{2})/;
const PHONE_REGEX = /010[-\s]?\d{4}[-\s]?\d{4}/;

try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let totalLines = 0;
    let validDateLines = 0;
    let colabRegexMatches = 0;

    lines.forEach((line) => {
        if (!line.trim()) return;
        totalLines++;

        if (DATE_REGEX.test(line)) {
            validDateLines++;
        }

        if (line.includes('1010-')) {
            colabRegexMatches++;
        }
    });

    console.log(`Total non-empty lines: ${totalLines}`);
    console.log(`Lines with YYYY-MM-DD: ${validDateLines}`);
    console.log(`Lines with '1010-': ${colabRegexMatches}`);

    // Sample lines that FAIL the 1010- check but HAVE a date
    console.log('\n--- Sample Lines Failing 1010- Check but Valid Date ---');
    let samplesShown = 0;
    for (let l of lines) {
        if (DATE_REGEX.test(l) && !l.includes('1010-')) {
            console.log(l.substring(0, 150)); // Print first 150 chars
            samplesShown++;
            if (samplesShown > 10) break;
        }
    }

} catch (e) {
    console.error('Error:', e);
}

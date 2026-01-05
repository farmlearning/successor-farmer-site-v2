import * as XLSX from 'xlsx';

export interface StudentRow {
    name: string;
    birth_date: string; // YYYY-MM-DD
    phone: string;
    region?: string;
    farmer_type?: string;
    year_level?: string;
    address?: string;
    email?: string;
    created_at?: string;
}

export const parseExcel = (file: File): Promise<StudentRow[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;

                // 1. Text/CSV format check for provided "2026.csv" file
                if (typeof data === 'string' || file.name.endsWith('.csv')) {
                    const textContent = typeof data === 'string' ? data : new TextDecoder('utf-8').decode(data as ArrayBuffer);

                    // Specific Logic for the legacy file found in Colab
                    if (textContent.includes('1010-') || textContent.includes('구분')) {
                        const students = parseLegacyCSV(textContent);
                        if (students.length > 0) {
                            console.log(`Legacy CSV Parser used. Found ${students.length} records.`);
                            resolve(students);
                            return;
                        }
                    }
                }

                // 2. Fallback to standard XLSX parser
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

                const students: StudentRow[] = [];
                const headers = jsonData[0] as string[];

                // Mappings (Standard Logic)
                const nameIdx = headers.findIndex(h => h && (h.includes('성명') || h.includes('이름')));
                const birthIdx = headers.findIndex(h => h && (h.includes('생년월일')));
                const phoneIdx = headers.findIndex(h => h && (h.includes('전화') || h.includes('핸드폰')));
                const typeIdx = headers.findIndex(h => h && (h.includes('구분') || h.includes('유형')));
                // ... (simplified for standard xlsx)

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (row[nameIdx]) {
                        students.push({
                            name: row[nameIdx],
                            birth_date: row[birthIdx] || '1900-01-01',
                            phone: row[phoneIdx] || '',
                            farmer_type: row[typeIdx] || '미지정'
                        });
                    }
                }
                resolve(students);

            } catch (err) {
                console.error("Parse Error", err);
                reject(err);
            }
        };

        reader.onerror = (err) => reject(err);

        // Read based on type
        if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
            reader.readAsText(file, 'utf-8'); // Try plain text for CSV
        } else {
            reader.readAsBinaryString(file);
        }
    });
};

// Custom Legacy CSV Parser based on regex analysis
function parseLegacyCSV(content: string): StudentRow[] {
    const lines = content.split('\n');
    const students: StudentRow[] = [];

    // Regex Patterns
    const PHONE_REGEX = /010[-\s]?\d{3,4}[-\s]?\d{4}/;
    const DATE_REGEX = /(\d{4}-\d{2}-\d{2})/;
    const EMAIL_REGEX = /([a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const TYPE_REGEX = /(청년농업인|후계농업인|우수후계농업인)/;
    const REGION_REGEX = /(경북|경남|전북|전남|충북|충남|경기|강원|제주|세종)/;

    // Name regex: Look for hangul word 2-4 chars long that is NOT a keyword 
    // This is tricky in unstructured data. We will rely on position or exclusion.
    // Heuristic: Name often appears before Birthdate.

    // Optimization: Filter empty or useless lines
    const validLines = lines.filter(l => l.trim().length > 10 && DATE_REGEX.test(l));

    validLines.forEach(line => {
        // 1. Extract Dates (Birthdate is usually 1st, Created is 2nd)
        const dateMatches = line.match(new RegExp(DATE_REGEX, 'g'));
        const birth_date = dateMatches && dateMatches.length > 0 ? dateMatches[0] : null;
        const created_at = dateMatches && dateMatches.length > 1 ? dateMatches[1] : new Date().toISOString();

        if (!birth_date) return; // Skip if no birthdate (key field)

        // 2. Extract Phone
        const phoneMatch = line.match(PHONE_REGEX);
        const phone = phoneMatch ? phoneMatch[0] : '';

        // 3. Extract Type & Region
        const typeMatch = line.match(TYPE_REGEX);
        const farmer_type = typeMatch ? typeMatch[0] : '청년농업인'; // Default/Fallback

        const regionMatch = line.match(REGION_REGEX);
        const region = regionMatch ? regionMatch[0] : '전국';

        // 4. Extract Email
        const emailMatch = line.match(EMAIL_REGEX);
        const email = emailMatch ? emailMatch[0] : '';

        // 5. Name Heuristic
        // Strategy: Remove known tokens (dates, email, phone, keywords) and look for remaining Hangul block.
        let cleanLine = line
            .replace(birth_date, '')
            .replace(created_at, '')
            .replace(phone, '')
            .replace(email, '')
            .replace(farmer_type, '') // Remove type keyword
            .replace(/충북\/충남\/대전|경북\/대구|전북\/전남\/광주/g, '') // Remove composite regions
            .replace(/[0-9-]/g, '') // Remove remaining digits/dashes
            .replace(/내국인|여|남/g, ''); // Remove common noise words

        // Match typical name pattern (2-4 hangul chars)
        const nameMatch = cleanLine.match(/[가-힣]{2,4}/);
        const name = nameMatch ? nameMatch[0] : 'Unknown';

        students.push({
            name,
            birth_date,
            phone,
            region,
            farmer_type,
            year_level: '1년차', // Default
            email,
            created_at,
            address: '',
            is_verified: false // Migration default
        });
    });

    return students;
}

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Credentials (from .env.local)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CSV_PATH = 'd:/03_antigravity/successor-farmer-site/20260103 (1).xls.csv';

function parseLegacyCSV(content) {
    const lines = content.split('\n');
    const students = [];
    const uniqueSignatures = new Set(); // For deduplication

    // Regex Patterns
    const PHONE_REGEX = /010[-\s]?\d{3,4}[-\s]?\d{4}/;
    const DATE_REGEX = /(\d{4}-\d{2}-\d{2})/;
    const EMAIL_REGEX = /([a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const TYPE_REGEX = /(청년농업인|일반후계농|우수후계농업인|예비농업인)/;
    const REGION_REGEX = /(서울|경기|인천|강원|충북|충남|대전|경북|경남|대구|부산|울산|전북|전남|광주|제주|세종)/;

    // Words to explicitly remove before name extraction
    const NOISE_WORDS = [
        /권역/g, /구분/g, /연번/g, /성명/g, /생년월일/g, /전화번호/g, /지역/g, /페이지/g,
        /내국인/g, /남/g, /여/g, /[0-9-]/g,
        /충북\/충남\/대전/g, /경북\/대구/g, /전북\/전남\/광주/g
    ];

    // Explicit Blocklist for Names (if parser still grabs them)
    // Add known regions or header words that might match Hangul{2,4}
    const NAME_BLOCKLIST = new Set([
        '권역', '구분', '연번', '성명', '지역', '페이지', '경북', '경남', '충북', '충남', '전북', '전남', '부산', '대구', '대전', '광주', '울산', '서울', '경기', '인천', '강원', '제주', '세종',
        '청년', '후계', '우수', '예비'
    ]);

    // Filter potential valid lines (Must have a date)
    const validLines = lines.filter(l => l.trim().length > 10 && DATE_REGEX.test(l));
    console.log(`Found ${validLines.length} lines with dates.`);

    validLines.forEach(line => {
        // 1. Extract Dates
        const dateMatches = line.match(new RegExp(DATE_REGEX, 'g'));
        const birth_date = dateMatches && dateMatches.length > 0 ? dateMatches[0] : null;
        const created_at = dateMatches && dateMatches.length > 1 ? dateMatches[1] : new Date().toISOString();

        if (!birth_date) return;

        // 2. Extract Phone
        const phoneMatch = line.match(PHONE_REGEX);
        const phone = phoneMatch ? phoneMatch[0] : '';
        const phoneNormalized = phone.replace(/-/g, '');

        // 3. Extract Type & Region
        const typeMatch = line.match(TYPE_REGEX);
        const farmer_type = typeMatch ? typeMatch[0] : '청년농업인';

        const regionMatch = line.match(REGION_REGEX);
        const region = regionMatch ? regionMatch[0] : '전국';

        // 4. Name Extraction Strategy
        let cleanLine = line;

        // Remove known entities to isolate name
        cleanLine = cleanLine.replace(birth_date, '').replace(created_at, '');
        if (phone) cleanLine = cleanLine.replace(phone, '');
        if (typeMatch) cleanLine = cleanLine.replace(typeMatch[0], '');
        if (regionMatch) cleanLine = cleanLine.replace(regionMatch[0], ''); // Key fix: Remove extracted region

        // Remove noise words
        NOISE_WORDS.forEach(regex => cleanLine = cleanLine.replace(regex, ' ')); // Replace with space to avoid merging

        // Find remaining Hangul block (2-4 chars)
        const nameMatches = cleanLine.match(/[가-힣]{2,4}/g);

        // Pick the best candidate (first one that isn't blocklisted)
        let name = 'Unknown';
        if (nameMatches) {
            for (const match of nameMatches) {
                if (!NAME_BLOCKLIST.has(match)) {
                    name = match;
                    break;
                }
            }
        }

        // 5. Deduplication Check
        // Use Phone + Name as unique key. (Or just Phone if confident)
        // Some records might lack phone, so use Name + Birth_Date as backup
        const uniqueKey = phoneNormalized ? phoneNormalized : (name + birth_date);

        if (uniqueSignatures.has(uniqueKey)) {
            // Duplicate found (likely from retry lines or artifacts)
            return;
        }
        uniqueSignatures.add(uniqueKey);

        students.push({
            name,
            birth_date,
            phone: phoneNormalized,
            region,
            farmer_type,
            year_level: '1년차',
            email: '', // Email regex removed to simplify, rarely used/needed
            created_at,
            address: '',
            is_verified: false
        });
    });

    return students;
}

async function run() {
    try {
        console.log('1. Parsing...');
        const content = fs.readFileSync(CSV_PATH, 'utf-8');
        const students = parseLegacyCSV(content);
        console.log(`   Parsed ${students.length} unique students.`);

        if (students.length === 0) {
            console.error('No students parsed!');
            return;
        }

        console.log('2. Truncating Table...');
        const { error: deleteError } = await supabase.from('students').delete().neq('id', -1); // Delete all
        if (deleteError) throw deleteError;
        console.log('   Table truncated.');

        console.log('3. Inserting Data...');
        const BATCH_SIZE = 500;
        for (let i = 0; i < students.length; i += BATCH_SIZE) {
            const batch = students.slice(i, i + BATCH_SIZE);
            const { error } = await supabase.from('students').insert(batch);
            if (error) {
                console.error(`Error batch ${i}:`, error.message);
                throw error;
            }
            process.stdout.write('.');
        }
        console.log('\nMigration Complete!');

    } catch (err) {
        console.error('Fatal Error:', err);
    }
}

run();

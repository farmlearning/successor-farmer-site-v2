import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import fs from 'fs';

// Credentials (from environment)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const CSV_PATH = 'd:/03_antigravity/successor-farmer-site/20260103 (1).xls.csv';

function sanitizeDate(value) {
    if (!value) return null;
    let dateStr = String(value).trim();

    // Check for "YYYY-MM-DD" format
    const isoDateRegex = /^(\d{4})-(\d{2})-(\d{2})/;
    const match = dateStr.match(isoDateRegex);

    if (match) {
        const year = parseInt(match[1]);
        if (year < 1900 || year > 2200) {
            console.warn(`[Date Warning] Out of range year: ${dateStr}. Setting to null.`);
            return null;
        }
        return dateStr;
    }

    // Attempt to parse if not strict YYYY-MM-DD
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        if (year < 1900 || year > 2200) {
            return null;
        }
        return d.toISOString().split('T')[0]; // Return YYYY-MM-DD
    }

    return null; // Invalid
}

async function run() {
    try {
        console.log('1. Reading File...');
        const buffer = fs.readFileSync(CSV_PATH);
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];

        // Use raw: false to get formatted strings (dates as "YYYY-MM-DD")
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
            header: 1,
            raw: false,
            dateNF: 'yyyy-mm-dd'
        });
        console.log(`   Read ${rows.length} rows.`);

        const students = [];
        const uniquePhones = new Set();
        let duplicates = 0;
        let dateWarnings = 0;

        for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            if (!r || r.length === 0 || !r[4]) continue;

            const name = r[4] || '';
            const phone = r[5] ? String(r[5]).trim() : '';

            const phoneNormalized = phone.replace(/[^0-9]/g, '');
            if (phoneNormalized && uniquePhones.has(phoneNormalized)) {
                duplicates++;
                continue;
            }
            if (phoneNormalized) uniquePhones.add(phoneNormalized);

            // With raw:false, dates should be strings like "1978-08-28"
            let birth_date = sanitizeDate(r[11]);
            let created_at = sanitizeDate(r[16]) || new Date().toISOString();

            if (!birth_date && r[11]) {
                dateWarnings++;
                // console.warn(`Invalid birth_date for ${name}: ${r[11]}`);
            }

            students.push({
                farmer_type: r[0] || '',
                region: r[1] || '',
                year_level: String(r[2] || ''),
                student_category: r[3] || '',
                name,
                phone,
                gender: r[6] || '',
                postal_code: String(r[7] || ''),
                address: r[8] || '',
                detailed_address: r[9] || '',
                email: r[10] || '',
                birth_date,
                is_foreigner: r[12] || '',
                main_crop: r[13] || '',
                selection_info: r[14] || '',
                privacy_consent: r[15] || '',
                created_at,
                is_verified: true
            });
        }

        console.log(`   Parsed ${students.length} unique students.`);
        console.log(`   Skipped ${duplicates} duplicates.`);
        console.log(`   Found ${dateWarnings} invalid dates replaced with null.`);

        if (students.length === 0) return;

        console.log('2. Truncating Table...');
        const { error: deleteError } = await supabase.from('students').delete().neq('id', -1);
        if (deleteError) throw deleteError;
        console.log('   Table truncated.');

        console.log('3. Inserting Data...');
        const BATCH_SIZE = 500;
        for (let i = 0; i < students.length; i += BATCH_SIZE) {
            const batch = students.slice(i, i + BATCH_SIZE);
            const { error } = await supabase.from('students').insert(batch);
            if (error) {
                console.error(`Error batch ${i / BATCH_SIZE + 1}:`, error.message);
                throw error;
            }
            process.stdout.write(`[Batch ${i / BATCH_SIZE + 1}] `);
        }
        console.log('\nMigration Complete!');

    } catch (err) {
        console.error('Fatal Error:', err);
    }
}

run();

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MIGRATION_FILE = path.join(process.cwd(), 'scripts', 'notices_data.json');
const ASSET_DIR = path.join(process.cwd(), 'scripts', 'migration_assets');

async function processMigration() {
    if (!fs.existsSync(MIGRATION_FILE)) {
        console.error('Migration file not found:', MIGRATION_FILE);
        return;
    }

    const data = JSON.parse(fs.readFileSync(MIGRATION_FILE, 'utf-8'));
    console.log(`Found ${data.length} notices to migrate.`);

    for (const notice of data) {
        console.log(`Processing notice ${notice.id}: ${notice.title}`);

        // 1. Process Attachments
        const processedAttachments = [];
        if (notice.attachments && notice.attachments.length > 0) {
            for (const att of notice.attachments) {
                // Ensure local path is correct relative to script execution or absolute as saved
                // We saved relative path in python script, so join with CWD or use as is if absolute?
                // Python saved joined path: "migration_assets/123/foo.jpg".
                // We'll trust the path but verify relative to where we run this script.
                // Actually let's assume Python output path is relative to where it ran.
                // We run node from root.
                // Python ran from scripts/ or root? We'll run python from root.
                // So path should be scripts/migration_assets/...

                const localPath = path.join(process.cwd(), 'scripts', 'migration_assets', notice.id, att.filename);

                if (fs.existsSync(localPath)) {
                    const fileBuffer = fs.readFileSync(localPath);
                    const storagePath = `${notice.id}/${att.filename}`;

                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('notice_attachments')
                        .upload(storagePath, fileBuffer, {
                            contentType: att.type || 'application/octet-stream',
                            upsert: true
                        });

                    if (uploadError) {
                        console.error(`  Failed to upload attachment ${att.filename}:`, uploadError.message);
                    } else {
                        const { data: publicData } = supabase.storage
                            .from('notice_attachments')
                            .getPublicUrl(storagePath);

                        processedAttachments.push({
                            name: att.original_name,
                            url: publicData.publicUrl,
                            type: path.extname(att.filename).replace('.', '')
                        });
                        console.log(`  Uploaded attachment: ${att.filename}`);
                    }
                } else {
                    console.warn(`  Attachment file not found: ${localPath}`);
                }
            }
        }

        // 2. Process Content Images
        let content = notice.content;
        const imgRegex = /\[\[IMG:(.+?)\]\]/g;
        const matches = [...content.matchAll(imgRegex)];

        for (const m of matches) {
            const placeholder = m[0];
            const fname = m[1];
            const seq_id = notice.id;
            const localPath = path.join(ASSET_DIR, String(seq_id), fname);

            if (fs.existsSync(localPath)) {
                const fileBuffer = fs.readFileSync(localPath);
                const storagePath = `${seq_id}/images/${fname}`;

                const { error: uploadError } = await supabase.storage
                    .from('notice_attachments')
                    .upload(storagePath, fileBuffer, {
                        contentType: 'image/jpeg',
                        upsert: true
                    });

                if (!uploadError) {
                    const { data: publicData } = supabase.storage
                        .from('notice_attachments')
                        .getPublicUrl(storagePath);

                    content = content.replace(placeholder, `<img src="${publicData.publicUrl}" alt="${fname}" style="max-width:100%"/>`);
                    console.log(`  Uploaded image: ${fname}`);
                }
            } else {
                console.warn(`  Image file not found: ${localPath}`);
            }
        }

        // 3. Insert Record
        const payload = {
            id: parseInt(notice.id),
            title: notice.title || 'Untitled',
            content: content,
            board_type: 'hjm_notice',
            author_name: notice.author || '관리자',
            created_at: notice.created_at || new Date().toISOString(),
            view_count: notice.view_count || 0,
            is_pinned: notice.is_pinned || false,
            attachments: processedAttachments
        };

        const { error: insertError } = await supabase
            .from('boards')
            .upsert(payload);

        if (insertError) {
            console.error(`  Failed to insert notice ${notice.id}:`, insertError.message);
        } else {
            console.log(`  Successfully inserted notice ${notice.id}`);
        }
    }
    console.log('Migration completed.');
}

processMigration().catch(err => console.error(err));

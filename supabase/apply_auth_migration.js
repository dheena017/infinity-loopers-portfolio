/**
 * Apply authentication columns to all user tables
 * Run with: node supabase/apply_auth_migration.js
 * 
 * Note: This requires SUPABASE_SERVICE_ROLE_KEY (not anon key)
 * Get it from: Supabase Dashboard > Settings > API > service_role key
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in server/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrations = [
  // Add password to mentors
  `ALTER TABLE mentors ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'kalvium@123'`,
  
  // Add password to secretaries
  `ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'kalvium@123'`,
  
  // Add role to secretaries
  `ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Secretary'`,
  
  // Add photo and bio to secretaries
  `ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS photo TEXT`,
  `ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS bio TEXT`,
  
  // Update NULL passwords
  `UPDATE mentors SET password = 'kalvium@123' WHERE password IS NULL OR password = ''`,
  `UPDATE secretaries SET password = 'kalvium@123' WHERE password IS NULL OR password = ''`,
  `UPDATE students SET password = 'kalvium@123' WHERE password IS NULL OR password = ''`,
];

async function applyMigrations() {
  console.log('🚀 Applying authentication migrations...\n');
  
  for (let i = 0; i < migrations.length; i++) {
    const sql = migrations[i];
    console.log(`[${i + 1}/${migrations.length}] ${sql.substring(0, 60)}...`);
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`   ❌ Error: ${error.message}`);
      } else {
        console.log('   ✅ Success');
      }
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
    }
  }
  
  console.log('\n✨ Migration complete!');
  console.log('\nDefault passwords set for all users:');
  console.log('  📧 Login with email and password: kalvium@123\n');
}

applyMigrations().catch(console.error);

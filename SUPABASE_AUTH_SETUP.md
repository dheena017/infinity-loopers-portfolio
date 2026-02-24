# Apply Authentication Setup to Supabase

## Quick Setup (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **arniiywzkkizgocnkuqy**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the SQL Script

Copy and paste this into the SQL Editor and click **Run**:

```sql
-- Add password columns to all user tables
ALTER TABLE mentors ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'kalvium@123';
ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT 'kalvium@123';
ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Secretary';
ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE secretaries ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update any NULL passwords to default
UPDATE mentors SET password = 'kalvium@123' WHERE password IS NULL OR password = '';
UPDATE secretaries SET password = 'kalvium@123' WHERE password IS NULL OR password = '';
UPDATE students SET password = 'kalvium@123' WHERE password IS NULL OR password = '';

-- Verify setup
SELECT 'Setup Complete!' as status;
```

### Step 3: Verify (Optional)

Run this to see all tables have password columns:

```sql
SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name IN ('students', 'mentors', 'secretaries') 
  AND column_name IN ('password', 'email', 'name')
ORDER BY table_name, column_name;
```

## Default Login Credentials

After running the script, all users will have this default password:

```
Password: kalvium@123
```

### Test Login Examples:

If you have a student with email `student@example.com`:
- **Email:** student@example.com
- **Password:** kalvium@123
- **Role:** student

If you have a mentor with email `mentor@example.com`:
- **Email:** mentor@example.com  
- **Password:** kalvium@123
- **Role:** teacher

## Security Notes

⚠️ **Important:** This is a demo setup using plain text passwords. For production:

1. **Hash passwords** using bcrypt or similar
2. **Use Supabase Auth** built-in authentication system
3. **Enable Row Level Security (RLS)** policies
4. **Create unique passwords** for each user

## Next Steps

1. ✅ Run the SQL script above in Supabase
2. ✅ Test login at: https://infinity-loopers-portfolio.netlify.app/login
3. 🔐 Consider implementing proper authentication for production

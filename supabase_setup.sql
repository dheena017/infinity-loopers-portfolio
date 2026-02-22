-- SQL to set up your Supabase database for the Space Portfolio

-- 1. Create the students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  linkedin TEXT,
  github TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Insert initial data (Squad 139 Members)
INSERT INTO students (name, linkedin, github) VALUES
('hariz', '', ''),
('sham', '', ''),
('amarnath', 'https://www.linkedin.com/in/amarnath-p-s-942782322/', 'https://github.com/amarnath-cdr'),
('arulananthan', '', ''),
('kamala kiruthi', 'https://www.linkedin.com/in/kamala-kiruthi/', 'https://github.com/kamalakiruthi8'),
('lohith', 'https://www.linkedin.com/in/chinthalapalli-lohith-126447384/', 'https://github.com/lohithchinthalalpalli'),
('hari', 'https://www.linkedin.com/in/hari-r-bb3181370/', 'https://github.com/harirs139-ui'),
('jayseelan', 'https://www.linkedin.com/in/jayaseelan-d-1951952a6', 'https://www.linkedin.com/in/jayaseelan-d-1951952a6'),
('durga saranya', 'https://www.linkedin.com/feed/', 'https://github.com/durgasaranyas139-lgtm'),
('gokul', 'http://www.linkedin.com/in/gokul-raj95', 'https://www.linkedin.com/in/gokul-raj95'),
('joy arnold', 'https://www.linkedin.com/in/joyarnold21?utm_source=share_via&utm_content=profile&utm_medium=member_android', ''),
('kathiravan', 'https://www.linkedin.com/in/kathiravan-e-56688a39b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', 'https://github.com/ekathiravanelumalai71-a11y'),
('mosses', 'https://www.linkedin.com/in/moses-acknal-7957973a4/', 'https://github.com/mosesacknals139'),
('priyadharsan', 'http://www.linkedin.com/in/priyadharsan-s2007', 'https://github.com/Priyadharsan2911'),
('abinay', 'https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit', ''),
('suriya', '', ''),
('yakesh', 'https://www.linkedin.com/in/yakesh-r-92648a383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', 'https://github.com/yakpranu-design'),
('nanthakumar', 'http://www.linkedin.com/in/nandhakumar-pm-8276b7381', 'https://github.com/nandhakumar1980'),
('srinithi', 'https://www.linkedin.com/in/srinithi-vijayakumar-981785344/', 'https://github.com/srinithivijayakumars139-wq'),
('srimathi', 'https://www.linkedin.com/in/srimathi-vijayakumar-10518a383/', 'https://github.com/srimajaya123-blip'),
('srinidthi', 'https://www.linkedin.com/in/srinidhi-v-123193384/', 'https://github.com/srinidhivs139-ai'),
('mohan', 'http://www.linkedin.com/in/mohan-e-b7945b2b2', 'https://github.com/mohanes139-cell'),
('nabi rasool', 'http://www.linkedin.com/in/nabi-rasool-129494393', ''),
('keerthana', 'https://www.linkedin.com/feed/', 'https://github.com/krishnakeerthanamitte-tech')
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 4. Create policy to allow everyone to read
CREATE POLICY "Allow public read access" ON students FOR SELECT USING (true);

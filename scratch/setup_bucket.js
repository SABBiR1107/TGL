
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupBucket() {
  const bucketName = 'product-media';
  
  console.log(`Checking bucket: ${bucketName}...`);
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }
  
  const exists = buckets.find(b => b.name === bucketName);
  
  if (exists) {
    console.log(`Bucket "${bucketName}" already exists.`);
  } else {
    console.log(`Bucket "${bucketName}" not found. Creating...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
    } else {
      console.log(`Bucket "${bucketName}" created successfully!`);
    }
  }
}

setupBucket();

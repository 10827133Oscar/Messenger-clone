// 環境變數檢查腳本
const fs = require('fs');
const path = require('path');

// 讀取 .env.local 檔案
const envPath = path.join(__dirname, '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    line = line.trim();
    // 跳過註解和空行
    if (line && !line.startsWith('#')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        envVars[key] = value;
      }
    }
  });
  console.log('📄 已讀取 .env.local 檔案\n');
} else {
  console.log('⚠️  未找到 .env.local 檔案\n');
}

const requiredEnvVars = {
  // 資料庫
  MONGODB_URI: 'MongoDB 資料庫連接字串',
  
  // NextAuth
  NEXTAUTH_SECRET: 'NextAuth 密鑰',
  
  // Google OAuth
  GOOGLE_CLIENT_ID: 'Google OAuth 客戶端 ID',
  GOOGLE_CLIENT_SECRET: 'Google OAuth 客戶端密鑰',
  
  // Pusher
  PUSHER_APP_ID: 'Pusher 應用程式 ID',
  NEXT_PUBLIC_PUSHER_APP_KEY: 'Pusher 公開金鑰',
  PUSHER_SECRET: 'Pusher 密鑰',
  PUSHER_CLUSTER: 'Pusher 集群',
  
  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'Cloudinary 雲端名稱',
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: 'Cloudinary 上傳預設值',
};

console.log('🔍 檢查環境變數設定...\n');

const missing = [];
const present = [];
const needsValue = [];

for (const [key, description] of Object.entries(requiredEnvVars)) {
  const value = envVars[key] || process.env[key];
  
  if (!value || value.trim() === '') {
    missing.push({ key, description });
    console.log(`❌ ${key}: 未設定 - ${description}`);
  } else if (value.includes('your_') || value === 'placeholder' || value.trim() === '') {
    needsValue.push({ key, description, value });
    console.log(`⚠️  ${key}: 已設定但需要填入實際值 - ${description}`);
    console.log(`   目前值: ${value}`);
  } else {
    present.push({ key, description });
    // 只顯示前幾個字符，隱藏敏感資訊
    const isSecret = key.includes('SECRET') || key.includes('SECRET') || key.includes('KEY');
    const displayValue = isSecret 
      ? '***已設定***' 
      : value.length > 40 
        ? value.substring(0, 40) + '...' 
        : value;
    console.log(`✅ ${key}: 已正確設定`);
    console.log(`   ${description}: ${displayValue}`);
  }
}

console.log('\n' + '='.repeat(60));
const totalSet = present.length;
const totalNeedsValue = needsValue.length;
const totalMissing = missing.length;
const total = Object.keys(requiredEnvVars).length;

console.log(`📊 檢查結果:`);
console.log(`   ✅ 已正確設定: ${totalSet}/${total}`);
console.log(`   ⚠️  需要填入實際值: ${totalNeedsValue}/${total}`);
console.log(`   ❌ 完全未設定: ${totalMissing}/${total}\n`);

if (needsValue.length > 0) {
  console.log('⚠️  以下環境變數已設定但需要填入實際值:\n');
  needsValue.forEach(({ key, description }) => {
    console.log(`   - ${key}: ${description}`);
  });
  console.log('');
}

if (missing.length > 0) {
  console.log('❌ 缺少以下環境變數:\n');
  missing.forEach(({ key, description }) => {
    console.log(`   - ${key}: ${description}`);
  });
  console.log('');
}

if (missing.length > 0 || needsValue.length > 0) {
  console.log('❌ 專案無法順利運行，請完成上述環境變數的設定！');
  console.log('💡 請編輯 .env.local 檔案並填入正確的環境變數值。');
  process.exit(1);
} else {
  console.log('✅ 所有必需的環境變數都已正確設定！');
  console.log('🎉 專案應該可以順利運行！');
  process.exit(0);
}

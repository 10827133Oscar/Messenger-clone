# Messenger Clone

這是一個使用 Next.js 建立的即時通訊應用程式。

## 專案需求

在開始之前，請確保您已安裝：
- Node.js 18+ 
- npm, yarn, pnpm 或 bun

## 安裝步驟

### 1. 安裝依賴套件

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 設定環境變數

在專案根目錄建立 `.env.local` 檔案，並填入以下環境變數：

```env
# MongoDB 資料庫連接字串
# 格式: mongodb://username:password@host:port/database
# 或使用 MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_URI=your_mongodb_connection_string

# NextAuth 密鑰
# 可以使用以下命令生成: openssl rand -base64 32
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth 設定
# 在 Google Cloud Console 建立 OAuth 2.0 憑證
# https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Pusher 即時通訊設定
# 在 https://dashboard.pusher.com/ 建立應用程式
PUSHER_APP_ID=your_pusher_app_id
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster

# Cloudinary 圖片上傳設定
# 在 https://cloudinary.com/ 建立帳號
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3. 服務設定說明

#### MongoDB
1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 或使用本地 MongoDB
2. 建立資料庫並取得連接字串
3. 將連接字串填入 `MONGODB_URI`

#### NextAuth
1. 使用以下命令生成密鑰：
   ```bash
   openssl rand -base64 32
   ```
2. 將生成的密鑰填入 `NEXTAUTH_SECRET`

#### Google OAuth
**建議為此專案建立新的 Google Cloud 專案**（隔離性、安全性、管理方便）

詳細設定步驟請參考：[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

快速步驟：
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案（建議名稱：`messenger-clone`）
3. 啟用「Google Identity Services API」或「Google+ API」
4. 設定 OAuth 同意畫面（選擇「外部」使用者類型）
5. 建立 OAuth 2.0 憑證（應用程式類型：網頁應用程式）
6. 設定授權重新導向 URI：`http://localhost:3000/api/auth/callback/google`
7. 複製 Client ID 和 Client Secret 填入 `.env.local` 檔案

#### Pusher
1. 前往 [Pusher Dashboard](https://dashboard.pusher.com/)
2. 建立新應用程式
3. 選擇集群（建議選擇離您最近的區域）
4. 將 App ID、Key、Secret 和 Cluster 填入對應的環境變數

#### Cloudinary
1. 前往 [Cloudinary](https://cloudinary.com/) 註冊帳號
2. 在 Dashboard 中取得 Cloud Name
3. 前往 Settings > Upload > Upload presets
4. 建立一個新的 Upload Preset（建議設定為 "Unsigned" 以允許前端上傳）
5. 將 Cloud Name 和 Upload Preset 填入對應的環境變數

### 4. 啟動開發伺服器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 專案結構

- `src/app/` - Next.js App Router 頁面和 API 路由
- `src/components/` - React 元件
- `src/lib/` - 工具函數和設定
- `src/models/` - MongoDB Mongoose 模型
- `src/context/` - React Context
- `src/hooks/` - 自訂 React Hooks

## 技術棧

- **框架**: Next.js 16
- **資料庫**: MongoDB (Mongoose)
- **認證**: NextAuth.js
- **即時通訊**: Pusher
- **圖片上傳**: Cloudinary
- **樣式**: Tailwind CSS
- **表單處理**: React Hook Form
- **狀態管理**: Zustand

## 注意事項

- 確保所有環境變數都已正確設定，否則應用程式可能無法正常運作
- 在生產環境部署時，請確保環境變數已正確設定在部署平台
- Google OAuth 的重新導向 URI 需要根據部署環境進行調整

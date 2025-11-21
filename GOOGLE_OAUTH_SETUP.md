# Google OAuth 設定指南

## 建議：建立新專案

✅ **建議為此專案建立新的 Google Cloud 專案**，原因：
- **隔離性**：避免影響其他專案
- **安全性**：獨立管理憑證和權限
- **管理方便**：專案和憑證對應清楚
- **成本追蹤**：可獨立追蹤使用量

## 詳細設定步驟

### 步驟 1：建立新專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 點擊頂部專案選擇器
3. 點擊「**新增專案**」
4. 輸入專案名稱（例如：`messenger-clone`）
5. 點擊「**建立**」

### 步驟 2：啟用必要的 API

1. 在左側選單選擇「**API 和服務**」>「**程式庫**」
2. 搜尋「**Google+ API**」或「**Google Identity Services API**」
3. 點擊進入後，點擊「**啟用**」

> **注意**：如果找不到 Google+ API，請啟用「**Google Identity Services API**」，這是新的 API。

### 步驟 3：設定 OAuth 同意畫面

1. 在左側選單選擇「**API 和服務**」>「**OAuth 同意畫面**」
2. 選擇使用者類型：
   - **外部**：任何人都可以使用（適合開發和測試）
   - **內部**：僅限組織內使用（需要 Google Workspace）
3. 填寫應用程式資訊：
   - **應用程式名稱**：Messenger Clone（或您喜歡的名稱）
   - **使用者支援電子郵件**：選擇您的電子郵件
   - **應用程式標誌**：（可選）
   - **應用程式首頁連結**：`http://localhost:3000`
   - **應用程式隱私權政策連結**：（可選，開發階段可留空）
   - **應用程式服務條款連結**：（可選，開發階段可留空）
   - **授權網域**：（可選，開發階段可留空）
4. 點擊「**儲存並繼續**」
5. 在「**範圍**」頁面，直接點擊「**儲存並繼續**」（不需要新增範圍）
6. 在「**測試使用者**」頁面（如果是外部應用程式）：
   - 如果應用程式狀態是「測試中」，需要新增測試使用者
   - 點擊「**新增使用者**」，輸入您的 Google 帳號電子郵件
   - 點擊「**儲存並繼續**」
7. 在「**摘要**」頁面，檢查資訊後點擊「**返回資訊主頁**」

### 步驟 4：建立 OAuth 2.0 憑證

1. 在左側選單選擇「**API 和服務**」>「**憑證**」
2. 點擊頂部的「**建立憑證**」>「**OAuth 用戶端 ID**」
3. 如果出現「設定 OAuth 同意畫面」提示，請先完成步驟 3
4. 選擇應用程式類型：**網頁應用程式**
5. 填寫詳細資訊：
   - **名稱**：Messenger Clone Client（或您喜歡的名稱）
   - **已授權的 JavaScript 來源**：
     - `http://localhost:3000`
   - **已授權的重新導向 URI**：
     - `http://localhost:3000/api/auth/callback/google`
     - （如果未來要部署，也要加入生產環境的 URL，例如：`https://yourdomain.com/api/auth/callback/google`）
6. 點擊「**建立**」
7. **重要**：系統會顯示您的 **Client ID** 和 **Client Secret**
   - 請立即複製這兩個值
   - Client Secret 只會顯示一次，如果忘記需要重新建立

### 步驟 5：更新環境變數

將取得的 Client ID 和 Client Secret 填入 `.env.local` 檔案：

```env
GOOGLE_CLIENT_ID=您的_Client_ID_這裡
GOOGLE_CLIENT_SECRET=您的_Client_Secret_這裡
```

## 生產環境設定

當您要部署到生產環境時，需要：

1. 在 Google Cloud Console 的 OAuth 2.0 憑證中：
   - 新增生產環境的重新導向 URI
   - 例如：`https://yourdomain.com/api/auth/callback/google`

2. 更新 `.env.local` 或生產環境的環境變數：
   - 確保 `NEXTAUTH_URL` 設定為生產環境的 URL
   - 例如：`NEXTAUTH_URL=https://yourdomain.com`

## 常見問題

### Q: 為什麼需要測試使用者？
A: 如果您的應用程式狀態是「測試中」，只有列在測試使用者清單中的 Google 帳號才能使用 Google 登入功能。

### Q: 如何發布應用程式？
A: 在 OAuth 同意畫面中，點擊「**發布應用程式**」按鈕。發布後，任何人都可以使用 Google 登入功能。

### Q: 出現「redirect_uri_mismatch」錯誤？
A: 檢查重新導向 URI 是否完全一致，包括：
- 協議（http/https）
- 域名
- 路徑
- 結尾斜線（如果有）

### Q: Client Secret 忘記了怎麼辦？
A: 需要重新建立 OAuth 2.0 憑證。舊的憑證會失效，需要更新環境變數。

## 驗證設定

設定完成後，可以：
1. 啟動開發伺服器：`npm run dev`
2. 訪問 `http://localhost:3000`
3. 點擊「使用 Google 登入」按鈕
4. 應該會跳轉到 Google 登入頁面


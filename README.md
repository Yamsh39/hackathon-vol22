# Smart Stack
**hackathon vol-22   
Team: FujiTech**

Smart Stackは、最新の技術を駆使して、あなたの家計管理をより効率的にサポートします。レシートのスキャンから情報の抽出まで、全てをスマートに処理し、家計簿を自動で作成することができるアプリケーションです。  
さらに、グラフやチャートを使った視覚的なデータ分析機能も搭載しており、家計の状態を一目でチェックできます。どこにお金がかかっているのか、どのカテゴリーで節約できるのかを簡単に理解でき、家計管理をより楽しくできます。  

---

## 技術スタック

- **フロントエンド**: React (Vite)
- **バックエンド**: Express, Node.js
- **データベース**: PostgreSQL
- **コンテナ管理**: Docker, Docker Compose

## 環境構築

### 1. リポジトリをクローンする
```bash
git clone [リポジトリURL]
```
### 2. プロジェクトディレクトリに移動する
```bash
cd hackathon-vol22
```
### 3. バックエンド/フロントエンドの依存関係をインストールする
```bash
cd frontend
npm install
npm install react-router-dom@6 react-chartjs-2 chart.js recharts react-router-dom
```
```bash
cd backend
npm install
```

### 5. プロジェクトディレクトリに戻る
```bash
cd ..
```

### 6. 環境変数ファイルを作成する(discordに記載)
```bash
touch .env
```

### 7. azureのセットアップをする
```bash
cd backend/
npm install express axios dotenv cors multer

cd frontend/
npm install axios
```

### 8. Geminiのセットアップをする
```bash
cd backend\
npm install @google/generative-ai
```

### 9. Dockerコンテナを立ち上げる
```bash
docker compose up --build
```

### 10. prismaのmigrateを実行する
```bash
docker exec -it hackathon-vol22-backend-1 sh
npx prisma migrate dev
```

### 11. ブラウザでアプリケーションにアクセスする
- フロントエンド: [http://localhost:3000](http://localhost:3000)
- バックエンド: [http://localhost:5000](http://localhost:5000)
- データベース: [http://localhost:5432](http://localhost:5432)
- pgAdmin: [http://localhost:5050](http://localhost:5050)


## ディレクトリ構成
```
hackathon-vol22
.
├── backend
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   ├── routes
│   │   ├── dbRoutes.js
│   │   ├── geminiRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── ocrRoutes.js
│   │   └── receiptRoutes.js
│   ├── services
│   │   ├── geminiService.js
│   │   ├── ocrService.js
│   │   └── receiptService.js
│   ├── uploads
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── dist
│   │   ├── assets
│   │   │   ├── index-DWvwZDsY.js
│   │   │   └── index-kQJbKSsj.css
│   │   └── index.html
│   ├── src
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── DetailPopup.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages
│   │   │   ├── About.jsx
│   │   │   ├── GraphPage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── IncomeForm.jsx
│   │   │   ├── IncomeHistory.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── ReceiptsForm.jsx
│   │   │   └── RegistrationHistory.jsx
│   │   ├── styles
│   │   │   ├── Button.module.css
│   │   │   ├── DetailPopup.module.css
│   │   │   ├── GraphPage.css
│   │   │   ├── Home.css
│   │   │   ├── IncomeHistory.module.css
│   │   │   ├── Navigation.module.css
│   │   │   └── RegistrationHistory.module.css
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── docker-compose.yaml
├── package-lock.json
├── package.json
└── README.md
```


# hackathon-vol22
--

# React + Vite

このプロジェクトは、Reactを使ったフロントエンド、ExpressとNode.jsを使ったバックエンド、PostgreSQLを使ったデータベースを構築したフルスタックWebアプリケーションです。すべてのサービスはDockerでコンテナ化され、`docker-compose`を使って簡単に開発環境を立ち上げることができます。

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
npm install react-router-dom@6
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
├── backend
│   ├── prisma
│   │   └── schema.prisma
│   ├── uploads
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── ReceiptsForm.jsx
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── docker-compose.yaml
└── README.md
```


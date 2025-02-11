# hackathon-vol22
--

# React + Vite

このプロジェクトは、Reactを使ったフロントエンド、ExpressとNode.jsを使ったバックエンド、PostgreSQLを使ったデータベースを構築したフルスタックWebアプリケーションです。すべてのサービスはDockerでコンテナ化され、`docker-compose`を使って簡単に開発環境を立ち上げることができます。

## 技術スタック

- **フロントエンド**: React (Vite)
- **バックエンド**: Express, Node.js
- **データベース**: PostgreSQL
- **コンテナ管理**: Docker, Docker Compose

以下を実行してみてできなかったらchatGPTに聞いてみて
```bash
$ docker compose up --build
```
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
```
```bash
cd backend
npm install
```

### 5. プロジェクトディレクトリに戻る
```bash
cd ..
```

### 6. 環境変数ファイルを作成する(内容は直接もらう)
```bash
touch .env
```

### 7. Dockerコンテナを立ち上げる
```bash
docker compose up --build
```

### 8. prismaのmigrateを実行する
```bash
docker exec -it hackathon-vol22-backend-1 sh
npx prisma migrate dev
```

### 9. azureのセットアップをする
```bash
cd backend/
npm install express axios dotenv cors multer

cd frontend/
npm install axios
```

### 10. ブラウザでアプリケーションにアクセスする
- フロントエンド: [http://localhost:3000](http://localhost:3000)
- バックエンド: [http://localhost:4000](http://localhost:4000)
- データベース: [http://localhost:5432](http://localhost:5432)
- pgAdmin: [http://localhost:5050](http://localhost:5050)


## ディレクトリ構成
```
hackathon-vol22
├── backend
│   ├── node_modules
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── node_modules
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── index.html
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
├── .env
├── .gitignore
└── docker-compose.yml
```


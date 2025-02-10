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


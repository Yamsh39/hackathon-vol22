# Node.jsの公式イメージを使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install

# アプリのソースコードをコピー
COPY . .

# 本番ビルドを実行
RUN npm run build

# 環境変数 PORT（Cloud Run では 8080）を考慮してサーバーを起動
CMD ["npm", "run", "preview", "--", "--port", "8080", "--host"]

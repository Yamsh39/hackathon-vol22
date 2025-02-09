# Node.jsの公式イメージを使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install

# アプリのソースコードをコピー
COPY . .

RUN npx prisma generate

# サーバーを起動
CMD ["node", "server.js"]

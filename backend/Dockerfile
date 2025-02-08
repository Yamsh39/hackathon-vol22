# Node.jsの公式イメージを使用
FROM node:18

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install

# アプリのソースコードをコピー
COPY . .

# サーバーを起動
CMD ["npm", "run", "dev"]

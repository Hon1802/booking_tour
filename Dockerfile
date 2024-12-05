FROM node:20-alpine AS development

ENV NODE_OPTIONS=--max_old_space_size=1536

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install 

COPY . .

# Thay đổi lệnh từ npm build thành npm run build
# RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "dev"]


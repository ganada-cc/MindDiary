# 1. 베이스 이미지 선택 (Node.js LTS 버전)
FROM node:18

# 2. 작업 디렉터리 생성
WORKDIR /app

# 3. 의존성 복사 및 설치
COPY package*.json ./
RUN npm install

# 4. 앱 소스 복사
COPY . .

# 5. 포트 설정 (manifest에 따라 3000번 사용)
EXPOSE 3000

# 6. 실행 명령
CMD [ "npm", "start" ]
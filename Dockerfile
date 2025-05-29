# 1. Node.js 23.7.0 버전 공식 이미지 사용 (alpine 기반으로 가볍게)
FROM node:23.7.0-alpine

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. package.json, package-lock.json 복사 (package-lock.json 있으면 복사하세요)
COPY package.json ./

# 5. 소스 코드 전체 복사
COPY . .

# 6. 앱 실행 포트 노출 (필요 시)
EXPOSE 3000

# 7. 앱 시작 명령어
CMD ["node", "main.js"]

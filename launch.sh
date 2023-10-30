#!/bin/sh

echo 'DATABASE_URL="file:./test.db"' > .env
[ -f prisma/test.db ] && rm prisma/test.db
lsof -t -i:3000 | xargs -I {} kill -9 {} 2>/dev/null
lsof -t -i:5174 | xargs -I {} kill -9 {} 2>/dev/null
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev & (cd client && npm install && npm run dev)

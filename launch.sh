#!/bin/sh

echo 'DATABASE_URL="file:./test.db"' > .env
npm install
npm run prisma:prepare
npm run prisma:migrate
npm run dev & (cd client && npm install && npm run dev)

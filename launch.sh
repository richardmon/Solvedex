#!/bin/sh

echo 'DATABASE_URL="file:./test.db"' > .env
npm install
npm run test:prepare
npm run test:migrate
npm run dev & (cd client && npm install && npm run dev)

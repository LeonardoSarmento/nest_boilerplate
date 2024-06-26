# --- Base Node ---
# Base setup
FROM node:20-alpine3.18 AS base
RUN echo "FROM node:20-alpine3.18 AS base"
 
WORKDIR /app
 
COPY package*.json ./
 
COPY . .
 
# --- Development Setup ---
# Dependences and Prisma setup
FROM base AS dev
RUN echo "base AS dev"
 
RUN npm i
RUN npx prisma generate
RUN npm run db:migrate:dev
 
CMD [ "npm", "run", "start:dev" ]
 
# --- Production Setup ---
# Dependences, Prisma setup, Build and apply Prisma change
FROM base AS prod
RUN echo "base AS prod"
 
RUN npm ci
RUN npx prisma generate
RUN npm run build
 
CMD [ "npm", "run", "start:prod:migrate" ]
# Stage 1: dependências (compartilhado entre dev e build)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: desenvolvimento (Vite com hot reload)
FROM deps AS dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 3: build estático (gera dist/)
FROM deps AS build
COPY . .
RUN npm run build

# Stage 4: produção (serve dist/ com nginx — só pra simulação local)
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

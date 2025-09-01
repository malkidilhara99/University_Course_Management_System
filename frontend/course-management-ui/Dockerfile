FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY public ./public
COPY src ./src
RUN npm ci --legacy-peer-deps && npm run build

FROM nginx:stable-alpine AS runtime
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

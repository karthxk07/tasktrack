# build stage
FROM node:25-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# runtime stage
FROM node:25-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/vite.config.js ./vite.config.js
EXPOSE 80

CMD ["/bin/sh", "-c", " \
  echo 'window._env_ = {' > /app/dist/env-config.js && \
  env | grep '^VITE_' | while IFS='=' read -r key value; do \
    echo \"  $key: \\\"$value\\\",\" >> /app/dist/env-config.js; \
  done && \
  echo '};' >> /app/dist/env-config.js && \
  npm run preview \
"]
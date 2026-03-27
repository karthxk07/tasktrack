# build stage
FROM node:25-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# runtime stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["/bin/sh", "-c", " \
  echo 'window._env_ = {' > /usr/share/nginx/html/env-config.js && \
  env | grep '^VITE_' | while IFS='=' read -r key value; do \
    echo \"  $key: \\\"$value\\\",\" >> /usr/share/nginx/html/env-config.js; \
  done && \
  echo '};' >> /usr/share/nginx/html/env-config.js && \
  nginx -g 'daemon off;' \
"]
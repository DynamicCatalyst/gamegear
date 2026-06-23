# ---- build stage: produce the static Angular bundle ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- run stage: serve the static files with nginx ----
FROM nginx:alpine
# Angular 22 outputs to dist/<project>/browser
COPY --from=build /app/dist/gamegear-angular/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Build stage
FROM node:20-alpine AS builder

# Add build arguments for Vite
ARG VITE_USER_SERVICE_URL
ARG VITE_WORKOUT_SERVICE_URL
ARG VITE_AI_SERVICE_URL

# Set them as environment variables during build time
ENV VITE_USER_SERVICE_URL=$VITE_USER_SERVICE_URL
ENV VITE_WORKOUT_SERVICE_URL=$VITE_WORKOUT_SERVICE_URL
ENV VITE_AI_SERVICE_URL=$VITE_AI_SERVICE_URL

WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build

# Runtime stage - Use Nginx for production-grade serving
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Add a basic nginx config to handle SPA routing (redirect all to index.html)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

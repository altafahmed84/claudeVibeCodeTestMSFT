# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN chmod +x node_modules/.bin/vite
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install dependencies for both frontend and API
COPY package*.json ./
COPY api/package*.json ./api/
RUN npm ci --only=production
RUN cd api && npm ci --only=production

# Copy built frontend
COPY --from=build /app/dist ./dist

# Copy API code
COPY api ./api
COPY staticwebapp.config.json ./

# Install serve to serve the frontend
RUN npm install -g serve

# Create startup script
RUN echo '#!/bin/sh' > start.sh && \
    echo 'serve -s dist -p 3000 &' >> start.sh && \
    echo 'cd api && node ../local-api.cjs &' >> start.sh && \
    echo 'wait' >> start.sh && \
    chmod +x start.sh

COPY local-api.cjs ./

EXPOSE 3000 7071

CMD ["./start.sh"]
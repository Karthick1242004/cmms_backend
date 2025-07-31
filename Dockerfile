# Use Node.js 18 LTS Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts --no-audit --no-fund

# Copy source code
COPY . .

# Build the application (requires TypeScript and other dev dependencies)
RUN npm run build

# Install only production dependencies in a clean way
RUN rm -rf node_modules && \
    npm ci --only=production --ignore-scripts --no-audit --no-fund

# Remove source files and dev configs to reduce image size
RUN rm -rf src/ tsconfig.json .tsbuildinfo && \
    npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S cmms -u 1001

# Change ownership of the app directory
RUN chown -R cmms:nodejs /app
USER cmms

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
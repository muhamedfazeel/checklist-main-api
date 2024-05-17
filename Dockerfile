# Stage 1: Build the application
FROM node:20-alpine3.18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --verbose && \
    npm install --only=development --verbose

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Stage 2: Create the production image using the same base image
FROM node:20-alpine3.18

# Set the working directory
WORKDIR /app

# Copy only necessary files from the build stage
# This includes the production node_modules and the built app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Set the environment variable for the port
# Use a default value if not provided
ENV PORT=3000

# Expose the port
EXPOSE ${PORT}

# Start the application
CMD ["node", "dist/main"]

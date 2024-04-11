# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, package-lock.json and .npmrc (for package access) to the working directory
COPY package.json pnpm-lock.yaml .npmrc ./

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies
RUN pnpm install

# Copy all local files to the image's working directory
COPY . .

# Build the project
RUN pnpm run build

# Expose the port that app will run on
EXPOSE 8080

# Run the application
CMD ["pnpm", "run", "preview"]

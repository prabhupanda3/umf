# Use Node.js for building the Angular app
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the Angular project files and build it
COPY . .
RUN npm run build --prod

# Use Nginx to serve the Angular app
FROM nginx:alpine

# Copy built Angular app to Nginx web directory
COPY --from=build /app/dist/jwellers /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

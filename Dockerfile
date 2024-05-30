# Use the Node.js 20 LTS version with Alpine
FROM node:20-alpine

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

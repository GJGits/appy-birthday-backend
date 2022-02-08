FROM node:16.10
COPY . home/backend
WORKDIR home/backend
RUN npm install express --save
RUN npm install cors
CMD ["node", "index.js", "mysql"]
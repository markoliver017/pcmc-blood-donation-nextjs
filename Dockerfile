# Use an official Node.js runtime as the base image
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libcups2 \
    libxshmfence1 \
    libgtk-3-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install puppeteer

# Build the Next.js application
RUN npm run build

# Expose the port that the application will use
EXPOSE 3000

# Run the command to start the application when the container launches
CMD ["npm", "start"]

#steps
#docker build -t inmers-app . --if running only Dockerfile

# To run the Docker container, use the following command:
#docker run -p 3000:3000 inmers-app

#Let's create a docker-compose.yml file instead:

# version: "3"
# services:
#     db:
#         image: mysql:8.0
#         environment:
#             MYSQL_ROOT_PASSWORD: root
#             MYSQL_DATABASE: immers
#         volumes:
#             - db-data:/var/lib/mysql
#         ports:
#             - "33060:3306"

#     app:
#         build: .
#         environment:
#             DB_HOST: db
#             DB_PORT: 3306
#             DB_USER: root
#             DB_PASSWORD: root
#             DB_NAME: immers
#         ports:
#             - "3000:3000"
#         depends_on:
#             - db

# volumes:
#     db-data:


#run: docker-compose up
#docker-compose up -d - If you want to run it in detached mode (i.e., in the background), you can use the -d flag:
#docker-compose up --build - If it's the first time you're running docker-compose up, it will build your images and start the containers. If you've made changes to your docker-compose.yml file or Dockerfile, you may need to rebuild your images using:

#
#docker-compose exec db mysql -uroot -pyour_password -e "SHOW DATABASES;"
#docker-compose logs db

#to delete existing database volume
#docker-compose down -v
#list down volume
#docker volume ls

# docker-compose exec db mysql -uroot -proot -e "CREATE DATABASE inmers;"
# docker-compose exec db mysql -uroot -proot -e "DROP DATABASE immers;"


#docker exec -it pcmc-inmers-shadcn-db-1 mysql -uroot -proot
#docker exec -it pcmc-inmers-shadcn-app-1 node lib/sync.js

#docker exec -it pcmc-inmers-shadcn_app_1 npx sequelize-cli db:seed:all

# PS C:\nextJs\pcmc-inmers-shadcn> docker save -o pcmc-inmers-shadcn.tar pcmc-inmers-shadcn-app mysql:8.0

# PS C:\nextJs\pcmc-inmers-shadcn> scp C:\nextJs\pcmc-inmers-shadcn\pcmc-inmers-shadcn.tar mroman@10.0.0.185:/home/mroman/

#log in to ur linux
#ssh mroman@10.0.0.185

#LOAD AND RUN .tar file
#sudo docker load -i /home/mroman/pcmc-inmers-shadcn.tar
#or
#sudo docker load -i pcmc-inmers-shadcn.tar

#Verify the image
#sudo docker images

#Finally, run the Docker container:
#sudo docker run -d -p 3000:3000 pcmc-inmers-shadcn-app
#sudo docker run -d --name mysql-container -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql:8.0

#sudo docker exec -it mysql-container mysql -uroot -p

#inside LINUX
#STOP/DELETE RUNNING CONTAINER
#sudo docker stop 4fe96af749a6
#sudo docker rm 4fe96af749a6 

#DELETE IMAGES inside linux docker
#sudo docker rmi pcmc-inmers-shadcn-app

# check container status
# sudo docker ps -a

#check container logs
#sudo docker logs gallant_bell
#sudo docker logs mysql-container

#check CPU architecture
#lscpu
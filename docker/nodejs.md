### Init project
Pull a node image
```console
docker pull node:14-alpine
```
init a nodejs project using this image
```console
# -it runs the command in shell mode
# --rm removes the container instance once we're done running the command(s)
# -u $(id -u):$(id -g) ensures that resulting package.json is owned by host machine user (eg: 1000:1000), not by root
# -v is mounting host directory to container's /app 
# -w is setting the working directory to /app
docker run -itu $(id -u):$(id -g)  --rm -v $(pwd):/app -w /app node:14-alpine npm init
```
install dependencies
```console
# -u is not required for some reason. npm init by default runs as root but `npm i` or `npm i package` doesn't
docker run -it --rm -v $(pwd):/app -w /app node:14-alpine npm i express
# or
docker run -it --rm -v $(pwd):/app -w /app node:14-alpine npm i
```
Create an npm alias!
```bash
alias npm="docker run -itu $(id -u):$(id -g) --rm -v $(pwd):/app -w /app node:14-alpine"
```
### Project Structure
Dockerfile
```dockerfile
#The image we're using. Don't use ambigious name like 'latest'
FROM node:14-alpine

#cd into /app in container
WORKDIR /app

#copy package.json into /app in container
COPY package.json .

#if package.json has not changed, this step won't run
RUN npm install

#now copy everything else
COPY . .

#run the app
CMD [ "npm", "run", "dev" ]
```
docker-compose.yml
```yml
version: '2'
services:
  web:
    build: .
    volumes:
      - .:/app
    ports:
      - "8082:8080"
    environment:
      - HTTP_PORT=8080
```
index.js
```js
const express = require('express');
const app = express()

app.get('/', (req, res) => {
    res.json({'status': 200})
})

app.listen(process.env.HTTP_PORT, () => console.log(`Listening to port ${process.env.HTTP_PORT}`));
```
accessing the running container
```console
#list files using docker-compose (running container service name)
docker-compose run --rm  web ls
#list files using docker run (running container name)
docker run -it --rm -v $(pwd):/app -w /app nodejs_web ls
```

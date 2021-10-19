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

`Dockerfile`
```Dockerfile
FROM ubuntu:20.04

RUN apt update && apt install figlet
```
Build image
```bash
#The name figlet can be anything, it will create an image
docker build -t figlet .
```

```bash
#List all images
docker images -a

#Remove all images
docker rmi $(docker images -a -q)

#Remove all unused(?) containers
docker system prune

#Access the container cli (--it is interactive)
docker container run --rm --it figlet

#Run commands from outside the cli
docker container run --rm figlet figlet Hello, laravel!
```

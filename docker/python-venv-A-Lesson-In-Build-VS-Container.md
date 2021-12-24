### Build config

When the objective is to build a production level image and deploy it, putting all of our instruction into `Dockerfile` makes things easier. Example includes venv and a non-root user.
```dockerfile
# pull official base image
FROM python:3.8-alpine3.14

ARG UID
ARG GID
ARG PYUSER=pyuser

ENV UID=${UID:-1000}
ENV GID=${GID:-1000}

RUN addgroup -g ${GID} --system ${PYUSER}
RUN adduser -G ${PYUSER} --system -D -s /bin/sh -u ${UID} ${PYUSER}

# set work directory
RUN mkdir -p /app
RUN chown ${PYUSER}:${PYUSER} /app
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update

# install dependencies
RUN pip install --upgrade pip

USER ${PYUSER}

RUN python -m venv venv
ENV VIRTUAL_ENV /app/venv
ENV PATH /app/venv/bin:$PATH

COPY ./src/requirements.txt .
RUN pip install -r requirements.txt

# # copy project
COPY ./src .
```
Tutorials and instructions often use this sort of build instructions for local development. 
### Problems
Try mounting `./src` to `/app` while running a container, and the `/app/venv` disappears. It's nowhere to be found because the container mount overrrides the image path.\
You can use a different `venv` location to avoid this. But it still doesn't resolve the issue. You can't still check what's inside `venv`, neither can your IDE.
### Why does it not seem to be a problem in tutorials
Let it be node project or python, tutorial creators love using their LOCAL python/nodejs to create the project and install dependencies INTO the host machine.\ 
When you have a local `node_modules` or `venv` directory with the dependencies, you and your IDE gets an illusion of finding these files. While in reality the dependency installations that happen in the dockerfile are completely dirrent.\
If the host machine's env is not incompitable with container's, it works. There's no guarantee it'd work. I disdain this illusion.\ 
The point of using docker is to not rely on hot machine's softwares. If you are runnin `pip install` from the host machine first, what's the point!
### My solution
For the development environment, take some more steps. When it comes to dependencies and source code, don't `COPY` anything. Run the commands as you'd run in your host machine. 
```dockerfile
# pull official base image
FROM python:3.8-alpine3.14

ARG UID
ARG GID
ARG PYUSER=pyuser

ENV UID=${UID:-1000}
ENV GID=${GID:-1000}

RUN addgroup -g ${GID} --system ${PYUSER}
RUN adduser -G ${PYUSER} --system -D -s /bin/sh -u ${UID} ${PYUSER}

# set work directory
RUN mkdir -p /app
RUN chown ${PYUSER}:${PYUSER} /app
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update

USER ${PYUSER}

# create venv during build if volume mount won't conflict later. Be sure to set PATH anyway, otherwise you'll have to run [/app/venv/bin python] all the time!
RUN python -m venv venv
ENV VIRTUAL_ENV /app/venv
ENV PATH /app/venv/bin:$PATH
```
```yml
version: '3'

services:
  web:
    container_name: web
    build:
      context: .
      dockerfile: ./python.dockerfile
    volumes:
      - "./src:/app"
```
```
# add venv, it'll now be visible in host ./src
docker-compose run --rm web python -m venv venv
# should return venv path
docker-compose run --rm web which python
```

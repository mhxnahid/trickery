```
# connect to a mongo container that's running using docker-compose
docker run --rm -it --net=host mongo:5 mongo --host 127.0.0.1 --username root --password
# connecting to a service in the same network(?)
docker-compose run --rm mongo mongo --host mongo --username root --password
```

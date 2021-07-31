`docker-compose.yml`
```yml                                                    /home/nahid/projects/docker/utils/docker-compose.yml                                                                 
version: '3'

services:
    meilisearch:
        image: 'getmeili/meilisearch'
        volumes:
            - ./data.ms:/data.ms
        ports:
            - 7700:7700
        restart: unless-stopped

    pgadmin:
        image: 'thajeztah/pgadmin4'
        ports:
            - "5050:5050"
        environment:
            PGADMIN_DEFAULT_EMAIL: admind@admin.com
            PGADMIN_DEFAULT_PASSWORD: root
            #PGADMIN_LISTEN_PORT: 5050
        #restart: unless-stopped

    postgres:
        image: 'postgres'
        volumes:
            - ./pgdata:/var/lib/postgresql/data
        ports:
            - "5432:5432"
        environment:
            POSTGRES_USER: root
            POSTGRES_PASSWORD: root
            POSTGRES_DB: test_db
        restart: unless-stopped
```

To run all as a container:
```
docker-compose up
docker-compose down
```

To run services:
```
docker-compose run pgadmin postgres
```

CLI access (service):
```
$_ docker container ls 
docker exec -it mysql_db_run_30372df019b7 bash

#OR

docker exec -it $(docker ps -q -f name=postgress) bash
```

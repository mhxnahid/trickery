```yml
# docker-compose.yml
version: "3.7"

networks:
  commoners:

services:
  mongo:
    image: mongo:5
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: Els--Mongo
    ports:
      - ${HOST:-127.0.0.1}:27017:27017
    volumes:
      - ./mongodb:/data/db
    networks:
      - commoners
```

```js
# mongoose connection string
const mongoose = require('mongoose');

mongoose.connect("mongodb://root:Pass-Word@127.0.0.1:27017/db_mine?authSource=admin", {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true
 })

mongoose.connection
    .on('error', console.log)
    .on('open', (op) => console.log(`opened`))
```

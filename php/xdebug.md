### Linux (ubuntu 20.04), vscode 1.62.2, php7.4.3

```
 php -v                                                                           ✔ 
PHP 7.4.3 (cli) (built: Jul  5 2021 15:13:35) ( NTS )
Copyright (c) The PHP Group
Zend Engine v3.4.0, Copyright (c) Zend Technologies
    with Zend OPcache v7.4.3, Copyright (c), by Zend Technologies
    with Xdebug v2.9.2, Copyright (c) 2002-2020, by Derick Rethans

```
`/etc/php/7.4/cli/conf.d/20-xdebug.ini`
```
zend_extension=xdebug.so
xdebug.idekey=VSCODE
xdebug.remote_autostart = 1
xdebug.remote_enable = 1
xdebug.remote_handler = dbgp
xdebug.remote_host = 127.0.0.1
xdebug.remote_log = /tmp/xdebug_remote.log
xdebug.remote_mode = req
xdebug.remote_port = 9003
```
```json
// Sample project/.vscode/launch.json

{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "request": "launch",
            "port": 9003
        },
        {
            "name": "Launch currently open script",
            "type": "php",
            "request": "launch",
            "program": "${file}",
            "cwd": "${fileDirname}",
            "port": 0,
            "runtimeArgs": [
                "-dxdebug.start_with_request=yes"
            ],
            "env": {
                "XDEBUG_MODE": "debug,develop",
                "XDEBUG_CONFIG": "client_port=${port}"
            }
        },
        {
            "name": "Launch Built-in web server",
            "type": "php",
            "request": "launch",
            "runtimeArgs": [
                "-dxdebug.mode=debug",
                "-dxdebug.start_with_request=yes",
                "-S",
                "localhost:0"
            ],
            "program": "",
            "cwd": "${workspaceRoot}",
            "port": 9003,
            "serverReadyAction": {
                "pattern": "Development Server \\(http://localhost:([0-9]+)\\) started",
                "uriFormat": "http://localhost:%s",
                "action": "openExternally"
            }
        }
    ]
}
```

### Docker (ubuntu 20.04 host) + vscode
```yml
version: '3'

networks:
  laravel:

services:
  site:
    build:
      context: ./dockerfiles
      dockerfile: nginx.dockerfile
    container_name: nginx
    ports:
      - 80:80
    volumes:
      - ./:/var/www/html
    depends_on:
      - php
    networks:
      - laravel

  php:
    build:
      context: ./dockerfiles
      dockerfile: php.dockerfile
    container_name: php
    volumes:
      - ./:/var/www/html
    networks:
      - laravel
```

```Dockerfile
# ./dockerfiles/php.dockerfile
FROM php:8.0-fpm-alpine

# install xdebug
RUN set -xe && \
        docker-php-source extract && \
        apk add --no-cache --virtual .build-deps \
            autoconf \
            g++ \
            make \
        && \
        pecl install xdebug && \
        docker-php-ext-enable xdebug && \
        docker-php-source delete && \
        apk del .build-deps

COPY ./xdebug.ini /usr/local/etc/php/conf.d/

CMD ["php-fpm", "-y", "/usr/local/etc/php-fpm.conf", "-R"]

```

```ini
# .dockerfiles/xdebug.ini
zend_extension=xdebug.so
xdebug.mode=develop,debug
xdebug.client_port=9004
xdebug.idekey=VSCODE
xdebug.discover_client_host=1
xdebug.start_with_request=yes
```

```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "request": "launch",
            "log": true,
            "port": 9004,
            "pathMappings": {
                "/var/www/html": "${workspaceFolder}"
            }
        }
    ]
}
```

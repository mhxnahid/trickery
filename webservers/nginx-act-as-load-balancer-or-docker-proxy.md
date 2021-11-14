### typical config of a laravel app with socket support (laravel-echo-server)
```
# Load balancer config
server{
    listen 80;

    server_name docker-laravel.test;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://127.0.0.1:8000;
        proxy_redirect off;
        # Handle Web Socket Connections
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```
### 8000 is handled by our container nginx
```
# server / container config
server {
    listen 80;
    index index.php;
    server_name _;
    root /var/www/html/public;

    location /socket.io {
        proxy_pass http://echo:6001/socket.io; #could be localhost if Echo and NginX are on the same box
        proxy_read_timeout                  60;
        proxy_connect_timeout               60;
        proxy_redirect                      off;

        # Specific for websockets: force the use of HTTP/1.1 and set the Upgrade header
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
}

```

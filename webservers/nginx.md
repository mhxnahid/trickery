### [nginx config pitfalls, a must read](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/)

### [Be very specific with the location block that defines backend](https://nealpoole.com/blog/2011/04/setting-up-php-fastcgi-and-nginx-dont-trust-the-tutorials-check-your-configuration/)

Strict:
```
location = /index.php {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
```

### Sample php socket process proxy

```
server {
    server_name socket.site.com;

    access_log /var/log/nginx/$host;

    location / {
        proxy_pass                          http://127.0.0.1:6001;
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;

        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto  https;
        proxy_set_header X-VerifiedViaNginx yes;
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

    error_page 502 /50x.html;
    location = /50x.html {
            root /usr/share/nginx/html;
    }
}

```

### Sample https redirection (with certbot config)

```
server {
        listen 80;
        listen [::]:80;
        server_name site.com www.site.com;
        return 301 https://$server_name$request_uri;
}

server {
        listen [::]:443 ssl ipv6only=on; # managed by Certbot
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/site.com/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/site.com/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

        root /var/www/html/site/public;

        index index.php;

        server_name site.com www.site.com;
        
        ......
}
```

### nginx secure link with timeout

nginx block:
```
location /box/para { #file storage path
        secure_link $arg_hash,$arg_tmz; # ?hash, ?tmz
        secure_link_md5 "$secure_link_expires$uri SecRetStrIng76";

        if ($secure_link = "") { return 403; }
        if ($secure_link = "0") { return 410; }
        
        location ~* ^.+\.(mp3|pdf|mp4|3gp)$ {
                add_header 'Content-Type' "application/octet-stream";
                add_header Content-disposition "attachment; filename=$1"; # Experiment with headers. Some headers make the secure link useless
        }
}
```

php link builder:
```
function buildSecureLink($baseUrl, $path, $secret = 'SecRetStrIng76', $ttl = 300)
{
        $expires = time() + $ttl;
        $md5 = md5("{$expires}{$path} {$secret}", true);
        $md5 = base64_encode($md5);
        $md5 = strtr($md5, '+/', '-_'); 
        $md5 = str_replace('=', '', $md5); 
        
        return "{$baseUrl}{$path}?hash={$md5}&tmz={$expires}";
}
```

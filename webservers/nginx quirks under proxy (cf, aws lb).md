### to let framework know that https is used (cloudflare in this example)
#### django
```conf
server{
    listen 80;

    server_name e-krishi.friendstech.net;

    location / {
        proxy_pass  http://ekrishi;
        proxy_set_header Host $host;
        #proxy_set_header      X-Forwarded-Proto $scheme;
        #django gets https only when this proto forward is used (cloudflare, aws lb etc.)
        proxy_set_header      X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_redirect        off;

    }
}
```
#### php/laravel (https is behind proxy) (this system has no direct public ip)
```
 location = /index.php {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        #explicit
        fastcgi_param  HTTPS "on";
  }
```

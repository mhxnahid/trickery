### to let framework know that https is used (cloudflare in this example)
```
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

```bash
curl https://get.acme.sh | sh -s email=a@b.com

# config should be for port 80, existing ssl config causes issues
acme.sh --issue --nginx -d domain.com -d domain2.com
```

#### domain.conf
```conf
server {
  listen 80;
  listen [::]:80;
  server_name domain.com;

  return 301 https://domain.com$request_uri;
}

server {
  listen [::]:443 ssl;
  listen 443 ssl;
  server_name domain.com;
  
  ...
  
  ssl_certificate /root/.acme.sh/domain.com/fullchain.cer;
  ssl_certificate_key /root/.acme.sh/domain.com/domain.com.key;

  include snippets/ssl-params.conf;

  ...

  location ~ /\.(?!well-known).* {
    deny all;
  }
}
```

```bash
# test config
nginx -t
# restart server
service nginx restart
```

#### test crontab renewal script
```bash
# from crontab -e
"/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh"
```
Output
```
[root@0123-aud-moi-app01 conf.d]# "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh"
[Wed  7 Dec 18:31:42 +06 2022] ===Starting cron===
[Wed  7 Dec 18:31:42 +06 2022] Renew: 'domain.com'
[Wed  7 Dec 18:31:42 +06 2022] Renew to Le_API=https://acme.zerossl.com/v2/DV90
[Wed  7 Dec 18:31:42 +06 2022] Skip, Next renewal time is: 2023-02-04T12:01:35Z
[Wed  7 Dec 18:31:42 +06 2022] Add '--force' to force to renew.
[Wed  7 Dec 18:31:42 +06 2022] Skipped domain.com
[Wed  7 Dec 18:31:42 +06 2022] Renew: 'domain2.com'
[Wed  7 Dec 18:31:42 +06 2022] Renew to Le_API=https://acme.zerossl.com/v2/DV90
[Wed  7 Dec 18:31:42 +06 2022] Skip, Next renewal time is: 2023-02-04T12:15:29Z
[Wed  7 Dec 18:31:42 +06 2022] Add '--force' to force to renew.
[Wed  7 Dec 18:31:42 +06 2022] Skipped domain2.com
[Wed  7 Dec 18:31:42 +06 2022] ===End cron===
```

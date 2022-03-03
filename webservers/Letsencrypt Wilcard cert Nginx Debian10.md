### install certbot (through snap, for example), and:
```bash
# must include site.com along with *.site.com, or browsers will whine.
sudo certbot certonly -d site.com -d "*.site.com" --manual --preferred-challenges dns
# Create TXT records as prescribed. Don't hit ENTER yet!
# check if TXT record has updated
dig -t txt +short _acme-challenge.site.com
```
### nginx config
```conf
server {
    listen              443 ssl;
    ssl_certificate     /etc/letsencrypt/live/site.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/site.com/privkey.pem;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ...
}
```
restart nginx, enjoy.
### manual renewal

# login as root
```sh
# add non-root user
adduser hridoy
passwd hridoy

# install python 3.10
wget https://www.python.org/ftp/python/3.10.12/Python-3.10.12.tgz
tar -xzf Python-3.10.12.tgz
cd Python-3.10.12
./configure --enable-optimizations
make install
```
### create systemd service for app (gunicorn)
```sh
sudo nano /etc/systemd/system/ApexSecurity.service
```

```
[Unit]
Description=Gunicorn instance to serve ApexSecurity
After=network.target

[Service]
User=hridoy
Group=hridoy
WorkingDirectory=/home/hridoy/projects/Apex-Security
ExecStart=/home/hridoy/projects/Apex-Security/.venv/bin/gunicorn --workers 3 --bind
unix:/home/hridoy/projects/Apex-Security/gunicorn.sock ApexSecurity.wsgi:application

[Install]
WantedBy=multi-user.target
```
### enable user to run this service commands as root
```
visudo
```
Add contents at the end
```
hridoy ALL=(ALL) NOPASSWD: /bin/systemctl start ApexSecurity.service, /bin/systemctl stop ApexSecurity.service,
/bin/systemctl restart ApexSecurity.service, /bin/systemctl status ApexSecurity.service
```
### add nginx config
```
nano /etc/nginx/sites-available/default
```
```nginx
upstream apex{
    server unix:/home/hridoy/projects/Apex-Security/gunicorn.sock;
}

server{
    listen 80;

    server_name apex-security.friendstech.net;

    location / {
        proxy_pass  http://apex;
        proxy_set_header Host $host;
        proxy_set_header      X-Forwarded-Proto $scheme;
        proxy_set_header      X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_redirect        off;
    }

    location /static {
        autoindex off;

        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied expired no-cache no-store private auth;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/x-javascript application/xml;
        gzip_disable "MSIE [1-6]\.";

        alias /home/hridoy/projects/Apex-Security/static/;
    }

    location /media {
        alias /home/hridoy/projects/Apex-Security/media/;
    }
}
```
```sh
# test config
nginx -t
# reload nginx
systemctl reload nginx
```
# login/su as user
```sh
su - hridoy
# or
ssh hridoy@host
```
```sh
# create key
ssh-keygen
# cat the pubkey & add to github project as deploy key
cat /home/hridoy/.ssh/id_rsa.pub
# navigate
mkdir projects && cd projects
# clone project
git pull git@github.com:Hridoy82/Apex-Security.git
cd Apex-Security
# create venv
python3.10 -m venv .venv
# activate venv
. .venv/activate/bin
# copy and fill up env
cp .env.example .env
# install reqs
pip install -r requirement.txt
#migrate
python manage.py migrate
#create user
python manage.py createsuperuser
#start service
sudo systemctl restart ApexSecurity.service
```

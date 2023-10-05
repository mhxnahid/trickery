```bash
#$ ps -u azureuser u
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
azureus+   722  0.0  1.3 904524 52996 ?        Ssl  Jun01   8:19 PM2 v5.1.2: God Daemon (/home/azureuser/.pm2)
azureus+ 11218  0.0  0.0   2496    76 ?        Ss   Aug27   1:22 /bin/tini -- /usr/local/bin/docker-entrypoint.sh eswrapper
azureus+ 11350  0.0  1.5 2599680 63208 ?       Sl   Aug27  41:46 /usr/share/elasticsearch/jdk/bin/java -Xms4m -Xmx64m -XX:+UseSerialGC -Dcli.name=server -Dcli.script=/usr/share/elasticsearch/bin/elasticsearch -Dcli.libs=lib/tools/server-c
azureus+ 11536  0.2 16.4 3183844 664044 ?      Sl   Aug27 129:16 /usr/share/elasticsearch/jdk/bin/java -Des.networkaddress.cache.ttl=60 -Des.networkaddress.cache.negative.ttl=10 -Djava.security.manager=allow -XX:+AlwaysPreTouch -Xss1m -Dj
azureus+ 11557  0.0  0.0 108192   552 ?        Sl   Aug27   0:00 /usr/share/elasticsearch/modules/x-pack-ml/platform/linux-x86_64/bin/controller
azureus+ 21193  0.0  0.0  21304  1588 ?        Ss   Jun29   0:00 /lib/systemd/systemd --user
azureus+ 21194  0.0  0.0 106356  2976 ?        S    Jun29   0:00 (sd-pam)
azureus+ 21559  0.0  0.1  15772  6400 ?        S    01:07   0:00 sshd: azureuser@pts/0
azureus+ 21561  0.0  0.2  11580  8212 pts/0    Ss   01:07   0:00 -bash
azureus+ 24012  3.7  0.7  39168 31308 ?        Ss   02:28   0:00 /home/azureuser/projects/dmtool-core/.venv/bin/python3.10 /home/azureuser/projects/dmtool-core/.venv/bin/gunicorn config.asgi:application -w 1 -k uvicorn.workers.UvicornWork
azureus+ 24013 43.7  4.8 316204 194320 ?       Ss   02:28   0:03 /home/azureuser/projects/dmtool-core/.venv/bin/python3.10 /home/azureuser/projects/dmtool-core/.venv/bin/celery -A config worker --loglevel=info
azureus+ 24014 38.6  4.7 315292 193040 ?       Ssl  02:28   0:03 /home/azureuser/projects/dmtool-core/.venv/bin/python3.10 /home/azureuser/projects/dmtool-core/.venv/bin/celery -A config beat --loglevel=info
azureus+ 24022 20.1  3.3 255420 135980 ?       Sl   02:28   0:01 /home/azureuser/projects/dmtool-core/.venv/bin/python3.10 /home/azureuser/projects/dmtool-core/.venv/bin/gunicorn config.asgi:application -w 1 -k uvicorn.workers.UvicornWork
azureus+ 24031  1.0  4.0 317156 164644 ?       S    02:28   0:00 /home/azureuser/projects/dmtool-core/.venv/bin/python3.10 /home/azureuser/projects/dmtool-core/.venv/bin/celery -A config worker --loglevel=info
azureus+ 24032  1.0  4.0 317160 164680 ?       S    02:28   0:00 /home/azureuser/projects/dmtool-core/.venv/bin/python3.10 /home/azureuser/projects/dmtool-core/.venv/bin/celery -A config worker --loglevel=info
azureus+ 24033  0.0  0.0  10628  3004 pts/0    R+   02:28   0:00 ps -u azureuser u
```
If there's a zombie, kill it or it will cause task loses. It may even run old code!

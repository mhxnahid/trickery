```bash
# https://www.python.org/downloads/
wget https://www.python.org/ftp/python/3.9.16/Python-3.9.16.tgz
tar xzf Python-3.9.16.tgz && cd Python-3.9.16
sudo ./configure --enable-optimizations && sudo make altinstall
# installed either in /usr/bin/python3.9 or in /usr/local/bin/python3.9
python3.9 --version
# configure update-alternatives
# I'm using the alias python3 as python is used by python2.7
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.8 1
sudo update-alternatives --install /usr/bin/python3 python3 /usr/local/bin/python3.9 2
# have fun
sudo update-alternatives --config python3
# create venv in your projects
/usr/local/bin/python3.9 -m venv .venv
# or
python3.9 -m venv .venv
```

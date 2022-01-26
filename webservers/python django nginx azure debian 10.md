```bash
sudo apt update
sudo apt upgrade
sudo apt dist-upgrade

apt install ranger htop mc ncdu ufw acl git logrotate fail2ban highlight ca-certificates curl gnupg lsb-release nginx make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
   
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
docker pull alpine
sudo chmod +x /usr/local/bin/docker-compose

ssh-keygen -t rsa -m PEM
cat id_rsa.pub
cat id_rsa.pub >> authorized_keys

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
nvm install 16
npm i -g pm2
pm2 startup

sudo apt install default-libmysqlclient-dev unixodbc unixodbc-dev

curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
sudo apt-get update
sudo ACCEPT_EULA=Y apt-get install -y msodbcsql17
sudo ACCEPT_EULA=Y apt-get install -y mssql-tools
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc
source ~/.bashrc

docker-compose up
cp .env.example .env

sqlcmd -U SA -P pass
> create database db;
> go

sudo apt install python3-pip
pip3 install --user pipenv

git clone git@github.com:user/project.git

sudo setfacl -Rdm u:www-data:rwx,u:azureuser:rwx .
sudo setfacl -Rm u:www-data:rwx,u:azureuser:rwx .

pipenv shell
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser

pm2 start

sudo ln -s $(pwd)/dmtool.nginx.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/dmtool.nginx.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo service nginx reload
```
### bashrc additions
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PATH:$HOME/.local/bin:$PYENV_ROOT/bin"

eval "$(pyenv init --path)"
eval "$(pyenv init -)"
#eval "$(pyenv virtualenv-init -)"

export PIPENV_VENV_IN_PROJECT="enabled"
export PATH="$PATH:/opt/mssql-tools/bin"
```

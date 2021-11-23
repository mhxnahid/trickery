```bash
# add prerequisites
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
# add keys
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# add keys
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# update repos
sudo apt-get update
# install docker
sudo apt-get install docker-ce docker-ce-cli containerd.io
# install docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# make it executible
sudo chmod +x /usr/local/bin/docker-compose
# create docker group
sudo groupadd docker
# add an user to the group
sudo usermod -aG docker <non-root_user>
```

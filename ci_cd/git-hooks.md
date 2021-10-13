### Server
```bash
pwd
/var/www/html
mkdir repo #files deploy here
mkdir git-server #server repositories here
cd git-server
git init --bare repo.git #code gets pushed here
cd repo.git/hooks
nano post-receive #configure workflow
```
```bash
#!/usr/bin/env bash

set -u
set -e

export GIT_WORK_TREE="/var/www/html/repo"
export NODE_VERSION="16"

git checkout -f

. $HOME/.nvm/nvm.sh
nvm use $NODE_VERSION

cd "$GIT_WORK_TREE"
npm i
```
### Local
Add local machine public key to server's `~/.ssh/authorized_keys` manually or using `ssh-copy-id` OR add a config in local machine's `~/.ssh/config` specifying which local public key to use
```bash
git remote add deploy user@ip:/var/www/html/git-server/repo.git
git push deploy master
```

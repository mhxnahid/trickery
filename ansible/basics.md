Host Machine
```bash
sudo add-apt-repository -y ppa:ansible/ansible
sudo apt-get install -y ansible
```
Add hosts
```bash
#/etc/ansible/hosts
[virt]
192.168.0.101
```
Test
```bash
#Ping
ansible all -m ping -u nahid
#Ping with credentials
ansible all -m ping -u nahid --private-key=~/.ssh/id_ansible
```

Run a command (install nginx package)
```bash
#Run command as sudo (user has to be in root group) OR use root user
ansible all -u nahid --private-key=~/.ssh/id_ansible --ask-become-pass --become -m apt -a "pkg=nginx state=latest update_cache=true"
```


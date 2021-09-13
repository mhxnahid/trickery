```
ssh-keygen -t ed25519 -C "mail@mail.com"
~/.ssh: touch authorized_keys
~/.ssh: chmod 600 authorized_keys
~/.ssh: cat key_1.pub >> ~/.ssh/authorized_keys
~/.ssh: cat key_2.pub >> ~/.ssh/authorized_keys
```

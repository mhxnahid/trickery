Github doesn't allow reusing deploy keys across repositories. \
Solution:
```
# ~/.ssh/config
Host another_repo
      Hostname github.com
      IdentityFile ~/.ssh/id_another_repo
      IdentitiesOnly yes
```
Clone using
```
git clone git@another_repo:user/repo.git
```

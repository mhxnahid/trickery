```
nginx.yml
```
```yml
 ---
  - hosts: virt
    become: yes
    user: nahid
    tasks:
     - name: Add Nginx Repository
       apt_repository: repo='ppa:nginx/stable' state=present
       register: ppainstalled
 
    - name: Install Nginx
      apt: pkg=nginx state=latest update_cache=true
      when: ppainstalled is success
      notify:
       - Start Nginx

   handlers:
    - name: Start Nginx
      service: name=nginx state=started
```

-K asks for root password
```
ansible-playbook --private-key=~/.ssh/id_ansible -K nginx.yml
```

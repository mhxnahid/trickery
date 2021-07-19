### ssh (if pass auth is required)
`/etc/ssh/sshd_config`
```
PermitRootLogin yes
PasswordAuthentication yes
```

`service ssh reload`\
`service sshd reload`

### update
```
apt update
apt upgrade
apt dist-upgrade
apt install ranger htop mc ncdu ufw acl git logrotate fail2ban highlight
```
### /etc/bash.bashrc
```bash
alias mc='. /usr/lib/mc/mc-wrapper.sh'
alias r="ranger"

function ranger {
	local IFS=$'\t\n'
	local tempfile="$(mktemp -t tmp.XXXXXX)"
	local ranger_cmd=(
		command
		ranger
		--cmd="map Q chain shell echo %d > "$tempfile"; quitall"
	)
	
	${ranger_cmd[@]} "$@"
	if [[ -f "$tempfile" ]] && [[ "$(cat -- "$tempfile")" != "$(echo -n `pwd`)" ]]; then
		cd -- "$(cat "$tempfile")" || return
	fi
	command rm -f -- "$tempfile" 2>/dev/null
}
```

### /etc/fail2ban/jail.local
```
[ssh]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 600
```

### ufw
```
ufw allow ssh
ufw allow http
ufw allow https
systemctl enable ufw
```
### mysql
```
wget https://dev.mysql.com/get/mysql-apt-config_0.8.17-1_all.deb
dpkg -i mysql-apt-config_0.8.17-1_all.deb
apt install mysql-server
mysql_secure_installation
```
### php-fpm
```
apt remove --purge apache2
apt install php7.4-fpm
apt install php7.4-{bcmath,bz2,intl,gd,mbstring,mysql,zip,xml,curl}
```
### phpmyadmin
```
#wget from https://www.phpmyadmin.net/downloads/

wget https://files.phpmyadmin.net/phpMyAdmin/5.1.1/phpMyAdmin-5.1.1-all-languages.tar.gz
tar -zxvf phpMyAdmin-*-all-languages.tar.gz
sudo mv phpMyAdmin-*-all-languages /usr/share/phpmyadmin
sudo cp -pr /usr/share/phpmyadmin/config.sample.inc.php /usr/share/phpmyadmin/config.inc.php
```
`/usr/share/phpmyadmin/config.inc.php`
```
#generate blowfish_secret https://phpsolved.com/phpmyadmin-blowfish-secret-generator/
$cfg['blowfish_secret'] = 'CfX1la/aG83gx1{7rADus,iqz8RzeV8x'; /* YOU MUST FILL IN THIS FOR COOKIE AUTH! */


# uncomment
/**
 * phpMyAdmin configuration storage settings.
 */

/* User used to manipulate with storage */
$cfg['Servers'][$i]['controlhost'] = 'localhost';
// $cfg['Servers'][$i]['controlport'] = '';
$cfg['Servers'][$i]['controluser'] = 'pma';
$cfg['Servers'][$i]['controlpass'] = 'pmapass';

/* Storage database and tables */
$cfg['Servers'][$i]['pmadb'] = 'phpmyadmin';
$cfg['Servers'][$i]['bookmarktable'] = 'pma__bookmark';
$cfg['Servers'][$i]['relation'] = 'pma__relation';
$cfg['Servers'][$i]['table_info'] = 'pma__table_info';
$cfg['Servers'][$i]['table_coords'] = 'pma__table_coords';
$cfg['Servers'][$i]['pdf_pages'] = 'pma__pdf_pages';
$cfg['Servers'][$i]['column_info'] = 'pma__column_info';
$cfg['Servers'][$i]['history'] = 'pma__history';
$cfg['Servers'][$i]['table_uiprefs'] = 'pma__table_uiprefs';
$cfg['Servers'][$i]['tracking'] = 'pma__tracking';
$cfg['Servers'][$i]['userconfig'] = 'pma__userconfig';
$cfg['Servers'][$i]['recent'] = 'pma__recent';
$cfg['Servers'][$i]['favorite'] = 'pma__favorite';
$cfg['Servers'][$i]['users'] = 'pma__users';
$cfg['Servers'][$i]['usergroups'] = 'pma__usergroups';
$cfg['Servers'][$i]['navigationhiding'] = 'pma__navigationhiding';
$cfg['Servers'][$i]['savedsearches'] = 'pma__savedsearches';
$cfg['Servers'][$i]['central_columns'] = 'pma__central_columns';
$cfg['Servers'][$i]['designer_settings'] = 'pma__designer_settings';
$cfg['Servers'][$i]['export_templates'] = 'pma__export_templates';
```

```
sudo mysql < /usr/share/phpmyadmin/sql/create_tables.sql -u root -p
sudo mysql -u root -p
> SELECT USER from mysql.user;
> CREATE USER 'pma'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
> GRANT ALL PRIVILEGES ON phpmyadmin.* TO 'pma'@'localhost';
> CREATE USER 'els'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
> GRANT ALL PRIVILEGES ON *.* TO 'els'@'localhost';
> FLUSH PRIVILEGES;
> SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY','')); #STRICT_TRANS_TABLES is another offender
```
easier @@sql_mode solution:
```
/etc/mysql/mysql.conf.d/mysqld.cnf (debian10)

[mysqld]
...
sql_mode        = NO_ENGINE_SUBSTITUTION
```

```
sudo chown -R www-data:www-data /usr/share/phpmyadmin
```
### add user
```
adduser els
```
### composer
```
#get latest from https://getcomposer.org/download/

php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === '756890a4488ce9024fc62c56153228907f1545c228516cbf63f885e036d37e9a59d27d63f46af1d4d07ee0f76181c7d3') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
sudo mv composer.phar /usr/local/bin/composer
php composer-setup.php
sudo mv composer.phar /usr/local/bin/composer
```
### openvpn
```
curl -O https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh
chmod +x openvpn-install.sh
./openvpn-install.sh
```
### acl (preferebly only on storage and cache)
```
setfacl -Rdm u:www-data:rwx,u:els:rwx html
setfacl -Rm u:www-data:rwx,u:els:rwx html
```
### ranger config
`/etc/ranger/config/rc.conf [mod]`
```
set column_ratios 1,4,2
set show_hidden true
set vcs_aware true
```
### nginx
`/etc/nginx/nginx.conf`
```
#http block
index index.php index.htm index.html;
```

`/etc/nginx/sites-avaialble/default`
```
server{
    include snippets/listenport.conf;

    server_name mopas.friendstech.net;

    root /var/www/html/mopas/mopas-laravel/public;

    include snippets/generic-laravel.conf;
}
```

`/etc/nginx/snippets/generic-laravel.conf`
```
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location = /index.php {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    include snippets/phpmyadmin.conf;
```

`/etc/nginx/snippets/phpmyadmin.conf`
```
location /phpmyadmin {
    root /usr/share/;
    index index.php index.html index.htm;
    location ~ ^/phpmyadmin/(.+\.php)$ {
        try_files $uri =404;
        root /usr/share/;
        fastcgi_pass unix:/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include /etc/nginx/fastcgi_params;
    }

    location ~* ^/phpmyadmin/(.+\.(jpg|jpeg|gif|css|png|js|ico|html|xml|txt))$ {
        root /usr/share/;
    }
}
```

`/etc/nginx/snippets/listenport.conf`
```
listen 80 default_server;
listen [::]:80 default_server;

listen 443 ssl default_server;
listen [::]:443 ssl default_server;
```
### logrotate
`/etc/logrotate.d/els`
```
/var/www/html/laravel/storage/logs/*.log {
    daily
    missingok
    rotate 12
    notifempty
    su stream stream
    postrotate
    /usr/bin/setfacl -m u:els:rwx,u:www-data:rwx /var/www/html/laravel/storage/logs/*.log
    endscript
}
```
### nano config
`.nanorc`
```
# Non-default settings
set atblanks        # wrap line at blanks.
set cutfromcursor   # CTRL+K cuts from cursor position to end of line.
set nohelp          # Disable the help information (CTRL+G to view the help screen).
set softwrap        # Enable softwrap of lines.
set suspend         # Enables CTRL+Z to suspend nano.
set tabsize 4       # Sets tab-to-spaces size to 4.
set tabstospaces    # Converts TAB key press to spaces.
include "/usr/share/nano/*.nanorc" # Enables the syntax highlighting.
set speller "aspell -x -c"         # Sets what spelling utility to use.
set constantshow    # Displays useful information e.g. line number and position in the bottom bar.
#set linenumbers     # Lines are numbered.
set casesensitive   # Case insensitive search.
set historylog      # Save the last 100 history searches for later use.
set positionlog     # Saves the cursor position between editing sessions.
set zap             # Allows you to highlight text (CTRL+SHIFT+ARROW) and delete it with backspace.
#set autoindent      # A new line will have the same number of leading spaces as the previous one.
#set indicator       # Displays a scroll bar on the right that shows the position and size of the current view port.
#set minibar         # Displays file name and other information in the bottom bar. Removes top bar.

# Enable and set a working backup directory
#set backup                              # Creates backups of your current file.
#set backupdir "~/.cache/nano/backups/"  # The location of the backups.

# Shortcut key bindings
bind ^C copy main       # CTRC+C - Copy
bind ^V paste all       # CTRL+V - Past
bind ^F whereis all     # CTRL+F - Find
bind ^S savefile main   # CTRL+S - Save 
```


## USER (els):
### nvm
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
nvm install node
```
### ssh key
```
ssh-keygen -t rsa -b 4096 -C "mhn@li.com"
#deploy key
cat /home/els/.ssh/id_rsa.pub

#authorize key for ssh login
#copy id_rsa.pub to /home/els/.ssh/authorized_keys
chmod 700 .ssh
chmod 700 authorized_keys
#user the private key to login
```
### git clone
```
git clone git@github.com:x/x.git
```
### bashrc
`.bashrc`
```
alias art="php artisan" #artisan alias
alias artsf="art migrate:refresh --seed" #seed with total rollback
alias gp="git pull"
```
### nano
`.nanorc`
```
set softwrap        # Enable softwrap of lines.
set suspend         # Enables CTRL+Z to suspend nano.
set tabsize 4       # Sets tab-to-spaces size to 4.
set tabstospaces    # Converts TAB key press to spaces.
include "/usr/share/nano/*.nanorc" # Enables the syntax highlighting.
set speller "aspell -x -c"         # Sets what spelling utility to use.
set constantshow    # Displays useful information e.g. line number and position in the bottom bar.
set linenumbers     # Lines are numbered.
set casesensitive   # Case insensitive search.
set historylog      # Save the last 100 history searches for later use.
set positionlog     # Saves the cursor position between editing sessions.
set zap             # Allows you to highlight text (CTRL+SHIFT+ARROW) and delete it with backspace.
set autoindent      # A new line will have the same number of leading spaces as the previous one.
#set indicator       # Displays a scroll bar on the right that shows the position and size of the current view port.
#set minibar         # Displays file name and other information in the bottom bar. Removes top bar.

# Enable and set a working backup directory
#set backup                              # Creates backups of your current file.
#set backupdir "~/.cache/nano/backups/"  # The location of the backups.

# Shortcut key bindings
bind ^C copy main       # CTRC+C - Copy
bind ^V paste all       # CTRL+V - Past
bind ^F whereis all     # CTRL+F - Find
bind ^S savefile main   # CTRL+S - Save
```

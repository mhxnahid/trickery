[SO Thread](https://stackoverflow.com/questions/30639174/how-to-set-up-file-permissions-for-laravel)
[SO Answer](https://stackoverflow.com/a/41268166/2923388)

#### With ACL
We've run into many edge cases when setting up permissions for Laravel applications. We create a separate user account (deploy) for owning the Laravel application folder and executing Laravel commands from the CLI, and run the web server under www-data. One issue this causes is that the log file(s) may be owned by www-data or deploy, depending on who wrote to the log file first, obviously preventing the other user from writing to it in the future. \

I've found that the only sane and secure solution is to use Linux ACLs. The goal of this solution is: \

To allow the user who owns/deploys the application read and write access to the Laravel application code (we use a user named deploy). \
To allow the www-data user read access to Laravel application code, but not write access. \
To prevent any other users from accessing the Laravel application code/data at all. \
To allow both the www-data user and the application user (deploy) write access to the storage folder, regardless of which user owns the file (so both deploy and www-data can write to the same log file for example). \
We accomplish this as follows: \

All files within the application/ folder are created with the default `umask of 0022`, which results in folders having `drwxr-xr-x` permissions and files having `-rw-r--r--` \
`sudo chown -R deploy:deploy application/` (or simply deploy your application as the deploy user, which is what we do). \
`chgrp www-data application/` to give the www-data group access to the application. \
`chmod 750 application/` to allow the deploy user read/write, the www-data user read-only, and to remove all permissions to any other users. \
`setfacl -Rdm u:www-data:rwx,u:deploy:rwx application/storage/` to set the default permissions on the storage/ folder and all subfolders. Any new folders/files created in the storage folder will inherit these permissions (rwx for both www-data and deploy). \
`setfacl -Rm u:www-data:rwX,u:deploy:rwX application/storage/` to set the above permissions on any existing files/folders. \

#### Print out only the file names from ls (remove trailing slash)
```
ls | awk '{print substr($1, 1, length($1)-1)}'
```

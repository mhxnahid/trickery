### nginx 504 timeout with load balancer
https://serverfault.com/questions/703311/cant-increase-timeout-on-nginx-with-php-fpm
```
So, if somebody else has that problem and can't find an answer, here is my fix, after 2 more hours of searching.

The culprit was our Amazon Load-balancer. The servers run on ec2-instances, which are behind a load-balancer. The load-balancer has an idle-timeout of 60 seconds set. Just setting this timeout to the desired value described here removed the 504.
```

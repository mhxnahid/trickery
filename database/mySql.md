#### Timestamp/datetime 
timestamp converts input from session time to UTC (system time), datetime doesn't do that.\
timestamp max year is 2038, datetime 9999\
timestamp queries are cached, datetime not\
timestamp fields can be indexed, datetime not\


#### Concat a column's value as string
```sql
SET group_concat_max_len = 9999999; #Default concat returns limited result
select group_concat(phone) as ephone from kfh_sms.user_profiles;
```

#### MariaDB 10.3.31 timestamp field CURRENT_TIMESTAMP ON_UPDATE quirk
https://stackoverflow.com/a/58181310/2923388

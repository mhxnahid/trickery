#### Timestamp converts input to UTC, datetime doesn't do that.

#### Concat a column's value as string
```sql
SET group_concat_max_len = 9999999; #Default concat returns limited result
select group_concat(phone) as ephone from kfh_sms.user_profiles;
```

#### find first occurance in a list of dict
```py
lis = [{'id': 6}, {'id': 9}]
next((i for z in lis if i['id'] == 6), None)
# {'id': 6}
```

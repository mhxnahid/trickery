#### find first occurance in a list of dict
```py
lis = [{'id': 6}, {'id': 9}]
next((i for z in lis if i['id'] == 6), None)
# {'id': 6}
```
### sum from list
```py
sum(1 for k in buyers if k.get('stage') == b.get('id'))
```

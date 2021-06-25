#### Custom events
```js
    window.addEventListener('toast', ({detail}) => {
        console.log(detail)
        Toast.fire({
            icon: detail.icon || 'success' ,
            title: detail.title || 'Title',
        });
    });
    
    window.dispatchEvent(new CustomEvent('toast', {detail: 'Hello!'}));
```

#### ?? and || usage
``??`` is false only on null and undefined (Returns the first not-null value in PHP)
```js
0 ?? 5
0
null ?? 5
5
undefined ?? 5
5
```
`||` is the same as `x ? 1 : 0` (WARN: this operator is logical OR in PHP, returns boolean, not value)
```js
0 || 5
5
null || 5
5
```

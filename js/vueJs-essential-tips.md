### Re-render on route change within the same component - watch $route or $key
```html
    <router-view :key="$route.fullPath"></router-view>
```
```js
    watch: {
    '$route': function() {
        // do your stuff here
      }
    }
```
[SO Answer](https://stackoverflow.com/questions/45372518/vue-js-component-doesnt-rerender-on-the-same-page)

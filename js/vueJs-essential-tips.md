### Update list after an item has been updated onChange or something like that
Here w're using `Vue.set()` to find the array element and replace it with the response received from api call. 
```js
update(id, post){
  axios
    .patch(this.urlb(`${routes.staff.appointments}${id}`), post)
    .then(({data}) => 
      {
        this.$set(this.records, this.records.findIndex(r => r.id ==  id), data)
      })
    .catch((err) => console.error(err.response.data))
}
```

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

### Use jquery tooltip using custom vue directive

```js
Vue.directive('tooltip', function(el, binding){
    $(el).tooltip({
             title: binding.value,
             placement: binding.arg,
             trigger: 'hover'             
         })
})
```
For example:
```html
<span class="label label-default" v-tooltip:bottom="'Your tooltip text'">
```
Or you can also bind the tooltip text to a computed variable:
```html
<span class="label label-default" v-tooltip:bottom="tooltipText">
```
And in your component script:
```js
computed: {
    tooltipText: function() {
       // put your logic here to change the tooltip text
       return 'This is a computed tooltip'
    }
}
```

[SO Answer](https://stackoverflow.com/questions/37078423/how-can-add-bootstrap-tooltip-inside-vue-js)


### Transition with v-show [Fiddle](http://jsfiddle.net/eywraw8t/355190/)

### Watchers attached to props will trigger on every [parent] component update if prop is an [object] defined directly on the <child :p="{}"> [SO Question](https://stackoverflow.com/q/63953539/2923388)

### be careful with global mixin created/mounted methods. These will mount on every component

### custom event listeners this.$root.$on has to be destroyed() using $off([]) method. These don't get cleaned up on component destroyal automatically.

### programatically register and destroy and recover watchers
```js
export default {
  data() {
    return {
      post: {
        _entity: {},
        entity_id: "",
      }
    };
  },
  mounted() {
    this.fetchRecord();
  },
  methods: {
    entityWatcher(value) {
      this.post.entity_id = value?.id || "";
    },
    fetchRecord() {
      const unwatchEntity = this.$watch("post._entity", this.entityWatcher); //register

      unwatchEntity(); //destroy

      const data = window.audit;

      this.post = {
        ...this.post,
        _entity: data.entity,
        entity_id: data.entity.id,
      };

      this.$watch("post._entity", this.entityWatcher); //register
    },
  },
};
```

### Shallow copy objects while assigning to data() to avoid mutations
```js
<script>
const PERSON = {name: ''}

export default {
  data() {
    return {
      person: [{...PERSON}]
    }
  },
  methods: {
    addPerson(){
      this.person.push({...PERSON})
    }
  }
};
</script>
```


### Global event emitter

```js
//main.js
import Vue from "vue";
import App from "./App.vue";

Vue.prototype.$bus = new Vue();

new Vue({
  render: h => h(App)
})
.$mount("#app");
```

```vue
//App.vue
<template>
  <div id="app">
    <button @click="$bus.$emit('record-create', { created: true })">Create Record</button>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$bus.$on("record-create", (data) => {
      console.log("record-create", data);
    });
  },
};
</script>
```
PS: using a prototype is not required. `this.$root.$emit()` and `this.$root.$on()` can be used.

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
  
### This causes the second array to repeat 10x!
 ![image](https://user-images.githubusercontent.com/45322767/230731751-ac172f5e-8a6a-45e3-b68f-b4e71a33eb09.png)
  
### remember to return data() function. otherwise it'll fail to read mixin data properties and give errors
![image](https://user-images.githubusercontent.com/45322767/231359170-145e1d9c-9662-4bea-8d65-dff951b28873.png)
![image](https://user-images.githubusercontent.com/45322767/231359206-477a9a71-0272-4458-b6ef-e34000deed39.png)



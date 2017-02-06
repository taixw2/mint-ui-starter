import Vue from 'vue';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
import App from './App.vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import routes from './routes';


Vue.use(VueResource);
Vue.use(MintUI);
Vue.use(VueRouter);


var router = new VueRouter({
    mode: 'hash',
    base: __dirname,
    routes,
    scrollBehavior(to, from, savePosition) {        
        return savePosition ? savePosition : {
            x: 0,
            y: 0
        };
    }
});


Vue.http.options.root = "/api";

Vue.http.interceptors.push((request,next)=>{
    next(response=>{

      return true;
    });
});

const app = new Vue({
    el: "#app",
    router,
    http: {
        options : {
          emulateJSON  :  true
        }
    },
    render: h => h(App)
});

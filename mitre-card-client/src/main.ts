import Vue from 'vue';
import App from './App.vue';
import router from './router';
import MainView from './components/MainView';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { State } from './model/state';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import PlayersApi from './services/PlayersApi';
 
const socket = io('http://localhost:3000');
 
Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueSocketIOExt, socket);

export let state: State = {
    player: {name: '', hand: [], isBot: false, resources: 0, role: false, _id: '',progress:[],persistentProgress:[]},
    chatShown: true,
  };


  
new Vue({
  router,
  template:`
    <div id="app">

        <router-view class="view"></router-view>

    </div>`,
}).$mount('#app');



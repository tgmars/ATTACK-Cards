import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import NamesView from './views/NamesView';
import MainView from './components/MainView';
import NotFoundView from './components/NotFoundView';
import StatsView from './components/StatsView';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/names',
      name: 'names',
      component: NamesView,
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
    },
    {
      path: '/games/:gameID',
      name: 'games',
      component: MainView,
    },
    {
      path: '/*',
      component: NotFoundView,
    },
  ],
});

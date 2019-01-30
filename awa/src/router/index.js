import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import flashcards from '@/components/flashcards'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/flashcards',
      name: 'flashcards',
      component: flashcards
    }
  ]
})

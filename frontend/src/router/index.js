import { createRouter, createWebHashHistory } from 'vue-router'


import Mur from '../views/Mur'
import Profil from '../views/Profil'
import Post from '../views/Post'
import Home from '../views/Home'


const routes = [

  // nav before connection
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/mur',
    name: 'Mur',
    component: Mur,
    //props: route => ({ query: route.query.offset })
  },

  {
    path: '/user/:userId',
    name: 'Profil',
    component: Profil,
    //props: route => ({ test: route.query.test })
  },

  // post
  {
    path: '/post/:postId',
    name: 'Post',
    component: Post
  },

  //profils
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

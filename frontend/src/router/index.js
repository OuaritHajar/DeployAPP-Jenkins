import { createRouter, createWebHashHistory } from 'vue-router'


import Mur from '../views/Mur'
import Profil from '../views/Profil'
import Post from '../views/Post'


const routes = [

  // nav before connection
  {
    path: '/',
    name: '/',
    component: Mur
  },
  {
    path: '/mur',
    name: 'Mur',
    component: Mur
  },

  {
    path: '/user/:userId',
    name: 'Profil',
    component: Profil
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

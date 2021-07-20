import { createRouter, createWebHashHistory } from 'vue-router'


import Mur from '../views/Mur'
import Profil from '../views/Profil'
import Post from '../views/Post'


const routes = [

  // nav before connection
  {
    path: '/home/limit=:limit',
    name: 'Home',
    component: Mur,
    props: route => ({ limit: route.query.limit })
  },
  {
    path: '/home/limit=:limit',
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

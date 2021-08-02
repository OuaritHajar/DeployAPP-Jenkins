import { createRouter, createWebHashHistory } from 'vue-router'

import Mur from '../views/Mur'
import Profil from '../views/Profil'
import Post from '../views/Post'
import Home from '../views/Home'
import Posts from '../views/Posts'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/mur/',
    name: 'Mur',
    component: Mur,
    children: [{
      path: '/posts/:page',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/user/:userId',
      name: 'Profil',
      component: Profil,
      props: true
    },
    {
      path: '/post/:postId',
      name: 'Post',
      component: Post,
      props: true
    },
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    window.scrollTo(0,0)
  }
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'

import Mur from '../views/Mur'
import Profil from '../views/Profil'
import ProfilUser from '../views/ProfilUser'
import Post from '../views/Post'


const routes = [

  // nav before connection
  {
    path: '/',
    name: '/',
    component: Mur
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // nav after connection
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/mur',
    name: 'Mur',
    component: Mur
  },

  {
    path: '/user/:userId',  //son propre profil
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
  {
    path: '/users/:userId',
    name: 'ProfilUser',
    component: ProfilUser
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

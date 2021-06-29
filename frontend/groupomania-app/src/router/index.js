import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Mur from '../views/Mur'
import Profil from '../views/Profil'
import Post from '../views/Post'
import NewPost from '../components/newPost'

const routes = [
  {
    path: '/',
    name: '/',
    component: Mur
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/mur',
    name: 'Mur',
    component: Mur
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Login
  },
  {
    path: '/profil',
    name: 'Profil',
    component: Profil
  },
  {
    path: '/post/:postId',
    name: 'Post',
    component: Post
  },
  {
    path: '/newPost',
    name: 'NewPost',
    component: NewPost
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

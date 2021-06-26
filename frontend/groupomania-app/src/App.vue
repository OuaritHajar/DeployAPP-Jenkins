<template>
  
    <Home/>
  
</template>



<script>
import Home from '@/views/Home.vue'

export default {
  components: {
    Home
  },
}

console.log(localStorage)
</script>




<style>
body{
  margin-top:100px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.navbar-brand{
  display:flex;
}
.navbar-brand img{
  max-height: 60px;
  margin-right:20px;
}
.navbar p{
  margin-top:13px;
}

.collapse ul a {
  font-size: 1.5rem;
}
</style>

<template>
    <div>
      <Nav/>
      <Home/>
      
        
        
    </div>
</template>



<script>
import Home from '@/views/Home.vue'
import Nav from '@/components/nav.vue'

export default {
  name: "App",
  components: {
    Nav,
    Home,
    
  },
}
</script>




<style>
body{
  margin-top:95px;
}
</style>

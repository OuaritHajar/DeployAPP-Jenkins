<template>
    <div>
      <Nav/>
      <Home/>
      <Footer/>
        
    </div>
</template>



<script>
import Home from '@/views/Home.vue'
import Nav from '@/components/nav.vue'
import Footer from '@/components/footer.vue'

export default {
  name: "App",
  components: {
    Nav,
    Home,
    Footer,
    
  },
}
</script>




<style>
body{
  margin-top:95px;
}
</style>

<template>
    <div id="app">
      <Nav/>
      <router-view/>
      <Footer/>
    </div>
</template>



<script>
import Nav from '@/components/home/nav.vue'
import Footer from '@/components/home/footer.vue'

export default {
  name: "App",
  components: {
    Nav,
    Footer,
  },
}
</script>




<style>
body{
  margin-top:95px;
}
</style>

<template>
<div>
    <Nav/>
    <router-view class="router-view"/>
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
  padding-top:95px;
}
.router-view{
    min-height: 80vh;
}
</style>

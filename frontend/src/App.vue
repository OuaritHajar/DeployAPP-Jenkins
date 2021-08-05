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
    mounted() {
        let token = localStorage.getItem('token')
        console.log('token : ', token)
        if (token){
            this.$store.dispatch("getUserAlreadyConnected");
        }
    }
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

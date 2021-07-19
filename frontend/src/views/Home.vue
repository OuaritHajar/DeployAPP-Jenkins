<template>

<div class="container-fluid home">
    <router-view/>
    <div class="row" v-if="user.userId == -1">

        <div class="col-sm-12">
            <Login/>
        </div>
        

        <section class="col-md-6">
            <div class="text-center">
                <h1>Bienvenue sur le réseau social de groupomania</h1>
                <img src="data:image/png;base64,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"
                    alt="logo groupomania">
            </div>
            <p class="text-presentation">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus nam eos hic nobis blanditiis pariatur natus a harum, quos consectetur aperiam dolore ratione libero deleniti nemo numquam soluta dicta porro.</p>
        </section>


        <section class="col-md-6">
            <Signup />
        </section>
        
    </div>
</div>


</template>


<script>
import { mapGetters} from 'vuex'
import Login from '@/components/user/login.vue'
import Signup from '@/components/user/signup.vue'

export default {
    components: {
        Login,
        Signup
    },

    computed: {
        ...mapGetters({
            user: ['get_user']
        })
    }
}
  
</script>



<style lang="scss" scoped>


.home{
    min-height:75vh;
}
.text-presentation{
    text-align:justify;
    margin: 10px 20px;
}
h1{
    font-size:2rem;
    margin:0 20px;
}


</style>

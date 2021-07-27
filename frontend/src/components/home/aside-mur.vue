<template>
<div class="aside row">

    <router-link :to="{name: 'Profil', params: {userId: user.id}}" class="nav-link">
        <div class="col-4 col-md-12 text-center image">
            <img :src="user.avatarUrl">
        </div>

        <div class="col-8 col-md-12">
            <p class="name">Bonjour,<br> {{ name }} </p>
        </div>
    </router-link>

</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed:{
        ...mapGetters({
            user:['get_user']
        }),

        name(){
            return this.user.first_name +' '+ this.user.last_name
        }
    }
}
</script>


<style lang="scss" scoped>
.aside{
    margin:0;
    padding:0;

    a{
        color: black;
    }

    .image{ 
        margin-left:auto;
        margin-right:auto;
        min-width: 100px;
        img{
            max-width: 100px;
        }
    }

    .name{
        margin-top: 10px;
        padding:0;
    }
}
</style>


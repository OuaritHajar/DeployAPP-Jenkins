<template>
<div v-if="user.id != -1" class="row">
    

    <aside class="col-md-3">
        <!--<AsideMur :user="user" />-->
        <AsideMur/>
    </aside>



    <main class="col-md-9">

        <router-view></router-view>

        <Pagination/>

    </main> 


</div>
</template>








<script>
import { mapGetters } from 'vuex'
import AsideMur from'@/components/home/aside-mur.vue'
import Pagination from '@/components/post/pagination.vue'

let moment = require("moment")


export default {
    components: {
        AsideMur,
        Pagination
    },
    mounted() {
        moment.locale('fr');
        this.$store.dispatch('postsNumber')
    },
    data() {
        return{
            actuelPage : 1,
        }
    },
    computed: {
        ...mapGetters({
            user: ['get_user'],
        }),
    },

}
</script>




<style scoped lang="scss">

aside{
    margin-bottom:10px;
    padding-right:0;
}




</style>
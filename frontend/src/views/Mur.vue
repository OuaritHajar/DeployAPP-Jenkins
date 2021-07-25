<template>
<div class="container-fluid">
    <div v-if="user && user.id != -1" class="row">

        <aside class="col-sm-3">
            <!--<AsideMur :user="user" />-->
            <AsideMur/>
        </aside>

        <main class="col-sm-9 col-md-8 col-lg-7">
            <router-view></router-view>
            <Pagination/>
        </main> 

    </div>
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
    data() {
        return{
            actuelPage : 1,
        }
    },
    mounted() {
        moment.locale('fr');
        this.$store.dispatch('postsNumber')
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
    margin-top:30px;
}

</style>
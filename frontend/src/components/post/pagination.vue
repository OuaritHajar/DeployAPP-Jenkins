<template>

    <nav aria-label="pagination">
        <ul class="pagination">

            <li class="page_item" >
                <button type="button" class="btn btn-primary" @click="lastPage">
                    Preview
                </button>
            </li>

            <li class="page_item">
                <button type="button" class="btn btn-primary">
                    
                    <span> {{ actuelPage }} </span>
                </button>
            </li>

            <li class="page_item">
                <button type="button" class="btn btn-primary" @click="nextPage">
                    Next
                </button>
            </li>

        </ul>
    </nav>
</template>



<script>
import { mapGetters } from 'vuex'

export default {

    data() {
        return{
            
        }
    },
    computed: {
        ...mapGetters({
            user: ['get_user'],
        }),
        actuelPage () {
            return this.$route.params.page;
        },
    },

    methods:{
        lastPage(){
            this.$router.push({ name: 'Posts', params: { page : JSON.parse(this.$route.params.page) - 1} })
        },
         
        nextPage(){
            console.log("page incrementé : ")
            this.$router.push({ name: 'Posts', params: { page : JSON.parse(this.$route.params.page) +1} })
        },
    },
}
</script>



<style lang="scss" scoped>

/* Pagination */
.pagination{
    margin: 20px ; 
    justify-content: center;

    button.page-link {
        display: inline-block;
    }
    button.page-link {
        font-size: 20px;
        color: #29b3ed;
        font-weight: 500;
    }
}
</style>
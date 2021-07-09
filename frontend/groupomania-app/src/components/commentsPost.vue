<template>
    <div>
        <p>Les commentaires</p>
        <p>post id : {{ postId }}</p>
    </div>
</template>



<script>
export default {
    props: {
        postId:{
            type:Number
        }
    },
    data(){
        return{

        }
    },
    mounted(){
        this.$store.dispatch('getAllComments')
    },
    computed:{

    },
    methods:{

    }
}
</script>



<style scoped>

</style>
<template>
<section>
    <div class="post">
        <UserHeader :post="post"/>
        
        <!-- Titre / Description -->
        <div class="description-post">
            <p class="title" v-if="post.title">  {{ post.title }} </p>
            <p class="description"> {{ post.description }} </p>
            <div class="img-post">
                <img v-if="post.img_url != null" :src="post.img_url" alt="photo">
            </div>
            
            <InteractionPost :post="post" />
        </div>

        <EditPost v-if="afficherInterfaceModification" :post="post"/>
        
    </div>
    
    <NewComment v-if="post.displayInputComment" :post="post"/>
    <Comments :comments="post.Comments" :post="post"/>
    
</section>
</template>



<script>
import { mapGetters } from 'vuex'
import EditPost from '@/components/post/editPost.vue'
import Comments from'@/components/comment/commentsPost.vue'
import NewComment from '@/components/comment/newComment'
import UserHeader from '@/components/user/userHeader.vue'
import InteractionPost from '@/components/post/interactionPost.vue'



export default {
    data(){
        return{
            afficherInterfaceModification: false
        }
    },
    props:['postId'],
    components:{
        EditPost,
        Comments,
        NewComment,
        UserHeader,
        InteractionPost
    },
    mounted(){
        this.$store.dispatch('getOnePost', this.postId )
    },
    computed: {
        ...mapGetters({
            user: ['get_user'],
            post:['get_one_post']
        }),
    },
}
</script>



<style scoped lang="scss">
.post{
    margin: 20px 20px;
    padding: 20px 20px 10px;
    
    background-color:#ececec;
    border: solid 1px #cfcfcf;
    border-radius: 10px;
    
    img{
        max-width: 400px;
        width:100%;

        margin-left:auto;
        margin-right:auto;
    }
}

.description-post{
    margin: 10px 10px 0 10px;

    .img-post{
        margin-bottom:10px;
        display:flex;
        justify-content: center;

        img{
            max-width: 500px;
            width:100%;
            margin-left:auto;
            margin-right:auto;
        }
    }
    .title{
        font-size:1.4rem;
        margin:0;
    }

    .description{
        margin:10px auto 20px auto;
        text-align: justify;
    }

    button{
        margin-left:5px;
        margin-right:5px;
    }
}



</style>
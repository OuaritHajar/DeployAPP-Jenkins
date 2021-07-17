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
    <Comments :comments="post.Comments" />
    
</section>
</template>



<script>
import { mapGetters } from 'vuex'
import EditPost from '@/components/editPost.vue'
import Comments from'@/components/commentsPost.vue'
import NewComment from '@/components/newComment'
import UserHeader from '@/components/userHeader.vue'
import InteractionPost from '@/components/interactionPost.vue'



export default {
    data(){
        return{
            afficherInterfaceModification: false
        }
    },
    components:{
        EditPost,
        Comments,
        NewComment,
        UserHeader,
        InteractionPost
    },
    mounted(){
        this.$store.dispatch('getOnePost', this.$route.params.postId )
    },
    beforeUpdate() {
        this.post.userAlreadyLike = false
        this.post.Likes.forEach(like => {
            if(like.UserId == this.user.userId) {
                this.post.userAlreadyLike = true
            }
        })
    },

    computed: {
        ...mapGetters({
            user: ['get_user'],
            post:['get_one_post']
        }),
    },
    methods: {
        deletePost(postId) {
            
            if(confirm('Etes vous sur ?')) {
                this.$store.dispatch('deletePost', postId)
                .then(()=> {
                    if(this.$route.name == "Post"){
                        this.$router.push('/mur')
                    } else {
                        this.$router.go()
                    }
                })
            }
        },

        
    }
    
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
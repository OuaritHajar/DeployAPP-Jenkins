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
            <div v-if="post.userId === user.userId || user.isAdmin" class="text-center">
                <button v-if="afficherInterfaceModification != true" @click="afficherInterfaceModification = true" class="btn btn-primary">
                    <i class="bi bi-pencil-square"> Modifier</i> 
                </button>
                <button v-if="afficherInterfaceModification" @click="afficherInterfaceModification = false" class="btn btn-primary">
                    <i class="bi bi-pencil-square"> Cacher </i> 
                </button>
                
                <button @click="deletePost(post.id)" class="btn btn-danger">
                    <i class="bi bi-trash"> Supprimer</i>
                </button>
            </div>
            
        </div>
        <EditPost v-if="afficherInterfaceModification"/>
    </div>
    
    <NewComment :post="post"/>
    <Comments :comments="comments" />
    
</section>
</template>



<script>
import { mapGetters } from 'vuex'
import EditPost from '@/components/editPost.vue'
import Comments from'@/components/commentsPost.vue'
import NewComment from '@/components/newComment'
import UserHeader from '@/components/userHeader.vue'


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
        UserHeader
    },
    mounted(){
        this.$store.dispatch('getOnePost', this.$route.params.postId )
    },
    computed: {
        ...mapGetters({
            user: ['get_user'],
            post:['get_one_post'],
            comments: ['get_comments_post']
        }),
    },
    methods: {
        deletePost(postId) {
            if(confirm('Etes vous sur ?')) {
                this.$store.dispatch('deletePost', postId)
                .then(()=> {
                    this.$router.go(-1)
                })
            }
        },
        addLike(postId) {
            this.$store.dispatch('addOrRemoveLike', postId)
            .then(()=> {
                this.$router.go()
            })
        }
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
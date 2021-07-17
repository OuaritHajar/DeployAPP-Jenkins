<template>
<section>
    <div class="row interaction-post">

        <div class="col-3 text-center">
            <button @click="addLike(post.id)" @mouseover="listUsersLike(post.id)" @mouseleave="hideListUsersLike(post.id)" class="btn btn-like">
                <i v-if="post.userAlreadyLike" class="bi bi-hand-thumbs-up-fill" title="Dislike"></i>
                <i v-else-if="post.userAlreadyLike == false || undefined" class="bi bi-hand-thumbs-up" title="Like"></i>
                <span v-if="post.Likes">
                    <span v-if="post.Likes.length > 0" class="like"> {{ post.Likes.length }} </span>
                </span>
            </button> 
        </div>

        <div class="col-3 text-center">
            <button v-if="post.displayInputComment == false" @click="afficherInputCommentaire(post.id)" class="btn btn-personnaliser"><i class="bi bi-reply" title="Commenter"></i></button>
            <button v-if="post.displayInputComment" @click="masquerInputCommentaire(post.id)" class="btn btn-personnaliser"><i class="bi bi-reply-fill" title="Cacher les commentaires"></i></button>
        </div>

        <div class="col-3 text-center">
            
            <div v-if="post.UserId">
                <button v-if="(post.UserId == user.userId || user.isAdmin) && post.displayEditPost != true" @click="afficherEditPost(post.id)" class="btn">
                    <i class="bi bi-pencil-square" title="Editer"></i>
                </button>
                <button v-if="(post.UserId == user.userId || user.isAdmin)&& post.displayEditPost" @click="hideEditPost(post.id)" class="btn">
                    <i class="bi bi-pencil-square" title="Cacher l'interface"></i>
                </button>
            </div>
            
        </div>

        <div class="col-3 text-center">
            <div v-if="post.UserId">
                <button v-if="post.UserId == user.userId || user.isAdmin" @click="(deletePost(post.id))" class="btn">
                    <i class="bi bi-trash" title="Supprimer"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- list users qui on liké le post -->
    <span class="liste-users-flotant" v-if="post.Likes">
        <p class="list-users-like-post" v-if="post.Likes.length > 0 && post.listUsersLike"> Liké par&ensp;
        <span v-for="(like, index) in post.Likes" :key="index" >
            <router-link :to="{name: 'Profil', params: {userId: like.UserId }}">
                {{ like.User.first_name }} {{ like.User.last_name }}&ensp;
            </router-link>
            <!-- <p v-if="like.UserId == user.userId"> J'ai liké </p> -->
        </span>
        </p>
    </span>

    <EditPost v-if="post.displayEditPost" :post="post"/>

</section>
</template>







<script>
import { mapGetters } from 'vuex'
import EditPost from '@/components/editPost.vue'


export default {
    components:{
        EditPost
    },
    props: ['post'],

    computed:{
        ...mapGetters({
            user: ['get_user']
        })
    },

    methods: {

        // Affichage
        listUsersLike(postId){
            this.$store.dispatch('displayListUsersLike', { postId: postId, vue: this.$route.name })
        },
        hideListUsersLike(postId){
            this.$store.dispatch('hideListUsersLike', { postId: postId, vue: this.$route.name })
        },


        afficherInputCommentaire(postId){
            this.$store.dispatch('displayInputComments', { postId: postId, vue: this.$route.name } )
        },
        masquerInputCommentaire(postId){
            this.$store.dispatch('hideInputComments', { postId: postId, vue: this.$route.name })
        },


        afficherEditPost(postId){
            this.$store.dispatch('displayEditPost', { postId: postId, vue: this.$route.name })
        },
        hideEditPost(postId){
            this.$store.dispatch('hideEditPost', { postId: postId, vue: this.$route.name })
        },


        // Interaction
        deletePost(postId) {
            if(confirm('Etes vous sur ?')) {
                this.$store.dispatch('deletePost', postId)
                .then(()=> {
                    this.$router.go()
                })
            }
        },
        addLike(postId) {
            this.$store.dispatch('addOrRemoveLike', postId)
            .then(()=> {
                this.$router.go()
            })
        },

    },
    
}
</script>


<style lang="scss" scoped>
.interaction-post{

    .btn:hover{
        background-color: rgb(226, 226, 226);
    }

    .btn-like{
        padding-top:3px;
        margin-bottom:-3px;

        .like{
            margin-left:5px;
            padding-top: -5px!important;
        }
    }

    .btn-personnaliser{
        margin-top:-2px;
        padding:0 10px 2px 10px;
    }
    .bi{
        font-size:1.5rem;

        &.bi-hand-thumbs-up, &.bi-hand-thumbs-up-fill{
            color:rgb(37, 37, 204);
            margin:0;
            padding:0;
        }
        &.bi-trash{
            color:rgb(223, 24, 24);
        }
        &.bi-pencil-square{
            color:rgb(37, 37, 204);
        }
        &.bi-box-arrow-in-left{
            color:rgb(37, 37, 204);
        }
        &.bi-reply, &.bi-reply-fill{
            font-size: 2rem;
            margin:0;   
            padding:0;
            color:rgb(37, 37, 204)
        }
    }
}

.list-users-like-post{
    font-size:0.8rem;
    margin-bottom:5px;
    margin-left:5px;
}



</style>
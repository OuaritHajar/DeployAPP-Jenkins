<template>
<section>

    <!-- Commentaires -->
    <div v-for="(comment, index) in comments" :key="index" class="comments">

        <div class="row" v-if="comment.User">

            <!-- Avatar -->
            <div class="col-xs-1 comments_image-comment">
              <img :src="comment.User.avatarUrl" alt="">
            </div>

            <!-- user / date -->
            <div class="col-auto mr-auto">
                <router-link :to="{name: 'Profil', params: {userId: comment.UserId }}">
                    <p class="user-comment"> {{ comment.User.first_name }} {{ comment.User.last_name }}</p>
                </router-link>
                <p class="comment-date" v-if="comment.createdAt === comment.updatedAt"> il y a {{ moment(comment.createdAt).fromNow(true) }} </p> 
                <p class="comment-date" v-else >modifié il y a {{ moment(comment.updatedAt).fromNow(true) }}  </p>
            </div>

            <!-- button -->
            <div class="col-auto btn-edit" v-if="user.id === comment.UserId || user.isAdmin" >
                <button v-if="comment.displayEditComment != true" 
                    @click="displayEditComment(comment.id, comment.PostId)" 
                    class="btn btn-primary">

                    <i class="bi bi-pencil-square" title="Editer"></i>
                </button>

                <button v-if="comment.displayEditComment" 
                    @click="hideEditComment(comment.id, comment.PostId)" 
                    class="btn btn-primary">

                    <i class="bi bi-pencil-square" title="Cacher"></i>
                </button>

                <span class="spacer"></span>

                <button  
                class="btn btn-danger" @click="displayDeleteComment(comment.id, comment.PostId)" >
                    <i class="bi bi-trash" title="Supprimer"></i>
                </button>
            </div>
        </div>

        <p class="description-comment"> {{ comment.description }} </p>


        <!-- Edit comment -->
        <div v-if="(user.id === comment.UserId || user.isAdmin) && comment.displayEditComment" >
            <form>
                <textarea v-model="comment.editDescriptionComment" type="text" class="form-control" id="inputTitle" rows="1">
                    
                </textarea>
            </form>
            <button @click="editComment(comment.id, comment.editDescriptionComment, comment.PostId)" class="btn btn-primary">
                <i class="bi bi-arrow-return-right"> Modifier</i>
            </button>
        </div>


        <!-- Modal delete comment -->
        <Modal v-if="comment.displayDelComment" @close="hideDelComment(comment.id, comment.PostId)" @delete="(deleteComment(comment.id, post.id))" :comment="comment">
            <template v-slot:body>
                  <p>Etes vous sur de vouloir supprimer ce commentaire ?</p>
                  
                  
            </template>
        </Modal>

    </div>

    <NewComment @comment-created="afficheComments(post.id)" :post="post"/>

</section>
</template>


<script>
import { mapGetters } from 'vuex'
import NewComment from '@/components/comment/newComment.vue'
import Modal from '@/components/modal.vue'
let moment = require("moment")

export default {
    components: { 
        NewComment,
        Modal
    },
    data(){
        return{
            moment:moment,
            afficherInterfaceEditComment : false,
        }
    },
    props: ['comments', 'post'],
    
    mounted(){
        moment.locale('fr');
    },

    computed:{
        ...mapGetters({
            user:['get_user'],
        })
    },

    methods:{
        afficheComments(postId) {
            this.$store.dispatch('displayComments', postId)
        },


        displayEditComment(commentId, postId){
            this.$store.dispatch('displayEditComment', {commentId : commentId, postId: postId, vue: this.$route.name })
        },
        hideEditComment(commentId, postId){
            this.$store.dispatch('hideEditComment', {commentId : commentId, postId: postId, vue: this.$route.name } )
        },
        editComment(commentId, description, postId){
            let data = { 
                'description': description,
                'commentId': commentId,
                'postId': postId,
                'vue': this.$route.name,
            }
            this.$store.dispatch('editComment', data)
        },


        displayDeleteComment(commentId, postId) {
            this.$store.dispatch('displayDeleteComment', {commentId : commentId, postId: postId, vue: this.$route.name })
        },
        hideDelComment(commentId, postId) {
            this.$store.dispatch('hideDeleteComment', {commentId : commentId, postId: postId, vue: this.$route.name })
        },
        deleteComment(commentId, postId){
        
            let data = {
                'commentId': commentId,
                'postId': postId,
                'vue': this.$route.name,
            }
            this.$store.dispatch('deleteComment', data)
        },
    }
}
</script>

<style lang="scss" scoped>
.comments {
    background-color:#f0f0f0;
    border-radius: 5px;
    border: solid 1px #e6e6e6;
    margin:0px 10px;
    padding:10px 20px;

    img{
        height:40px;
        width:40px;
    }
    .comments_image-comment{
        margin: 0;
        padding-left:5px;
        padding-right: 0;
    }
    .user-comment{
        margin-bottom:0;
        font-size:0.8rem;
    }
    .comment-date{
        font-size:0.8rem;
        margin-bottom:0
    }
    .description-comment{
        margin: 10px 10px 10px;
    }
    .btn{
        margin-top:5px;
        padding:2px 5px;
    }
}
</style>
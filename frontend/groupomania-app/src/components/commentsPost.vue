<template>
<section>
    <div v-for="(comment, index) in comments" :key="index" class="comments">

        <div class="row" v-if="comment.User">

            <!-- Avatar -->
            <div class="col-xs-1 comments_image-comment" >
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
            <div class="col-auto btn-edit" v-if="comment.UserId === user.userId || user.isAdmin" >
                <button v-if="comment.editComment != true" @click="displayEditComment(comment.id)" class="btn btn-primary">
                    <i class="bi bi-pencil-square" title="Editer"></i>
                </button>
                <button v-if="comment.editComment" @click="hideEditComment(comment.id)" class="btn btn-primary">
                    <i class="bi bi-pencil-square" title="Cacher"></i>
                </button>

                <span class="spacer"></span>
                <button @click="deleteComment(comment.id)" class="btn btn-danger">
                    <i class="bi bi-trash" title="Supprimer"></i>
                </button>
            </div>
        </div>

        <p class="description-comment"> {{ comment.description }} </p>

        <!-- Edit comment -->
        <div v-if="(comment.UserId === user.userId || user.isAdmin) && comment.editComment" >
            <form>
                <textarea v-model="comment.editDescriptionComment" type="text" class="form-control" id="inputTitle" rows="1"></textarea>
            </form>
            <button @click="editComment(comment.id, comment.editDescriptionComment)" class="btn btn-primary">
                <i class="bi bi-arrow-return-right"> Modifier</i>
            </button>
        </div>
    </div>
    
    <NewComment :post="post"/>

</section>
</template>


<script>
import { mapGetters } from 'vuex'
import NewComment from '@/components/newComment.vue'

let moment = require("moment")


export default {
    components: { 
        NewComment 
    },
    data(){
        return{
            moment:moment,
            afficherInterfaceEditComment : false
        }
    },
    props: ['comments'],
    emits: [''],
    mounted(){
        moment.locale('fr');
    },
    computed:{
        ...mapGetters({
            user:['get_user'],
            post:['get_one_post']
        })
    },

    methods:{
        displayEditComment(commentId){
            this.$store.dispatch('displayEditComment', commentId)
        },
        hideEditComment(commentId){
            this.$store.dispatch('hideEditComment', commentId)
        },


        editComment(commentId, description){
            let data = { 
                'description': description,
                'commentId': commentId    
            }
            this.$store.dispatch('editComment', data)
            .then(()=> {
                this.$router.go()
            })
        },

        deleteComment(commentId){
            if(confirm('Etes vous sur de vouloir supprimer le commentaire ?')){
                let data = {'commentId': commentId }
                this.$store.dispatch('deleteComment', data)
                .then(()=> {
                    this.$router.go()
                })
            }
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
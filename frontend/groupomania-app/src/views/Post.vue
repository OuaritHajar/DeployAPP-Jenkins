<template>
    <div>

        <!-- Post -->
        <div id="post" class="post">

            <!-- Titre / Description -->
            <h2>  {{ post.title }} </h2>
            <p class="description"> {{ post.description }} </p>
            <img v-if="post.img_url != null" :src="post.img_url" alt="photo">

            <!-- Likes / Commentaires -->
            <div class="row interaction-post">
                <p><button @click="addLike(post.id)" class="nostyle">Like : </button> {{ post.likes }} </p>
                <p class="spacer">-</p>
                <p> Commentaire : {{ post.comments }}</p>
            </div>
            
            <!-- info supplémentaire -->
            <div class="row interaction-post information-post">
                <router-link :to="{name: 'ProfilUser', params: {userId: post.userId }}">
                    <p  v-if="post.User">post de {{ post.User.first_name }} {{ post.User.last_name }} </p> 
                </router-link>
                <span class="spacer"></span>
                <p v-if="post.createdAt === post.updatedAt"> le : {{ post.createdAt }} </p> 
                <p v-else>modifié le : {{ post.updatedAt }} </p>
            </div>
            
            <!-- Edit post -->
            <div v-if="post.userId === user.userId">
                <hr>
                <form enctype="multipart/form-data">
                    <fieldset>
                        <legend>Modifier votre post</legend>
                        <hr>
                        <div >
                        
                            <!-- Titre-->
                            <div class="form-group ">
                                <label for="inputTitle">Titre :</label>
                                <input v-model="titlePost" type="text" class="form-control gray" id="inputTitlePost" > 
                            </div>

                            <!-- Message -->
                            <div class="form-group">
                                <label for="inputMessage">Message:</label>
                                <textarea v-model="descriptionPost" type="text" class="form-control gray" rows="2" id="inputMessage">  </textarea>
                            </div>

                            <!-- Image-->
                            <div class="form-group">
                                <label for="inputImg_url">Image : </label>
                                <input type="file" @change="uploadImage($event)" id="file-input">
                            </div>
                        </div>

                        <button @click="editPost()" class="btn btn-primary">
                            Modifier
                        </button>
                        
                        <span class="spacer"></span>
                        <button @click="deletePost()" class="btn btn-danger">
                            Supprimer
                        </button>

                    </fieldset>
                </form>
            </div>
        </div>

        <!-- Ajouter un commentaire -->
        <div class="new-comment">
            <form class="form-inline">  

                <div class="col-sm-9">
                    <textarea v-model="descriptionComment" class="form-control" placeholder="Ajouter un commentaire" rows="3"></textarea>
                </div>
                <div class="col-sm-3">
                    <button @click="newComment(post.id)" class="btn btn-primary">
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
        

        <!-- Comments -->
        <div class="comments">
            <div v-for="(comment, index) in comments" :key="index" class="comment">
                <router-link :to="{name: 'ProfilUser', params: {userId: comment.UserId }}">
                    <p v-if="comment.User"> {{ comment.User.first_name }} {{ comment.User.last_name}}</p>
                </router-link>
                <p> {{ comment.description }} </p>

                <!-- Edit comment -->
                <div v-if="comment.UserId === user.userId" >
                    <form>
                        <textarea v-model="editDescriptionComment" type="text" class="form-control" id="inputTitle" rows="1"></textarea>
                        
                        <button @click="editComment(comment.id)" class="btn btn-primary">
                            Modifier
                        </button>
                        <span class="spacer"></span>
                        <button @click="deleteComment(comment.id)" class="btn btn-danger">
                            Supprimer
                        </button>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data(){
        return{
            titlePost: '',
            descriptionPost:'',
            file: null,

            descriptionComment: "",
            editDescriptionComment:""
        }
    },
    
    computed: {
        ...mapState({
            post:['post'],
            user:['user'],
            comments:['commentsPost']
        }),
    },

    mounted(){
        this.$store.dispatch('getOnePost', this.$route.params.postId )        
    },



    methods: {
        uploadImage(event) {
            this.file = event.target.files[0]
            console.log(this.file)
        },


        editPost() {
            let data = new FormData();

            data.append('title', this.titlePost);
            data.append('description', this.descriptionPost);
            data.append('img_url', this.file); 

            this.$store.dispatch('editPost', data)
            .then(()=> {
                this.$router.go()
            })
        },



        deletePost() {
            if(confirm('Etes vous sur ?')) {
                this.$store.dispatch('deletePost')
                .then(()=> {
                    this.$router.push('/mur')
                })
            }
        },


        newComment(postId) {
            let data = {
                'description': this.descriptionComment,
                'postId' : postId
                }
            this.$store.dispatch('newComment', data)
            .then(()=> {
                this.$router.go()
            })
        },


        editComment(commentId){
            let data = { 
                'description': this.editDescriptionComment,
                'commentId': commentId    
            }
            this.$store.dispatch('editComment', data)
            .then(()=> {
                this.$router.go()
            })
        },



        deleteComment(commentId){
            let data = {
                'commentId': commentId
            }
            this.$store.dispatch('deleteComment', data)
            .then(()=> {
                this.$router.go()
            })
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
  padding:30px 40px;
  background-color:#e0e0e0;
  border: solid 1px #a1a1a1;
  border-radius: 10px;
  
  img{
    max-width: 400px;
    width:100%;

    margin-left:auto;
    margin-right:auto;
  }
}
#file-input{
    margin-left:10px;
}
.gray{
    color:gray
}


.description{
  margin:10px auto 20px auto;
  text-align: justify;
}
.information-post{
  font-size:0.8rem;
  color:#808080;
}
.interaction-post{
  margin-left: 10px;
}



.spacer{
  margin:0 10px 0 10px
}
.nostyle{
  border:none;
  background-color: #e0e0e0;
}
.nostyle:hover{
  border-radius: 5px;
  background-color: #d4d4d4;

}


.comments{
    background-color:#f0f0f0;
    border: solid 1px #e6e6e6;
    margin:20px 20px
}
.comment{
    border: solid 1px #e6e6e6;
    padding:10px 20px;
}
.new-comment{
    margin:20px 20px;
}
textarea.form-control{
    width:100%;
}
hr{
    margin: 5px 0 5px 0;
}

</style>
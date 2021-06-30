<template>
    <div>
        <!-- Post -->
        <div id="post" class="post">
            <h2>  {{ post.title }} </h2>
            <img v-if="post.img_url != null" :src="post.img_url" alt="premier post photo">
            <p class="description"> {{ post.description }} </p>

            <div class="row interaction-post">
                <p><button @click="addLike" class="nostyle">Like : </button> {{ post.likes }} </p>
                <p class="spacer">-</p>
                <p> Commentaire : {{ post.comments }}</p>
            </div>
            
            <div class="row interaction-post information-post">
                <p>posté par : quelqu'un </p> <span class="spacer"></span>
                <p v-if="post.createdAt === post.updatedAt"> le : {{ post.createdAt }} </p> 
                <p v-else>modifié le : {{ post.updatedAt }} </p>
            </div>
            
            <hr>

            <!-- Edit post -->
            <div v-if="post.userId == $store.state.userId">
                <form enctype="multipart/form-data">
                    <fieldset>
                        <legend>Modifier votre post</legend>
                        <hr>
                        <div >
                        
                            <!-- Titre-->
                            <div class="form-group ">
                                <label for="inputTitle">Titre :</label>
                                <input v-model="titlePost" type="text" class="form-control" id="inputTitle">
                            </div>

                            <!-- Message -->
                            <div class="form-group">
                                <label for="inputMessage">Message:</label>
                                <textarea v-model="descriptionPost" type="text" class="form-control" rows="6" id="inputMessage"></textarea>
                            </div>

                            <!-- Image-->
                            <div class="form-group">
                                <label for="inputImg_url">Image :</label>
                                <input type="file" class="form-control" id="inputImg_url">
                            </div>
                        </div>

                        <button @click="editPost" class="btn btn-primary">
                            Modifier
                        </button>
                        
                        <span class="spacer"></span>
                        <button @click="deletePost" class="btn btn-danger">
                            Supprimer
                        </button>

                    </fieldset>
                </form>
            </div>
        </div>

        <!-- Ajouter un commentaire -->
        <div class="new-comment">
            <form class="form-inline" enctype="multipart/form-data">  

                <div class="col-sm-9">
                    <textarea v-model="descriptionComment" class="form-control" placeholder="Ajouter un commentaire" rows="3"></textarea>
                </div>
                <div class="col-sm-3">
                    <button @click="newComment" class="btn btn-primary">
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
        

        <!-- Comments -->
        <div class="comments">
            <div v-for="(comment, index) in allComments" :key="index" class="comment">
                <p> {{ comment.UserId }} </p>
                <p> {{ comment.description }} </p>

                <!-- Edit comment -->
                <div v-if="comment.UserId == $store.state.userId" >
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
import axios from 'axios'

export default {
    data(){
        return{
            post:{},
            allComments:[],
            descriptionComment: "",
            titlePost:"",
            descriptionPost:'',
            editDescriptionComment:""
        }
    },
    methods: {
        editPost() {
            axios.put("http://localhost:3000/api/posts/"+ this.$route.params.postId, {
                title: this.titlePost,
                description: this.descriptionPost
            },{
                headers: {
                    Authorization: "Bearer " + localStorage.token
                }
            })
            .then(response => {
              console.log(response)
              window.location = "http://localhost:8080/index.html#/mur"

            })
            .catch(error => {
            console.log(error); 
            });
        },



        deletePost() {
            axios.delete("http://localhost:3000/api/posts/"+ this.$route.params.postId,{
                headers: {
                    Authorization: "Bearer " + localStorage.token
                }
            })
            .then( ()=> {
              window.location = "http://localhost:8080/index.html#/"

            })
            .catch(error => {
            console.log(error); 
            });
        
        },


        newComment() {
            axios.post("http://localhost:3000/api/posts/"+ this.$route.params.postId + "/comment", {
                description: this.descriptionComment
            },{
                headers: {
                    Authorization: "Bearer " + localStorage.token
                }
            })
            .then((response)=> {
                console.log(response)
            })
            .catch(error => {
            console.log(error); 
            });
        },


        editComment(commentId){
            axios.put("http://localhost:3000/api/posts/"+ this.$route.params.postId + "/comment/" + commentId, {
                description: this.editDescriptionComment
            },{
                headers: {
                    Authorization: "Bearer " + localStorage.token
                }
            })
            .then((response)=> {
                console.log(response)
                window.location = "http://localhost:8080/index.html#/post/" + this.$route.params.postId
            })
            .catch(error => {
            console.log(error); 
            });
        },



        deleteComment(commentId){
            axios.delete("http://localhost:3000/api/posts/"+ this.$route.params.postId + "/comment/" + commentId, {
                headers: {
                    Authorization: "Bearer " + localStorage.token
                }
            })
            .then((response)=> {
                console.log(response)
                window.location = "http://localhost:8080/index.html#/post/" + this.$route.params.postId
            })
            .catch(error => {
            console.log(error); 
            });
        },

        

        addLike() {
            axios.post("http://localhost:3000/api/posts/" + this.$route.params.postId + "/like", "" , {
              headers: {
                Authorization: "Bearer " + localStorage.token
              }
            })
            .then(response => {
                console.log(response)

            })
            .catch(error => {
            console.log(error); 
            });
        }
    },
    mounted(){
        axios.get("http://localhost:3000/api/posts/" + this.$route.params.postId, {
          headers: {
            Authorization: "Bearer " + localStorage.token
          }
        })
        .then(response => {
          console.log(response)
            this.post = response.data.post
            this.allComments = response.data.comments
        })
        .catch(error => {
        console.log(error); 
        });
    }
}
</script>


<style scoped>
.post{
  margin: 20px 20px;
  padding:20px 23px;
  background-color:#e0e0e0;
  border: solid 1px #a1a1a1;
  border-radius: 10px;

  padding-left:30px;
  padding-right:30px
}

.post img{
  width: 100%;
  max-width: 550px;
}
.information-post{
  font-size:0.8rem;
  color:#808080;
}
.description{
  margin-bottom:20px;

  text-align: justify;
}
.post img{
  margin-right:auto;
  margin-left:auto;
}
.interaction-post{
  margin-left:auto;
  margin-right:auto;
}
.spacer{
  margin:0 10px 0 10px
}
.nostyle{
  border:none;
  background-color: #e0e0e0;
}

.btn-ajouter-post{
  display: flex;
  justify-content: center;
}

.comments{
    margin:20px 20px
}
.comment{
    background-color:#f0f0f0;
    border: solid 1px #a1a1a1;
    border-radius: 10px;
    margin:10px 20px;
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
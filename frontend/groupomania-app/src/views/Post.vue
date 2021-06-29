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
        </div>

        <!-- Ajouter un commentaire -->
        <div class="new-comment">
            <form class="form-inline" enctype="multipart/form-data">  

                <div class="col-sm-9">
                    <textarea v-model="description" class="form-control" placeholder="Ajouter un commentaire" rows="3"></textarea>
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
            description: ""
        }
    },
    methods: {
        newComment() {
            axios.post("http://localhost:3000/api/posts/"+ this.$route.params.postId + "/comment", {
                description: this.description
            },{
                headers: {
                    Authorization: "Bearer " + localStorage.token
                }
            })
        },
        addLike() {

            axios.post("http://localhost:3000/api/posts/" + this.$route.params.postId + "/like", "" , {
              headers: {
                Authorization: "Bearer " + localStorage.token
              }
            })
            .then(response => {
              console.log(response)
              // reload like 

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

</style>
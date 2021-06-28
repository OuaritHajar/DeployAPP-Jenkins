<template>
    <div>
        <!-- Post -->
        <div id="post" class="post">
        

            <span>postId : {{ $route.params.postId }}</span>


            <h2>  {{ post.title }} </h2>
            <img :src="post.img_url" alt="premier post photo" class="image-post">
            <p> {{post.img_url}} </p> 
            <p class="description"> {{ post.description }} </p>

            <p class="author">posté par :  </p>
            <div class="row interaction-post">
                <p> Likes : {{ post.likes }} - </p>
                <p> Commentaire : {{ post.comments }}</p>
            </div>
            <p>Cree le : {{ post.createdAt }} </p>
            <p>Modifier le : {{ post.updatedAt }} </p>
            <div class="seperate"></div>
        </div>

        <!-- Comments -->
        <div class="comments">
            <div v-for="(comment, index) in allComments" :key="index">
                <p> {{comment.description}} </p>
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
            allComments:[]
        }
    },
    mounted(){
    
    //let postId = $route.params.postId
    //console.log(postId)
    
    axios.get("http://localhost:3000/api/posts/`${route.params.postId}`", {
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
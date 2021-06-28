<template>
    <div class="post">
            <p class="author">posté par </p>
            <h2>{{ post.title }}</h2>


            <p> post numero: {{ $route.params.postId }} </p>


            <p class="description">${response.post.description}</p>
            <a href="post.html"><img src="img/image-post.jpg" alt="premier post poto"
                    class="image-post"></a>
            <div class="row interaction-post">
                <p><a href="*" class="like">Likes</a>: ${response.post.likes} </p>
                <p class="spacer">-</p>
                <p><a href="*" class="commentaire"> Commentaire </a>: ${response.comments.length}</p>
            </div>
            <p>Cree le : ${response.post.createdAt} </p>
            <p>Modifier le : ${response.post.updatedAt} </p>
            <div class="seperate"></div>
            </div>
</template>

<script>
import axios from 'axios'

export default {
    data(){
        return{
            post:{},
            comments:[]
        }
    },
    mounted(){
    
    
    axios.get("http://localhost:3000/api/posts/`${route.params.postId}`", {
      headers: {
        Authorization: "Bearer " + localStorage.token
      }
    })
    .then(response => {
      console.log(response)
        this.post = response.data.post
    })
    .catch(error => {
    console.log(error); 
    });
  }
}
</script>
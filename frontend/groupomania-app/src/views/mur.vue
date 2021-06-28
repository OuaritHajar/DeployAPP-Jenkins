<template>
<div>
  <div v-for="(post, index) in allPosts" :key="index">
    <div id="post" class="post">
        
      <router-link :to="{name: 'Post', params: {postId: post.id}}">
        <h2>  {{ post.title }} </h2>
        <img :src="post.img_url" alt="premier post photo" class="image-post">
        <p> {{post.img_url}} </p> 
        <p class="description"> {{ post.description }} </p>
      </router-link>

        <p class="author">posté par :  </p>
        <div class="row interaction-post">
            <p> Likes : {{ post.likes }} - </p>
            <p> Commentaire : {{ post.comments }}</p>
        </div>
        <p>Cree le : {{ post.createdAt }} </p>
        <p>Modifier le : {{ post.updatedAt }} </p>
        <div class="seperate"></div>
    </div>
  </div>

</div>
    
</template>



<script>
//import Post from '../components/post'
import axios from 'axios'

export default {
  
  //components: {
  //  Post
  //},
  data() {
    return{
      allPosts: [],
    }
  },
  methods: {
    
  },
  
  mounted(){
    
    axios.get("http://localhost:3000/api/posts?limit=10", {
      headers: {
        Authorization: "Bearer " + localStorage.token
      }
    })
    .then(response => {
      console.log(response)
        this.allPosts = response.data.post
    })
    .catch(error => {
    console.log(error); 
    });
  }
}
</script>













<style scoped>
.post{
  margin-left:auto;
  margin-right:auto;

  background-color:#c5c5c5;

  padding-left:30px;
  padding-right:30px
}

.post img{
  width: 100%;
  max-width: 550px;
}
.post a img{
  display:flex;
}
.author{
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

.btn-ajouter-post{
  display: flex;
  justify-content: center;
}

</style>
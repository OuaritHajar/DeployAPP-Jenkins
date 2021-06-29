<template>
<section>
  <!-- Button new post -->
  <div class="text-center">
    <router-link to="/newPost" class="nav-link">
      <button class="btn btn-primary">Ajouter un post</button>
    </router-link>
    <p> userId: {{ $store.state.userId }}</p>
  </div>

  <!-- Affiche post -->
  <div v-for="(post, index) in allPosts" :key="index">
    <div class="post">
        
      <router-link :to="{name: 'Post', params: {postId: post.id}}">
        <h2>  {{ post.title }} </h2>
        <img v-if="post.img_url != null" :src="post.img_url" alt="premier post photo">
        <p class="description"> {{ post.description }} </p>
      </router-link>
        <p>postId : {{ post.id }}</p> 
        <div class="row interaction-post">
            <p><button @click="addLike(post.postId)" class="nostyle">Like : </button> {{ post.likes }} </p>
            <p class="spacer">-</p>
            <p> Commentaire : {{ post.comments }}</p>
        </div>
        
        
        <div class="row interaction-post informationPost">
          <p>posté par : quelqu'un </p> <span class="spacer"></span>
          
          <p v-if="post.createdAt === post.updatedAt"> le : {{ post.createdAt }} </p> 
          <p v-else>modifié le : {{ post.updatedAt }} </p>
        </div>
        <div class="seperate"></div>
    </div>
  </div>
</section>
    
</template>



<script>
//import Post from '../components/post'
import axios from 'axios'

export default {
  data() {
    return{
      allPosts: [],
    }
  },
  methods:{
    addLike() {
      console.log(this.$route.params.postId)

      axios.post("http://localhost:3000/api/posts/" + this.$route.params.post + "/like", {
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
  },
  mounted(){
    axios.get("http://localhost:3000/api/posts?limit=10", {
      headers: {
        Authorization: "Bearer " + localStorage.token
      }
    })
    .then(response => {
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
.informationPost{
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

</style>
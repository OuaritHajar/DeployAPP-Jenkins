<template>
<section>
  <!-- Button new post -->
  <div v-if="$store.state.userId != 0" class="text-center">
    <router-link to="/newPost" class="nav-link">
      <button class="btn btn-primary">Ajouter un post</button>
    </router-link>
  </div>

  <!-- Affiche tout les posts -->
  <div v-for="(post, index) in allPosts" :key="index">
    <div class="post">
      
        
      <!-- Titre / Description -->
      <router-link :to="{name: 'Post', params: {postId: post.id}}">
        <h2>  {{ post.title }} </h2>
        <p class="description"> {{ post.description }} </p>
        <img v-if="post.img_url != null" :src="post.img_url" alt="photo">
      </router-link>

      <!-- Likes / Commentaires -->
      <div class="row interaction-post">
          <p><button @click="addLike(post.id)" class="nostyle">Like : </button> {{ post.likes }} </p>
          <p class="spacer">-</p>
          <p> Commentaire : {{ post.comments }}</p>
      </div>
      
      <!-- info supplémentaire -->
      <div class="row interaction-post information-post">
        <router-link :to="{name: 'ProfilUser', params: {userId: post.UserId }}">
            <p>post de {{ post.UserId }} </p> 
        </router-link>
        
        <span class="spacer"></span>

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

    addLike(payload) {
      console.log(localStorage)

      axios.post("http://localhost:3000/api/posts/" + payload + "/like", "" , {
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
    axios.get("http://localhost:3000/api/posts?limit=10", {
      headers: {
        Authorization: "Bearer " + localStorage.token
      }
    })
    .then(response => {
        this.allPosts = response.data.post
        console.log(response.data.post)
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
  padding:30px 40px;
  background-color:#e0e0e0;
  border: solid 1px #a1a1a1;
  border-radius: 10px;
}

.post img{
  max-width: 400px;
  width:100%;
}
.information-post{
  font-size:0.8rem;
  color:#808080;
}
.interaction-post{
  margin-left: 10px;
}
.description{
  margin:10px auto 20px auto;

  text-align: justify;
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


</style>
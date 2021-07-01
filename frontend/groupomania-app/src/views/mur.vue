<template>
<section>
  <!-- Button new post -->
  <div v-if="$store.state.userId != 0" class="text-center">
    <router-link to="/newPost" class="nav-link">
      <button class="btn btn-primary">Ajouter un post</button>
    </router-link>
  </div>

  <!-- Affiche tout les posts -->
  <div v-for="(post, index) in displayedPosts" :key="index">
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

  <!-- pagination -->
  <div class="offset">
    <nav aria-label="Page navigation example">
			<ul class="pagination">
				<li class="page-item">
					<button type="button" class="page-link" v-if="page != 1" @click="page--"> Previous </button>
				</li>
				<li class="page-item">
					<button type="button" class="page-link" v-for="(pageNumber, index) in pages.slice(page-1, page+5)" :key="index" @click="page = pageNumber"> {{pageNumber}} </button>
				</li>
				<li class="page-item">
					<button type="button" @click="page++" v-if="page < pages.length" class="page-link"> Next </button>
				</li>
			</ul>
		</nav>	
  </div>
  
</section>
    
</template>



<script>
//import Post from '../components/post'
import axios from 'axios'

export default {
  data() {
    return{
      posts : [''],
			page: 1,
			perPage: 10,
			pages: [],
    }
  },
  methods:{
    getPosts () {	
      for(let i = 0; i < 50; i++){
        this.posts.push({
               suffix:'#' + i});
      }  
		},
		setPages () {
			let numberOfPages = Math.ceil(this.posts.length / this.perPage);
      console.log(numberOfPages)
			for (let index = 1; index <= numberOfPages; index++) {
				this.pages.push(index);
			}
		},
		paginate (posts) {
			let page = this.page;
			let perPage = this.perPage;
			let from = (page * perPage) - perPage;
			let to = (page * perPage);
			return  posts.slice(from, to);
		},











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
    axios.get("http://localhost:3000/api/posts", {
      headers: {
        Authorization: "Bearer " + localStorage.token
      }
    })
    .then(response => {
        this.posts = response.data.post
    })
    .catch(error => {
    console.log(error); 
    });
  },




  computed: {
		displayedPosts () {
			return this.paginate(this.posts);
		}
	},
	watch: {
		posts () {
			this.setPages();
		}
	},
	filters: {
		trimWords(value){
			return value.split(" ").splice(0,20).join(" ") + '...';
		}
	}
}
</script>










<style scoped lang="scss">
button.page-link {
	display: inline-block;
}
button.page-link {
    font-size: 20px;
    color: #29b3ed;
    font-weight: 500;
}
.offset{
  width: 500px !important;
  margin: 20px auto;  
}








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

  a{
    text-decoration: none;
    
    & h2, .description{
      color:black;
    }
  }

  h2:hover, .description:hover{
    color:rgb(68, 68, 68)
  }
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


</style>
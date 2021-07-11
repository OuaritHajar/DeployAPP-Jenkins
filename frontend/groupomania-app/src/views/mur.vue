<template>
<div v-if="$store.state.user.userId != -1">
  <section>

    <!-- Button new post -->
    <div class="text-center">
      <button v-if="afficheNewPost == false" @click="afficheNewPost = true" class="btn btn-primary">Ajouter un post</button>
      <button v-if="afficheNewPost" @click="afficheNewPost = false" class="btn btn-primary">Masquer</button>
    </div>
    <div v-if="afficheNewPost">
      <NewPost/>
    </div>
    

  
    <!-- Affiche tout les posts -->
    <div v-for="(post, index) in displayedPosts" :key="index" class="post">
      
      <!-- Titre / Description -->
      <router-link :to="{name: 'Post', params: {postId: post.id}}">
        <h2>  {{ post.title }} </h2>
        <p class="description"> {{ post.description }} </p>
        <img v-if="post.img_url != null" :src="post.img_url" alt="photo">
      </router-link>


        <!-- Likes / Commentaires -->
      <div class="row interaction-post">
          <p><button @click="addLike(post.id)" class="nostyle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
              <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
            </svg>
            </button> {{ post.likes }} </p>
      </div>
      

      <!-- info supplémentaire -->
      <div class="row information-post">
        <div class="col-md-5">
          <router-link :to="{name: 'ProfilUser', params: {userId: post.UserId }}">
            <p v-if="post.User">post de  {{ post.User.first_name }} {{ post.User.last_name }} </p> 
          </router-link>
        </div>
        
        
        <div class="col-md-7 text-right">
          <p v-if="post.createdAt === post.updatedAt"> le : {{ post.createdAt }} </p> 
          <p v-else>modifié le : {{ post.updatedAt }} </p>
        </div>
        
      </div>


      <!-- Commentaires -->
      
      <div v-if="post.comments > 0" class="text-center btn-comment">
        <hr>
        <button v-if="afficherLesCommentaires == false" @click="afficheComments(post.id)"  class="btn">Afficher les {{ post.comments }} commentaires</button>
        <button v-if="afficherLesCommentaires" @click="masquerComments(post.id)" class="btn" >Masquer les commentaires</button>
      </div>
      
      
      
      <div v-for="(comment,index) in commentsPost" :key="index">
        <!-- on affiche que sur le post -->
        <div v-if="comment.PostId == post.id && afficherLesCommentaires">
          <hr>
          <router-link :to="{name: 'ProfilUser', params: {userId: comment.UserId }}">
            <p v-if="comment.User" class="user-comment"> {{ comment.User.first_name }} {{ comment.User.last_name }}</p>
          </router-link>
          <p> {{ comment.description }}</p>
          
        </div>
      </div>
      

    </div>
  </section> 


  <!-- pagination -->
    <div class="offset">
    <nav aria-label="Page navigation example">
		<ul class="pagination">
			<li class="page-item">
				<button type="button" class="page-link" v-if="page != 1" @click="page--"> Previous </button>
			</li>
			<li class="page-item">
				<button type="button" class="page-link" v-for="(pageNumber, index) in pages.slice(page-1, page+10)" :key="index" @click="page = pageNumber"> {{pageNumber}} </button>
			</li>
			<li class="page-item">
				<button type="button" @click="page++" v-if="page < pages.length" class="page-link"> Next </button>
			</li>
		</ul>
	</nav>	
  </div>


</div>
</template>



<script>
import { mapState } from 'vuex'
import NewPost from '@/components/newPost.vue'
//import CommentsPost from '@/components/commentsPost.vue'

export default {
    components: {
      NewPost,
      //CommentsPost
    },

    data() {
        return{
          page: 1,
          perPage: 10,
          pages: [],
          afficheNewPost: false,
          afficherLesCommentaires: false
        }
    },

    mounted(){
        this.$store.dispatch('getAllPosts')
        console.log("state.posts", this.$store.state.posts)
    },


    computed: {
        ...mapState({
            posts: ["posts"],
            commentsPost: ["commentsOfPost"]
        }),

        displayedPosts () {
          return this.paginate(this.posts);
        },

        formDate(date) {
          console.log(date)
          const dateStr = JSON.parse(date)
          return  new Date(dateStr)
        }
    },


    methods:{

      afficheComments(postId) {
        this.$store.dispatch('getCommentsPost', postId)
        .then(()=> {
          this.afficherLesCommentaires = true
          })
      },

      masquerComments(){
        this.afficherLesCommentaires = false
      },





		setPages () {
			let numberOfPages = Math.ceil(this.posts.length / this.perPage);
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

    addLike(postId) {
        this.$store.dispatch('addOrRemoveLike', postId)
        .then(()=> {
            this.$router.go();
        })
    },
  },       

	watch: {
		posts () {
			this.setPages();
		}
	},

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
  margin: 20px auto;  
  
}
.pagination{
  justify-content: center;
}








.post{
  margin: 20px 20px;
  padding:30px 40px 10px;
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
    color:rgb(0, 68, 255)
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
  margin-left: -5px;
  margin-top:5px;
  margin-bottom: -10px;
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

hr{
  margin:0 ;
}
.user-comment{
  margin:10px 0;
}


</style>
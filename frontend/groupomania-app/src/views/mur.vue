<template>
<div v-if="$store.state.user.userId != -1">
  <section>

    <!-- Button new post -->
    <div class="text-center">
        <button @click="afficheNewPost = true" class="btn btn-primary">Ajouter un post</button>
        <div v-if="afficheNewPost">
          <NewPost/>
        </div>
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
              <p v-if="post.User">post de  {{ post.User.first_name }} {{ post.User.last_name }} </p> 
          </router-link>
          
          <span class="spacer"></span>
  
          <p v-if="post.createdAt === post.updatedAt"> le : {{ post.createdAt }} </p> 
          <p v-else>modifié le : {{ post.updatedAt }} </p>
        </div>
          <!-- <CommentsPost postId={post.id} ></CommentsPost> -->



          <!-- Commentaires -->
          <div v-if="commentsPost">
            <div v-if="post.Comments.length != 0" class="text-center">
              <hr>
              <button class="btn" @click="afficheComments(post.id)">Afficher les commentaires</button>
            </div>

            <div v-if="afficherLesCommentaires">
              <p> post index {{ index }} </p> 
                

              <div v-for="(comment,index) in commentsPost" :key="index">
                  <p v-if="comment.User"> {{ comment.User.first_name }} {{ comment.User.last_name }}</p>
                  <p> {{ comment.description }}</p>
              </div>

              
          </div>
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
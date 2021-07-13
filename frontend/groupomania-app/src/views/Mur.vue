<template>
<section v-if="$store.state.user.userId != -1">

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

        <router-link :to="{name: 'Post', params: {postId: post.id}}">
          <!-- info user -->
          <div class="row information-post">
            
            <div class="col-xs-3">
              <router-link :to="{name: 'ProfilUser', params: {userId: post.UserId }} " v-if="post.User">
                <img :src="post.User.avatarUrl" alt="">
              </router-link>
            </div>
    
            <div class="col-xs-9">
              <div class="row ml-3">
                <router-link :to="{name: 'ProfilUser', params: {userId: post.UserId }} " v-if="post.User">
                  <p class="post_user-name">{{ post.User.first_name }} {{ post.User.last_name }} </p>
                </router-link>
              </div>
    
              <div class="row ml-3">
                <p v-if="post.createdAt === post.updatedAt"> il y a {{ moment(post.createdAt).fromNow(true) }} </p> 
                <p v-else>modifié il y a {{ moment(post.updatedAt).fromNow(true) }}  </p>
              </div>
            </div>
    
          </div>
    
          <!-- Titre / Description -->
          <div class="description-post">
            <h2 v-if="post.title">  {{ post.title }} </h2>
            <p class="description"> {{ post.description }} </p>
            <div class="img-post">
              <img v-if="post.img_url != null" :src="post.img_url" alt="photo" >
            </div>
            
          </div>
        </router-link>
    
        <hr>
    
        <!-- Likes / Btn commentaire / editer -->
        <div class="row interaction-post">
          
          <div class="col-3 text-center">
            <button @click="addLike(post.id)" class="btn btn-like">
              <i class="bi bi-hand-thumbs-up"></i>
              <span class="like"> {{ post.likes }} </span>
            </button> 
          </div>
    
    
          <div class="col-3 text-center">
            <button v-if="afficherInputCommentaire == false" @click="afficherInputCommentaire = true"  class="btn btn-personnaliser">Répondre</button>
            <button v-if="afficherInputCommentaire" @click="afficherInputCommentaire = false"  class="btn btn-personnaliser">Masquer</button>
          </div>
    
          
          <div class="col-3 text-center">
            <router-link :to="{name: 'Post', params: {postId: post.id}}">
              <div v-if="post.UserId">
                <button v-if="post.UserId == user.userId" class="btn btn-personnaliser">Editer</button>
              </div>
            </router-link>
          </div>
    
          <div class="col-3 text-center">
            <router-link :to="{name: 'Post', params: {postId: post.id}}">
              <div v-if="post.UserId">
                <button v-if="post.UserId == user.userId" class="btn">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </router-link>
          </div>
            
        </div>
        
        <!-- Espace commentaires -->
        <div class="comments">

            <!-- Bouton Commentaires -->
            <div v-if="post.comments == 1" class="text-center">
              <hr>
              <button v-if="post.displayComment == false" @click="afficheComments(post.id)" class="btn btn-primary btn-comment">Afficher le commentaire</button>
              <button v-if="post.displayComment" @click="masquerComments(post.id)" class="btn btn-primary btn-comment" >Masquer le commentaire</button>
            </div>

            <div v-else-if="post.comments > 1" class="text-center">
              <hr>
              <button v-if="post.displayComment == false" @click="afficheComments(post.id)" class="btn btn-primary btn-comment">Afficher les {{ post.comments }} commentaires</button>
              <button v-if="post.displayComment" @click="masquerComments(post.id)" class="btn btn-primary btn-comment" >Masquer les commentaires</button>
            </div>




            <!-- Commentaires -->
            <div v-for="(comment,index) in commentsPost" :key="index">
            
              <!-- on affiche que sur le post -->
              <div v-if="comment.PostId == post.id && post.displayComment">
              
              
                <div class="row" v-if="comment.User">
                  <div class="col-xs-3 comments_image-comment" >
                    <img :src="comment.User.avatarUrl" alt="">
                  </div>

                  <div class="col-xs-9">
                    <router-link :to="{name: 'ProfilUser', params: {userId: comment.UserId }}">
                      <p class="user-comment"> {{ comment.User.first_name }} {{ comment.User.last_name }}</p>
                    </router-link>
                    <p v-if="comment.createdAt === comment.updatedAt" class="comment-date"> il y a {{ moment(comment.createdAt).fromNow(true) }} </p> 
                    <p v-else class="comment-date">modifié il y a {{ moment(comment.updatedAt).fromNow(true) }}  </p>
                  </div>
                </div>

                <div>
                  <p class="description-comment"> {{ comment.description }}</p>
                </div>
                <hr>
              </div>
            </div>

            <!-- Ajouter un commentaire -->
            <div v-if="afficherInputCommentaire || post.displayComment" class="row new-comment">
                <div class="col-md-10 col-sm-9">
                    <textarea v-model="descriptionComment" class="form-control" placeholder="Ajouter un commentaire" rows="2"></textarea>
                </div>
                <div class="col-md-2 col-sm-3 text-center">
                    <button @click="newComment(post.id)" class="btn btn-primary mt-2">
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
        
      
    </div>

    <!-- pagination -->
    
    <nav aria-label="pagination">
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


</section> 
</template>



<script>
import { mapGetters, mapState } from 'vuex'
import NewPost from '@/components/newPost.vue'
let moment = require("moment");

export default {
  components: {
    NewPost,
    //CommentsPost
  },

  data() {
      return{
        moment: moment,
        page: 1,
        perPage: 10,
        pages: [],
        afficheNewPost: false,
        afficherLesCommentaires: false,
        afficherInputCommentaire: false,
        descriptionComment:''
      }
  },



  computed: {
    ...mapState({
        commentsPost: ["commentsOfPost"],
        user: ['user']
    }),
    ...mapGetters({
        posts: ['get_all_posts']
    }),

    displayedPosts () {
      return this.paginate(this.posts);
    },
  },
    mounted(){
      this.$store.dispatch('getAllPosts')
      console.log("state.posts", this.$store.getters.posts)
      moment.locale('fr');
  },

  methods:{
    afficheComments(postId) {
      this.$store.dispatch('getCommentsPost', postId)
      .then(()=> {
          this.$store.dispatch('displayComments', postId)
      })
    },

    masquerComments(postId){
      this.$store.dispatch('hideComments', postId)
    },





    newComment(postId) {
      let data = {
        'description': this.descriptionComment,
        'postId' : postId
      }
      this.$store.dispatch('newComment', data)
      .then(()=> {
          this.$router.go()
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

.post{
    margin: 20px 20px 0 20px;
    padding:20px 30px 0 30px;
    background-color:#ececec;
    border: solid 1px #cfcfcf;
    border-radius: 5px;

    a{
        text-decoration: none;

        & h2, .description{
            color:black;
        }
    }

    hr{
        margin:0
    }
}


.information-post{
    font-size:0.8rem;
    color:#808080;
    
    img{
        height:60px;
        width: 60px;
    }

    .post_user-name{
        font-size:1rem;
        margin-top:8px;
        margin-bottom: 0px;
    }
}




.description-post{
    margin: 10px 10px 0 10px;

    .img-post{
        margin-bottom:10px;
        display:flex;
        justify-content: center;

        img{
            max-width: 500px;
            width:100%;
            margin-left:auto;
            margin-right:auto;
        }
    }

    .description{
        margin:10px auto 20px auto;
        text-align: justify;
    }

}





.interaction-post{
    margin: 0px 0 0px 0;

    .btn:hover{
        background-color: rgb(226, 226, 226);
    }

    .btn-like{
        padding-top:3px;

        .like{
            margin-left:10px;
            padding-top: -5px!important;
        }
    }

    .btn-personnaliser{
        margin-top:5px;
    }
    
    .btn-delete{
        margin-left:0px;
    }
}




/* Comments */
.comments {
    margin-left:10px;

    img{
        height:40px;
        width:40px;
        margin-top:20px;
    }
    .comments_image-comment{
        margin-right:20px;
    }
    .user-comment{
        margin-top:22px;
        margin-bottom:0;
        font-size:0.8rem;
    }
    .comment-date{
        font-size:0.8rem;
        margin-bottom:0
    }
    .btn-comment{
        margin-top:5px;
        margin-bottom: 5px;
    }
    .description-comment{
        margin: 15px 10px 20px;
    }
    .new-comment{
        margin-top:20px;
        margin-bottom: 10px;
    }
}




/* Bootstrap icons */
.bi{
    font-size:1.5rem;

    &.bi-hand-thumbs-up{
        color:rgb(37, 37, 204);
        margin:0;
        padding:0;
    }
    &.bi-trash{
        color:rgb(223, 24, 24);
    }
}


/* Pagination */
.pagination{
    margin: 20px ; 
    justify-content: center;

    button.page-link {
        display: inline-block;
    }
    button.page-link {
        font-size: 20px;
        color: #29b3ed;
        font-weight: 500;
    }
}

</style>
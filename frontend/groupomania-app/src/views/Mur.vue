<template>
<section v-if="user.userId != -1">

    <!-- Button new post -->
    <div class="text-center">
        <button v-if="afficheNewPost == false" @click="afficheNewPost = true" class="btn btn-primary">Ajouter un post</button>
        <button v-if="afficheNewPost" @click="afficheNewPost = false" class="btn btn-primary">Masquer</button>
    </div>
    <div v-if="afficheNewPost">
        <NewPost @post-created="updateDisplayBtn"/>
    </div>

  
    <!-- Affiche tout les posts -->
    <div v-for="(post, index) in displayedPosts" :key="index" class="post">

        <router-link :to="{name: 'Post', params: {postId: post.id}}">
          
            <UserHeader :post="post"></UserHeader>
    
            <!-- Titre / Description -->
            <div class="description-post">
                <p class="title" v-if="post.title">  {{ post.title }} </p>
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
            <button @click="addLike(post.id)" @mouseover="listUsersLike(post.id)" @mouseleave="hideListUsersLike(post.id)" class="btn btn-like">
              <i v-if="post.userAlreadyLike" class="bi bi-hand-thumbs-up-fill"></i>
              <i v-else-if="post.userAlreadyLike == false || undefined" class="bi bi-hand-thumbs-up"></i>
              
              <span v-if="post.Likes">
                  <span v-if="post.Likes.length > 0" class="like"> {{ post.Likes.length }} </span>
              </span>
            </button> 
          </div>

          <div class="col-3 text-center">
            <button v-if="post.displayInputComment == false" @click="afficherInputCommentaire(post.id)"  class="btn btn-personnaliser"><i class="bi bi-reply"></i></button>
            <button v-if="post.displayInputComment" @click="masquerInputCommentaire(post.id) "  class="btn btn-personnaliser"><i class="bi bi-reply-fill"></i></button>
          </div>
    
          
          <div class="col-3 text-center">
            <router-link :to="{name: 'Post', params: {postId: post.id}}">
              <div v-if="post.UserId">
                <button v-if="post.UserId == user.userId || user.isAdmin" class="btn"><i class="bi bi-pencil-square"></i></button>
              </div>
            </router-link>
          </div>
    
          <div class="col-3 text-center">
              <div v-if="post.UserId">
                <button v-if="post.UserId == user.userId || user.isAdmin" @click="(deletePost(post.id))" class="btn">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
          </div>
            
        </div>




        <!-- list users qui on liké le post -->
        <span class="liste-users-flotant" v-if="post.Likes">
            <p class="list-users-like-post" v-if="post.Likes.length > 0 && post.listUsersLike"> Liké par&ensp;
            <span v-for="(like, index) in post.Likes" :key="index" >
                <router-link :to="{name: 'Profil', params: {userId: like.UserId }}">
                    {{ like.User.first_name }} {{ like.User.last_name }}&ensp;
                </router-link>
                <!-- <p v-if="like.UserId == user.userId"> J'ai liké </p> -->
            </span>
            </p>
        </span>
        



        
        <!-- Espace commentaires -->
        <div class="comments" v-if="post.Comments">

            <!-- Bouton Commentaires -->
            <div v-if="post.Comments.length == 1" class="text-center">
              <hr>
              <button v-if="post.displayComment == false" @click="afficheComments(post.id)" class="btn btn-primary btn-comment">Afficher le commentaire</button>
              <button v-if="post.displayComment" @click="masquerComments(post.id)" class="btn btn-primary btn-comment" >Masquer le commentaire</button>
            </div>

            <div v-else-if="post.Comments.length > 1" class="text-center">
              <hr>
              <button v-if="post.displayComment == false" @click="afficheComments(post.id)" class="btn btn-primary btn-comment">Afficher les {{ post.Comments.length }} commentaires</button>
              <button v-if="post.displayComment" @click="masquerComments(post.id)" class="btn btn-primary btn-comment" >Masquer les commentaires</button>
            </div>




            <!-- Commentaires -->
            <div v-if="post.displayComment">
                <Comments :comments="commentsPost" ></Comments>
            </div>
            

            <!-- Ajouter un commentaire -->
            <div v-if="post.displayInputComment || post.displayComment" class="row new-comment">
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
import { mapGetters } from 'vuex'
import NewPost from '@/components/newPost.vue'
import UserHeader from '@/components/userHeader.vue'
import Comments from '@/components/commentsPost.vue'


let moment = require("moment");

export default {
    components: {
        NewPost,
        UserHeader,
        Comments
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
            descriptionComment:'',
        }
    },



    computed: {
        ...mapGetters({
            posts: ['get_all_posts'],
            user: ['get_user'],
            commentsPost: ['get_comments_post']
        }),
        displayedPosts () {
            return this.paginate(this.posts);
        },
    },


    mounted(){
        moment.locale('fr');
        this.$store.dispatch('getAllPosts')
        //this.posts.forEach(post => {
        //    post.Likes.forEach(like => {
        //        
        //        if(like.UserId == this.user.userId) {
        //            post.userAlreadyLike = true
        //        } else {
        //            post.userAlreadyLike = false
        //        }
        //    })
        //});

    },


    beforeUpdate() {
        this.posts.forEach(post => {

            post.userAlreadyLike = false
            post.Likes.forEach(like => {
                if(like.UserId == this.user.userId) {
                    post.userAlreadyLike = true
                }
            })
        });
    },

    methods:{

    // Affichage
        updateDisplayBtn() {
            this.afficheNewPost = false
        },

        afficheComments(postId) {
          this.$store.dispatch('getCommentsPost', postId)
          .then(()=> {
              this.$store.dispatch('displayComments', postId)
          })
        },
        masquerComments(postId){
          this.$store.dispatch('hideComments', postId)
        },






        afficherInputCommentaire(postId){
            this.$store.dispatch('displayInputComments', postId)
        },
        masquerInputCommentaire(postId){
            this.$store.dispatch('hideInputComments', postId)
        },


        listUsersLike(postId){
            this.$store.dispatch('displayListUsersLike', postId)
        },
        hideListUsersLike(postId){
            this.$store.dispatch('hideListUsersLike', postId)
        },



    // Interaction
        deletePost(postId) {
            if(confirm('Etes vous sur ?')) {
                this.$store.dispatch('deletePost', postId)
                .then(()=> {
                    this.$router.go()
                })
            }
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

        addLike(postId) {
            this.$store.dispatch('addOrRemoveLike', postId)
            .then(()=> {
                this.$router.go()
            })
        },

    // Pagination
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
    margin: 10px 10px;
    padding:20px 20px 0 20px;
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
        margin-left:20px;
    }

    .post_user-name{
        font-size:1rem;
        margin-top:8px;
        margin-bottom: 0px;
    }
}




.description-post{
    margin: 10px 10px 0 10px;

    .title{
        font-size:1.3rem;
        color:black;
    }

    .img-post{
        margin-bottom:10px;

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

    .btn:hover{
        background-color: rgb(226, 226, 226);
    }

    .btn-like{
        padding-top:3px;
        margin-bottom:-3px;

        .like{
            margin-left:10px;
            padding-top: -5px!important;
        }
    }

    .btn-personnaliser{
        margin-top:-2px;
        padding:0 10px 2px 10px;
    }
}

.list-users-like-post{
    font-size:0.8rem;
    margin-bottom:5px;
    margin-left:5px;
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

    &.bi-hand-thumbs-up, &.bi-hand-thumbs-up-fill{
        color:rgb(37, 37, 204);
        margin:0;
        padding:0;
    }
    &.bi-trash{
        color:rgb(223, 24, 24);
    }
    &.bi-pencil-square{
        color:rgb(37, 37, 204);
    }
    &.bi-box-arrow-in-left{
        color:rgb(37, 37, 204);
    }
    &.bi-reply, &.bi-reply-fill{
        font-size: 2rem;
        margin:0;   
        padding:0;
        color:rgb(37, 37, 204)
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
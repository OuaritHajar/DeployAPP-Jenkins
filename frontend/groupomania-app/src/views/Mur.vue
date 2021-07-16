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

        <InteractionPost :post="post"></InteractionPost>
        



        
        <!-- Espace commentaires -->
        <div class="comments" v-if="post.Comments">

            <!-- Afficher input commentaire -->
            <div v-if="post.displayInputComment" class="row new-comment">
                <div class="col-md-10 col-sm-9">
                    <textarea v-model="descriptionComment" class="form-control" placeholder="Ajouter un commentaire" rows="2"></textarea>
                </div>
                <div class="col-md-2 col-sm-3 text-center">
                    <button @click="newComment(post.id)" class="btn btn-primary mt-2">
                        Envoyer
                    </button>
                </div>
            </div>


            <!-- Bouton Commentaires -->
            <div v-if="post.Comments.length == 1" class="text-center">
                <hr>
                <button 
                v-if="post.displayComment == false" 
                @click="afficheComments(post.id)" 
                class="btn btn-primary btn-comment">
                    Afficher le commentaire
                </button>

                <button 
                v-if="post.displayComment"
                @click="masquerComments(post.id)"
                class="btn btn-primary btn-comment">
                    Masquer le commentaire
                </button>
            </div>

            <div v-else-if="post.Comments.length > 1" class="text-center">
              <hr>
              <button v-if="post.displayComment == false" @click="afficheComments(post.id)" class="btn btn-primary btn-comment">Afficher les {{ post.Comments.length }} commentaires</button>
              <button v-if="post.displayComment" @click="masquerComments(post.id)" class="btn btn-primary btn-comment" >Masquer les commentaires</button>
            </div>




            <!-- Commentaires -->
            <Comments v-if="post.displayComment" :comments="commentsPost" ></Comments>
            
            
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
import InteractionPost from '@/components/interactionPost.vue'


let moment = require("moment");

export default {
    components: {
        NewPost,
        UserHeader,
        Comments,
        InteractionPost
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



    // Interaction
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
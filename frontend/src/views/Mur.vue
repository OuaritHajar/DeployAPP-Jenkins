<template>
<div v-if="user.userId != -1" class="row">
    
    <aside class="col-md-3">
        <AsideMur :profil="profil" />
    </aside>



    <main class="col-md-9">

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
                <NewComment v-if="post.displayInputComment" :post="post" />


                <!-- Bouton Commentaires -->
                <div v-if="post.Comments.length == 1" class="text-center">
                    <hr>
                    <button v-if="post.displayComment == false" 
                    @click="afficheComments(post.id)" 
                    class="btn btn-primary">
                        Afficher le commentaire
                    </button>

                    <button v-if="post.displayComment" 
                    @click="masquerComments(post.id)" 
                    class="btn btn-primary">
                        Masquer le commentaire
                    </button>
                </div>

                <div v-else-if="post.Comments.length > 1" class="text-center">
                    <hr>
                    <button v-if="post.displayComment == false" 
                    @click="afficheComments(post.id)" 
                    class="btn btn-primary">
                        Afficher les {{ post.Comments.length }} commentaires
                    </button>

                    <button v-if="post.displayComment" 
                    @click="masquerComments(post.id)" 
                    class="btn btn-primary">
                        Masquer les commentaires
                    </button>
                </div>



                <!-- Commentaires -->
                <Comments v-if="post.displayComment" :comments="post.Comments" :post="post" ></Comments>

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


    </main> 


</div>
</template>








<script>
import { mapGetters } from 'vuex'
import NewPost from '@/components/post/newPost.vue'
import UserHeader from '@/components/user/userHeader.vue'
import Comments from '@/components/comment/commentsPost.vue'
import InteractionPost from '@/components/post/interactionPost.vue'
import NewComment from '@/components/comment/newComment.vue'
import AsideMur from'@/components/home/aside-mur.vue'


let moment = require("moment");

export default {
    components: {
        NewPost,
        UserHeader,
        Comments,
        InteractionPost,
        NewComment,
        AsideMur
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
            profil: ['get_user_profil']
        }),
        displayedPosts () {
            return this.paginate(this.posts);
        },
    },

    mounted(){
        moment.locale('fr');
            this.$store.dispatch('getAllPosts')
            this.$store.dispatch('getProfilUsers', this.user.userId )
        
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
            this.$store.dispatch('displayComments', postId)
        },
        masquerComments(postId){
          this.$store.dispatch('hideComments', postId)
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
		},
	},
}
</script>




<style scoped lang="scss">

aside{
    margin-bottom:10px;
    padding-right:0;
}
.post{
    margin: 10px 0px;
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


.comments{
    button{
        margin:10px;
    }
}




.description-post{
    margin: 10px 10px 0 10px;

    .title{
        font-size:1.3rem;
        color:black;
    }

    .img-post{
        margin-bottom:20px;
        display: flex;

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
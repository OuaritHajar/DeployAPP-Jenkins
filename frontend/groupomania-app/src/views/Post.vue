<template>
    <section>
        <div class="post">

             <!-- info user -->
            <div class="row information-post">

                <!-- Avatar -->
                <div class="col-xs-3">
                    <router-link :to="{name: 'Profil', params: {userId: post.UserId }} " v-if="post.User">
                        <img :src="post.User.avatarUrl" alt="">
                    </router-link>
                </div>
                
                <div class="col-xs-9">
                    <!-- Nom / Prénom -->
                    <div class="row ml-3 post__user-name">
                        <router-link :to="{name: 'Profil', params: {userId: post.UserId }} " v-if="post.User">
                            <p class="post_user-name">{{ post.User.first_name }} {{ post.User.last_name }} </p>
                        </router-link>
                    </div>

                    <!-- Date -->
                    <div class="row ml-3">
                        <p v-if="post.createdAt === post.updatedAt"> il y a {{ moment(post.createdAt).fromNow(true) }} </p> 
                        <p v-else>modifié il y a {{ moment(post.updatedAt).fromNow(true) }}  </p>
                        <p></p>
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



            <!-- Edit post -->
            <div v-if="post.userId === user.userId || user.isAdmin" class="edit-post">
                <hr>
                <form enctype="multipart/form-data">
                    <fieldset>
                        <legend class="text-center">Modifier votre post</legend>
                        <hr>
                        <div >
                        
                            <!-- Titre-->
                            <div class="form-group ">
                                <label for="inputTitle">Titre :</label>
                                <input v-model="titlePost" type="text" class="form-control gray" id="inputTitlePost"> 
                            </div>

                            <!-- Message -->
                            <div class="form-group">
                                <label for="inputMessage">Message:</label>
                                <textarea v-model="descriptionPost" type="text" class="form-control gray" rows="2" id="inputMessage">  </textarea>
                            </div>

                            <!-- Image-->
                            <div class="form-group">
                                <label for="inputImg_url">Image : </label>
                                <input type="file" @change="uploadImage($event)" class="file-input">
                            </div>
                        </div>

                        <div class="text-center">
                            <button @click="editPost()" class="btn btn-primary">
                                Modifier
                            </button>

                            <span class="spacer"></span>
                            <button @click="deletePost(post.id)" class="btn btn-danger">
                                Supprimer
                            </button>
                        </div>
                        

                    </fieldset>
                </form>
            </div>
        </div>

        <!-- Ajouter un commentaire -->
        <div class="new-comment">
            <form class="form-inline">  

                <div class="col-sm-10">
                    <textarea v-model="descriptionComment" class="form-control" placeholder="Ajouter un commentaire" rows="3"></textarea>
                </div>
                <div class="col-sm-2 text-center">
                    <button @click="newComment(post.id)" class="btn btn-primary ">
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
        

        <!-- Commentaires -->
        <div v-for="(comment, index) in comments" :key="index" class="comments">

            <div class="row" v-if="comment.User">
                <div class="col-2 col-md-2 comments_image-comment" >
                  <img :src="comment.User.avatarUrl" alt="">
                </div>

                <div class="col-7 col-md-8">
                    <router-link :to="{name: 'Profil', params: {userId: comment.UserId }}">
                        <p class="user-comment"> {{ comment.User.first_name }} {{ comment.User.last_name }}</p>
                    </router-link>
                    <p class="comment-date" v-if="comment.createdAt === comment.updatedAt"> il y a {{ moment(comment.createdAt).fromNow(true) }} </p> 
                    <p class="comment-date" v-else >modifié il y a {{ moment(comment.updatedAt).fromNow(true) }}  </p>
                </div>

                <div cass="col-3 col-md-2" v-if="comment.UserId === user.userId || user.isAdmin" >
                    <button @click="editComment(comment.id, comment.editDescriptionComment)" class="btn btn-primary">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <span class="spacer"></span>
                    <button @click="deleteComment(comment.id)" class="btn btn-danger">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>

            <p class="description-comment"> {{ comment.description }} </p>

            <!-- Edit comment -->
            <div v-if="comment.UserId === user.userId || user.isAdmin" >
                <form>
                    <textarea v-model="comment.editDescriptionComment" type="text" class="form-control" id="inputTitle" rows="1"></textarea>
                </form>
            </div>
        </div>
        

    </section>
</template>



<script>
import {  mapGetters } from 'vuex'
let moment = require("moment");

export default {
    data(){
        return{
            moment:moment,

            titlePost: '',
            descriptionPost: this.$store.getters.get_one_post.description,
            file: null,

            descriptionComment: "",
        }
    },

    
    mounted(){
        this.$store.dispatch('getOnePost', this.$route.params.postId )
    },
    

    computed: {
        ...mapGetters({
            user:['get_user'],
            post:['get_one_post'],
            comments: ['get_comments_post']
        }),
    },


    methods: {
        uploadImage(event) {
            this.file = event.target.files[0]
            console.log(this.file)
        },


        editPost() {
            let data = new FormData();

            data.append('title', this.titlePost);
            data.append('description', this.descriptionPost);
            data.append('img_url', this.file); 

            this.$store.dispatch('editPost', data)
            .then(()=> {
                this.$router.push('/mur')
            })
        },



        deletePost(postId) {
            if(confirm('Etes vous sur ?')) {
                this.$store.dispatch('deletePost', postId)
                .then(()=> {
                    this.$router.go(-1)
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


        editComment(commentId, description){
            let data = { 
                'description': description,
                'commentId': commentId    
            }
            this.$store.dispatch('editComment', data)
            .then(()=> {
                this.$router.go()
            })
        },



        deleteComment(commentId){
            if(confirm('Etes vous sur de vouloir supprimer le commentaire ?')){
                let data = {'commentId': commentId }
                this.$store.dispatch('deleteComment', data)
                .then(()=> {
                    this.$router.go()
                })
            }
        },

        

        addLike(postId) {
            this.$store.dispatch('addOrRemoveLike', postId)
            .then(()=> {
                this.$router.go()
            })
        }
    },
    
}
</script>



<style scoped lang="scss">

.post{
    margin: 20px 20px;
    padding:30px 40px 20px;
    
    background-color:#ececec;
    border: solid 1px #cfcfcf;
    border-radius: 10px;
    
    img{
        max-width: 400px;
        width:100%;

        margin-left:auto;
        margin-right:auto;
    }

    .spacer{
        margin:0 10px 0 10px
    }

    hr{
        margin: 5px 0 5px 0;
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

.edit-post{

    .gray{
        color:gray
    }
    .file-input{
        margin-left:10px;
    }
}



.new-comment{
    margin:20px 20px;

    textarea.form-control{
        width:100%;
    }

    .col-sm-10,.col-sm-2{
        padding:0;
    }
}



.comments {
    background-color:#f0f0f0;
    border: solid 1px #e6e6e6;
    margin:0px 20px;
    padding:10px 20px;

    img{
        height:40px;
        width:40px;
    }
    .comments_image-comment{
        margin: 0px 0px
    }
    .user-comment{
        margin-bottom:0;
        font-size:0.8rem;
    }
    .comment-date{
        font-size:0.8rem;
        margin-bottom:0
    }
    .description-comment{
        margin: 10px 10px 10px;
    }
    .btn{
        margin-top:5px;
        padding:2px 5px;
    }
}


/* Bootstrap icons */
.bi{
    font-size: 1rem;
}



</style>
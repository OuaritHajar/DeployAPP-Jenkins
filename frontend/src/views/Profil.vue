<template>
    <section>
        <form>
        <fieldset>
            <legend>Votre profil utilisateur</legend>
            <hr />
            <div class="row">

                <!-- Avatar -->
                <div class="col-sm-5 interface-avatar">
                    <div class="avatar">
                        <img :src="theUser.avatarUrl" alt="avatar">
                    </div>
                    <div v-if="user.id == theUser.id || user.isAdmin" class="text-center">
                        <button v-if="modifAvatar != true" class="btn btn-secondary btn-avatar" @click="modifAvatar = true ">Changer l'avatar</button>
                        <button v-if="modifAvatar" class="btn btn-secondary btn-avatar" @click="modifAvatar = false">Annuler</button>
                    </div>
                </div>


                <!-- Information -->
                <div class="col-sm-7 information">
                    <div class="row">
                        <div class="col-3">
                            <label for="inputLastName">Prénom: </label>
                        </div>
                        <div class="col-3 mr-auto">
                            <span>{{ theUser.last_name }}</span>
                        </div>
                        <span v-if="(user.id === theUser.id || user.isAdmin)">
                            <button class="btn btn-primary" v-if="inputLastName != true" @click="inputLastName = true"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-primary" v-if="inputLastName" @click="inputLastName = false"><i class="bi bi-pencil-fill"></i></button>
                        </span>
                        
                        <input v-if="(user.id === theUser.id || user.isAdmin) && inputLastName" v-model="lastName" type="text" class="form-control">
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <label for="inputFirstName">Nom:  </label>
                        </div>
                        <div class="col-3 mr-auto">
                            <span>{{ theUser.first_name }}</span>
                        </div>
                        <span v-if="(user.id === theUser.id || user.isAdmin)">
                            <button class="btn btn-primary" v-if="inputFirstName != true" @click="inputFirstName = true"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-primary" v-if="inputFirstName" @click="inputFirstName = false"><i class="bi bi-pencil-fill"></i></button>
                        </span>
                        
                        <input v-if="( user.id === theUser.id || user.isAdmin ) && inputFirstName" v-model="firstName" type="text" class="form-control">  
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <p>Email :  </p>
                        </div>
                        <div class="col-auto">
                            <span>{{ theUser.email }}</span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <p>Crée le  </p>
                        </div>
                        <div class="col-auto">
                            <span>{{ moment(theUser.createdAt).format("DD-MM-YYYY HH:mm") }}</span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <p>Sexe :</p>
                        </div>
                        <div class="col-auto">
                            <span>{{ sexe }}</span>
                        </div>
                    </div>


                    <div class="text-center">
                        <button v-if="inputLastName || inputFirstName" @click="editUser(theUser.id)" class="btn btn-primary">
                            Modifier
                        </button>
                        <button @click="deleteUser()" class="btn btn-danger">
                            Supprimer
                        </button>
                    </div>
                </div>

                

            </div>


            <!-- Interface de modification -->
            <EditAvatar v-if="modifAvatar" :user="theUser"></EditAvatar>
            <hr>

            <div class="col-sm-12 activity">
                <div class="row text-center">
                    <div class="col-4 activity-posts">
                        <p v-if="theUser.Posts" class="text-overflowe"> {{ theUser.Posts.length }}&nbsp;Post(s) </p>
                    </div>
                    <div class="col-4 activity-comments">
                        <p v-if="theUser.Comments" class="text-overflowe">{{ theUser.Comments.length }}&nbsp;Commentaire(s)  </p>
                    </div>
                    <div class="col-4 activity-likes">
                        <p v-if="theUser.Likes" class="text-overflowe">{{ theUser.Likes.length }}&nbsp;Like(s)  </p>
                    </div>
                </div>
            </div>



<!--
            <div v-for="activity in allActivity" :key="activity.createdAt" class="activities">
                <p > 
                    le {{ moment(activity.createdAt).format("DD/MM") }}
                    à {{ moment(activity.createdAt).format("HH:mm") }},
                    {{ user.first_name }}
                    a
                    {{ activity.activityType }}

                    <span v-if="activity.Post">
                        <router-link :to="{name: 'Post', params: {postId: activity.Post.id}}" class="nav-link">
                            le post 
                        </router-link>
                        de 
                        <router-link  :to="{name: 'Profil', params: {userId: activity.Post.User.id}}" class="nav-link">
                          {{ activity.Post.User.first_name }} {{ activity.Post.User.last_name }}
                        </router-link>
                    </span>
                    
                </p>
            </div>
                -->

            
                

        </fieldset>
    </form>
    </section>
</template>



<script>
import { mapGetters } from 'vuex'
import EditAvatar from '@/components/user/editAvatar.vue'
let moment = require("moment");

export default {
    components:{
        EditAvatar
    },
    //props:['test'],
    data(){
        return{
            moment: moment,

            lastName:'',
            firstName: '',

            modifAvatar:false,
            
            inputFirstName: false,
            inputLastName: false,

        }
    },

    computed: {
        ...mapGetters({
            theUser:['get_user_profil'],
            user: ['get_user']
        }),

        //allActivity() {
        //    let activities = []
        //    this.user.Comments.forEach(comment => {
        //        comment.activityType = 'commenté'
        //        activities.push(comment)
        //    })
        //    this.user.Posts.forEach(post => {
        //        post.activityType = 'ajouté un post'
        //        activities.push(post)
        //    })
        //    this.user.Likes.forEach(like => {
        //        like.activityType = 'aimé'
        //        activities.push(like)
        //    })
        //    activities.sort(function(a, b) {
        //        a = new Date(a.createdAt);
        //        b = new Date(b.createdAt);
        //        return a>b ? -1 : a<b ? 1 : 0;
        //    });
        //    return activities 
        //},

        sexe(){
            if(this.theUser.sexe) {
                return 'Femme'
            }else {
                return 'Homme'
            }
        }
    },

    mounted(){
        this.$store.dispatch('getProfilUsers', this.$route.params.userId )
    },

    methods: {

        editUser(userId) {
            let formData = new FormData()

            formData.append('first_name', this.firstName);
            formData.append('last_name', this.lastName);
            formData.append('userId', userId); 

            this.$store.dispatch('editUser', formData )
            .then(()=> {
                this.inputFirstName = false
                this.inputLastName = false
                this.modifAvatar = false
            })
        },

        deleteUser() {
            if(confirm("Voulez vous vraiment supprimer votre compte ?")){
                this.$store.dispatch('deleteUser', this.$route.params.userId)
                .then(()=> {
                    this.$store.dispatch('logout')
                    .then(()=> {
                        this.$router.push('/')
                    })
                })
            }
        },
    },
}
</script>

<style scoped lang="scss">
form{
    margin: 10px 10px;
    padding: 10px 10px 0;
}
.activities .nav-link{
    margin:0;
    padding:0;
    display: inline;
    
}


.interface-avatar{
    margin-top:20px;

    .avatar {
        display: flex;
        justify-content: center;
        margin: 0 5px;

        img{
            width: 200px;
            height: 200px;
            margin-bottom:20px
        }
    }
    .btn-avatar{
        margin-bottom:20px;
    }
}



.information{
    margin-top:20px;
    padding-left:30px;

    .col-3, .col-auto{
        padding:0;
    }
}

.activity{
    background-color:#ececec;
    border: solid 1px #cfcfcf;
    border-radius: 10px;

    margin: 15px 0 15px 0;
    .activity-posts, .activity-likes{
        margin-top:15px;
    }
    .activity-comments{
        border-right:solid 1px #cfcfcf;
        border-left:solid 1px #cfcfcf;
        padding-top:15px;
    }
    .text-overflowe{
        overflow: hidden;
        text-overflow: ellipsis;
    }
}








</style>
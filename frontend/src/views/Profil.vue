<template>
    <section>
        <form>
        <fieldset>
            <legend>Votre profil utilisateur</legend>
            <hr />
            <div class="row">

                <!-- Avatar -->
                <div class="col-sm-5">
                    <div class="avatar">
                        <img :src="user.avatarUrl" alt="avatar">
                    </div>
                    <div class="text-center">
                        <button v-if="modifAvatar != true" class="btn btn-secondary btn-avatar" @click="modifAvatar = true ">Modifier</button>
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
                            <span>{{ user.last_name }}</span>
                        </div>
                        <button class="btn btn-primary" v-if="inputLastName != true" @click="inputLastName = true"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-primary" v-if="inputLastName" @click="inputLastName = false"><i class="bi bi-pencil-fill"></i></button>

                        <input v-if="(thisUser.userId === user.id || thisUser.isAdmin) && inputLastName" v-model="lastName" type="text" class="form-control">
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <label for="inputFirstName">Nom:  </label>
                        </div>
                        <div class="col-3 mr-auto">
                            <span>{{ user.first_name }}</span>
                        </div>
                        <button class="btn btn-primary" v-if="inputFirstName != true" @click="inputFirstName = true"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-primary" v-if="inputFirstName" @click="inputFirstName = false"><i class="bi bi-pencil-fill"></i></button>

                        <input v-if="( thisUser.userId === user.id || thisUser.isAdmin ) && inputFirstName" v-model="firstName" type="text" class="form-control">  
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <p>Email :  </p>
                        </div>
                        <div class="col-auto">
                            <span>{{ user.email }}</span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3">
                            <p>Crée le  </p>
                        </div>
                        <div class="col-auto">
                            <span>{{ moment(user.createdAt).format("DD-MM-YYYY HH:mm") }}</span>
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
                        <button @click="editUser()" class="btn btn-primary">
                            Modifier
                        </button>
                        <button @click="deleteUser()" class="btn btn-danger">
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>


            <!-- Interface de modification -->
            <div v-if="modifAvatar" class="row interface-image">

                <div class="col-sm-12 interface-avatar">
                    <p class="text-center interface-title">Choisir un avatar</p>
                    <form>
                        <div class="row">
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar1.png">
                                </label>
                                <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value=" 1">
                            </div>

                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar2.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "2">
                            </div>

                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar3.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "3">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar4.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "4">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar5.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "5">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar6.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "6">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar7.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "7">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar8.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "8">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar9.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "9">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar10.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "10">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar11.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "11">
                            </div>
                            <div class="col-3 col-sm-2 col-lg-1 text-center">
                                <label class="" for="inlineRadio1">
                                    <img src="http://localhost:3000/images/static/avatar/avatar12.png">
                                </label>
                                 <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value= "12">
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="col-sm-12 interface-photo">
                    <p class="text-center interface-title">Choisir une photo</p>
                    <form action="">
                        <input type="file">
                    </form>
                    
                    
                </div>
            </div>

        </fieldset>
    </form>
    </section>
</template>



<script>
import { mapGetters } from 'vuex'
let moment = require("moment");

export default {
    data(){
        return{
            moment: moment,

            lastName:'',
            firstName: '',
            
            inputFirstName: false,
            inputLastName: false,
            modifAvatar:false,

            avatarValue: ''
        }
    },

    computed: {
        ...mapGetters({
            user:['get_user_profil'],
            thisUser: ['get_user']
        }),

        avatarUrl() {
            if(this.avatarValue != null) {
                return 'http://localhost:3000/images/static/avatar/avatar' + this.avatarValue + '.png'
            } else {
                return null
            }
        },

        sexe(){
            if(this.user.sexe) {
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

        editUser() {
            let data = {
                first_name: this.firstName,
                last_name: this.lastName,
                avatarUrl:  this.avatarUrl,
                userId: this.$route.params.userId
            }
            this.$store.dispatch('editUser', data)
            .then(()=> {
                this.inputFirstName = false
                this.inputLastName = false
                this.modifAvatar = false
                //this.$router.go()
                
            })
        },

        deleteUser() {
            if(confirm("Voulez vous vraiment supprimer votre compte ?")){
                this.$store.dispatch('deleteUser', this.$route.params.userId)
                .then(()=> {
                    this.$router.push("/logout")
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
hr{
    margin:0 0 30px;
}
.information{
    padding-left:30px;

    .col-3, .col-auto{
        padding:0;
    }
}
.interface-image{
    margin-top:30px;

    img{
        width:70px;
    }
    .col-sm-2, .col-2{
        margin:0;
        padding:0;
    }
    .inputAvatar{
        display: flex;
        margin-left:auto;
        margin-right:auto;
        margin-bottom:20px;

    }
}
.interface-title{
    margin-top:10px;
    margin-bottom:0;
    font-size:1.2rem;
}

.interface-avatar{
    background-color:#ececec;
    border: solid 1px #cfcfcf;
    border-radius: 10px;
}
.interface-photo{
    background-color:#ececec;
    border: solid 1px #cfcfcf;
    border-radius: 10px;
}

</style>
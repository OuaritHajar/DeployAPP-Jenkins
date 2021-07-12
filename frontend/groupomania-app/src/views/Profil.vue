<template>
    <section>
        <form class="form">
        <fieldset>
            <legend>Votre profil utilisateur</legend>
            <hr />

            <!-- Nom / Prenom -->
            <div class="row">
                <div class="avatar col-sm-4">
                    <img :src="user.avatarUrl" alt="avatar">
                </div>

                <div class="col-sm-7 offset-sm-1">
                    <div class="form-group">
                        <label for="inputLastName">Prénom : {{ user.last_name }}</label>
                        <input v-model="lastName" type="text" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="inputFirstName">Nom : {{ user.first_name }} </label>
                        <input v-model="firstName" type="text" class="form-control">  
                    </div>

                    <div>
                        <p>Email : {{ user.email }} </p>
                        <p>Crée le {{ moment(user.createdAt).format("DD-MM-YYYY HH:mm") }} </p>
                        
                    </div>
                    <button @click="editUser()" class="btn btn-primary">
                        Modifier
                    </button>
                    <button @click="deleteUser()" class="btn btn-danger">
                        Supprimer
                    </button>
                </div>
            </div>

        </fieldset>
    </form>
    </section>
</template>



<script>
import { mapState } from 'vuex'
let moment = require("moment");

export default {
    data(){
        return{
            lastName:'',
            firstName: '',
            moment: moment
        }
    },

    computed: {
        ...mapState({
            user:['profil']
        })
    },

    mounted(){
        this.$store.dispatch('getProfil' )
    },

    methods: {
        editUser() {
            let data = {
                first_name: this.firstName,
                last_name: this.lastName
            }
            this.$store.dispatch('editUser', data)
        },

        deleteUser() {
            if(confirm("Voulez vous vraiment supprimer votre compte ?")){
                this.$store.dispatch('deleteUser')
                .then(()=> {
                    this.$router.push("/logout")
                })
            }
        },
    },
}
</script>

<style scoped lang="scss">
.form{
    margin: 20px 20px;
    padding:20px 20px;
}
.avatar {
    display: flex;
    justify-content: center;

    img{
        width: 200px;
        height: 200px;
        margin-bottom:20px
    }
}


</style>
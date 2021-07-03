<template>
    <section>
        <form class="form">
        <fieldset>
            <legend>Votre profil utilisateur</legend>
            <hr />

            <!-- Nom / Prenom -->
            <div>
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
                    <p>Crée le {{ user.createdAt }} </p>
                </div>
            </div>

            <button @click="editUser()" class="btn btn-primary">
                Modifier
            </button>
            <button @click="deleteUser" class="btn btn-danger">
                Supprimer
            </button>
        </fieldset>
    </form>
    </section>
</template>



<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
    data(){
        return{
            lastName:'',
            firstName:'',              //this.$store.state.userProfil.first_name
        }
    },

    computed: {
        ...mapState({
            user:['userProfil']
        })
    },



    mounted(){
        this.$store.dispatch('getUserProfil',this.$route.params.userId )
        //this.lastName = this.$store.state.userProfil.last_name
    },



    methods: {
        editUser() {

            //let data = new FormData();
            //data.append('first_name', this.firstName )
            //data.append('last_name', this.lastName)
            //console.log('donné de ma data pour modifier l\'user', data )


            let data = {
                first_name: this.firstName,
                last_name: this.lastName
            }
            console.log('donné de ma data pour modifier l\'user', data )

            this.$store.dispatch('editUser',this.$route.params.userId, data)




            //axios.put("http://localhost:3000/api/users/"+ this.$route.params.userId, {
            //    first_name: this.firstName,
            //    last_name: this.lastName
            //},{
            //    headers: {
            //        Authorization: "Bearer " + localStorage.token
            //    }
            //})
            //.then(response => {
            //    console.log(response.data)
            //})
            //.catch(error => {
            //    console.log(error); 
            //});
        },

        deleteUser() {
            axios.delete("http://localhost:3000/api/users/"+ this.$route.params.userId,{
                headers: {
                    Authorization: "Bearer " + localStorage.token
                }
            })
            .then( () => {
                window.location = "http://localhost:8080/index.html#/logout"
            })
            .catch(error => {
                console.log(error); 
            });
        },
    },
}
</script>

<style scoped>
.form{
    margin: 20px 20px;
    padding:20px 20px;
}
</style>
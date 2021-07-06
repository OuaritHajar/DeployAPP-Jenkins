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
            <button @click="deleteUser()" class="btn btn-danger">
                Supprimer
            </button>
        </fieldset>
    </form>
    </section>
</template>



<script>
import { mapState } from 'vuex'

export default {
    data(){
        return{
            lastName:'',
            firstName: ''
        }
    },

    computed: {
        ...mapState({
            user:['userProfil']
        })
    },



    mounted(){
        this.$store.dispatch('getUserProfil' )
        //this.lastName = this.$store.state.userProfil.last_name
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
            this.$store.dispatch('deleteUser')
            .then(()=> {
                this.$router.push("/logout")
            })
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
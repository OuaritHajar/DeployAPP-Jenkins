<template>
    <section>
        <form class="form">
        <fieldset>
            <legend>Votre profil utilisateur</legend>
            <hr />

            <!-- Nom / Prenom -->
            <div>
                <p>{{ user.avatarUrl }}</p>
                <img src="@/assets/avatar/avatar1.png" alt="avatar">
                <img :src="user.avatarUrl">

                <v-avatar>
        <img
          src="https://cdn.vuetifyjs.com/images/john.jpg"
          alt="John"
        >
      </v-avatar>



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
    vuetify: new Vuetify(),
    data(){
        return{
            lastName:'',
            firstName: '',
            avatarUrl: 'https://picsum.photos/id/1005/600/200'
        }
    },

    computed: {
        ...mapState({
            user:['profil']
        })
    },



    mounted(){
        this.$store.dispatch('getProfil' )
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
            if(confirm("Do you really want to delete?")){
                this.$store.dispatch('deleteUser')
                .then(()=> {
                    this.$router.push("/logout")
                })
            }
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
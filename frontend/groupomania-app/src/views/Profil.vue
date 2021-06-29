<template>
    <section>
        <form enctype="multipart/form-data" class="form">
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

            <button @click="editUser" class="btn btn-primary">
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

export default {
    data(){
        return{
            user:{},
            lastName:'',
            firstName:''
        }
    },
    methods: {
        editUser() {
            axios.put("http://localhost:3000/api/users/"+ this.$route.params.userId, {
                first_name: this.firstName,
                last_name: this.lastName
            },{
                headers: {
                    Authorization: "Bearer " + localStorage.token
                }
            })
        },
        addLike() {
            axios.post("http://localhost:3000/api/posts/" + this.$route.params.postId + "/like", "" , {
              headers: {
                Authorization: "Bearer " + localStorage.token
              }
            })
            .then(response => {
              console.log(response)
              // reload like 

            })
            .catch(error => {
            console.log(error); 
            });
        }
    },
    mounted(){
        axios.get("http://localhost:3000/api/users/" + this.$route.params.userId, {
          headers: {
            Authorization: "Bearer " + localStorage.token
          }
        })
        .then(response => {
          console.log(response.data)
          this.user = response.data
        })
        .catch(error => {
        console.log(error); 
        });
    }
}
</script>

<style scoped>
.form{
    margin: 20px 20px;
    padding:20px 20px;
}
</style>
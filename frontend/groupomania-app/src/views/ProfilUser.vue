<template>
    <section>
        <div>
            <p>Nom : {{ user.first_name }} </p>
            <p>Prenom : {{ user.last_name }}</p>
            <p>Email : {{ user.email }}</p>
            <p>Inscrit depuis {{ user.createdAt }}</p>
        </div>
    </section>
</template>


<script>
import axios from 'axios'


export default {
    data() {
        return{
            user:{}
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
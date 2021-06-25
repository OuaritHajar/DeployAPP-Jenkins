<template>
  <div id="app">
    <section>
      <h1>Connexion</h1>
      <form class="form-login">
          <div class="form-row">

              <!-- Email-->
              <div class="form-group col-md-6">
                  <label for="inputEmail">Email :</label>
                  <input v-model="email" type="email" class="form-control" id="inputEmail" required
                      placeholder="exemple@messagerie.fr">
              </div>

              <!-- Ville -->
              <div class="form-group col-md-6">
                  <label for="inputPassword">Mot de passe :</label>
                  <input v-model="password" type="password" class="form-control" id="inputPassword" required>
              </div>
          </div>

          <!-- sauvegarde donné-->
          <div class="form-group">
              <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="gridCheck">
                  <label class="form-check-label" for="gridCheck">
                      Sauvegardez les informations
                  </label>
              </div>
          </div>

          <button @click="userLogin" type="button" class="btn btn-primary">
              Entrer
          </button>

      </form>
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default{
  name:'App',
  data() {
    return{
      email:'',
      password:''
    }
  },
  methods:{
    userLogin(){
      try{
        axios.post("http://localhost:3000/api/users/login", {
          email:this.email,
          password:this.password
        })
        .then(function(response){
            console.log("response :",response.data)

            if (response.data.token) {
              localStorage.setItem('token', response.data.token)

              // UserId in vueX
            //this.$store.dispatch("updateUserId", response.data.userId)


            }
            
          
            

            window.location = "http://localhost:8080/index.html#/Mur"
        })
        .catch(function(error){
            console.error(error)
        })
      }
      catch(err) {
        console.error(err)
      }
    }  
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello{
  border: black solid 2px
}
</style>

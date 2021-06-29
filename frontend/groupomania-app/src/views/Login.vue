<template>
  <div id="login">
    <section>
        <form>
            <fieldset>
                <legend>Connection</legend>
                <hr>
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

                <button @click="userLogin" class="btn btn-primary">
                    Entrer
                </button>
            </fieldset>
        </form>
    </section>
  </div>
</template>

<script>

import { ref } from "vue"
import { useStore } from 'vuex'
import axios from 'axios'


export default{
  setup() {
      const store = useStore()

      const email = ref('')
      const password = ref('')
      const userId = ref('')

      function userLogin(e) {
        e.preventDefault()
        try{
          axios.post("http://localhost:3000/api/users/login", {
            email:email.value,
            password:password.value
          })
          .then(function(response){
              console.log("response :",response.data)
  
              if (response.data.token) {
                  // save token in localStorage
                  localStorage.setItem('token', response.data.token)
  
                  // save userId in vuex 
                  store.dispatch('updateUserId', response.data.userId)
              }
              window.location = "http://localhost:8080/index.html#/mur"
          })
          .catch(function(error){
              console.error(error)
          })
        }
        catch(err) {
          console.error(err)
        }
      }

      return {
        userId,
        password,
        email,
        userLogin
      }
  },
  mounted() {
    const store = useStore()

    // vide token et userId
    localStorage.clear()
    store.dispatch('updateUserId', 0)
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form{
  border:solid rgb(151, 151, 151) 1px;
  border-radius: 5px;
  box-shadow: 2px 2px 2px 2px #757575;

  margin:20px 20px;
  padding:20px 20px;
}
hr{
    margin-top:0;
}
</style>

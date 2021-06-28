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
                <p> userId: {{ user_id }}</p>
            </fieldset>
        </form>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default{
  name:'login',
  data() {
    return{
      email:'',
      password:''
    }
  },
  computed:{
      ...mapGetters(["user_id"])
  },
  methods:{
    userLogin(e){
        e.preventDefault()
      try{
        axios.post("http://localhost:3000/api/users/login", {
          email:this.email,
          password:this.password
        })
        .then(function(response){
            console.log("response :",response.data)

            if (response.data.token) {
                localStorage.setItem('token', response.data.token)

                // UserId in vueX ou pas...
                sessionStorage.setItem('userId', JSON.parse(response.data.userId))
                console.log(sessionStorage)
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
    },
  },
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

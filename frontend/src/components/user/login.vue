<template>
  <div id="login">
    <section>
        <form>
            <fieldset>
                <legend>Connexion</legend>
                <hr>
                <div class="form-row">

                    <!-- Email-->
                    <div class="form-group col-sm-6">
                        <input v-model="email" type="email" class="form-control" id="inputEmail" required
                            placeholder="Adresse email">
                    </div>

                    <!-- Mot de passe -->
                    <div class="form-group col-sm-4">
                        <input v-model="password" type="password" class="form-control" id="inputPassword" placeholder="Mot de passe" required>
                        <span class="status"> {{ loginError }} </span>
                    </div>

                    <!-- Bouton -->
                    <div class="col-sm-2 text-center">
                        <button @click="userLog()" class="btn btn-primary">
                            Connexion
                        </button>
                        <span class="status"> {{ status }} </span>
                        
                    </div>
                </div>

                <!-- sauvegarde donné
                <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="gridCheck">
                        <label class="form-check-label" for="gridCheck">
                            Sauvegardez les informations
                        </label>
                    </div>
                </div>-->

                
                
                
                
                <hr>
            </fieldset>
        </form>
    </section>
  </div>
</template>



<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return{
            email:"",
            password:""
        }
    },

    computed: {
        ...mapGetters({
            status: ['get_status'],
            loginError: ['get_login_error']
        })
    },

    methods: {
        userLog: function () {
            this.$store.dispatch("login", {
                email: this.email,
                password: this.password,
            })
            .then((response) => {
                if(response){
                    this.$router.push({ name: 'Posts', params: { page : 1} })
                    this.$emit('userConnected')
                }
            })
            .catch((error) =>{
              console.log(error);
            });

            
        },
    }
}
</script>



<style scoped>
form{

    margin:0px 10vw;
    padding:0px 0px;
}
hr{
    margin-top:0;
}
.status{
    margin-left:10px;
    font-weight: bold;
}

</style>

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

                <button @click="userLog()" class="btn btn-primary">
                    Entrer
                </button>
                <p> {{ $store.state.status }} </p>
            </fieldset>
        </form>
    </section>
  </div>
</template>



<script>
export default {
    data() {
        return{
            email:"",
            password:""
        }
    },
    computed: {
        
    },
    methods: {
        userLog: function () {
            this.$store.dispatch("login", {
                email: this.email,
                password: this.password,
            })
            .then(() => {
              this.$router.push("/Mur");
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

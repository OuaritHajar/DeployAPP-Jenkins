<template>
  <div id="login">
    <section>
        <p class="text-center deconnection">Vous êtes déconnecté</p>
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
                            Sauvegardez les inwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwformations
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

export default{
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
            const self = this;
            this.$store.dispatch("login", {
                email: this.email,
                password: this.password,
            })
            .then(function () {
              self.$router.push("/Mur");
            },
            function (error) {
              console.log(error);
            });
        },
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
.deconnection{
    font-size:1.5rem;
}
</style>

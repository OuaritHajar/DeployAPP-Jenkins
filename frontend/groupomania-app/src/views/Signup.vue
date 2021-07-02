<template>
    <div id="signup">
        <form>
        <fieldset>
            <legend>Inscription</legend>
            <hr />
            <p>Saisissez vos informations pour créer un compte utilisateur.</p>

            <!-- Nom / Prenom -->
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="inputFirstName">Nom : </label>
                    <input v-model="firstName" type="text" class="form-control" placeholder="Nom"
                        required>
                </div>
                <div class="form-group col-md-6">
                    <label for="inputLastName">Prénom :</label>
                    <input v-model="lastName" type="text" class="form-control" placeholder="Prénom"
                        required>
                </div>
            </div>
            <div class="form-row">

                <!-- Email-->
                <div class="form-group col-md-6">
                    <label for="inputEmail">Email</label>
                    <input v-model="email" type="email" class="form-control" required
                        placeholder="exemple@messagerie.fr">
                </div>

                <!-- Mot de passe -->
                <div class="form-group col-md-6">
                    <label for="inputPassword">Mot de passe</label>
                    <input v-model="password" type="password" class="form-control" required>
                </div>
            </div>

            <!-- Accepter les conditions -->
            <div class="form-group">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value=""
                        id="invalidCheck30" required>
                    <label class="form-check-label" for="invalidCheck30">
                        Agree to terms and conditions
                    </label>
                    <div class="invalid-feedback">
                        You must agree before submitting.
                    </div>
                </div>
            </div>

            <button @click="signup" class="btn btn-primary">
                S'enregistrer
            </button>
            <p> {{ $store.state.status }} </p>
        </fieldset>
    </form>
    </div> 
</template>



<script>

export default {
    data() {
        return {
            firstName:'',
            lastName:'',
            email: '',
            password: ''
        }
    },
    methods: {
        signup() {
            const self = this;

            this.$store.dispatch('signup', {
                first_name:this.firstName,
                last_name:this.lastName,
                email:this.email,
                password:this.password
            })
            .then(() => {
                self.$router.push("/login");
                
            })
            .catch((error) => {
                console.log(error)
            })
        }
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
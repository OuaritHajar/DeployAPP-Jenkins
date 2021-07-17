<template>
    <div id="signup">
        <form>
        <fieldset>
            <legend class="text-center">Inscription</legend>
            <hr />
            <p class="text-center">Saisissez vos informations pour créer un compte utilisateur.</p>

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

            <!-- Sexe -->
            <div class="form-row">
                <div class="form-group col-md-12">
                    <label class="mr-2">Sexe : </label>
                    <div class="form-check-inline">
                      <input v-model="sexe" class="form-check-input" type="radio" value="0" id="inlineCheckbox1">
                      <label class="form-check-label" for="inlineCheckbox1"> Homme</label>
                    </div>
                    <div class="form-check-inline">
                      <input v-model="sexe" class="form-check-input" type="radio" value="1" id="inlineCheckbox2">
                      <label class="form-check-label" for="inlineCheckbox2">Femme</label>
                    </div>
                </div>
            </div>


            <div class="form-row">
                <!-- Email-->
                <div class="form-group col-md-6">
                    <label for="inputEmail">Email :</label>
                    <input v-model="email" type="email" class="form-control" required
                        placeholder="exemple@messagerie.fr">
                </div>

                <!-- Mot de passe -->
                <div class="form-group col-md-6">
                    <label for="inputPassword">Mot de passe :</label>
                    <input v-model="password" type="password" class="form-control" required>
                </div>
            </div>

            <!-- Accepter les conditions -->
            <div class="form-group">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="invalidCheck1" required>
                    <label class="form-check-label" for="invalidCheck1">
                        Accepter les termes et conditions.
                    </label>
                    <div class="invalid-feedback">
                        Vous devez accepter les termes et conditions.
                    </div>
                </div>
            </div>

            <button @click="signup" class="btn btn-primary">
                S'enregistrer
            </button>
            <span class="status"> {{ status }} </span>
        </fieldset>
    </form>
    </div> 
</template>



<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            firstName:'',
            lastName:'',
            email: '',
            password: '',
            sexe:''
        }
    },
    computed:{
        ...mapGetters({
            status : ['get_status']
        })
    },

    methods: {
        signup() {
            this.$store.dispatch('signup', {
                first_name:this.firstName,
                last_name:this.lastName,
                email:this.email,
                password:this.password,
                sexe: this.sexe
            })
            .then(() => {
                this.$router.push("/login");
                
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
.status{
    margin-left:10px;
    font-weight: bold;
}

</style>
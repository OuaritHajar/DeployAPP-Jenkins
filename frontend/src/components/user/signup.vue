<template>
    <form>
    <fieldset>
        <legend class="text-center">Inscription</legend>
        <hr>
        <p class="text-center">Saisissez vos informations pour créer un compte utilisateur.</p>


        <!-- list erreurs -->
        <p v-if="errors.length">
          <b>Veuillez vérifier ces informations : </b>
          <ul>
            <li v-for="error in errors" :key="error.id">{{ error }}</li>
          </ul>
        </p>




        <!-- Nom / Prenom -->
        <div class="form-row">
            <div class="form-group col-lg-6 col-md-12 col-sm-6">
                <label for="inputFirstName">Prénom :</label>
                
                <input v-model="firstName" type="text" class="form-control" id="inputFirstName"  placeholder="Prénom" required>
                
                <div class="invalid-feedback">
                    Vous devez accepter les termes et conditions.
                </div>
            </div>
            <div class="form-group col-lg-6 col-md-12 col-sm-6">
                <label for="inputLastName">Nom :</label>
                <input v-model="lastName" type="text" class="form-control" id="inputLastName" placeholder="Nom" required
                    >
            </div>
        </div>


        <div class="form-row">
            <!-- Email-->
            <div class="form-group col-lg-6 col-md-12 col-sm-6">
                <label for="inputEmail">Email :</label>
                <input v-model="email" type="email" class="form-control"
                    placeholder="exemple@messagerie.fr" required>
            </div>
            <!-- Mot de passe -->
            <div class="form-group col-lg-6 col-md-12 col-sm-6">
                <label for="inputPassword">Mot de passe :</label>
                <input v-model="password" type="password" class="form-control" required>
            </div>
        </div>


        <!-- Sexe -->
        <div class="form-row">
            <div class="form-group col-md-12">
                <label class="mr-2">Sexe : </label>
                <div class="form-check-inline">
                  <input v-model="sexe" class="form-check-input" type="radio" value="0" id="inlineCheckbox1" >
                  <label class="form-check-label" for="inlineCheckbox1"> Homme</label>
                </div>
                <div class="form-check-inline">
                  <input v-model="sexe" class="form-check-input" type="radio" value="1" id="inlineCheckbox2" >
                  <label class="form-check-label" for="inlineCheckbox2">Femme</label>
                </div>
            </div>
        </div>


        <!-- Accepter les conditions -->
        <div class="form-group">
            <div class="form-check">
                <input v-model="condition" class="form-check-input" type="checkbox" id="invalidCheck1" required>
                <label class="form-check-label" for="invalidCheck1">
                    Accepter les termes et conditions.
                </label>
            </div>
        </div>
        <p> condition valeur : {{ condition }} </p>

        <!-- Bouton -->
        <div class="text-center">
            <button @click="signup" class="btn btn-primary">
                S'enregistrer
            </button>

            <p class="status"> {{ status }} </p>
        </div>

    </fieldset>
</form>
</template>



<script>
import { mapGetters } from 'vuex'


export default {
    data() {
        return {
            //errors: [],
            condition: false,
            firstName:'',
            lastName:'',
            email: '',
            password: '',
            sexe:''
        }
    },
    computed:{
        ...mapGetters({
            status : ['get_status_signup'],
            errors: ['get_list_errors']
        })
    },

    methods: {
        //checkForm(e) {
        //    
        //    this.errors = []
//
        //    let instance = axios.create({
        //        baseURL: 'http://localhost:3000/api/',
        //    });
//
//
        //    if (!this.firstName) {
        //        this.errors.push('First Name required')
        //    }
        //    if (!this.lastName) {
        //        this.errors.push('Last Name required')
        //    }
        //    if (!this.email) {
        //        this.errors.push('EMail required')
        //    }
        //    if (!this.password) {
        //        this.errors.push('Password required')
        //    }
//
        //    
//
        //    let dataUser = {
        //        first_name:this.firstName,
        //        last_name:this.lastName,
        //        email:this.email,
        //        password:this.password,
        //        sexe: this.sexe
        //    }
//
//
        //    instance.post('users/signup', dataUser)
        //    .then( async response => {
        //        console.log(response)
        //        }
        //    )
//
        //    .catch(async error => {                   
        //        if (error.response.status === 400) {
        //            error.response.data.forEach(error => {
        //                this.errors.push(error.error)
        //            })
        //        } else if (error.response.status === 409) {
        //            this.errors.push(error.response.data.error)
        //        }
        //    })
//
//
        //    e.preventDefault()
        //    //this.signup()
        //},
//
        //validPassword(password) {
        //    const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
        //    return PASSWORD_REGEX.test(password)
        //},



        signup() {
            if (this.condition === true) {
                this.$store.dispatch('signup', {
                    first_name:this.firstName,
                    last_name:this.lastName,
                    email:this.email,
                    password:this.password,
                    sexe: this.sexe
                })
            }
            
        }
    }
}
</script>





<style scoped>
form{
  border:solid rgb(151, 151, 151) 1px;
  border-radius: 5px;
  box-shadow: 1px 1px 1px 1px #757575;
  background-color:#f8f8f8;

  margin:15px 10px;
  padding:10px 15px;
}
hr{
    margin:0;
}
.status{
    margin-left:10px;
    font-weight: bold;
}

</style>
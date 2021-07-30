<template>
  <form>
    <fieldset>
      <legend class="text-center">Inscription</legend>
      <hr />
      <p class="text-center mt-3">
        Saisissez vos informations pour créer un compte utilisateur.
      </p>

      <!-- list erreurs -->
      <div v-if="errors">
        <b>Veuillez vérifier ces informations : </b>
        <ul>
          <li v-for="error in errors" :key="error.id">{{ error }}</li>
        </ul>
      </div>

      <!-- Nom / Prenom -->
      <div class="form-row">
        <div class="form-group col-lg-6 col-md-12 col-sm-6">
          <label for="inputLastName">Nom :</label>
          <input
            v-model.trim="lastName"
            :class="{ 'is-invalid': submitted && v$.lastName.$error }"
            type="text"
            class="form-control"
            id="inputLastName"
            placeholder="Nom"
            required
          />
          <span v-if="submitted && v$.lastName.$error"
            >Entre 3 et 18 caractères.</span
          >
        </div>

        <div class="form-group col-lg-6 col-md-12 col-sm-6">
          <label for="inputFirstName">Prénom :</label>
          <input
            v-model.trim="firstName"
            :class="{ 'is-invalid': submitted && v$.firstName.$error }"
            type="text"
            class="form-control"
            id="inputFirstName"
            placeholder="Prénom"
            required
          />
          <span v-if="submitted && v$.firstName.$error"
            >Entre 3 et 18 caractères.</span
          >
        </div>
      </div>

      <div class="form-row">
        <!-- Mot de passe -->
        <div class="form-group col-lg-6 col-md-12 col-sm-6">
          <label for="inputPassword">Mot de passe :</label>
          <input
            v-model.trim="password"
            :class="{ 'is-invalid': submitted && v$.password.$error }"
            type="password"
            class="form-control"
            required
          />
          <span v-if="submitted && v$.password.$error"
            >Mot de passe invalide.</span
          >
        </div>

        <!-- Condirm mot de passe -->
        <div class="form-group col-lg-6 col-md-12 col-sm-6">
          <label for="inputPassword">Confirmer mot de passe :</label>
          <input
            v-model.trim="confirmPassword"
            :class="{ 'is-invalid': submitted && v$.confirmPassword.$error }"
            type="password"
            class="form-control"
            required
          />
          <span v-if="v$.confirmPassword.$error">Mot de passe différent</span>
        </div>
      </div>

      <!-- Email-->
      <div class="form-row">
        <div class="form-group col-12">
          <label for="inputEmail">Email :</label>

          <div class="form-row">
            <div class="col-10">
              <input
                v-model.trim="email"
                :class="{ 'is-invalid': submitted && v$.email.$error }"
                type="email"
                class="form-control"
                placeholder="exemple@messagerie.fr"
                required
              />
            </div>

            <button class="btn btn-primary col-2" @click="checkEmail()">
              Vérif.
            </button>
          </div>

          <div class="form-row">
            <div class="col-auto mr-auto pl-0">
              <span class="col-auto mr-auto" v-if="v$.email.$error"
                >Email invalide</span
              >
            </div>
            <div class="col-auto">
              <span v-if="emailAvailable" class="email-disponible">
                {{ emailAvailable }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sexe -->
      <div class="form-row">
        <div class="form-group col-md-12">
          <label class="mr-2">Sexe : </label>
          <div class="form-check-inline">
            <input
              v-model="sexe"
              class="form-check-input"
              type="radio"
              value="0"
              id="inlineCheckbox1"
            />
            <label class="form-check-label" for="inlineCheckbox1"> Homme</label>
          </div>
          <div class="form-check-inline">
            <input
              v-model="sexe"
              class="form-check-input"
              type="radio"
              value="1"
              id="inlineCheckbox2"
            />
            <label class="form-check-label" for="inlineCheckbox2">Femme</label>
          </div>
        </div>
      </div>

      <!-- Accepter les conditions -->
      <div class="form-group">
        <div class="form-check">
          <input
            v-model="condition"
            class="form-check-input"
            type="checkbox"
            id="invalidCheck1"
            required
          />
          <label class="form-check-label" for="invalidCheck1">
            Accepter <a href="/">les termes et conditions</a>.
          </label>
        </div>
      </div>

      <!-- Bouton -->
      <div class="text-center">
        <button @click="signup" class="btn btn-primary">S'enregistrer</button>
        <p class="status">{{ status }}</p>
      </div>
    </fieldset>
  </form>
</template>



<script>
import { mapGetters } from "vuex";

//import { reactive } from 'vue'
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  sameAs,
  helpers,
} from "@vuelidate/validators";

export default {
  setup() {
    return {
      v$: useVuelidate(),
    };
  },

  data() {
    return {
      //errors: [],
      condition: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      sexe: "",

      minLengthName: 3,
      maxLengthName: 19,

      emailAlreadyUsed: false,
      submitted: false,
    };
  },

  computed: {
    ...mapGetters({
      status: ["get_status_signup"],
      errors: ["get_list_errors"],
      emailAvailable: ["get_email_available"],
    }),
  },

  validations() {
    return {
      firstName: {
        required,
        minLength: minLength(this.minLengthName),
        maxLength: maxLength(this.maxLengthName),
        $autoDirty: true,
        $lazy: true,
      },
      lastName: {
        required,
        minLength: minLength(this.minLengthName),
        maxLength: maxLength(this.maxLengthName),
        $autoDirty: true,
        $lazy: true,
      },
      email: {
        required,
        email,
        $autoDirty: true,
        $lazy: true,
      },
      password: {
        required: helpers.regex(/^(?=.*\d).{4,12}$/),
        $autoDirty: true,
        $lazy: true,
      },
      confirmPassword: {
        sameAsPassword: sameAs(this.password),
        $autoDirty: true,
        $lazy: true,
      },
    };
  },

  methods: {
    checkEmail() {
      this.$store.dispatch("checkEmail", this.email);
    },

    signup() {
      this.submitted = true;
      this.checkEmail();

      if (this.condition === true) {
        this.$store.dispatch("signup", {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          password: this.password,
          sexe: this.sexe,
        });
      }
    },
  },
};
</script>





<style scoped>
form {
  border: solid rgb(151, 151, 151) 1px;
  border-radius: 5px;
  box-shadow: 1px 1px 1px 1px #757575;
  background-color: #f8f8f8;

  margin: 15px 10px;
  padding: 10px 15px;
}
hr {
  margin: 0;
}
.status {
  margin-left: 10px;
  font-weight: bold;
}
.email-disponible {
  width: 500px;
  text-align: right;
}
</style>
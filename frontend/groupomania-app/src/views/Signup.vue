<template>
    <form enctype="multipart/form-data" action="login.html" class="form-login">
        <fieldset>
            <legend>Inscription</legend>
            <p>Rentrer les informations pour créer un compte utilisateur</p>

            <!-- Nom / Prenom -->
            <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="inputFirstName">Nom : </label>
                    <input type="text" class="form-control" placeholder="Nom" name="nom"
                        id="inputFirstName" required>
                </div>
                <div class="form-group col-md-6">
                    <label for="inputLastName">Prénom :</label>
                    <input type="text" class="form-control" placeholder="Prénom" id="inputLastName"
                        required>
                </div>
            </div>
            <div class="form-row">

                <!-- Email-->
                <div class="form-group col-md-6">
                    <label for="inputEmail">Email</label>
                    <input type="email" class="form-control" id="inputEmail" required
                        placeholder="exemple@messagerie.fr">
                </div>

                <!-- Ville -->
                <div class="form-group col-md-6">
                    <label for="inputPassword">Mot de passe</label>
                    <input type="password" class="form-control" id="inputPassword" required>
                </div>
            </div>

            <!-- Accepter les conditions -->
            <div class="form-group">
                <div class="form-check">
                    <input class="form-check-input is-invalid" type="checkbox" value=""
                        id="invalidCheck30" required>
                    <label class="form-check-label" for="invalidCheck30">
                        Agree to terms and conditions
                    </label>
                    <div class="invalid-feedback">
                        You must agree before submitting.
                    </div>
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
            <button id="btnSubmit" type="button" class="btn btn-primary">
                S'enregistrer
            </button>
        </fieldset>
    </form>
</template>



<style scoped>
.form-login{
  width:80%;
  border:solid rgb(151, 151, 151) 1px;
  border-radius: 5px;
  box-shadow: 2px 2px 2px 2px #757575;

  margin-top:20px;
  margin-bottom:30px;
  padding:20px;
}


</style>
<template>
  <div class="hello">
    <section>
      <h1>Connexion</h1>
      <form class="form-login">
          <div class="form-row">

              <!-- Email-->
              <div class="form-group col-md-6">
                  <label for="inputEmail">Email :</label>
                  <input type="email" class="form-control" id="inputEmail" required
                      placeholder="exemple@messagerie.fr">
              </div>

              <!-- Ville -->
              <div class="form-group col-md-6">
                  <label for="inputPassword">Mot de passe :</label>
                  <input type="password" class="form-control" id="inputPassword" required>
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
              Entrer
          </button>
      </form>
    </section>
  </div>
</template>

<script>

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello{
  border: black solid 2px
}
</style>

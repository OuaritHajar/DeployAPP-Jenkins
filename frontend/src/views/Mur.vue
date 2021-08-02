<template>
  <div class="container-fluid mur">
    <div v-if="user && user.id != -1" class="row">
      <aside class="col-sm-3">
        <AsideMur />
      </aside>
      <main class="col-sm-9 col-md-8 col-lg-7">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>



<script>
import { mapGetters } from "vuex";
import AsideMur from "@/components/home/aside-mur.vue";
let moment = require("moment");

export default {
  components: {
    AsideMur,
  },
  data() {
    return {
      actuelPage: 1,
    };
  },
  mounted() {
    let token = localStorage.getItem('token')
    if (token){
      this.$store.dispatch("getUserAlreadyConnected");
    }

    moment.locale("fr");
    this.$store.dispatch("postsNumber");
  },

  computed: {
    ...mapGetters({
      user: ["get_user"],
    }),
  },
};
</script>




<style scoped lang="scss">
aside {
  margin-top: 30px;
}
</style>
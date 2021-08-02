<template>
  <div>
    <nav aria-label="pagination">
      <ul class="pagination">
        <li class="page_item mr-3">
          <button v-if="actuelPage != 1" type="button" class="btn btn-primary" @click="lastPage">
            Précédent
          </button>
        </li>

        <div class="liste-pages row">
          <li
            class="page_item"
            v-for="(page, index) in nombreDePages"
            :key="index"
          >
            <button
              v-if="actuelPage == index + 1"
              type="button"
              class="btn liste-pages__btn page-selected"
            >
              <span> {{ index + 1 }} </span>
            </button>
            <button
              v-else
              type="button"
              class="btn liste-pages__btn"
              @click="goThisPage(index + 1)"
            >
              <span> {{ index + 1 }} </span>
            </button>
          </li>
        </div>
        <li class="page_item ml-3">
          <button v-if="actuelPage != nombreDePages" type="button" class="btn btn-primary" @click="nextPage">
            Suivant
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>



<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      perPage: 5,
    };
  },

  mounted() {
    this.$store.dispatch("postsNumber");
  },

  computed: {
    ...mapGetters({
      user: ["get_user"],
      postsNumber: ["get_posts_number"],
    }),
    actuelPage() {
      return this.$route.params.page;
    },
    nombreDePages() {
      return Math.ceil(this.postsNumber / this.perPage);
    },
  },

  methods: {
    lastPage() {
      this.$router.push({
        name: "Posts",
        params: { page: JSON.parse(this.$route.params.page) - 1 },
      });
    },
    nextPage() {
      this.$router.push({
        name: "Posts",
        params: { page: JSON.parse(this.$route.params.page) + 1 },
      });
    },
    goThisPage(pageId) {
      this.$router.push({ name: "Posts", params: { page: pageId } });
    },
  },
};
</script>



<style lang="scss" scoped>
/* Pagination */
.pagination {
  margin: 20px;
  justify-content: center;

  button.page-link {
    display: inline-block;
  }
  button.page-link {
    font-size: 20px;
    color: #29b3ed;
  }
  .page-selected {
    background-color: rgb(156, 182, 238);
    font-weight: bold;
    color: black !important;
  }
  .liste-pages {
    background-color: rgb(0, 123, 255);
    border-radius: 5px;

    .liste-pages__btn {
      color: white;
      border: rgb(255, 255, 255) 0.2px solid;
      font-weight: 500;
    }
  }
}
</style>
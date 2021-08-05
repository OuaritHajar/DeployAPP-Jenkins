<template>
  <section>
    <form>
      <fieldset>
        <legend>Votre profil utilisateur</legend>
        <hr />
        <div class="row">
          <!-- Avatar -->
          <div class="col-sm-5 interface-avatar">
            <div class="avatar">
              <img :src="theUser.avatarUrl" alt="avatar" />
            </div>
            <div
              v-if="user.id === theUser.id || user.isAdmin"
              class="text-center"
            >
              <button
                v-if="modifAvatar != true"
                class="btn btn-secondary btn-avatar"
                @click="modifAvatar = true"
              >
                Changer l'avatar
              </button>
              <button
                v-if="modifAvatar"
                class="btn btn-secondary btn-avatar"
                @click="modifAvatar = false"
              >
                Annuler
              </button>
            </div>
          </div>

          <!-- Information -->
          <div class="col-sm-7 information">
            <!-- Prénom -->
            <div class="row">
              <div class="col-3">
                <label for="inputLastName">Prénom: </label>
              </div>
              <div class="col-3 mr-auto">
                <span>{{ theUser.last_name }}</span>
              </div>
              <span v-if="user.id === theUser.id || user.isAdmin">
                <button
                  class="btn btn-primary"
                  v-if="inputLastName != true"
                  @click="inputLastName = true"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-primary"
                  v-if="inputLastName"
                  @click="inputLastName = false"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
              </span>

              <input
                v-if="(user.id === theUser.id || user.isAdmin) && inputLastName"
                v-model="lastName"
                type="text"
                class="form-control"
              />
            </div>

            <!-- Nom -->
            <div class="row">
              <div class="col-3">
                <label for="inputFirstName">Nom: </label>
              </div>
              <div class="col-3 mr-auto">
                <span>{{ theUser.first_name }}</span>
              </div>
              <span v-if="user.id === theUser.id || user.isAdmin">
                <button
                  class="btn btn-primary"
                  v-if="inputFirstName != true"
                  @click="inputFirstName = true"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="btn btn-primary"
                  v-if="inputFirstName"
                  @click="inputFirstName = false"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
              </span>

              <input
                v-if="
                  (user.id === theUser.id || user.isAdmin) && inputFirstName
                "
                v-model="firstName"
                type="text"
                class="form-control"
              />
            </div>

            <!-- Email -->
            <div class="row">
              <div class="col-3">
                <p>Email :</p>
              </div>
              <div class="col-auto">
                <span>{{ theUser.email }}</span>
              </div>
            </div>

            <div class="row">
              <div class="col-3">
                <p>Crée le</p>
              </div>
              <div class="col-auto">
                <span>{{
                  moment(theUser.createdAt).format("DD-MM-YYYY HH:mm")
                }}</span>
              </div>
            </div>

            <div class="row">
              <div class="col-3">
                <p>Sexe :</p>
              </div>
              <div class="col-auto">
                <span>{{ sexe }}</span>
              </div>
            </div>

            <!-- Btn modifier/suprrimer -->
            <div
              v-if="user.id === theUser.id || user.isAdmin"
              class="text-center"
            >
              <button
                v-if="inputLastName || inputFirstName"
                @click="editUser(theUser.id, user.id)"
                class="btn btn-primary"
              >
                Modifier
              </button>
              <button
                data-toggle="modal"
                data-target="#deleteUser"
                class="btn btn-danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        <!-- Interface de modification avatar -->
        <EditAvatar
          v-if="modifAvatar"
          :theUser="theUser"
          :user="user"
          @avatar-updated="modifAvatar = false"
        ></EditAvatar>
        <hr />

        <!-- Resume activity -->
        <div class="col-sm-12 activity">
          <div class="row text-center">
            <div class="col-4 activity-posts">
              <p v-if="theUser.Posts" class="text-overflowe">
                {{ theUser.Posts.length }}&nbsp;Post(s)
              </p>
            </div>
            <div class="col-4 activity-comments">
              <p v-if="theUser.Comments" class="text-overflowe">
                {{ theUser.Comments.length }}&nbsp;Commentaire(s)
              </p>
            </div>
            <div class="col-4 activity-likes">
              <p v-if="theUser.Likes" class="text-overflowe">
                {{ theUser.Likes.length }}&nbsp;Like(s)
              </p>
            </div>
          </div>
        </div>

        <!-- Activity -->
        <div
          v-for="activity in allActivity"
          :key="activity.createdAt"
          class="activities"
        >
          <p v-if="activity">
            le {{ moment(activity.createdAt).format("DD/MM") }} à
            {{ moment(activity.createdAt).format("HH:mm") }},
            {{ theUser.first_name }}
            a
            {{ activity.activityType }}

            <span v-if="activity.Post">
              <router-link
                :to="{ name: 'Post', params: { postId: activity.Post.id } }"
                class="nav-link"
              >
                le post
              </router-link>
              de
              <span v-if="activity.Post.User">
                <router-link
                  :to="{
                    name: 'Profil',
                    params: { userId: activity.Post.User.id },
                  }"
                  class="nav-link"
                >
                  {{ activity.Post.User.first_name }}
                  {{ activity.Post.User.last_name }}
                </router-link>
              </span>
            </span>
          </p>
        </div>
      </fieldset>
    </form>

    <!-- Modal delete user -->
    <div
      class="modal fade"
      id="deleteUser"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Supprimer</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            Etes vous sur de vouloir supprimer votre compte ?
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">
              Annuler
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteUser()"
              data-dismiss="modal"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>



<script>
import { mapGetters } from "vuex";
import EditAvatar from "@/components/user/editAvatar.vue";
let moment = require("moment");

export default {
  components: {
    EditAvatar,
  },
  props: ["userId"],
  data() {
    return {
      moment: moment,
      lastName: "",
      firstName: "",
      modifAvatar: false,
      inputFirstName: false,
      inputLastName: false,
    };
  },
  mounted() {
    this.$store.dispatch("getProfilUsers", this.userId);
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch("getProfilUsers", to.params.userId);
    next();
  },

  computed: {
    ...mapGetters({
      theUser: ["get_user_profil"],
      user: ["get_user"],
    }),

    allActivity() {
      let activities = [];
      if (this.theUser.Comments) {
        this.theUser.Comments.forEach((comment) => {
          comment.activityType = "commenté";
          activities.push(comment);
        });
      }
      if (this.theUser.Posts) {
        this.theUser.Posts.forEach((post) => {
          post.activityType = "ajouté un nouveau post";
          activities.push(post);
        });
      }
      if (this.theUser.Likes) {
        this.theUser.Likes.forEach((like) => {
          like.activityType = "aimé";
          activities.push(like);
        });
      }

      activities.sort(function (a, b) {
        a = new Date(a.createdAt);
        b = new Date(b.createdAt);
        return a > b ? -1 : a < b ? 1 : 0;
      });
      return activities;
    },

    sexe() {
      if (this.theUser.sexe) {
        return "Femme";
      } else {
        return "Homme";
      }
    },
  },

  methods: {
    editUser(userIdProfil, userId) {
      let formData = new FormData();

      formData.append("first_name", this.firstName);
      formData.append("last_name", this.lastName);
      formData.append("userId", userId);
      formData.append("userIdProfil", userIdProfil);

      this.$store.dispatch("editUser", formData).then(() => {
        this.inputFirstName = false;
        this.inputLastName = false;
        this.modifAvatar = false;
      });
    },

    deleteUser() {
      this.$store
        .dispatch("deleteUser", {
          theUserId: this.$route.params.userId,
          user: this.user,
        })
        .then(() => {
          if (this.theUser.id === this.user.id) {
            this.$store.dispatch("logout", "Compte supprimer avec succès");
            this.$router.push("/");
          } else {
            this.$router.push({ name: "Posts", params: { page: 1 } });
          }
        });
    },
  },
};
</script>

<style scoped lang="scss">
form {
  margin: 10px 10px 150px 10px;
  padding: 10px 10px 0;
}
.activities .nav-link {
  margin: 0;
  padding: 0;
  display: inline;
}

.interface-avatar {
  margin-top: 20px;

  .avatar {
    display: flex;
    justify-content: center;
    margin: 0 5px;

    img {
      width: 200px;
      height: 200px;
      margin-bottom: 20px;
    }
  }
  .btn-avatar {
    margin-bottom: 20px;
  }
}

.information {
  margin-top: 20px;
  padding-left: 30px;

  .col-3,
  .col-auto {
    padding: 0;
  }
}

.activity {
  background-color: #ececec;
  border: solid 1px #cfcfcf;
  border-radius: 10px;

  margin: 15px 0 15px 0;
  .activity-posts,
  .activity-likes {
    margin-top: 15px;
  }
  .activity-comments {
    border-right: solid 1px #cfcfcf;
    border-left: solid 1px #cfcfcf;
    padding-top: 15px;
  }
  .text-overflowe {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
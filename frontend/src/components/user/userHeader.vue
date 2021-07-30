<template>
  <div class="row information-post">
    <!-- Avatar -->
    <div class="col-xs-3">
      <router-link
        :to="{ name: 'Profil', params: { userId: post.UserId } }"
        v-if="post.User"
      >
        <img :src="post.User.avatarUrl" alt="" />
      </router-link>
    </div>
    <!-- Nom / Prénom -->
    <div class="col-xs-9">
      <div class="row ml-3 post__user-name">
        <router-link
          :to="{ name: 'Profil', params: { userId: post.UserId } }"
          v-if="post.User"
        >
          <p class="post_user-name">
            {{ post.User.first_name }} {{ post.User.last_name }}
          </p>
        </router-link>
      </div>
      <!-- Date -->
      <div class="row ml-3">
        <p v-if="post.createdAt === post.updatedAt">
          il y a {{ moment(post.createdAt).fromNow(true) }}
        </p>
        <p v-else>modifié il y a {{ moment(post.updatedAt).fromNow(true) }}</p>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
let moment = require("moment");

export default {
  data() {
    return {
      moment: moment,
    };
  },
  props: ["post"],
};
</script>

<style scoped lang="scss">
.information-post {
  font-size: 0.8rem;
  color: #808080;

  img {
    margin-left: 16px;
    height: 60px;
    width: 60px;
  }

  .post_user-name {
    font-size: 1rem;
    margin-top: 8px;
    margin-bottom: 0px;
  }
}
</style>
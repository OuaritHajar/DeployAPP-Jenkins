<template>
    <div id="post" class="post">
        <p class="author">posté par : <a href="profil.html?userId=${response.userPost.id}"> 
            ${response.userPost.first_name} ${response.userPost.last_name}</a>
        </p>
        <h2>${response.post.title}</h2>
        <p class="description">${response.post.description}</p>
        <a href="post.html"><img src="img/image-post.jpg" alt="premier post poto"
                    class="image-post"></a>
        <div class="row interaction-post">
            <p><a href="*" class="like">Likes</a>: ${response.post.likes} </p>
            <p class="spacer">-</p>
            <p><a href="*" class="commentaire"> Commentaire </a>: ${response.comments.length}</p>
        </div>
        <p>Cree le : ${response.post.createdAt} </p>
        <p>Modifier le : ${response.post.updatedAt} </p>
        <div class="seperate"></div>
    </div>
</template>



<script>


export default{
  name:'post',
  data() {
    return{

    }
  },

}
</script>



<style scoped>
.post{
  margin-left:auto;
  margin-right:auto;

  background-color:#c5c5c5;

  padding-left:30px;
  padding-right:30px
}

.post img{
  width: 100%;
  max-width: 550px;
}
.post a img{
  display:flex;
}
.author{
  font-size:0.8rem;
  color:#808080;
}
.description{
  margin-bottom:20px;

  text-align: justify;
}
.post img{
  margin-right:auto;
  margin-left:auto;
}
.interaction-post{
  margin-left:auto;
  margin-right:auto;
}

.btn-ajouter-post{
  display: flex;
  justify-content: center;
}

</style>
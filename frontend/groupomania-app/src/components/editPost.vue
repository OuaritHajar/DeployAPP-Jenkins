<template>
<!-- Edit post -->
<div v-if="post.userId === user.userId || user.isAdmin" class="edit-post">
    <hr>
    <form enctype="multipart/form-data">
        <fieldset>
            <div >
                <!-- Titre-->
                <div class="form-group ">
                    <label for="inputTitle">Titre :</label>
                    <input v-model="titlePost" type="text" class="form-control gray" id="inputTitlePost"> 
                </div>
                <!-- Message -->
                <div class="form-group">
                    <label for="inputMessage">Message:</label>
                    <textarea v-model="descriptionPost" type="text" class="form-control gray" rows="2" id="inputMessage">  </textarea>
                </div>
                <!-- Image-->
                <div class="form-group">
                    <label for="inputImg_url">Image : </label>
                    <input type="file" @change="uploadImage($event)" class="file-input">
                </div>
            </div>
            <div class="text-center">
                <button @click="editPost()" class="btn btn-primary">
                    Modifier
                </button>
            </div>
        </fieldset>
    </form>
</div>
</template>


<script>
import {mapGetters} from 'vuex'

export default {
    data(){
        return{
            titlePost: '',
            descriptionPost: this.$store.getters.get_one_post.description,
            file: null,
        }
    },
    computed: {
        ...mapGetters({
            user:['get_user'],
            post:['get_one_post'],
            comments: ['get_comments_post']
        })
    },


    methods: {
        uploadImage(event) {
            this.file = event.target.files[0]
            console.log(this.file)
        },


        editPost() {
            let data = new FormData();

            data.append('title', this.titlePost);
            data.append('description', this.descriptionPost);
            data.append('img_url', this.file); 

            this.$store.dispatch('editPost', data)
            .then(()=> {
                this.$router.push('/mur')
            })
        },
    }
}
</script>


<style scoped lang="scss">
.edit-post{
    .gray{
        color:gray
    }
    .file-input{
        margin-left:10px;
    }
    hr{
        margin: 10px 0 10px 0;
    }
}


</style>
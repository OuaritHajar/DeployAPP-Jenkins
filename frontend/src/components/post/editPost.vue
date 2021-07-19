<template>
<!-- Edit post -->
<div class="edit-post">
    <hr>
    <form enctype="multipart/form-data">
        <fieldset>
            <legend class="text-center"> Modifier le post</legend>
            <div >
                <!-- Titre-->
                <div class="form-group ">
                    <label for="inputTitle">Titre :</label>
                    <input v-model="titlePost" type="text" class="form-control gray" id="inputTitlePost"> 
                </div>
                <!-- Message -->
                <div class="form-group">
                    <label for="inputMessage">Message:</label>
                    <textarea v-model="descriptionPost" type="text" class="form-control gray" rows="3" id="inputMessage">  </textarea>
                </div>
                <!-- Image-->
                <div class="form-group">
                    <label for="inputImg_url">Image : </label>
                    <input type="file" @change="uploadImage($event)" class="file-input">
                </div>
            </div>
            <div class="text-center">
                <button @click="editPost(post.id)" class="btn btn-primary">
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
    props: ['post'],
    computed: {
        ...mapGetters({
            user:['get_user'],
        })
    },
    mounted(){
        
            console.log("route : ",this.$route.name)
    },


    methods: {
        uploadImage(event) {
            this.file = event.target.files[0]
            console.log(this.file)
        },


        editPost(postId) {
            let data = new FormData();

            data.set('title', this.titlePost);
            data.set('description', this.descriptionPost);
            data.set('img_url', this.file);
            data.append('postId', postId); 

            this.$store.dispatch('editPost', data)
            .then(()=> {
                this.$store.dispatch('hideEditPost', { postId: postId, vue: this.$route.name })
                this.$router.go()
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
    button{
        margin-bottom:20px;
    }
}



</style>
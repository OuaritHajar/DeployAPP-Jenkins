<template>
<section>
    <div class="new-post">
        <form enctype="multipart/form-data">
        <fieldset>
            <legend class="text-center"> Créer un nouveau post</legend>
            <hr/>
            <div class="form-row">
                
                <!-- Titre -->
                <div class="col-md-12 mb-3">
                    <label for="inputTitle">Titre :</label>
                    <input v-model="title" type="text" class="form-control" id="inputTitle" placeholder="Facultatif">
                </div>

                <!-- Description -->
                <div class="col-md-12 mb-3">
                    <label for="inputDescription">Description :</label>
                    <textarea v-model="description" class="form-control" id="inputDescription" placeholder="Ajouter une description" rows="6" required></textarea>
                </div>

                <!-- Image-->
                <div class="col-md-12">
                    <label for="inputImgUrl">Image :</label>
                    <input type="file" @change="uploadImage($event)" id="inputImgUrl">
                </div>
            </div>
            
            <div class="text-center">
                <button @click="creatNewPost(user)" class="btn btn-primary">Publier</button>
            </div>
            
        </fieldset>  
        </form>
    </div>
</section>
</template>

<script>
import { mapGetters } from 'vuex'

export default{
    data() {
        return{
            title: "",
            description: "",
            img_url:"",
            file: null
        }
    },
    computed: {
        ...mapGetters({
            user: ['get_user']
        })
    },
    methods: {
        uploadImage(event) {
            this.file = event.target.files[0]
            console.log(this.file)
        },
        creatNewPost(user) {
            
            let data = new FormData();
            data.append('title', this.title);
            data.append('description', this.description);
            data.append('img_url', this.file); 
            
            console.log("haaaaaaaaa",user.first_name)
            
            

            this.$store.dispatch('createPost', data)
            .then(() => {
                this.$store.dispatch('postsNumber')
                this.$emit('post-created')
                this.$store.dispatch('getAllPosts', 1);
                
            })
            .catch(function (error) {
              console.log(error);
            });
        },
    },
}
</script>


<style scoped>
.new-post{
    margin: 10px 10px;
    padding: 10px 20px;

    background-color:#ececec;
    border: solid 1px #cfcfcf;
    border-radius: 5px;
}
#inputImgUrl{
    margin-left:10px;
}
hr{
    margin-top:0;
}
.spacer{
    margin: 0 10px 0 10px
}

</style>
<template>
<section>
    <div class="new-post">
        <form enctype="multipart/form-data">
        <fieldset>
            <legend> Créer un nouveau post</legend>
            <hr/>
            <div class="form-row">
                
                <!-- Titre -->
                <div class="col-md-12 mb-3">
                    <label for="inputTitle">Titre :</label>
                    <input v-model="title" type="text" class="form-control" id="inputTitle" placeholder="Entrer votre titre" required>
                </div>

                <!-- Description -->
                <div class="col-md-12 mb-3">
                    <label for="inputDescription">Description :</label>
                    <textarea v-model="description" class="form-control" id="inputDescription" placeholder="Ajouter une description" rows="6" required></textarea>
                </div>

                <!-- Image-->
                <div class="col-md-12 mb-3">
                    <label for="inputImg_url">Image :</label>
                    <input type="file" @change="uploadImage($event)" id="file-input">
                </div>
            </div>
            
            <button @click="creatNewPost" class="btn btn-primary">Créer</button>
        </fieldset>  
        </form>
    </div>
</section>
</template>

<script>
import axios from 'axios';

export default{
    data() {
        return{
            title: "",
            description: "",
            img_url:"",
            file: null
        }
    },
    methods: {
        uploadImage(event) {
            this.file = event.target.files[0]
        },
        creatNewPost() {
            let data = new FormData();

            data.append('title', this.title);
            data.append('description', this.description);
            data.append('img_url', this.file); 
            console.log(data)
            //data.append('img_url', this.file, this.file.name); 
            let config = {
                headers : {
                  'Content-Type' : 'application/x-www-form-urlencoded',
                  'Authorization': "Bearer " + localStorage.token,
                }
            }
            const URL = 'http://localhost:3000/api/posts/'; 
            axios.post( URL,  data, config
            ).then( () => {
                window.location = "http://localhost:8080/index.html#/"
            })
        }
    }
}
</script>


<style scoped>
.new-post{
    margin: 20px 20px;
    padding: 20px 20px;

    border: #a1a1a1 solid 1px;
    background-color:#e0e0e0;
    border-radius: 5px;
}
#file-input{
    margin-left:10px;
}
hr{
    margin-top:0;
}
.spacer{
    margin: 0 10px 0 10px
}

</style>
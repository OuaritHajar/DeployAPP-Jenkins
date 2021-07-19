<template>
<aside class="row interface-image">  
    <hr>
    <div class="col-sm-12 interface-avatar">
        <form>
            <fieldset>
                <legend class="text-center avatar-title">Avatar</legend>
                <div class="row">
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio1">
                        <img src="http://localhost:3000/images/static/avatar/avatar1.png">
                    </label>
                    <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio1" value=" 1">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio2">
                        <img src="http://localhost:3000/images/static/avatar/avatar2.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio2" value= "2">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio3">
                        <img src="http://localhost:3000/images/static/avatar/avatar3.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio3" value= "3">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio4">
                        <img src="http://localhost:3000/images/static/avatar/avatar4.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio4" value= "4">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio5">
                        <img src="http://localhost:3000/images/static/avatar/avatar5.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio5" value= "5">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio6">
                        <img src="http://localhost:3000/images/static/avatar/avatar6.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio6" value= "6">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio7">
                        <img src="http://localhost:3000/images/static/avatar/avatar7.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio7" value= "7">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio8">
                        <img src="http://localhost:3000/images/static/avatar/avatar8.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio8" value= "8">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio9">
                        <img src="http://localhost:3000/images/static/avatar/avatar9.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio9" value= "9">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio10">
                        <img src="http://localhost:3000/images/static/avatar/avatar10.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio10" value= "10">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio11">
                        <img src="http://localhost:3000/images/static/avatar/avatar11.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio11" value= "11">
                </div>
                <div class="col-3 col-sm-2 col-lg-1 text-center">
                    <label class="" for="inlineRadio12">
                        <img src="http://localhost:3000/images/static/avatar/avatar12.png">
                    </label>
                     <input v-model="avatarValue" class="inputAvatar" type="radio" name="inlineRadioOptions" id="inlineRadio12" value= "12">
                </div>
            </div>
            </fieldset>
            
        </form>
    </div>
    <div class="col-sm-12 text-center">
        <p class="separation-ou">Ou</p>
    </div>
    <div class="col-sm-12 interface-photo">
        <div class="form-file">
            <form>
                <label for="input-file">Image : </label>
                <input id="input-file" type="file" @change="uploadImage($event)">
                
            </form>
        </div>
        
    </div>

    <div class="col-sm-12 text-center mt-3">
        <button @click="editUser(user.id)" class="btn btn-primary">
            Modifier l'avatar
        </button>
    </div>
</aside>
</template>


<script>
export default {
    data(){
        return{
            file:'',
            
            avatarValue: '',
            useAvatar : true
        }
    },
    props:['user'],

    computed: {
        avatarUrl() {
            if(this.avatarValue != null) {
                return 'http://localhost:3000/images/static/avatar/avatar' + this.avatarValue + '.png'
            } else {
                return null
            }
        },
    },

    methods: {
        uploadImage(event) {
            this.file = event.target.files[0]
            this.useAvatar = false
            console.log(this.file)
        },

        editUser(userId) {
            let formData = new FormData()

            if(this.useAvatar){
                formData.append('avatarUrl', this.avatarUrl);
            } else {
                formData.append('avatarUrl', this.file);
            }
            formData.append('userId', userId); 


            this.$store.dispatch('editUser', formData )
            .then(()=> {
                //this.inputFirstName = false
                //this.inputLastName = false
                //this.modifAvatar = false
                //this.$router.go()
                
            })
        },
    },
}
</script>


<style lang="scss" scoped>
.interface-image{
    margin-top:30px;

    img{
        width:70px;
    }
    .col-sm-2, .col-2{
        margin:0;
        padding:0;
    }
    .avatar-title{
        padding:15px 0;
    }
    
    .interface-avatar{
        background-color:#ececec;
        border: solid 1px #cfcfcf;
        border-radius: 5px;

        margin-top:20px;
    }
    .inputAvatar{
        display: flex;
        margin-left:auto;
        margin-right:auto;
        margin-bottom:20px;
    }
}
.separation-ou{
    margin-top:10px;
    font-size:1.2rem;
}
.interface-photo{
    background-color:#ececec;
    border: solid 1px #cfcfcf;
    border-radius: 5px;

    padding:10px 20px;

    label{
        font-size:1.4rem;
        margin-right:15px;
    }
}

</style>
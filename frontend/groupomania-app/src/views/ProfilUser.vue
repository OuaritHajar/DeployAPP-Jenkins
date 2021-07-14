<template>
    <section>
        
        <!-- Nom / Prenom -->
        <div class="row">
            <div class="avatar col-sm-4">
                <img :src="user.avatarUrl" alt="avatar">
            </div>
            <div class="col-sm-7 offset-sm-1 caracteristique">
                
                <p>Prénom : {{ user.last_name }}</p>
                <p>Nom : {{ user.first_name }}</p>
                <p>Sexe : {{ sexe }}</p>   
                <p>Email : {{ user.email }} </p>
                <p>Crée le {{ moment(user.createdAt).format("DD-MM-YYYY HH:mm") }} </p>
                
            </div>
        </div>
    </section>
</template>






<script>
import { mapState } from 'vuex'
const moment = require('moment')

export default {
    data() {
        return{
            moment: moment
        }
    },

    computed: {
        ...mapState({
            user:['userProfil']
        }),
        sexe(){
            if(this.user.sexe){
                return 'Femme'
            } else {
                return 'Homme'
            }
        }
    },

    mounted(){
        this.$store.dispatch('getProfilUsers', this.$route.params.userId)
    }
}
</script>

<style scoped lang="scss">
.avatar {
    display: flex;
    justify-content: center;

    img{
        width: 200px;
        height: 200px;
        margin-bottom:20px
    }
}

.caracteristique{
    margin-top:32px;
    margin-left:20px;
}
</style>
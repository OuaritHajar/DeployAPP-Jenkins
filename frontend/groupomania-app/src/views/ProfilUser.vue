<template>
    <section>
        <div>
            <p>Nom : {{ user.first_name }} </p>
            <p>Prenom : {{ user.last_name }}</p>
            <p>Email : {{ user.email }}</p>
            <p>Inscrit depuis {{ user.createdAt }}</p>
        </div>
    </section>
</template>


<script>
import { mapState } from 'vuex'

export default {
    data() {
        return{
        }
    },

    computed: {
        ...mapState({
            user:['userProfil']
        })
    },

    mounted(){
        this.$store.dispatch('getProfilUsers', this.$route.params.userId)
    }
}
</script>
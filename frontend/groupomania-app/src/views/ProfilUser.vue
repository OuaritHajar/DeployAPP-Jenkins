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
export default {
    data() {
        return{
            user:{}
        }
    },
    mounted(){
        this.$store.dispatch('getProfilUsers', this.$route.params.userId)
    }
}
</script>
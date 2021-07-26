<template>
    <section>
        <!-- Ajouter un commentaire -->
        <div class="new-comment">
            <form class="form-inline">  

                <div class="col-sm-10">
                    <textarea v-model="descriptionComment" class="form-control" placeholder="Ajouter un commentaire" rows="2"></textarea>
                </div>

                <div class="col-sm-2 text-center">
                    <button @click="newComment(post.id)" class="btn btn-primary ">
                        Envoyer
                    </button>
                </div>

            </form>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data(){
        return{
            descriptionComment: "",
        }
    },
    computed: {
        ...mapGetters({
            user:['get_user']
        })
    },
    props: ['post'],

    methods: {
        newComment(postId) {
            let data = {
                description: this.descriptionComment,
                postId : postId,
                vue: this.$route.name,
                user: this.user
            }

            this.$store.dispatch('newComment', data)
            .then(()=> {
                if( this.$route.name === 'Posts') {
                    this.$store.dispatch('hideInputComments', { postId: postId, vue: this.$route.name })
                    this.$store.dispatch('displayComments', postId)
                } else {
                    this.$store.dispatch('hideInputComments', { postId: postId, vue: this.$route.name })
                }
            })
        },
    }
}
</script>



<style lang="scss" scoped>
.new-comment{
    margin:20px 20px;

    textarea.form-control{
        width:100%;
    }

    .col-sm-10,.col-sm-2{
        padding:0;
    }
}

</style>
<template>
<div>
    <ul>
        <li v-for="(note, index) in notes" :key="index">
            {{ note }}
        </li>
    </ul>
   <input type="text" v-model="title" @keypress.enter="save"/>
   <p>Total Notes: {{ totalNotes }}</p>

</div>
</template>


<script>
import {useStore} from 'vuex'
import {computed, ref} from "vue"

export default {
    setup() {
        const store = useStore()

        const notes = computed(() => store.state.notes)
        const totalNotes = computed(() => store.getters.totalNotes)
        const title = ref("");

        function save() {
            store.dispatch('saveNote', title.value)
            title.value = "";
        }

        return {
            notes,
            totalNotes,
            title,
            save,
        }
    }
}
</script>
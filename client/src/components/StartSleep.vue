<template>
  <v-flex>
    <v-btn @click="start" color="primary" large>Start a Sleep</v-btn>
  </v-flex>
</template>

<script>
  import {mapActions} from 'vuex';
  export default {
    name: 'StartSleep',
    methods: {
      ...mapActions('sleep', [
        'createSleep'
      ]),
      start() {
        this.createSleep();
      }
    }
  }
</script>

<style scoped>

</style>

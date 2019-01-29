<template>
  <v-flex>
    <v-btn @click="start(false)" color="primary" large>Start a Sleep</v-btn>
    <v-btn @click="start(true)" color="secondary" large>Start a Sleep (Asleep)</v-btn>
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
      start(asleep) {
        this.createSleep(asleep);
      }
    }
  }
</script>

<style scoped>

</style>

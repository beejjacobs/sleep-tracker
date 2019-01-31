<template>
  <v-flex>
    <div class="display-1">Start a Sleep</div>
    <v-btn large fab color="primary" @click="start(false)"><v-icon>play_arrow</v-icon></v-btn>
    <v-btn large fab color="primary" @click="start(true)"><v-icon>brightness_3</v-icon></v-btn>
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
  .v-btn--floating.v-btn--large {
    height: 100px;
    width: 100px;
    font-size: xx-large;
    margin: 30px;
  }

  .v-btn--floating.v-btn--large .v-icon {
    font-size: 60px;
  }
</style>

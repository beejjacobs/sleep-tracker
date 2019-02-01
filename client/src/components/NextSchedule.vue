<template>
  <div v-if="nextSchedule" class="banner">
    Schedule: <v-btn fab small :color="color" outline><v-icon :class="{moon}">{{icon}}</v-icon></v-btn> @ {{time}}
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  export default {
    name: 'NextSchedule',
    computed: {
      ...mapGetters('schedule', [
        'nextSchedule'
      ]),
      color() {
        return this.nextSchedule.isStart ? 'grey' : 'yellow darken-2';
      },
      icon() {
        return this.nextSchedule.isStart ? 'brightness_3' : 'wb_sunny';
      },
      moon() {
        return this.icon === 'brightness_3';
      },
      time() {
        return this.nextSchedule.time.format('HH:mm');
      }
    }
  }
</script>

<style scoped>
  .banner {
    position: fixed;
    width: 100%;
    height: 56px;
    bottom: 16px;
    text-align: center;
    font-size: 20px;
    line-height: 56px;
  }
</style>

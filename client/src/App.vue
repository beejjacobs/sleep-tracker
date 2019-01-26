<template>
  <v-app dark>
    <v-content>
      <status
        :connected="isConnected"
        :last-connected-at="lastConnected"
        :offline-changes-count="offlineChangesCount"
        :offline-schedule-changed="offlineScheduleChanged"
      />
    </v-content>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'isConnected',
      'lastConnected',
      'offlineChangesCount',
      'offlineScheduleChanged',
      'sleeps'
    ])
  }
}
</script>

<style>
  .application.theme--dark {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: black;
    color: #d8d8d8;
  }
  .theme--dark .v-card {
    background: black;
  }

  .display-1 {
    color: rgba(216, 216, 216, 0.5);
  }
</style>

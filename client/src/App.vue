<template>
  <v-app dark>
    <v-content>
      <v-layout align-center class="section">
        <last-sleep/>
      </v-layout>
      <v-layout class="section small">
        <start-sleep/>
      </v-layout>
      <add-sleep/>
      <schedule/>
      <status/>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'App'
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

  .section {
    height: 70vh;
    justify-items: center;
    text-align: center;
  }
  .section.small {
    height: 30vh;
  }
</style>

<template>
  <v-app dark>
    <v-content>
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
</style>

<template>
  <v-app dark>
    <v-content>
      <v-layout class="section">
        <last-sleep/>
      </v-layout>
      <v-layout class="section small">
        <start-sleep/>
      </v-layout>
      <add-sleep/>
      <history/>
      <next-schedule/>
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
    height: 60vh;
    justify-items: center;
    text-align: center;
  }
  .section.small {
    height: 40vh;
    margin-top: 15px;
  }

  .moon {
    transform: translateX(4%);
  }
</style>

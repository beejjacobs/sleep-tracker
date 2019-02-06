<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-btn slot="activator" fab fixed top right color="blue darken-2"><v-icon>history</v-icon></v-btn>
    <v-card class="main">
      <v-btn fab fixed top right @click="show = false" color="error"><v-icon>close</v-icon></v-btn>
      <div class="display-1">Sleeps</div>

      <table class="add-sleep">
        <thead>
        <tr>
          <th></th>
          <th>Start</th>
          <th>End</th>
          <th>Sleep Time</th>
        </tr>
        </thead>
        <tbody>
        <history-sleep-row
          v-for="sleep in sleeps"
          :key="sleep.id"
          :sleep="sleep"
          @edit="edit"/>
        </tbody>
      </table>
    </v-card>

    <edit-sleep :sleep="editing" @close="editing = false"/>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  name: 'History',
  data() {
    return {
      show: false,
      editing: false
    };
  },
  computed: {
    ...mapGetters('sleep', [
      'sleeps'
    ])
  },
  methods: {
    edit(sleep) {
      this.editing = sleep;
    }
  }
};
</script>

<style scoped>
  .main {
    text-align: center;
  }
  .display-1 {
    padding-top: 25px;
    padding-bottom: 25px;
  }

  table {
    font-size: large;
    margin: 0 auto;
    min-width: 50vw;
    border-collapse: collapse;
    border-style: hidden;
    width: 95%;
    table-layout: fixed;
  }

  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 5px;
    transition: 0.5s;
  }
</style>

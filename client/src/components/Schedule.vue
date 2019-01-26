<template>
  <v-dialog fullscreen v-model="show">
    <v-btn slot="activator" fab fixed top left color="deep-purple darken-2">
      <v-icon>schedule</v-icon>
    </v-btn>
    <v-card>
      <v-btn fab fixed top right @click="show = false" color="error"><v-icon>close</v-icon></v-btn>
      <v-card-text>
        <h1 class="display-1 mb-3">Schedule</h1>
        <table>
          <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="sleep in schedule" :key="sleep.id">
            <td>{{ sleep.start }}</td>
            <td>{{ sleep.end }}</td>
          </tr>
          <tr v-if="newRow.editing">
            <td><time-editor v-model="newRow.start"/></td>
            <td><time-editor v-model="newRow.end"/></td>
          </tr>
          <tr>
            <td class="add" colspan="2">
              <v-btn v-if="!newRow.editing" fab color="green darken-2" @click="add"><v-icon>add</v-icon></v-btn>
              <v-btn v-else fab color="green darken-2" @click="done"><v-icon>done</v-icon></v-btn>
            </td>
          </tr>
          </tbody>
        </table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: 'Schedule',
    data() {
      return {
        show: false,
        newRow: {
          start: '',
          end: '',
          editing: false
        }
      }
    },
    computed: {
      ...mapGetters([
        'schedule'
      ])
    },
    methods: {
      ...mapActions([
        'addSleepToSchedule'
      ]),
      add() {
        this.newRow.editing = true;
      },
      done() {
        this.addSleepToSchedule({
          start: this.newRow.start,
          end: this.newRow.end
        });
        this.newRow.editing = false;
        this.newRow.start = '';
        this.newRow.end = '';
      }
    }
  }
</script>

<style scoped>
  .v-card {
    text-align: center;
    background: #404040;
  }

  table {
    font-size: large;
    width: 100%;
    border-collapse: collapse;
    border-style: hidden;
    table-layout: fixed;
  }

  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 10px;
    transition: 0.5s;
  }
</style>

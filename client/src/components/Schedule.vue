<template>
  <v-dialog fullscreen v-model="show">
    <v-btn slot="activator" fab fixed top left color="deep-purple darken-2">
      <v-icon>schedule</v-icon>
    </v-btn>
    <v-card>
      <v-btn fab fixed top right @click="close" color="error"><v-icon>close</v-icon></v-btn>
      <v-card-text>
        <h1 class="display-1 mb-3">Schedule</h1>
        <table>
          <thead>
          <tr>
            <th></th>
            <th>Start</th>
            <th>End</th>
          </tr>
          </thead>
          <tbody>
          <schedule-row v-for="(sleep, i) in schedule" :key="i" :sleep="sleep"/>
          <tr v-if="newRow.editing">
            <td><v-btn fab small color="green darken-2" @click="done"><v-icon>done</v-icon></v-btn></td>
            <td><time-editor v-model="newRow.start"/></td>
            <td><time-editor v-model="newRow.end"/></td>
          </tr>
          <tr  v-if="!newRow.editing">
            <td class="add"><v-btn fab small color="green darken-2" @click="add"><v-icon>add</v-icon></v-btn></td>
            <td></td>
            <td></td>
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
      close() {
        this.show = false;
        this.newRow.editing = false;
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
  }

  table {
    font-size: large;
    margin: 0 auto;
    min-width: 50vw;
    border-collapse: collapse;
    border-style: hidden;
  }

  td:nth-child(2),
  td:nth-child(3){
    min-width: 128px;
  }

  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 5px;
    transition: 0.5s;
  }
</style>

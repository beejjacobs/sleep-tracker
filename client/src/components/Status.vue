<template>
  <v-dialog>
    <v-btn  slot="activator" fab fixed bottom left :color="isConnected ? 'green' : 'red'">
      <v-icon>{{ isConnected ? 'link' : 'link_off' }}</v-icon>
    </v-btn>
    <v-card>
      <v-card-text>
        <h1 class="display-1 mb-3">Status</h1>
        <table>
          <tr>
            <td>Connected</td>
            <td>{{ isConnected ? 'Yes' : 'No' }}</td>
          </tr>
          <tr>
            <td>Last Connection</td>
            <td>{{ lastConnection }}</td>
          </tr>
          <tr>
            <td>Offline Actions</td>
            <td>{{offlineChangesCount}}</td>
          </tr>
          <tr>
            <td>Schedule Updated Offline</td>
            <td>{{offlineScheduleChanged ? 'Yes' : 'No'}}</td>
          </tr>
        </table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapGetters} from 'vuex';
  export default {
    name: 'Status',
    computed: {
      ...mapGetters([
        'isConnected',
        'lastConnected'
      ]),
      ...mapGetters('schedule', [
        'offlineScheduleChanged'
      ]),
      ...mapGetters('sleep', [
        'offlineChangesCount'
      ]),
      lastConnection() {
        if (this.lastConnected === 'unknown') {
          return 'Unknown';
        }
        return this.$moment(this.lastConnected).format('HH:mm DD/MM/YYYY');
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
  }

  td {
    text-align: left;
  }

  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 10px;
    transition: 0.5s;
  }
</style>

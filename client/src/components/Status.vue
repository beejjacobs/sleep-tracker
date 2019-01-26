<template>
  <v-dialog>
    <v-btn  slot="activator" fab fixed bottom left :color="connected ? 'green' : 'red'">
      <v-icon>{{ connected ? 'link' : 'link_off' }}</v-icon>
    </v-btn>
    <v-card>
      <v-card-text>
        <h1 class="display-1 mb-3">Status</h1>
        <table>
          <tr>
            <td>Connected</td>
            <td>{{ connected ? 'Yes' : 'No' }}</td>
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
  export default {
    name: 'Status',
    props: {
      connected: {
        type: Boolean
      },
      lastConnectedAt: {
      },
      offlineChangesCount: {
        type: Number
      },
      offlineScheduleChanged: {
        type: Boolean
      }
    },
    computed: {
      lastConnection() {
        if (this.lastConnectedAt === 'unknown') {
          return 'Unknown';
        }
        return this.$moment(this.lastConnectedAt).format('HH:mm DD/MM/YYYY');
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

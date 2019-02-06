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
          <tr v-for="sleep in sleeps">
            <td></td>
            <td>{{sleep.start | moment('HH:mm')}}</td>
            <td>{{sleep.end | moment('HH:mm')}}</td>
            <td>{{ calcSleep(sleep) | duration }}</td>
          </tr>
        </tbody>
      </table>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex';
import moment from 'moment';

function pluralEnding(num) {
  return num > 1 ? 's' : '';
}

export default {
  name: 'History',
  filters: {
    duration(dur) {
      const asMins = dur.asMinutes();
      if (asMins < 59) {
        return asMins.toFixed() + ' min' + pluralEnding(asMins);
      }
      const hrs = dur.hours();
      const mins = dur.minutes();
      return hrs + ' hr' + pluralEnding(hrs) + ' ' +
          mins + ' min' + pluralEnding(mins);
    }
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapGetters('sleep', [
      'sleeps'
    ])
  },
  methods: {
    calcSleep(sleep) {
      return sleep.sections
          .map(section => {
            if (section.asleep && section.awake) {
              return moment.duration(moment(section.awake).diff(moment(section.asleep)));
            }
            return moment.duration();
          })
          .reduce((previousValue, currentValue) => {
            return previousValue.add(currentValue);
          }, moment.duration());
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

<template>
  <v-flex v-if="lastSleep">
    <div class="display-1">Last Sleep</div>
    <table class="title mt-1 mb-1">
      <tr>
        <td>Started</td>
        <td>{{start.format('HH:mm')}}<span v-if="!startedToday"> ({{startDay}})</span></td>
      </tr>
      <tr>
        <td>Ended</td>
        <td>{{endText}}</td>
      </tr>
    </table>
    <template v-if="lastSection">
      <div class="subheading">Last Section</div>
      <table class="title mt-1 mb-1">
        <tr>
          <td>Asleep</td>
          <td>{{lastSection.asleep | moment('HH:mm')}} ({{asleepHm}})</td>
        </tr>
        <tr v-if="lastSection.awake">
          <td>Awake</td>
          <td>{{lastSection.awake| moment('HH:mm')}} ({{awakeHm}})</td>
        </tr>
      </table>
    </template>
    <div class="spacer"></div>
    <v-btn :disabled="awake" large fab color="yellow darken-2"><v-icon>wb_sunny</v-icon></v-btn>
    <v-btn :disabled="!awake || ended" large fab color="grey"><v-icon>brightness_3</v-icon></v-btn>
    <v-btn :disabled="ended" large fab color="red darken-2"><v-icon>stop</v-icon></v-btn>
  </v-flex>
</template>

<script>
  import {mapGetters} from 'vuex';
  import moment from 'moment';
  import {dateToHoursMinutes} from '../util';

  export default {
    name: 'LastSleep',
    computed: {
      ...mapGetters('sleep', [
        'lastSleep'
      ]),
      ...mapGetters('time', [
        'now'
      ]),
      asleepHm() {
        if (!this.lastSection || !this.lastSection.asleep) {
          return '';
        }
        return dateToHoursMinutes(moment(this.lastSection.asleep), this.now);
      },
      awakeHm() {
        if (!this.lastSection || !this.lastSection.awake) {
          return '';
        }
        return dateToHoursMinutes(moment(this.lastSection.awake), this.now);
      },
      awake() {
        if (!this.lastSection) {
          return true;
        }
        if (this.lastSection.awake) {
          return true;
        }
        return false;
      },
      ended() {
        if (!this.lastSleep) {
          return false;
        }
        return !!this.lastSleep.end;
      },
      endText() {
        if (!this.lastSleep) {
          return '';
        }
        if (this.lastSleep.end) {
          return moment(this.lastSleep.end).format('HH:mm');
        }
        return 'Now';
      },
      lastSection() {
        if (!this.lastSleep) {
          return false;
        }
        if (this.lastSleep.sections.length === 0) {
          return false;
        }
        return this.lastSleep.sections[this.lastSleep.sections.length - 1];
      },
      start() {
        return moment(this.lastSleep.start);
      },
      startDay() {
        return this.start.calendar(null, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] dddd',
          sameElse: 'DD/MM/YYYY'
        });
      },
      startedToday() {
        return moment(this.now).isSame(this.start, 'day');
      }
    }
  }
</script>

<style scoped>
  .display-1 {
    margin-top: 25px;
  }
  .spacer {
    height: 35px;
  }

  .status {
    text-align: left;
    width: 324px;
    margin: 0 auto;
  }

  table.title {
    text-align: left;
    margin: 0 auto;
  }

  table.title td {
    padding: 10px;
  }

  table.title td:first-child {
    text-align: right;
  }

  .v-btn--floating.v-btn--large {
    height: 85px;
    width: 85px;
    font-size: xx-large;
    margin: 0 15px;
  }

  .v-btn--floating.v-btn--large .v-icon {
    font-size: 45px;
  }
</style>

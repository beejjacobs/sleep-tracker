<template>
  <v-flex v-if="lastSleep">
    <div class="display-1">Last Sleep</div>
    <table class="title mt-1 mb-1">
      <tr>
        <td>Started</td>
        <td>{{start.format('HH:mm')}}<span v-if="!startedToday"> ({{startDay}})</span></td>
      </tr>
      <tr v-if="lastSleep.end">
        <td>Ended</td>
        <td>{{lastSleep.end | moment('HH:mm')}}</td>
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
    <v-btn large fab color="yellow darken-2"><v-icon x-large>wb_sunny</v-icon></v-btn>
    <v-btn large fab color="grey"><v-icon x-large>brightness_3</v-icon></v-btn>
  </v-flex>
</template>

<script>
  import {mapGetters} from 'vuex';
  import moment from 'moment';
  import {dateToHoursMinutes} from '../util';

  export default {
    name: 'LastSleep',
    data() {
      return {
        timeToFeed: '',
        timeSinceFeed: ''
      }
    },
    computed: {
      ...mapGetters('sleep', [
        'lastSleep'
      ]),
      start() {
        return moment(this.lastSleep.start);
      },
      startedToday() {
        return moment().isSame(this.start, 'day');
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
      lastSection() {
        if (!this.lastSleep) {
          return false;
        }
        if (this.lastSleep.sections.length === 0) {
          return false;
        }
        return this.lastSleep.sections[this.lastSleep.sections.length - 1];
      },
      asleepHm() {
        if (!this.lastSection || !this.lastSection.asleep) {
          return '';
        }
        return dateToHoursMinutes(moment(this.lastSection.asleep));
      },
      awakeHm() {
        if (!this.lastSection || !this.lastSection.awake) {
          return '';
        }
        return dateToHoursMinutes(moment(this.lastSection.awake));
      },
      awake() {
        return false;
      }
    },
    methods: {
      updateTimes() {

      }
    },
    watch: {
      lastSleep(value) {
        this.updateTimes();
      }
    },
    created() {
      this.updateTimes();
      setInterval(() => {
        this.updateTimes();
      }, 60 * 1000);
    }
  }
</script>

<style scoped>
  .display-1 {
    margin-top: 40px;
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
</style>

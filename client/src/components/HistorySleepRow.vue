<template>
  <tr>
    <td><edit-menu v-model="open" @edit="edit" @remove="remove"/></td>
    <td :class="{hide: open}">{{sleep.start | moment('HH:mm')}}</td>
    <td>{{sleep.end | moment('HH:mm')}}</td>
    <td>{{ calcSleep(sleep) | duration }}</td>
  </tr>
</template>

<script>
import moment from 'moment';
import {mapActions} from 'vuex';

function pluralEnding(num) {
  return num > 1 ? 's' : '';
}

export default {
  name: 'HistorySleepRow',
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
  props: {
    sleep: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    ...mapActions('sleep', [
      'deleteSleep'
    ]),
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
    },
    edit() {

    },
    remove() {
      this.deleteSleep(this.sleep.id);
    }
  }
}
</script>

<style scoped>
  .hide {
    color: black;
  }
</style>

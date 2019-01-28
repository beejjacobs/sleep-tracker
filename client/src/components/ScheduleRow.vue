<template>
  <tr>
    <template v-if="!editing">
      <td>
        <v-speed-dial direction="right" v-model="open">
          <v-btn slot="activator" color="blue darken-2" v-model="open" dark fab small><v-icon>settings</v-icon><v-icon>close</v-icon></v-btn>
          <v-btn fab dark small color="green" @click="edit"><v-icon>edit</v-icon></v-btn>
          <v-btn fab dark small color="red darken-3" @click="remove"><v-icon>delete</v-icon></v-btn>
        </v-speed-dial>
      </td>
      <td :class="{hide: open}">{{ sleep.start }}</td>
      <td>{{ sleep.end }}</td>
    </template>
    <template v-else>
      <td><v-btn fab small color="green darken-2" @click="done"><v-icon>done</v-icon></v-btn></td>
      <td><time-editor v-model="times.start" label="Start"/></td>
      <td><time-editor v-model="times.end" label="End"/></td>
    </template>
  </tr>
</template>

<script>
  import {mapActions} from 'vuex';
  export default {
    name: 'ScheduleRow',
    props: {
      sleep: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        open: false,
        editing: false,
        times: {
          start: '',
          end: ''
        }
      };
    },
    methods: {
      ...mapActions('schedule', [
        'deleteSleepInSchedule',
        'editSleepInSchedule'
      ]),
      done() {
        let sleep = {
          id: this.sleep.id,
          start: this.times.start,
          end: this.times.end
        };
        this.editSleepInSchedule(sleep);
        this.editing = false;
        this.open = false;
      },
      edit() {
        this.times.start = this.sleep.start;
        this.times.end = this.sleep.end;
        this.editing = true;
      },
      remove() {
        this.deleteSleepInSchedule(this.sleep.id);
        this.open = false;
      }
    }
  }
</script>

<style scoped>
  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 5px;
    transition: 0.5s;
  }

  .hide {
    color: black;
  }
</style>

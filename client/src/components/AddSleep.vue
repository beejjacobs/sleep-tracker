<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-btn slot="activator" fab fixed bottom right color="green darken-2"><v-icon>add</v-icon></v-btn>
    <v-card class="main">
      <v-btn fab fixed top right @click="show = false" color="error"><v-icon>close</v-icon></v-btn>

      <div class="display-1">Add a Sleep</div>

      <date-editor class="date" v-model="sleep.start.date" label="Start Date"/>
      <time-editor v-model="sleep.start.time" label="Start Time"/>
      <time-editor v-model="sleep.end" label="End Time"/>

      <div class="title">Sections</div>
      <table class="add-sleep">
        <thead>
        <tr>
          <th></th>
          <th>Asleep</th>
          <th>Awake</th>
        </tr>
        </thead>
        <tbody>
        <sleep-section-row
          v-for="section in sleep.sections" :key="section.id"
          :value="section"
          @delete="deleteSection(section.id)"
        />
        <tr class="new-row">
          <template v-if="!sleep.section.editing">
            <td><v-btn fab small color="green darken-2" @click="add"><v-icon>add</v-icon></v-btn></td>
            <td></td>
            <td></td>
          </template>
          <template v-else>
            <td>
              <v-btn fab small color="green darken-2" @click="addSection"><v-icon>done</v-icon></v-btn>
              <v-btn fab small color="red darken-2" @click="cancel"><v-icon>close</v-icon></v-btn>
            </td>
            <td><time-editor v-model="sleep.section.asleep" label="Asleep"/></td>
            <td><time-editor v-model="sleep.section.awake" label="Awake"/></td>
          </template>
        </tr>
        </tbody>
      </table>
      <v-btn color="green" @click="done" large>Done</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {formatSection, momentFromDateTime} from '../util';
  export default {
    name: 'AddSleep',
    data() {
      return {
        show: false,
        sleep: {
          id: '',
          start: {
            date: '',
            time: ''
          },
          end: '',
          section: {
            editing: false,
            asleep: '',
            awake: ''
          },
          sections: [

          ]
        }
      };
    },
    mounted() {
      let now = this.$moment();
      let oneHrAgo = now.clone().subtract(1, 'hour');

      this.sleep.start.date = oneHrAgo.format('YYYY-MM-DD');
      this.sleep.start.time = oneHrAgo.format('HH:mm');
      this.sleep.end = now.format('HH:mm');

      this.sleep.section.asleep = this.sleep.start.time;
      this.sleep.section.awake = this.sleep.end;
    },
    computed: {
      ...mapGetters('sleep', [
        'maxSleepId'
      ]),
      maxSectionId() {
        let max = Math.max(...this.sleep.sections.map(s => s.id));
        if (max !== Number.NEGATIVE_INFINITY) {
          return max;
        }
        return 0;
      }
    },
    watch: {
      'sleep.start.time'() {
        this.updateNewSectionTimes();
      },
      'sleep.end'() {
        this.updateNewSectionTimes();
      }
    },
    methods: {
      ...mapActions('sleep', [
        'updateSleep'
      ]),
      add() {
        this.sleep.section.editing = true;
      },
      addSection() {
        let s = {
          id: this.maxSectionId + 1
        };
        Object.assign(s, this.sleep.section);
        delete s.editing;
        this.sleep.sections.push(s);
        this.sleep.section.editing = false;
      },
      cancel() {
        this.sleep.section.editing = false;
      },
      deleteSection(id) {
        let i = this.sleep.sections.findIndex(s => s.id === id);
        if (i !== -1) {
          this.sleep.sections.splice(i, 1);
        }
      },
      done() {
        let s = this.sleep;
        let start = momentFromDateTime(s.start);
        let end = momentFromDateTime({date: s.start.date, time: s.end});
        if (end.isBefore(start)) {
          end.add(1, 'day');
        }

        let sleep = {
          id: this.maxSleepId + 1,
          start: start.format(),
          end: end.format(),
          sections: s.sections.map(section => formatSection(section, start))
        };

        this.updateSleep(sleep);
        this.sleep.sections = [];
        this.show = false;
      },
      updateNewSectionTimes() {
        this.sleep.section.asleep = this.sleep.start.time;
        this.sleep.section.awake = this.sleep.end;
      }
    }
  }
</script>

<style scoped>
  .display-1 {
    padding-top: 25px;
    padding-bottom: 25px;
  }
  .title {
    margin: 25px;
  }
  .main {
    text-align: center;
  }
  .v-dialog__container {
    width: 45vw;
    display: inline-block !important;
  }

  .v-dialog__container.date {
    display: block !important;
    margin-left: 5vw;
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

  table td .v-dialog__container {
    width: 30vw;
  }

  .new-row {
    height: 80px;
  }
</style>

<style>
  table.add-sleep td, table.add-sleep th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 5px;
    transition: 0.5s;
  }

  table.add-sleep tr td:first-child {
    text-align: right;
  }

</style>

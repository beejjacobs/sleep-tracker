<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-card class="main" v-if="sleep">
      <v-btn fab fixed top right @click="show = false" color="error"><v-icon>close</v-icon></v-btn>

      <div class="display-1">Edit Sleep</div>

      <date-editor class="date" v-model="start.date" label="Start Date"/>
      <time-editor v-model="start.time" label="Start Time"/>
      <time-editor v-model="end" nullable label="End Time"/>

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
          v-for="section in editing.sections" :key="section.id"
          :value="section"
          @delete="deleteSection(section.id)"
        />
        <tr class="new-row">
          <template v-if="!newSection.editing">
            <td><v-btn fab small color="green darken-2" @click="add"><v-icon>add</v-icon></v-btn></td>
            <td></td>
            <td></td>
          </template>
          <template v-else>
            <td>
              <v-btn fab small color="green darken-2" @click="addSection"><v-icon>done</v-icon></v-btn>
              <v-btn fab small color="red darken-2" @click="cancel"><v-icon>close</v-icon></v-btn>
            </td>
            <td><time-editor v-model="newSection.asleep" label="Asleep"/></td>
            <td><time-editor v-model="newSection.awake" nullable label="Awake"/></td>
          </template>
        </tr>
        </tbody>
      </table>
      <v-btn color="green" @click="done" large>Save</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {formatSection, justDate, justTime, momentFromDateTime} from '../util';
  export default {
    name: 'EditSleep',
    props: {
      sleep: {
        type: [Object, Boolean]
      }
    },
    data() {
      return {
        show: false,
        editing: {},
        newSection: {
          editing: false,
          asleep: '',
          awake: ''
        },
        start: {
          date: '',
          time: ''
        },
        end: ''
      };
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
      show() {
        if (!this.show) {
          this.$emit('close');
        }
      },
      'start.date'() {
        this.editing.start = momentFromDateTime(this.start).format();
        this.updateNewSectionTimes();
      },
      'start.time'() {
        this.editing.start = momentFromDateTime(this.start).format();
        this.updateNewSectionTimes();
      },
      end() {
        this.updateNewSectionTimes();
      },
      sleep() {
        if (this.sleep) {
          this.editing = Object.assign({}, this.sleep);
          this.editing.sections = this.sleep.sections
              .map(section => Object.assign({}, section))
              .map(section => {
                section.asleep = justTime(section.asleep);
                section.awake = justTime(section.awake);
                return section;
              });
          this.show = true;
          this.updateNewSectionTimes();
          this.updateTimes();
        }
      }
    },
    methods: {
      ...mapActions('sleep', [
        'updateSleep'
      ]),
      add() {
        this.newSection.editing = true;
      },
      addSection() {
        let s = {
          id: this.maxSectionId + 1
        };
        Object.assign(s, this.sleep.section);
        delete s.editing;
        this.sleep.sections.push(s);
        this.newSection.editing = false;
      },
      cancel() {
        this.newSection.editing = false;
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
        
        let end = null;
        if (s.end !== null) {
          end = momentFromDateTime({date: s.start.date, time: s.end});
          if (end.isBefore(start)) {
            end.add(1, 'day');
          }
          end = end.format();
        }

        let sleep = {
          id: this.maxSleepId + 1,
          start: start.format(),
          end,
          sections: s.sections.map(section => formatSection(section, start))
        };

        this.updateSleep(sleep);
        this.sleep.sections = [];
        this.show = false;
      },
      updateNewSectionTimes() {
        this.newSection.asleep = this.start.time;
        this.newSection.awake = this.end;
      },
      updateTimes() {
        this.start.date = justDate(this.sleep.start);
        this.start.time = justTime(this.sleep.start);
        this.end = justTime(this.sleep.end);
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

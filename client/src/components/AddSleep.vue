<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-btn slot="activator" fab fixed bottom right color="green darken-2"><v-icon>add</v-icon></v-btn>
    <v-card class="main">
      <v-btn fab fixed top right @click="show = false" color="error"><v-icon>close</v-icon></v-btn>

      <div class="display-1">Add a Sleep</div>

      <date-editor class="date" v-model="sleep.start.date" label="Start Date"/>
      <time-editor v-model="sleep.start.time" label="Start Time"/>
      <time-editor v-model="sleep.end.time" label="End Time"/>

      <div class="subheading">Sections</div>
      <table>
        <thead>
        <tr>
          <th></th>
          <th>Asleep</th>
          <th>Awake</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="section in sleep.sections">
          <td></td>
          <td>{{section.asleep}}</td>
          <td>{{section.awake}}</td>
        </tr>
        <tr v-if="!sleep.section.editing">
          <td><v-btn fab small color="green darken-2" @click="add"><v-icon>add</v-icon></v-btn></td>
          <td></td>
          <td></td>
        </tr>
        <template v-else>
          <tr>
            <td>
              <v-btn fab small color="green darken-2" @click="addSection"><v-icon>done</v-icon></v-btn>
              <v-btn fab small color="red darken-2" @click="cancel"><v-icon>close</v-icon></v-btn>
            </td>
            <td><time-editor v-model="sleep.section.asleep" label="Asleep"/></td>
            <td><time-editor v-model="sleep.section.awake" label="Awake"/></td>
          </tr>
        </template>
        </tbody>
      </table>
    </v-card>
  </v-dialog>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
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
          end: {
            date: '',
            time: ''
          },
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
      this.sleep.end.date = now.format('YYYY-MM-DD');
      this.sleep.end.time = now.format('HH:mm');

      this.sleep.section.asleep = oneHrAgo.format('HH:mm');
      this.sleep.section.awake = now.format('HH:mm');
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
      }
    }
  }
</script>

<style scoped>
  .display-1 {
    padding-top: 25px;
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
  }

  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 5px;
    transition: 0.5s;
  }

  table td .v-dialog__container {
    width: 30vw;
  }
</style>

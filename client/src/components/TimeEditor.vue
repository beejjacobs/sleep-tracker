<template>
  <v-dialog
    ref="dialog"
    v-model="dialog"
    :return-value.sync="time"
    persistent
    lazy
    full-width
    width="290px"
  >
    <v-text-field
      slot="activator"
      v-model="time"
      prepend-icon="access_time"
      readonly
      :label="label"
      class="entry"
    ></v-text-field>
    <v-time-picker v-if="dialog" v-model="time" color="blue" format="24hr">
      <v-spacer></v-spacer>
      <v-btn flat color="blue" @click="dialog = false">Cancel</v-btn>
      <v-btn flat color="blue" @click="done">OK</v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script>
  export default {
    name: 'TimeEditor',
    props: {
      label: {
        type: String,
        default: 'Time'
      },
      value: {
        type: String
      }
    },
    data() {
      return {
        dialog: false,
        time: '00:00'
      }
    },
    mounted() {
      this.time = this.value;
    },
    watch: {
      value() {
        this.time = this.value;
      }
    },
    methods: {
      done() {
        this.$refs.dialog.save(this.time);
        this.$emit('input', this.time);
      }
    }
  }
</script>

<style scoped>
  .entry {
    max-width: 120px;
    text-align: center;
  }
</style>

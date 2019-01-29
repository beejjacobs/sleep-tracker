<template>
  <v-dialog
    ref="dialog"
    v-model="dialog"
    :return-value.sync="date"
    persistent
    lazy
    full-width
    width="290px"
  >
    <v-text-field
      slot="activator"
      v-model="date"
      :label="label"
      prepend-icon="event"
      readonly
    ></v-text-field>
    <v-date-picker v-model="date" scrollable color="blue">
      <v-spacer></v-spacer>
      <v-btn flat color="blue" @click="dialog = false">Cancel</v-btn>
      <v-btn flat color="blue" @click="done">OK</v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
  export default {
    name: 'DateEditor',
    props: {
      label: {
        type: String,
        default: 'Date'
      },
      value: {
        type: String
      }
    },
    data() {
      return {
        dialog: false,
        date: '00:00'
      }
    },
    mounted() {
      this.date = this.value;
    },
    watch: {
      value() {
        this.date = this.value;
      }
    },
    methods: {
      done() {
        this.$refs.dialog.save(this.date);
        this.$emit('input', this.date);
      }
    }
  }
</script>

<style scoped>

</style>

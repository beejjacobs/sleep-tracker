<template>
  <tr>
    <template v-if="!editing">
      <td><edit-menu v-model="open" @edit="edit" @remove="remove"/></td>
      <td :class="{hide: open}">{{ value.asleep }}</td>
      <td>{{ value.awake }}</td>
    </template>
    <template v-else>
      <td><v-btn fab small color="green darken-2" @click="done"><v-icon>done</v-icon></v-btn></td>
      <td><time-editor v-model="value.asleep" label="Asleep"/></td>
      <td><time-editor v-model="value.awake" label="Awake"/></td>
    </template>
  </tr>
</template>

<script>
  export default {
    name: 'SleepSectionRow',
    props: {
      value: {
        type: Object
      }
    },
    data() {
      return {
        editing: false,
        open: false
      }
    },
    methods: {
      edit() {
        this.editing = true;
        this.open = false;
      },
      remove() {
        this.$emit('delete');
      },
      done() {
        this.editing = false;
      }
    }
  }
</script>

<style scoped>
  .hide {
    color: black;
  }
</style>

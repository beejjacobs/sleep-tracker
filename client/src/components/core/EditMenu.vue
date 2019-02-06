<template>
  <v-speed-dial direction="right" v-model="open">
    <v-btn slot="activator" color="blue darken-2" v-model="open" dark fab small>
      <v-icon>settings</v-icon>
      <v-icon>close</v-icon>
    </v-btn>
    <v-btn fab dark small color="green" @click="edit"><v-icon>edit</v-icon></v-btn>
    <v-btn fab dark small color="red darken-3" @click="remove"><v-icon>delete</v-icon></v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'EditMenu',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false
    };
  },
  watch: {
    open() {
      this.$emit('input', this.open);
    },
    value() {
      this.open = this.value;
    }
  },
  methods: {
    edit() {
      this.$emit('edit');
    },
    remove() {
      this.$emit('remove');
    }
  }
}
</script>

<style scoped>

</style>

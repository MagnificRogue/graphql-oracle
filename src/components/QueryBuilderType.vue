<template>
  <span class="queryBuilderType">
    <button v-on:click="alertClicked"> {{name }} </button>
   </span>
</template>

<script>
export default {
  name: 'queryBuilderType',
  props: ['name', 'type'],
  data () {
    return {
    }
  },
  methods: {
    alertClicked: function (event) {
      this.$emit('buildType', this.type)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.queryBuilderType {
  background-color: black;
  color: yellow;
}
</style>

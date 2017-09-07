<template>
  <div class="navigator">
    <h1> Navigator Page </h1>
    <h2> Schema: {{ schema }} </h2>
  </div>
</template>

<script>
export default {
  name: 'navigator',
  data () {
    return {
    }
  },

  computed: {
    schema: function () {
      return this.$store.state.graphqlSchema
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

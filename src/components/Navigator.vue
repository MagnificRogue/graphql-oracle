<template>
  <div class="navigator">
    <h1> Navigator Page </h1>
    <div id='navigatorGraph'></div>
  </div>
</template>

<script>
const vis = require('vis')

export default {
  name: 'navigator',
  data () {
    return {
      nodes: [],
      edges: []
    }
  },

  computed: {
    // A reference to the graphql schema
    schema: function () {
      return this.$store.state.graphqlSchema.data.__schema
    }
  },
  methods: {
    buildGraph () {
      let discardedTypes = new Set(['__Schema', '__Type', '__TypeKind', '__Field', '__InputValue', '__EnumValue', '__Directive', '__DirectiveLocation'])

      this.schema.types.forEach((type) => {
        if (type.kind === 'SCALAR' || discardedTypes.has(type.name)) {
          return
        }
        this.nodes.push({
          id: type.name,
          label: type.name,
          data: type
        })
      })

      // for each type we added
      this.nodes.forEach((type) => {
        let fields = type.data.fields
        // if it doesn't have any fields, then continue on
        if (!fields) {
          return
        }

        // If it DOEs have fields, for each field
        fields.forEach((field) => {
          switch (field.type.kind) {
            // If the field is an object, we have a relationship of parent has one child
            case 'OBJECT':
              this.edges.push({
                from: type.id,
                to: field.type.name,
                arrows: 'to'
              })
              break

            case 'SCALAR':
              break
              // If the field is actually a 1-N relationship
            case 'LIST':
              let fieldType = field.type.ofType.kind
              if (fieldType === 'SCALAR') {
                return
              }

              this.edges.push({
                from: type.id,
                to: field.type.ofType.name,
                arrows: 'to'
              })

              break
            default:
              return
          }
        })
      })
    }
  },
  mounted () {
    this.buildGraph()

    let container = document.getElementById('navigatorGraph')
    var data = {
      nodes: new vis.DataSet(this.nodes),
      edges: new vis.DataSet(this.edges)
    }
    var options = {}
    let network = new vis.Network(container, data, options)
    console.log(network)
    console.log(data)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #navigatorGraph {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: black;
    z-index: -1;
  }

  h1 {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    color: rgb(136, 148, 168); 
  }
</style>

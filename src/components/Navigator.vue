<template>
  <div class="navigator">
    <h1> Navigator Page </h1>
    <div id='navigatorGraph'></div>
  </div>
</template>

<script>
const cytoscape = require('cytoscape')
const cola = require('cytoscape-cola')
cytoscape.use(cola)

export default {
  name: 'navigator',
  data () {
    return {
      nodes: {} // an associative array of type names to its properties and edges
    }
  },

  computed: {
    // A reference to the graphql schema
    schema: function () {
      return this.$store.state.graphqlSchema.data.__schema
    }
  },
  methods: {
    buildNodesMap () {
      let discardedTypes = new Set(['__Schema', '__Type', '__TypeKind', '__Field', '__InputValue', '__EnumValue', '__Directive', '__DirectiveLocation'])

      this.schema.types.forEach((type) => {
        if (type.kind === 'SCALAR' || discardedTypes.has(type.name)) {
          return
        }
        let typeNode = {
          id: type.name,
          label: type.name,
          data: type,
          expanded: false
        }

        this.nodes[typeNode.id] = typeNode
      })
    },
    // We assume that the parent node is already on the graph
    graphHasNode (graph, nodeId) {
      return graph.nodes('#' + nodeId).length !== 0
    },

    expandGraph (graph, parentNode, renderedPosition) {
      let fields = parentNode.data.fields
      if (!fields) {
        return
      }
      fields.forEach((field) => {
        switch (field.type.kind) {
          case 'OBJECT':
            if (!this.graphHasNode(graph, field.type.name)) {
              graph.add({
                group: 'nodes',
                data: this.nodes[field.type.name],
                renderedPosition: renderedPosition
              })
            }

            graph.add({
              group: 'edges',
              data: {
                source: parentNode.id,
                target: field.type.name,
                label: field.name
              }
            })
            break

          case 'SCALAR':
            let node = graph.add({
              group: 'nodes',
              data: {
                label: field.name + ':' + field.type.name
              },
              renderedPosition: renderedPosition
            })

            graph.add({
              group: 'edges',
              data: {
                label: field.name,
                source: parentNode.id,
                target: node.id()
              }
            })
            break

          case 'LIST':
            let fieldType = field.type.ofType.name
            let fieldKind = field.type.ofType.kind
            switch (fieldKind) {
              case 'OBJECT':
                if (!this.graphHasNode(graph, fieldType)) {
                  graph.add({
                    group: 'nodes',
                    data: this.nodes[fieldType],
                    renderedPosition: renderedPosition
                  })
                }

                graph.add({
                  group: 'edges',
                  data: {
                    source: parentNode.id,
                    target: fieldType,
                    label: field.name
                  }
                })
                break

              case 'SCALAR':
                break

              default:
                console.log('Failed to add list of ' + fieldKind + ' to ' + parentNode.id)
                break
            }
            break

          default:
            console.log('Failed to field to ' + parentNode.id)
            console.log(field)
        }
      })
    }
  },
  mounted () {
    let container = document.getElementById('navigatorGraph')
    let graph = cytoscape({
      container: container,
//      hideEdgesOnViewport: true,
      // Style information about the graph
      style: [
        {
          selector: 'node', // all nodes in the graph
          css: {
            'content': 'data(label)',
            'background-color': 'yellow',
            'border-width': '1px',
            'border-color': 'grey',
            'color': 'white'
          }
        },
        {
          selector: 'edge',
          css: {
            'content': 'data(label)',
            'color': '#d3d3d3'
          }
        }
      ]
    })

    this.buildNodesMap()
    graph.add({
      group: 'nodes',
      data: this.nodes['Query']
    })
    this.expandGraph(graph, this.nodes['Query'])

    graph.on('click', 'node', (evt) => {
      console.log(evt)
      let node = this.nodes[evt.target.id()]
      if (!node.expanded) {
        node.expanded = true
        this.expandGraph(graph, this.nodes[evt.target.id()], evt.renderedPosition)
        graph.layout(layout).run()
      }
    })

    let layout = {
      name: 'cola',
      animate: true,
      infinite: true,
      fit: false,
      edgeLength: 200,
      nodeSpacing: (node) => { return 50 }
    }

    graph.layout(layout).run()
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

<template>
  <div class="queryBuilder">
    <h1> Query Builder</h1>
    <div id='queryBuilder'></div>
    <div id='queryTypes'>
      <query-builder-type @buildType="addQuery" v-for="qt in queryTypes" :name="qt.name" :type="qt.type"></query-builder-type>
    </div>
  </div>
</template>

<script>
import QueryBuilderType from './QueryBuilderType.vue'
const cytoscape = require('cytoscape')
const cola = require('cytoscape-cola')
cytoscape.use(cola)

export default {
  name: 'queryBuilder',
  data () {
    return {
      nodes: {}, // an associative array of type names to its properties and edges
      queryTypesArray: [],
      graphRef: undefined,
      queryGraphs: []
    }
  },
  components: {
    QueryBuilderType
  },
  computed: {
    // A reference to the graphql schema
    schema: function () {
      return this.$store.state.graphqlSchema.data.__schema
    },
    queryTypes: {
      get: function () {
        return this.queryTypesArray // a dummy, undefined value
      },
      set: function (newValue) {
        this.queryTypesArray = newValue
      }
    },
    cytograph: {
      get: function () {
        return this.graphRef
      },
      set: function (graph) {
        this.graphRef = graph
      }
    }
  },
  methods: {
    addQuery (typeName) {
      let graphIndex = this.queryGraphs.length
      let node = {
        group: 'nodes',
        data: {
          index: graphIndex,
          attr: this.nodes[typeName],
          label: this.nodes[typeName].label,
          expanded: false
        }
      }
      this.queryGraphs.push(node)
      this.cytograph.add(node)
    },
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

    /*
     * @arg graph : A reference to a cytoscape graph
     * @arg parentNode: A reference to the node clicked, cytoscape node
     * @arg renderedPosition: where to branch the data out
     */
    expandGraph (graph, parentNode, renderedPosition) {
      let typeInfo = this.nodes[parentNode.data().label].data
      let fields = typeInfo.fields
      if (!fields) {
        return
      }
      fields.forEach((field) => {
        switch (field.type.kind) {
          case 'OBJECT':
            let typeRelation = graph.add({
              group: 'nodes',
              data: {
                index: parentNode.data().index,
                attr: this.nodes[field.type.name],
                label: field.type.name
              },
              renderedPosition: renderedPosition
            })
            graph.add({
              group: 'edges',
              data: {
                source: parentNode.id(),
                target: typeRelation.id(),
                label: field.name
              }
            })
            break

          case 'SCALAR':
            let node = graph.add({
              group: 'nodes',
              data: {
                label: field.name + ':' + field.type.name,
                index: parentNode.data().index
              },
              renderedPosition: renderedPosition
            })

            graph.add({
              group: 'edges',
              data: {
                label: field.name,
                source: parentNode.id(),
                target: node.id()
              }
            })
            break

          case 'LIST':
            let fieldKind = field.type.ofType.kind
            let fieldType = field.type.ofType.name
            switch (fieldKind) {
              case 'OBJECT':
                let childNode = graph.add({
                  group: 'nodes',
                  data: {
                    index: parentNode.data().index,
                    attr: this.nodes[fieldType],
                    label: fieldType
                  },
                  renderedPosition: renderedPosition
                })

                graph.add({
                  group: 'edges',
                  data: {
                    source: parentNode.id(),
                    target: childNode.id(),
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
    let container = document.getElementById('queryBuilder')
    this.cytograph = cytoscape({
      container: container,
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
            'target-arrow-shape': 'triangle',
            'content': 'data(label)',
            'color': '#0F0F0F',
            'curve-style': 'bezier',
            'text-background-opacity': 1,
            'text-border-color': '#000000',
            'text-border-width': 1,
            'text-border-opacity': 1,
            'text-background-color': '#ddd'
          }
        }
      ]
    })

    this.buildNodesMap()

    this.queryTypes = this.nodes['Query'].data.fields.map((field) => {
      return {name: field.name, type: field.type.name}
    })

    this.cytograph.on('click', 'node', (evt) => {
      let node = evt.target
      if (!node.data().expanded) {
        node.data().expanded = true
        this.expandGraph(this.cytograph, node, evt.renderedPosition)
        // let nodesInGraph = this.cytograph.filter('node[index=' + node.data().index + ']').select()
        // nodesInGraph.layout(layout).run()
        this.cytograph.layout(layout).run()
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
    this.cytograph.layout(layout).run()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #queryBuilder{
    width: 100%;
    height: 90%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: black;
    z-index: -1;
  }

  #queryTypes{
    background-color: red;
    z-index: 1;
    top: 90%;
    height: 10%;
    width: 100%;
    position: absolute;
    margin-left: -8px;
  }

  h1 {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    color: rgb(136, 148, 168); 
  }
</style>

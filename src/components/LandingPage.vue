<template>
  <div class="landingPage">
    <h1> Welcome to the GraphQL Oracle! </h1> 
    <div>
      <router-link to="Navigator">
        <h2> Schema Navigator </h2>
        <img :src="navigatorImageUrl">
      </router-link>
    </div>
    <div>
      <router-link to="QueryBuilder">
        <h2> Query Builder </h2>
        <img :src="querybuilderImageUrl">
      </router-link>
    </div>
    <div>
      <router-link to="DataNavigator">
        <h2> Data Navigator </h2>
        <img :src="dataNavigatorUrl">
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'landingPage',
  data () {
    return {
    }
  },
  computed: {
    navigatorImageUrl: function () {
      return require('../assets/SpaceImage.jpg')
    },
    querybuilderImageUrl: function () {
      return require('../assets/GraphQLLogo.svg')
    },
    dataNavigatorUrl: function () {
      return require('../assets/DataNavigator.png')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#landingPage {
  text-align: center;
}

h1, h2 {
  font-weight: normal;
}

img {
  border-radius: 50%;
  height:20em;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

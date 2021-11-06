<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.ternoff{
  display:none;
}
p, h1, h2{
  color: black;
}
</style>

<script>
export default {
    name: 'App',
    metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: 'GreenHouse',
      // all titles will be injected into this template
      titleTemplate: '%s | GreenHouse'
    }
  }
</script>

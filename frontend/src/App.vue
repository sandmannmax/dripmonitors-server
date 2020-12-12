<template>
  <div id="app">
    <ControlBar/>
    <router-view/>
  </div>
</template>

<script>
import ControlBar from './components/ControlBar'

export default {
  components: {
    ControlBar
  },
}
</script>

<style>
  @font-face {
    font-family: "Questrial";
    src: local("Questrial"),
    url(../public/Questrial-Regular.ttf) format("truetype");
  }

  #app {
    font-family: Questrial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>

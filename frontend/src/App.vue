<template>
  <div id="app">
    <ControlBar/>
    <div class="content-wrapper">
      <router-view/>
    </div>    
    <Footer/>
  </div>
</template>

<script>
import ControlBar from './components/ControlBar'
import Footer from './components/Footer'

export default {
  components: {
    ControlBar,
    Footer
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
    color: #2c3e50;
    min-height: 100vh;
  }

  .content-wrapper {
    min-height: calc(100vh - 150px);
    margin-top: 10px;
    margin-bottom: 4px;
  }
</style>

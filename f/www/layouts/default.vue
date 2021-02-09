<template>
  <div id="app">
    <NavBar />

    <section class="main-content">
      <nuxt />
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavBar from '../components/NavBar.vue';

@Component({
  components: { NavBar }
})
export default class Default extends Vue {
  items = [
    {
      title: 'Home',
      icon: 'home',
      to: { name: 'index' }
    },
    {
      title: 'Inspire',
      icon: 'lightbulb',
      to: { name: 'inspire' }
    }
  ]
}
</script>

<style scoped>
  @font-face {
    font-family: "Questrial";
    src: local("Questrial"),
    url(../static/Questrial-Regular.ttf) format("truetype");
  }

  #app {
    font-family: Questrial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background-color: #fafafa;
    min-height: 100vh;
  }

  .main-content {
    min-height: calc(100vh - 180px);
    margin-top: 10px;
    margin-bottom: 4px;
  }
</style>

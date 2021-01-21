<template>
  <div class="home">
    <div class="container">
      <h1 class="text-center">
        <img src="logo.png" width="300"/>
      </h1>
      <div class="text-center margin">
        <p>Get your customizable Sneaker-Monitor for your Cook-Group.</p>
      </div>     
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

@Component
export default class Home extends Vue {
}
</script>

<style scoped>
  .margin {
    margin-top: 50px;
  }
</style>
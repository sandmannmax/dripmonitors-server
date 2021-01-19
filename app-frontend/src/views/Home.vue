<template>
  <div class="home">
    <div class="container">
      <h1 class="text-center">
        <img src="logoFull.png" width="500"/>
      </h1>
      <div class="text-center margin">
        <p>Welcome to lazyshoebot.</p>
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
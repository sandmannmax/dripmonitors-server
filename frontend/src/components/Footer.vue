<template>
  <div class="main-div">
    <div class="container">
      Hello
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue { }
</script>

<style scoped>
  .main-div {
    height: 50px;
    color: white;
    background-color: rgb(48, 25, 25);
  }
</style>

<template>
  <div class="main-div">
    <div class="text-center">
      <router-link class="link" to="/impressum">Impressum</router-link>
      <router-link class="link" to="/agb">AGB</router-link>
    </div>
    <div class="text-center">
      lazyshoebot 2021&#169;
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
    height: 60px;
    color: white;
    background-color: rgb(22, 21, 21);
    text-decoration: none;
    padding: 5px 0px;
  }

  .link {
    margin: 0px 3px;
    color: white;
  }
</style>

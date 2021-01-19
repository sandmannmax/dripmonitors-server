<template>
  <div class="home">
    <div class="container">
      <div class="text-center margin">
        <h3>Impressum</h3>
        <p>Text</p>
      </div>     
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

@Component
export default class Impressum extends Vue {
}
</script>

<style scoped>
  .margin {
    margin-top: 50px;
  }
</style>
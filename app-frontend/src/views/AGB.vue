<template>
  <div class="home">
    <div class="container">
      <div class="text-center margin">
        <h3>AGB</h3>
        <p>Text</p>
      </div>     
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

@Component
export default class AGB extends Vue {
}
</script>

<style scoped>
  .margin {
    margin-top: 50px;
  }
</style>
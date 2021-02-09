<template>
  <b-navbar class="container" id="navbar">
    <template #brand>
      <nuxt-link class="nav-element" to="/" id="title"><img src="logo.png"/></nuxt-link>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <nuxt-link class="nav-element" to="/">Lazy Monitor</nuxt-link>
        <nuxt-link class="nav-element" to="/">Lazy AIO</nuxt-link>
        <span class="spacer"/>
        <a class="nav-element" :href="dashboard">Dashboard</a>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class NavBar extends Vue {
  
}
</script>

<style scoped>
  #navbar {
    height: 80px;
    background-color: transparent;
  }

  .navbar-burger {
    margin: auto auto 0 auto;
  }

  @media only screen and (max-width: 1023px) {
    #navbar {
      padding: 0px 20px;
    }
  }

  #title {
    width: 60px;
    height: 60px;
    margin: auto 0;
  }

  #title:hover {
    transform: scaleX(1.05) scaleY(1.05);
    transition: transform 0.2s;
  }

  .brand {
    height:
  }

  .nav-element {
    color: #2c3e50;
    font-size: 1.3em;
    transition: 0.5s;
    margin: 0px 10px;
  }

  .nav-element:hover {
    text-decoration: none;
    cursor: pointer;
    color: #7c8188;
  }

  .spacer {
    border-left: 1px solid #db3e3e;
    height: 20px;
  }

</style>

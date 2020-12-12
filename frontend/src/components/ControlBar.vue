<template>
  <b-navbar type="dark" id="navbar">
    <b-container>
      <b-navbar-nav>
        <router-link to="/" class="navbar-brand title" id="title">LSB</router-link>
        <router-link class="linkL" to="/monitor" v-if="user.loggedIn">Monitor</router-link>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <router-link class="link" to="/profile" v-if="user.loggedIn">Hallo, {{ user.name }}</router-link>
        <router-link class="linkR" to="/login" v-else>Login</router-link>
        <button class="btn btnCall" v-if="!user.loggedIn">Hol dir den Monitor</button>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component
export default class ControlBar extends Vue {
  @Getter user;
}
</script>

<style scoped>

.link {
  color: white;
  margin: auto 0px;
}

.linkL {
  color: white;
  margin: auto 0px auto 20px;
}

.linkR {
  color: white;
  margin: auto 20px auto 0px;
}

.btnCall {
  color: white;
  background-color: #db3e3e;
}

#navbar {
  background-color: rgb(22, 21, 21);
}

#title {
  font-size: 2em;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #db3e3e;
}

</style>

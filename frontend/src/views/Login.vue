<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5">
            <div class="card-body">
              <h5 class="card-title text-center">Einloggen</h5>
              <form class="form-signin" v-if="!user">
                <div class="form-label-group">
                  <input type="text" id="inputUsername" class="form-control" v-model="input.username" placeholder="Benutzername" required autofocus>
                  <label for="inputUsername">Benutzername</label>
                </div>

                <div class="form-label-group">
                  <input type="password" id="inputPassword" class="form-control" v-model="input.password" placeholder="Passwort" required>
                  <label for="inputPassword">Passwort</label>
                </div>

                <button class="btn btn-lg btnClass btn-block text-uppercase" type="button" v-on:click="loginForm()">Einloggen</button>
              </form>   
              <div v-else>
                <p class="signedIn-text">Bereits eingeloggt. Wollen Sie sich abmelden?</p>
                <button class="btn btn-lg btnClass btn-block text-uppercase" type="button" v-on:click="logoutForm()">Ausloggen</button>
              </div>
              <div class="divCenterMargin">
                <div>{{ error }}</div>
              </div>
              <div class="divCenterMargin">
                Noch keinen Account? <router-link to="/register">Hier</router-link> registrieren.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

@Component
export default class Login extends Vue {
  @Action login;
  @Action getServicesAccess;
  @Action logout;
  @Getter user;

  input = {
    username: '',
    password: ''
  };
  error = ''

  async loginForm() {
    if (this.input.username != '' && this.input.password != '') {
      this.error = await this.login({username: this.input.username, password: this.input.password});
      if (this.user) {
        await this.getServicesAccess({ accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
        this.$router.push({name: 'home'});
      }
    } else if (this.input.username == '')
      this.error = 'Bitte geben Sie einen Benutzernamen ein.';
    else
      this.error = 'Bitte geben Sie ein Password ein.';
  }

  async logoutForm() {
    this.error = await this.logout({ accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
  }
}
</script>

<style scoped>
  .card-signin {
    border: 0;
    border-radius: 1rem;
    box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);
  }

  .card-signin .card-title {
    margin-bottom: 2rem;
    font-weight: 300;
    font-size: 1.5rem;
  }

  .card-signin .card-body {
    padding: 2rem;
  }

  .form-signin {
    width: 100%;
  }

  .form-signin .btn {
    font-size: 80%;
    border-radius: 5rem;
    letter-spacing: .1rem;
    font-weight: bold;
    padding: 1rem;
    transition: all 0.2s;
  }

  h3 {
    text-align: center;
  }

  .inputForm {
    margin: auto;
    width: 100px;
    border: 2px solid rgb(44, 44, 44);
  }

  .form-label-group {
    position: relative;
    margin-bottom: 1rem;
  }

  .form-label-group input {
    height: auto;
    border-radius: 2rem;
  }

  .form-label-group>input,
  .form-label-group>label {
    padding: .75rem 1.5rem;
  }

  .form-label-group>label {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    margin-bottom: 0;
    /* Override default `<label>` margin */
    line-height: 1.5;
    color: #495057;
    border: 1px solid transparent;
    border-radius: .25rem;
    transition: all .1s ease-in-out;
  }

  .form-label-group input::-webkit-input-placeholder {
    color: transparent;
  }

  .form-label-group input:-ms-input-placeholder {
    color: transparent;
  }

  .form-label-group input::-ms-input-placeholder {
    color: transparent;
  }

  .form-label-group input::-moz-placeholder {
    color: transparent;
  }

  .form-label-group input::placeholder {
    color: transparent;
  }

  .form-label-group input:not(:placeholder-shown) {
    padding-top: calc(.75rem + .75rem * (2 / 3));
    padding-bottom: calc(.75rem / 3);
  }

  .form-label-group input:not(:placeholder-shown)~label {
    padding-top: calc(.75rem / 3);
    padding-bottom: calc(.75rem / 3);
    font-size: 12px;
    color: #777;
  }

  .divCenterMargin {
    margin-top: 8px;
    text-align: center;
  }

  .signedIn-text {
    font-size: 1.1rem;
    text-align: center;
  }

  .btnClass {
    color: white;
    background-color: #db3e3e;
  }
</style>
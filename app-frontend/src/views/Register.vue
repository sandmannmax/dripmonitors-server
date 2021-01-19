<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <h3>Registrieren</h3>
          <form class="form-signin" v-if="!user">
            <div class="form-label-group">
              <input type="text" id="inputUsername" class="form-control" v-model="input.username" placeholder="Benutzername" required autofocus>
              <label for="inputUsername">Benutzername</label>
            </div>

            <div class="form-label-group">
              <input type="text" id="inputMail" class="form-control" v-model="input.mail" placeholder="E-Mail Adresse" required autofocus>
              <label for="inputMail">E-Mail Adresse</label>
            </div>

            <div class="form-label-group">
              <input type="password" id="inputPassword" class="form-control" v-model="input.password" placeholder="Passwort" required>
              <label for="inputPassword">Passwort</label>
            </div>

            <button class="btn btn-lg btnClass btn-block text-uppercase" type="button" v-on:click="registerForm()">Registrieren</button>
          </form>                      
          <div class="divCenterMargin">
            <div class="error">{{ error }}</div>
          </div>
          <div class="divCenterMargin">
            Schon einen Account? <router-link to="/login">Hier</router-link> anmelden.
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
export default class Register extends Vue {
  @Action register;
  @Getter user;

  mounted() {
    if (this.user)
      this.$router.push('/profile');
  }

  input = {
    username: '',
    mail: '',
    password: ''
  };
  error = ''

  async registerForm() {
    if (this.input.username == '') {
      this.error = 'Bitte geben Sie einen Benutzernamen ein.';
      return;
    }

    if (this.input.mail == '') {
      this.error = 'Bitte geben Sie eine E-Mail Adresse ein.';
      return;
    }

    if (this.input.password == '') {
      this.error = 'Bitte geben Sie ein Passwort ein.';
      return;
    }

    this.error = await this.register({ username: this.input.username, mail: this.input.mail, password: this.input.password });
    if (this.user)
      this.$router.push({name: 'home'});
  }
}
</script>

<style scoped>
  .home {
    padding: 50px 0px;
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

  .btnClass {
    color: white;
    background-color: #db3e3e;
  }

  .error {
    color: #db3e3e;    
  }
</style>
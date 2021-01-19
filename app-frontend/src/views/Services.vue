<template>
  <div>
    <div class="container">
      <div class="row" v-for="service in services" v-bind:key="service._id">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5">
            <div class="card-body">
              <h5 class="card-title text-center">{{ service.name }}</h5>
              <button class="btn btn-sm btnClass btn-block text-uppercase" v-on:click="getAccess(service._id, service.name)">Zugriff bekommen</button>
            </div>
          </div>
        </div>
      </div>
      <b-modal id="getServiceAccessModal" hide-header hide-footer centered>
        <form @submit.stop.prevent="getAccessWithKey" class="text-center formMargin">    
          <div class="form-label-group">
            <input type="text" id="inputAccessKey" class="form-control" v-model="accessKey" placeholder="Access-Key" required autofocus>
            <label for="inputAccessKey">Access-Key</label>
          </div>
          <button class="btn btn-sm btnClass btn-block text-uppercase">Zugriff bekommen</button>
          <div class="errorField">{{ error }}</div>
        </form>
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

@Component
export default class Services extends Vue {
  @Getter user;
  @Getter services;
  @Getter servicesAccess;
  @Action getServices;
  @Action buyService;
  @Action getServicesAccess;

  accessKey = '';
  selectedServiceId = undefined;
  error = '';

  mounted() {
    if (this.services.length == 0)
      this.getServices();
  }

  getAccess(id, name) {
    if (this.user) {
      let alreadyOwned = false;
      for (let i = 0; i < this.servicesAccess.length; i++){
        if (this.servicesAccess[i]._id === id)
          alreadyOwned = true;
      }
      if (alreadyOwned)
        console.log('Already Owned');
      else {
        this.accessKey = '';
        this.error = '';
        this.selectedServiceId = id;
        this.$bvModal.show('getServiceAccessModal');
      }
    } else
      this.$router.push('login');
  }

  async getAccessWithKey() {
    this.error = await this.buyService({ serviceId: this.selectedServiceId, serviceAccessKey: this.accessKey, accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
    if (this.error === '') {      
      await this.getServicesAccess({ accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
      this.$router.push({name: 'home'});
    }
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

  .error-fields {
    margin-top: 8px;
    text-align: center;
  }

  .signedIn-text {
    font-size: 1.1rem;
    text-align: center;
  }

  .btnClass {
    margin-top: 20px;
    color: white;
    background-color: #db3e3e;
  }

  .formMargin {
    font-family: Questrial, sans-serif;
    margin: 40px;
  }

  .errorField {
    margin-top: 10px;
    color: #db3e3e;
  }
</style>
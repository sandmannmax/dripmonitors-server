<template>
  <div class="container">
    <div class="monitor">
      <div id="monitorConfiguration">
        <div>
          <b-img v-bind:src="monitor.monitor.botImage" rounded="circle" id="botImage"/>
          <h3>{{ monitor.monitor.botName }}</h3> 
          <p>
            <button class="btn btn-sm button" v-on:click="editMonitor()">Bearbeiten</button>
            <button class="btn btn-sm button" v-on:click="sendTestMessage()">Testnachricht senden</button>
          </p>          
        </div>
        
        <b-modal id="editMonitor" hide-header hide-footer centered>
          <form @submit.stop.prevent="" class="formMargin">
            <div class="form-label-group">
              <input type="text" id="inputWebhook" class="form-control" v-model="webHook" placeholder="Discord Webhook" required>
              <label for="inputWebhook">Discord Webhook</label>
            </div>
            <div class="form-label-group">
              <input type="text" id="inputBotname" class="form-control" v-model="botName" placeholder="Bot Name" required>
              <label for="inputBotname">Bot Name</label>
            </div>
            <div class="form-label-group">
              <input type="text" id="inputBotimage" class="form-control" v-model="botImage" placeholder="Bot Profilbild" required>
              <label for="inputBotimage">Bot Profilbild</label>
            </div>
            <button class="btn btn-sm btnClass btn-block text-uppercase" v-on:click="saveEditMonitor">Speichern</button> 
            <button class="btn btn-sm btnClass btn-block text-uppercase" v-on:click="cancelEditMonitor">Abbrechen</button> 
          </form>
          <div class="error">{{ editMonitorError }}</div>
        </b-modal>        
      </div>
      <div id="monitoredItems">
        <div class="monitoredItemsHeader">
          <h3>Beobachtete Produkte</h3>
          <button class="buttonAdd" v-on:click="add()">
            <svg width="1.6em" height="1.6em" viewBox="3 1 16 16" class="bi bi-plus" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button> 
        </div>      
        <div v-for="product in monitor.monitoredProducts" v-bind:key="product.id">
          <Product v-bind:product="product"/>
        </div>
        <b-modal id="addMonitoredItem" hide-header hide-footer centered>
          <form @submit.stop.prevent="addMonitoredItem" class="formMargin">
            <Dropdown v-bind:selectedItem.sync="selectedItem"/> 
            <div class="row">
              <div class="col-2">Name: </div>
              <div class="col-10">{{ selectedItem.name }}</div>
            </div>   
            <div class="row">
              <div class="col-2">Site: </div>
              <div class="col-10">{{ selectedItem.site }}</div>
            </div> 
            <div class="row">
              <div class="col-2">Preis: </div>
              <div class="col-10">
                <input type="number" v-model="price"/>
              </div>
            </div>
            <button class="btn btn-sm btnClass btn-block text-uppercase" v-bind:disabled="price == 0 || selectedItem.name == undefined">Hinzufügen</button> 
          </form>
          <div class="error">{{ addProductError }}</div>
        </b-modal>
      </div>
    </div>
  </div>  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import Dropdown from '../components/Dropdown.vue';
import Product from '../components/Product.vue';

@Component({
  components: {
    Dropdown,
    Product,
  }
})
export default class Monitor extends Vue {
  @Action getMonitor;
  @Action getMonitoredProducts;
  @Action getAvailableProducts;  
  @Action sendTestmessage;
  @Action addMonitoredProduct;
  @Action updateMonitor;
  @Getter user;
  @Getter hasMonitor;
  @Getter monitor;

  selectedItem: any = {};
  price = 0;

  webHook = '';
  botName = '';
  botImage = '';

  editMonitorError = '';
  addProductError = '';

  async mounted() {
    if (!this.user || !this.hasMonitor)
      this.$router.push('/');
    else {
      await this.getMonitor({ accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
      await this.getMonitoredProducts({ accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
      await this.getAvailableProducts({ accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
    }
  }

  sendTestMessage() {
    this.sendTestmessage({ accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
  }

  editMonitor() {
    this.webHook = this.monitor.monitor.webHook;
    this.botName = this.monitor.monitor.botName;
    this.botImage = this.monitor.monitor.botImage;
    this.$bvModal.show('editMonitor');
  }

  async saveEditMonitor() {
    this.editMonitorError = await this.updateMonitor({ webHook: this.webHook, botName: this.botName, botImage: this.botImage, accessToken: this.user.accessToken, refreshToken: this.user.refreshToken })
    if (this.editMonitorError == '')
      this.$bvModal.hide('editMonitor');
  }

  cancelEditMonitor() {
    this.$bvModal.hide('editMonitor');
  }

  add() {
    this.selectedItem = {};
    this.price = 0;
    this.$bvModal.show('addMonitoredItem');
  }

  async addMonitoredItem() {
    this.addProductError = await this.addMonitoredProduct({site: this.selectedItem.site, price: this.price, productId: this.selectedItem._id, accessToken: this.user.accessToken, refreshToken: this.user.refreshToken});
    if (this.addProductError == '')
      this.$bvModal.hide('addMonitoredItem');
    else if (this.addProductError == 'Produkt wird schon beobachtet') {      
      this.selectedItem = {};
      this.price = 0;
    }
  }
}
</script>

<style scoped>  
  .monitor {
    padding: 40px;
  }

  #monitorConfiguration {
    margin-bottom: 50px;
  }

  #monitorConfiguration h3 {
    display: inline;
    margin: auto 0;
  }

  #monitorConfiguration p {
    margin-top: 15px;
  }

  #monitorConfiguration p button {
    margin-right: 10px;
  }

  .button {
    color: white;
    background-color: #db3e3e;
  }

  .monitoredItemsHeader {
    display: flex;
    align-items: center;
    height: 3em;
  }

  .monitoredItemsHeader h3 {
    margin-top: auto;
    margin-bottom: auto;
  } 

  .buttonAdd {
    background-color: #db3e3e;
    border: none;
    width: 1.6em;
    height: 1.6em;
    border-radius: 50%;
    transition: .2s;
    margin-left: .5em;
  }

  #botImage {
    width: 60px;
    margin-right: 10px;
  }

  .btnClass {
    margin-top: 20px;
    color: white;
    background-color: #db3e3e;
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

  .error {
    margin-top: 5px;
    text-align: center;
    color: #db3e3e;
  }

</style>
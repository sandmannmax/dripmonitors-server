<template>
  <div class="container">
    <div id="monitorConfiguration">
      <h3>Konfiguration Monitor</h3>
      <div>
        <b-img v-bind:src="monitor.monitor.botImage" rounded="circle" id="botImage"/>
        {{ monitor.monitor.botName }}        
        <button class="btn btn-sm button" v-on:click="sendTestMessage()">Testnachricht senden</button> 
      </div>
      <div class="row">
        <div class="col">Webhook:</div>
        <div class="col-10">{{ monitor.monitor.webHook }}</div>
      </div>
      <div class="row">
        <div class="col">Name:</div>
        <div class="col-10">{{ monitor.monitor.botName }}</div>
      </div>
      <div class="row">
        <div class="col">Image:</div>
        <div class="col-10">{{ monitor.monitor.botImage }}</div>
      </div>
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
        <div>{{ product.product.name }} für {{ product.price }} von {{ product.product.site }}</div>
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
      </b-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import Dropdown from '../components/Dropdown.vue';

@Component({
  components: {
    Dropdown,
  }
})
export default class Monitor extends Vue {
  @Action getMonitor;
  @Action getMonitoredProducts;
  @Action getAvailableProducts;  
  @Action sendTestmessage;
  @Action addMonitoredProduct;
  @Getter user;
  @Getter hasMonitor;
  @Getter monitor;

  selectedItem: any = {};
  price = 0;

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

  add() {
    this.selectedItem = {};
    this.price = 0;
    this.$bvModal.show('addMonitoredItem');
  }

  addMonitoredItem() {
    this.addMonitoredProduct({site: this.selectedItem.site, price: this.price, productId: this.selectedItem._id, accessToken: this.user.accessToken, refreshToken: this.user.refreshToken});
    this.$bvModal.hide('addMonitoredItem');
  }
}
</script>

<style scoped>  
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

  #monitorConfiguration {
    margin: 30px 0;
  }

  #botImage {
    width: 40px;
    margin-right: 10px;
  }

  .btnClass {
    margin-top: 20px;
    color: white;
    background-color: #db3e3e;
  }

</style>
<template>
  <div class="productContainer row">
    <div class="col-10">
      <h5>{{ product.product.site }}: {{ product.product.name }}</h5>
      <div>
        <div>Preislimit: {{ product.price }}€</div>
        <div><span class="bad" v-if="product.product.soldOut && product.product.active">Ausverkauft</span><span class="bad" v-if="!product.product.active">Nicht erhältlich im Shop</span><span class="good" v-if="product.product.active">Erhältlich im Shop</span></div>
      </div>
    </div>
    <div class="col-2 trash-div">
      <button class="buttonDelete" v-on:click="del">
        <b-icon icon="trash-fill" color="white"/>
      </button> 
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';

@Component
export default class Product extends Vue 
{ 
  @Action deleteMonitoredProduct;
  @Getter user;

  @Prop(Object) product;  

  async del() {
    await this.deleteMonitoredProduct({ productId: this.product._id, site: this.product.product.site, accessToken: this.user.accessToken, refreshToken: this.user.refreshToken });
  }
}
</script>

<style scoped>
  .productContainer {
    margin: 0px 0px 10px 0px;
    padding: 5px;
    border: 1px solid black;
    border-radius: 15px;
  }

  .bad {
    color: white;
    background-color: #db3e3e;
    padding: 3px;
    border-radius: 5px;
    margin-right: 5px;
  }

  .good {
    color: black;
    background-color: #77af61;
    padding: 3px;
    border-radius: 5px;
    margin-right: 5px;
  }

  .trash-div {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .buttonDelete {
    background-color: #db3e3e;
    border: none;
    width: 1.8em;
    height: 1.8em;
    border-radius: 50%;
    transition: .2s;
  }
</style>

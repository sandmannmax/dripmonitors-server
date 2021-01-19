<template>
  <div class="dropdown">
    <input v-model="inputValue" class="dropdown-input" type="text" placeholder="Produkt finden" />
    <div class="dropdown-list" v-show="inputValue">
      <div v-on:click="selectItem(product)" v-for="product in monitor.availableProducts" :key="product._id" class="dropdown-item" v-show="productVisible(product)">
        {{ product.name }} - {{ product.site }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component
export default class Dropdown extends Vue {
  @Getter monitor;

  inputValue = '';

  productVisible (product) {
    let currentName = product.name.toLowerCase()
    let currentInput = this.inputValue.toLowerCase()
    let inputs = currentInput.split(' ');
    let visible = true;
    for (let i = 0; i < inputs.length; i++) {
      if (!currentName.includes(inputs[i]))
        visible = false;
    }
    return visible;
  }

  selectItem (product) {
    this.$emit('update:selectedItem', product);
    this.inputValue = '';
  }
}
</script>

<style scoped>
.dropdown{
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  z-index: 1;
}
.dropdown-input, .dropdown-selected{
  width: 100%;
  padding: 10px 16px;
  border: 1px solid transparent;
  background: #edf2f7;
  line-height: 1.5em;
  outline: none;
  border-radius: 8px;
}
.dropdown-input:focus, .dropdown-selected:hover{
  background: #fff;
  border-color: #e2e8f0;
}
.dropdown-input::placeholder{
  opacity: 0.7;
}
.dropdown-selected{
  font-weight: bold;
  cursor: pointer;
}
.dropdown-list{
  position: absolute;
  width: 100%;
  max-height: 500px;
  margin-top: 4px;
  overflow-y: auto;
  background: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}
.dropdown-item{
  display: flex;
  width: 100%;
  padding: 11px 16px;
  cursor: pointer;
}
.dropdown-item:hover{
  background: #edf2f7;
}
.dropdown-item-flag{
  max-width: 24px;
  max-height: 18px;
  margin: auto 12px auto 0px;
}
</style>

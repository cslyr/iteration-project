<template>
  <div>
    <iframe ref="myIframe" src=" http://127.0.0.1:5173/" style="width: 500px;height: 500px;background-color: aqua;"></iframe>
    <div class="product-filter">
      <div class="filter-option">
        <label for="color">Color:</label>
        <select id="color" v-model="selectedOptions.color">
          <option v-for="option in colorOptions" :value="option">{{ option }}</option>
        </select>
      </div>
      <div class="filter-option">
        <label for="size">Size:</label>
        <select id="size" v-model="selectedOptions.size">
          <option v-for="option in sizeOptions" :value="option">{{ option }}</option>
        </select>
      </div>
      <button @click="applyFilter">Apply Filter</button>
    </div>

    <div class="filtered-products">
      <div v-for="product in filteredProducts" :key="product.id">
        {{ product.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive ,onMounted} from 'vue';
console.log('222')
onMounted(()=>{
  window.addEventListener('message', function(e) {
        alert('data from domain1 ---> ' + e.data);

        var data = JSON.parse(e.data);
        // if (data) {
        //     data.number = 16;

        //     // 处理后再发回domain1
        //     window.parent.postMessage(JSON.stringify(data), 'http://www.domain1.com');
        // }
    }, false);
    console.log("222mounted")
})
const products = reactive([
  {
    id: 1,
    name: 'Product A',
    options: [
      { name: 'Color', value: 'Red' },
      { name: 'Size', value: 'Small' }
    ]
  },
  {
    id: 2,
    name: 'Product B',
    options: [
      { name: 'Color', value: 'Blue' },
      { name: 'Size', value: 'Large' }
  ]
    }
    // ... more products
  ]
);

const colorOptions = products.reduce((acc, product) => {
  product.options.forEach(option => {
    if (option.name === 'Color' && !acc.includes(option.value)) {
      acc.push(option.value);
    }
  });
  return acc;
}, []);

const sizeOptions = products.reduce((acc, product) => {
  product.options.forEach(option => {
    if (option.name === 'Size' && !acc.includes(option.value)) {
      acc.push(option.value);
    }
  });
  return acc;
}, []);

const selectedOptions = reactive({
  color: '',
  size: ''
});

const filteredProducts = ref([]);

function applyFilter() {
  filteredProducts.value = filterProductsBySKU(selectedOptions);
}

function filterProductsBySKU(selectedOptions) {
  return products.filter(product => {
    return Object.keys(selectedOptions).every(optionName => {
      const selectedValue = selectedOptions[optionName];
      return product.options.some(productOption => {
        return productOption.name === optionName && productOption.value === selectedValue;
      });
    });
  });
}
</script>

<style lang="less">
.product-filter {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.filter-option {
  margin-right: 20px;
}

.filter-option label {
  margin-right: 5px;
}

.filtered-products {
  /* Styles for displaying filtered products */
}
</style>
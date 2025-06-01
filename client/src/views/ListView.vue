<template>
  <div class="list-view">
    <header>
      <MainHeader />
    </header>
           
  <div class="search" v-if="products.length > 0">
      <input type="text" placeholder="Buscar Produto" v-model="searchText" @input="searchProduct()" id="search" />
      <i class="fa fa-search icon" @click="searchProduct()"></i>
  </div>
    <div class="wrapper" v-if="products.length > 0">
      <div class="product-list">
      <div class="list-item" v-for="product in filteredProducts" :key="product.id" @click="goToProduct(product.id)">
        <div class="product-container">
          <img :src="product.image" class="product-image" alt="Cover image" />

          <div class="products-info">
            <h2 class="title">{{ product.nome }}</h2>
            <div class="description">{{ fixLength(product.descricao) }}</div>
         
                <div v-if="product.preco === 0" class="price">
                  <i class="fa-solid fa-hand-holding-heart"></i>
                </div>
                <div v-else class="price">R$ {{ product.preco.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="not-found" v-if="filteredProducts.length === 0">
      <h2>Nenhum produto encontrado :(</h2>
    </div>

    <div class="not-found" v-else-if="products.length === 0">
      <h2>Nenhum produto disponível :(</h2>
    </div>
</div>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainHeader from '@/components/headers/MainHeader.vue';
// import { getAllProducts } from '@/controllers/ProductController'


export default {
  name: 'ListView',
  components: {
    MainHeader
  }, 
  data() {
    return {
      products:[],
      filteredProducts: []   
    }
  },
  computed: {
      ...mapGetters(['loggedInUser'])
  },
  methods: {
    goToProduct(id) {
      this.$router.push(`/product/${id}`)
    },
    normalizeString(string) {
      console.log(string)
      return string
      // return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    },
    searchProduct() {
      if (this.searchText === '') {
        this.filteredProducts = this.products
      } else {
        this.filteredProducts = this.products.filter(product => {
          return this.normalizeString(product.nome).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) || 
          this.normalizeString(product.descricao).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) 
        })
      }
    },
    fixLength: function (text) {
        return text.length > 50 ? text.substr(0, 50) + '...' : text
    }
  },
  
  async mounted() {
    console.log(this.loggedInUser?.id)

    // await getAllProducts().then((response) => {
        
    //     let products = response.data

    //     products.forEach(product => {
    //       const photoLink = product.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
    //       product.image = 'http://localhost:3000/' + photoLink
    //     })

    //     // filtra produtos que nao sao do usuario logado
    //     products = products.filter(product => product.idVendedor !== this.loggedInUser.id);

    //     this.products = products
    //     this.filteredProducts = products
    // }).catch((error) => {
    //   console.log(error)
    // })

    //mock
    this.products = [
      {
        id: 1,
        nome: 'Produto 1',
        descricao: 'Descrição do Produto 1',
        preco: 100.00,
        idVendedor: 2,
        // imagem qualquer estatica
        image: 'https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=900&width=1600&fit=bounds'
      },
      {
        id: 2,
        nome: 'Produto 2',
        descricao: 'Descrição do Produto 2',
        preco: 200.00,
        idVendedor: 3,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 3,
        nome: 'Produto 3',
        descricao: 'Descrição do Produto 3',
        preco: 1, 
        idVendedor: 4,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 4,
        nome: 'Produto 4',
        descricao: 'Descrição do Produto 4',
        preco: 150.00,
        idVendedor: 5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 5,
        nome: 'Produto 5',
        descricao: 'Descrição do Produto 5',
        preco: 300.00,
        idVendedor: 6,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 6,
        nome: 'Produto 6',
        descricao: 'Descrição do Produto 6',
        preco: 50.00,
        idVendedor: 7,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 7,
        nome: 'Produto 7',
        descricao: 'Descrição do Produto 7',
        preco: 75.00,
        idVendedor: 8,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 8,
        nome: 'Produto 8',
        descricao: 'Descrição do Produto 8',
        preco: 120.00,
        idVendedor: 9,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      }
    ];
    
    this.filteredProducts = this.products
    console.log(this.products)
  }
}
</script>

<style lang="less">
header {
  margin-bottom:20px;
}

.search {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    border: 1px solid var(--secondaryColor);
    padding: 10px 10px;
    margin: 0px 0 20px 40px;
    position: relative;

    //sizing
    width: 300px;
    height: 40px;
    
    input {
        border: none;
        outline: none;
        background-color: transparent;
        font-size: 18px;
        font-family: Gellix;
        width: 100%;
        padding-right: 25px;
    }

    i {
        font-size: 20px;
        position: absolute;
        right: 10px;
        color: gray;
    }
}   

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin: 0 0 50px 40px;
}


.product-list {
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}

.product-image{
    padding: 5px;
    width: 250px;
    height: 170px;
    object-fit: contain;
}
.list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.product-container {
  display: flex;
  flex-direction: column;
  height: 90%;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.products-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
  font-family: Gellix;
  color: #333;
  margin: 0;
}

.description {
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
  color: #333;
}

.price {
  font-size: 18px;
  color: var(--primaryColor);
  font-weight: 600;
  margin-top: 15px;
}

i{
    color: var(--primaryColor);
    font-size: 33px;
}

.not-found {
  margin-top: 120px;
  text-align: center;
  color: var(--secondaryColor);
}
</style>
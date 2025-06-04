<template>
  <div class="list-view">
    <header>
      <MainHeader />
    </header>
           
    <div class="search" v-if="cars.length > 0">
      <input type="text" placeholder="Buscar Carro" v-model="searchText" @input="searchCar()" id="search" />
      <i class="fa fa-search icon" @click="searchCar()"></i>
    </div>

    <div class="wrapper" v-if="cars.length > 0">
      <div class="car-list">
        <div class="list-item" v-for="car in filteredCars" :key="car.id" @click="goToCar(car.id)">
          <div class="car-container">
            <img :src="car.image" class="car-image" alt="Cover image" />

            <div class="cars-info">
              <h2 class="title">{{ car.nome }}</h2>
              <div class="description">{{ fixLength(car.descricao) }}</div>

              <div v-if="car.preco === 0" class="price">
                <i class="fa-solid fa-hand-holding-heart"></i>
              </div>
              <div v-else class="price">R$ {{ car.preco.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="not-found" v-if="filteredCars.length === 0">
        <h2>Nenhum carro encontrado :(</h2>
      </div>

      <div class="not-found" v-else-if="cars.length === 0">
        <h2>Nenhum carro disponível :(</h2>
      </div>
    </div>  
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MainHeader from '@/components/headers/MainHeader.vue';
// import { getAllCars } from '@/controllers/CarController'

export default {
  name: 'ListView',
  components: {
    MainHeader
  }, 
  data() {
    return {
      cars: [],
      filteredCars: [],
      searchText: ''
    }
  },
  computed: {
    ...mapGetters(['loggedInUser'])
  },
  methods: {
    goToCar(id) {
      this.$router.push(`/car/${id}`)
    },
    normalizeString(string) {
      return string
      // return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    },
    searchCar() {
      if (this.searchText === '') {
        this.filteredCars = this.cars
      } else {
        this.filteredCars = this.cars.filter(car => {
          return this.normalizeString(car.nome).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) || 
                 this.normalizeString(car.descricao).toLowerCase().includes(this.normalizeString(this.searchText).toLowerCase()) 
        })
      }
    },
    fixLength(text) {
      return text.length > 50 ? text.substr(0, 50) + '...' : text
    }
  },
  
  async mounted() {
    // console.log(this.loggedInUser?.id)

    // await getAllCars().then((response) => {
    //   let cars = response.data

    //   cars.forEach(car => {
    //     const photoLink = car.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
    //     car.image = 'http://localhost:3000/' + photoLink
    //   })

    //   cars = cars.filter(car => car.idVendedor !== this.loggedInUser.id)

    //   this.cars = cars
    //   this.filteredCars = cars
    // }).catch((error) => {
    //   console.log(error)
    // })

    // mock
    this.cars = [
      {
        id: 1,
        nome: 'Carro 1',
        descricao: 'Descrição do Carro 1',
        preco: 100.00,
        idVendedor: 2,
        image: 'https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=900&width=1600&fit=bounds'
      },
      {
        id: 2,
        nome: 'Carro 2',
        descricao: 'Descrição do Carro 2',
        preco: 200.00,
        idVendedor: 3,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 3,
        nome: 'Carro 3',
        descricao: 'Descrição do Carro 3',
        preco: 1,
        idVendedor: 4,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 4,
        nome: 'Carro 4',
        descricao: 'Descrição do Carro 4',
        preco: 150.00,
        idVendedor: 5,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 5,
        nome: 'Carro 5',
        descricao: 'Descrição do Carro 5',
        preco: 300.00,
        idVendedor: 6,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 6,
        nome: 'Carro 6',
        descricao: 'Descrição do Carro 6',
        preco: 50.00,
        idVendedor: 7,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 7,
        nome: 'Carro 7',
        descricao: 'Descrição do Carro 7',
        preco: 75.00,
        idVendedor: 8,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      },
      {
        id: 8,
        nome: 'Carro 8',
        descricao: 'Descrição do Carro 8',
        preco: 120.00,
        idVendedor: 9,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEyR_bM0FtYagyhUZY7F2H5rBSJjclo5atmg&s'
      }
    ];
    
    this.filteredCars = this.cars
    console.log(this.cars)
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


.car-list {
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}

.car-image{
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

.car-container {
  display: flex;
  flex-direction: column;
  height: 90%;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.car-info {
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
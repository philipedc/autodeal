<template>
  <div class="user-cars">
    <div class="list-header">
        <div class="user-cars-options">
            <div class="left">
                <div class="search">
                    <input type="text" placeholder="Buscar Carro" v-model="searchText" @input="searchCar()"/>
                    <i class="fa fa-search icon" @click="searchCar()"></i>
                </div>
            </div>
            <div class="right" @click="carModalOpen = true">
              <h2> Cadastrar Carro </h2>
            </div>
        </div>
    </div>
    
    <div class="car-list-profile" v-if="cars.length > 0">
        <div class="car" v-for="car in filteredCars" :key="car.id" @click="confirmDelete(car.id)">
            <img :src="car.image" />
            <div class="name">{{ fixLength(car.nome) }}</div>
           
            <div v-if="car.preco == 0" class="price">
                <i class="fa-solid fa-hand-holding-heart"></i>
            </div>
            <div v-else class="price"> {{ formatValue(car.preco) }}</div>
        </div>
    </div>

    <div v-else class="not-found">
        <h3> Você ainda não cadastrou nenhum carro </h3>
    </div>

    <CarRegistrationModal :modalOpen="carModalOpen" @closeModal="closeCarModal()" />

    <ModalComponent :modalOpen="confirmationModalOpen" @closeModal="confirmationModalOpen = false">
      <div class="exc-car-modal">
        <i class="fa-solid fa-exclamation-circle"></i>
        <h2>Deseja realmente deletar este carro?</h2>
        <div class="exc-buttons">
          <button class="btn btn-primary" @click="confirmationModalOpen = false">Cancelar</button>
          <button class="btn btn-confirm" @click="deleteSelectedCar">
            Confirmar
          </button>
        </div>
      </div>
    </ModalComponent>

  </div>
</template>

<script>
import CarRegistrationModal from '@/components/modals/CarRegistrationModal.vue'
import ModalComponent from '@/components/modals/ModalComponent.vue'
import { getUserCars } from '@/controllers/ProfileController'
import { mapGetters } from 'vuex'
import { deleteCar } from '@/controllers/CarController' 

export default {
  name: 'UserCars',
  components: {
    CarRegistrationModal,
    ModalComponent
  },
  data() {
    return {
      searchText: '',
      carModalOpen: false,
      cars: [],
      filteredCars: [],
      selectedCarId: null,
      confirmationModalOpen: false
    }
  },
  methods: {
    formatValue(value) {
      if (!value) return 'R$ 0,00'
      return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    },
    fixLength(text) {
      return text.length > 25 ? text.substr(0, 25) + '...' : text
    },
    normalizeString(string) {
      return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
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
    async closeCarModal() {
      this.carModalOpen = false
      const id = this.loggedInUser?.id
      if (id) {
        await getUserCars(id).then((response) => {
          const cars = response.data

          cars.forEach(car => {
            const photoLink = car.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
            car.image = 'http://localhost:3000/' + photoLink
          })

          this.cars = cars
          this.filteredCars = cars
        })
      }
    },
    confirmDelete(carId) {
      this.selectedCarId = carId;
      this.confirmationModalOpen = true;
    },
    async deleteSelectedCar() {
      if (this.selectedCarId) {
        try {
          await deleteCar(this.selectedCarId);
          this.confirmationModalOpen = false;
          this.selectedCarId = null;
          this.closeCarModal(); // atualiza lista

          this.$toast.open({
            message: 'Carro deletado com sucesso!',
            type: 'success',
            position: 'top-right',
            duration: 3000
          });
        } catch (error) {
          console.error('Erro ao deletar carro:', error);
        }
      }
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  async mounted() {
    const id = this.loggedInUser?.id
    if (id) {
      await getUserCars(id).then((response) => {
        const cars = response.data

        cars.forEach(car => {
          const photoLink = car.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
          car.image = 'http://localhost:3000/' + photoLink
        })

        this.cars = cars
        this.filteredCars = cars
      })
    }
  }
}
</script>

<style lang="less">
.user-cars {
  margin-top: 20px;

  .user-cars-options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        i {
            font-size: 25px;
            color: var(--secondaryColor);
            cursor: pointer;
        }

        .search {
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 5px;
            box-sizing: border-box;
            border: 1px solid var(--secondaryColor);
            padding: 10px 10px;
            position: relative;
            margin: 0 50px 0 20px;

            //sizing
            width: 400px;
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
                position: absolute;
                right: 10px;
                color: gray;
            }
        }            
    }

    .right {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;

        h2 {
            font-weight: 500;
            font-size: 22px;
            color: var(--primaryColor);
            border: 1px solid var(--primaryColor);
            border-radius: 5px;
            padding: 10px;
        }
    }
  }

  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    margin-top: 40px;

    h3 {
        font-weight: 500;
    }
  }

  .car-list-profile {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin: 20px 0 40px 20px;
    
    .car {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: space-evenly;
        align-items: center;
        min-height: 90px;
        text-align: center;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.18);
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        transition: all linear .2s;
        height: min(300px, 100%);
        padding: 10px;
        cursor: pointer;

        img {
            width: 100%;
            height: 150px;
            border-radius: 5px;
            object-fit: contain;
            margin-top: 10px;
        }

        .name {
            font-size: 18px;
            margin: 10px;
        }

        .price {
            color: var(--primaryColor);
            font-size: 22px;
            padding: 10px 0px;
            font-weight: 600;
        }

        &:active{
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.25);
        }
    }
  }

  .exc-car-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    h2 {
        font-size: 22px;
        font-weight: 500;
        text-align: center;
        max-width: 450px;
        word-break: break-word;
    }

    i {
        color: #3b3b3b;
    }

    button {
        width: 100px;
        height: 40px;
        border-radius: 5px;
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }

    .btn-primary {
        background-color: #fff;
        border: 1px solid #ccc;
        color: #232323;
    }

    .btn-confirm {
        background-color: var(--primaryColor);
        color: white;
    }

    .exc-buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
  }
}
</style>
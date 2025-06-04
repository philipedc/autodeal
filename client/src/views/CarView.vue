<template>
  <div class="car-view">
    <header>
      <MainHeader />
    </header>
     
    <div class="car">

      <i class="fa-solid fa-arrow-left" @click="this.$router.push('/')">  </i>

      <div class="car-info">
        <h1>{{ car.nome }}</h1>

        <div class="car-details">
          <div class="detail">
            <p class="label">Descrição </p><p>{{ car.descricao }}</p>
          </div>
        </div>

        <div class="car-details">
          <div class="detail">
            <p class="label">Preço</p><p> R$ {{ car.preco }}</p>
          </div>
        </div>

        <div class="buy">
          Deseja obter este carro?
          <span @click="confirmationModalOpen = true">
            Entre em contato com o anunciante!
          </span>
        </div>
      </div>

      <div class="car-image">

        <img :src="car.image" alt="Imagem do Carro" /> 

        <div class="car-anunciante">
          <p class="car">Carro anunciado por</p>

          <div class="anunciante">
            <img class="dono" :src="vendor.image" alt="Imagem do anunciante" />
            <p class="anunciante-nome">{{ vendor.nome }}</p>
          </div>

        </div>
      </div>
    </div>

    <ModalComponent :modalOpen="confirmationModalOpen" @closeModal="confirmationModalOpen = false">
      <div class="buy-car-modal">
        <i class="fa-solid fa-exclamation-circle"></i>
        <h2>Confirma a aquisição deste carro?</h2>
        <div class="buy-buttons">
          <button class="btn btn-primary" @click="confirmationModalOpen = false">Cancelar</button>
          <button class="btn btn-confirm" @click="buyCar">
            Confirmar
          </button>
        </div>
      </div>
    </ModalComponent>

  </div>
</template>

<script>
import MainHeader from '@/components/headers/MainHeader.vue'
import { getCar, getVendor } from '@/controllers/CarController'
import userDefault from '@/assets/images/user-default-image.png'
import ModalComponent from '@/components/modals/ModalComponent.vue'
import { performSale } from '@/controllers/SaleController'
import { mapGetters } from 'vuex'

export default {
  name: 'CarView',
  components: {
    MainHeader,
    ModalComponent
  },
  data() {
    return {
      car: {},
      vendor: {},
      userDefault,
      confirmationModalOpen: false
    };
  },
  methods: {
    async buyCar () {
      const carId = this.car.id
      const buyerId = this.loggedInUser.id
      const vendorId = this.car.idVendedor

      await performSale(carId, buyerId, vendorId).then((res) => {
        if (res.status === 200) {
          this.$toast.open({
            message: 'Compra realizada com sucesso!',
            type: 'success',
            duration: 4000,
            position: 'top-right'
          })
          this.$router.push('/')
          this.confirmationModalOpen = false
        }
      }).catch((error) => {
        console.log(error)
        this.$toast.open({
          message: 'Erro ao realizar a compra. Tente novamente.',
          type: 'error',
          duration: 5000,
          position: 'top-right'
        })
      })
    }
  },
  async mounted() {
    const carId = this.$route.params.carId

    await getCar(carId).then((response) => {
      const car = response.data
      const photoLink = car.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
      car.image = 'http://localhost:3000/' + photoLink
      this.car = car
    }).catch((error) => {
      console.log(error)
    })

    await getVendor(this.car.idVendedor).then((response) => {
      const vendor = response.data

      if (!vendor.foto) {
        vendor.image = userDefault
      }
      else {
        const photoLink = vendor.foto.replace(/\\/g, '/').replace('uploads', 'uploads/')
        vendor.image = 'http://localhost:3000/' + photoLink
      }
      this.vendor = vendor
    }).catch((error) => {
      console.log(error)
    })
  },
  computed: {
    ...mapGetters(['loggedInUser'])
  }
}
</script>

<style lang="less">
.car-view {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 20px;

  header {
			margin-bottom: 90px;
  }

  .car {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      width: 100%;
      justify-content: center;
    

      i {
        color: var(--primaryColor);
        font-size: 35px;
        margin-top: 32px; 
        margin-left: 15px;
        margin-right: 25px;
        align-self: flex-start;
      }

        .car-info{
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 20px;
            margin-left: 40px;
            
           

            h1 {
              font-size: 40px;
              font-weight: 400;
              color: #000000; 
              text-align: left; 
              margin: 0 0 17px 0;
            }
     
            h2 {
                font-size: 30px;
                font-weight: 400;
                margin-bottom: 50px;
                color: var(--primaryColor);
                text-align: left;
            }

            .car-details{
                display: flex;
                flex-direction: row;
                align-items: left;
                width: 100%;
                justify-content: left;
                gap: 150px;

                .detail{
                    display: flex;
                    flex-direction: column;
                }

                .label{
                    color : var(--primaryColor);
                    text-align: left;
                    font-size: 24px;
                    margin-bottom: 12px;
                    

                }

                p{
                    color: #000000;
                    text-align: left;
                    font-size: 22px;
                    font-weight: medium;
                }

            }

            .buy {
                margin-top: 50px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                span {
                    color: var(--primaryColor);
                    font-weight: 600;
                    margin-left: 10px;
                    cursor: pointer;
                }
            }
        }

        .car-image{

            display: flex;
            flex-direction: column;
            align-items: center;

            margin-right: 40px;
            
            width: 1100px;
            height: 500px;
            justify-content: center;
            
            border-radius: 50px;
            background-color: #b80b0b;
            padding: 20px;

            gap:50px;
         

            img {
                margin-top: 0px;
                width: 300px;
                height: 250px;
                object-fit: contain;
                border-radius: 35px;  
            }

            .produto-anunciante{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                gap:15px;

                
                .produto{
                    color: #ffffff;
                    text-align: left;
                    font-size:20px;

                }
                .anunciante{
                    display: flex;
                    flex-direction: row;
                    align-items: strech;
                    gap: 20px;
                    margin-bottom: 20px;

                    img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        object-fit: cover;
                    }

                    .dono{ 
                      width: 50px;
                      height: 50px;
                    }
                
                    .anunciante-nome{
                        color: #ffffff;
                        font-weight: bold;
                        margin-top: 7px;
                        text-align: left;
                        font-size:20px;

                    }
                }

            }
        }
    }

    .buy-car-modal {
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

        .buy-buttons {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 20px;
        }
    }
}    

</style>
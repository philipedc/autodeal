<template>
  <div class="vendor-car-modal">
      <ModalComponent :modalOpen="modalOpen" @closeModal="$emit('closeModal')">
          <h2>Cadastrar Carro</h2>
          
          <div class="top-fields">
              <div class="text-inputs">
                  <h3><span>*</span> Campos obrigatórios</h3>
                  <label for="name">Modelo <span>*</span></label>
                  <input type="text" placeholder="Ex: Honda Civic" required ref="name" >

                  <label for="price">Preço <span>*</span></label>
                  <input type="text" placeholder="Preço" required ref="price" @input="formatPrice" >
              </div>

              <div class="text-inputs">
                  
              </div>
          
              <div class="image-input">
                  <label for="inputfile" class="add-image-label" v-if="!imagePreviewUrl">
                      Adicionar imagem
                  </label>
                  <input type="file" id="inputfile" @change="handleFileUpload" class="file-input" ref="inputfile" >
                  <div class="image-preview" v-if="imagePreviewUrl" @click="triggerFileInput">
                      <img :src="imagePreviewUrl" alt="Preview da imagem">
                      <h2>Alterar imagem</h2>
                  </div>
              </div>
          </div>

          <div class="middle-fields">
              <div>
                  <div class="middle-upper-fields">
                    <div class="field-group">
                      <label for="ano">Ano <span>*</span></label>
                      <input type="text" placeholder="Ex: 2018" required ref="ano">
                    </div>
                    <div class="field-group">
                      <label for="quilometragem">Quilometragem <span>*</span></label>
                      <input type="text" placeholder="Ex: 50000" required ref="quilometragem" @input="formatPrice">
                    </div>
                  </div>

                  <label for="description">Descrição <span>*</span></label>
                  <textarea type="text"  
                  class="description-area" placeholder="Descrição do carro" required ref="description"></textarea>
              </div>
          </div>

          <div class="buttons">
              <button class="cancel" @click="$emit('closeModal')">Cancelar</button>
              <button 
                  class="save" 
                  @click="handleSave" 
                  v-if="!loading" 
              >
                  Salvar
              </button>
              <div class="loading" v-else>
                  <i class="fa fa-spinner fa-spin"></i>
                  <h2>Salvando...</h2>
              </div>
          </div>
      </ModalComponent>
  </div>
</template>

<script>
import ModalComponent from '@/components/modals/ModalComponent.vue'
import { mapGetters } from 'vuex'
import { addUserCar } from '@/controllers/ProfileController'

export default {
  name: 'CarRegistrationModal',
  components: {
    ModalComponent
  },
  props: ['modalOpen', 'car'],
  data() {
    return {
      imagePreviewUrl: null,
      imgFile: null,
      fileChanged: false,
      loading: false,
      isDonation: false
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file?.type !== 'image/jpeg' && file?.type !== 'image/png' && file?.type !== 'image/svg+xml' && file?.type !== 'image/webp') {
          this.$toast.open({
              message: 'Formato de imagem inválido. Use JPG, PNG, SVG ou WEBP.',
              type: 'warning',
              position: 'top-right',
              duration: 5000
          })
          return
      }
      if (file) {
          this.fileChanged = true
          this.imagePreviewUrl = URL.createObjectURL(file)
          this.imgFile = file
      }
    },
    formatPrice() {
      let value = this.$refs.price.value
      value = value.replace(/\D/g, "")
      if (value) {
        value = (parseInt(value) / 100).toLocaleString("pt-BR", { 
            style: "currency", 
            currency: "BRL" 
        })
      }
      this.$refs.price.value = value
    },
    async handleSave() {
      this.loading = true
      const name = this.$refs.name.value
      const description = this.$refs.description.value
      let price = this.$refs.price.value
      const idVendedor = this.loggedInUser.id
      const ano = this.$refs.ano.value
      const quilometragem = this.$refs.quilometragem.value

      if (!name || !price || !description) {
        this.$toast.open({
          message: 'Preencha todos os campos obrigatórios',
          type: 'warning',
          position: 'top-right',
          duration: 5000
        })
        this.loading = false
        return
      }

      if (ano < 1900 || ano > new Date().getFullYear()) {
        this.$toast.open({
          message: 'Ano inválido',
          type: 'warning',
          position: 'top-right',
          duration: 5000
        })
        this.loading = false
        return
      }

      if (quilometragem < 0) {
        this.$toast.open({
          message: 'Quilometragem inválida',
          type: 'warning',
          position: 'top-right',
          duration: 5000
        })
        this.loading = false
        return
      }

      const sanitizedPrice = price.replace(/[^\d,]/g, '').replace(',', '.')
      price = parseFloat(sanitizedPrice)

      const formData = new FormData()
      formData.append('nome', name)
      formData.append('descricao', description)
      formData.append('preco', price)
      formData.append('foto', this.imgFile)
      formData.append('idVendedor', idVendedor)
      formData.append('ano', ano)
      formData.append('quilometragem', quilometragem)

      await addUserCar(formData).then((res) => {
        if (res.status === 200) {
          this.$toast.open({
            message: 'Carro cadastrado com sucesso',
            type: 'success',
            position: 'top-right',
            duration: 5000
          })
        } else {
          this.$toast.open({
            message: 'Erro ao cadastrar carro',
            type: 'error',
            position: 'top-right',
            duration: 5000
          })
        }
        this.loading = false
        this.$emit('closeModal')
      }).catch(() => {
        this.$toast.open({
          message: 'Erro ao cadastrar carro',
          type: 'error',
          position: 'top-right',
          duration: 5000
        })
        this.loading = false
        this.$emit('closeModal')
      })
    },
    triggerFileInput() {
      this.$refs.inputfile.click()
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  watch: {
    isDonation() {
      if (this.isDonation) {
        this.$refs.price.setAttribute('disabled', true)
        this.$refs.price.value = '0.00'
        this.$refs.price.style.backgroundColor = '#f2f2f2'
      } else {
        this.$refs.price.removeAttribute('disabled')
        this.$refs.price.style.backgroundColor = '#fff'
      }
    },
    modalOpen: {
      handler() {
        this.$nextTick(() => {
          this.fileChanged = false
          this.imagePreviewUrl = null
          this.isDonation = false
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.vendor-car-modal {
    * {
        box-sizing: border-box;
    } 

    h2 {
        font-size: 20px;
        font-weight: 500;
    }
    h3 {
        font-size: 12px;
        font-weight: 500;
        text-align: left;
        span {
            color: var(--primaryColor);
        }
    }

    label {
        font-size: 12px;
        font-weight: 500;
        text-align: left;
        margin-bottom: 10px;
        span {
            color: var(--primaryColor);
        }
    }

    input, select {
        width: 180px;
        height: 40px;
        border-radius: 5px;
        border: 1px solid #ccc;
        padding: 0 10px;
        font-size: 14px;
        font-weight: 500;
        color: #232323;
        margin-bottom: 20px;
    }

    .top-fields {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: 25px;
        margin-top: 20px;

        .text-inputs {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
        }

        .image-input {
            .file-input {
                display: none;
            }

            .add-image-label {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 180px;
                height: 150px;
                border: 2px dashed #828282;
                border-radius: 5px;
                cursor: pointer;
                color: #828282;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin-top: 30px;
            }

            .image-preview {
                width: 180px;
                height: 170px;
                border-radius: 5px;
                padding: 5px;
                font-size: 14px;
                font-weight: 500;
                color: #232323;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                img {
                    width: 100%;
                    height: 100%;
                    max-width: 150px;
                    max-height: 130px;
                    object-fit: contain;
                    cursor: pointer;
                }

                h2 {
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--primaryColor);
                    cursor: pointer;
                }
            }
        }
    }

    .middle-fields {
      .middle-upper-fields {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          .field-group {
            display: flex;
            flex-direction: column;

            label {
              margin-bottom: 5px;
            }

            input {
              width: 180px;
              height: 40px;
              border-radius: 5px;
              border: 1px solid #ccc;
              padding: 0 10px;
              font-size: 14px;
              font-weight: 500;
              color: #232323;
            }
          }
        }

        div {
            display: flex;
            flex-direction: column;
        }

        .description-area {
            width: -webkit-fill-available;
            height: 100px;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 10px;
            font-size: 14px;
            font-weight: 500;
            color: #232323;
            margin-bottom: 20px;
            font-family: 'Gellix', sans-serif;
        }

        select {
            width: 180px;
            color: #737373;
        }
    }
    
    .bottom-fields {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;

        div {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
        }

        & > div:first-child {
            margin-right: 40px;
        }
    } 

    .donation-field {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;

      .donation {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: 1px;

          input {
              width: 20px;
              height: 20px;
              margin-right: 10px;
          }

          label {
              font-size: 14px;
              font-weight: 500;
              color: #232323;
          }
      }
    }

    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;

        button {
            width: 100px;
            height: 40px;
            border-radius: 5px;
            border: none;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }

        .cancel {
            background-color: #fff;
            border: 1px solid #ccc;
            color: #232323;
        }

        .save {
            background-color: var(--primaryColor);
            color: #fff;
        }

        .loading {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 10px;
            color: var(--primaryColor);

            h2 {
                font-size: 16px;
                font-weight: 500;
            }
        }
    }
}
</style>
<template>
  <div class="user-history">
    <div class="list-header-vendor">
        <div class="header-item" v-for="(field, fkey) in listFields" :key="fkey">
            <h2>{{ field.display }}</h2>
        </div>
    </div>

    <div class="history-item" v-for="item in transactions" :key="item.id" v-if="transactions.length > 0">
        <div class="image">
          <img :src="item.image" alt="car" />
        </div>
        <p>{{ item.name }}</p>
        <p>{{ fixLength(item.description) }}</p>

        <div class="price">
          <div v-if="item.price === 0"> 
            <i class="fa-solid fa-hand-holding-heart" style="color: black; font-size: 25px;"></i>
          </div>
          <div v-else class="price"> 
            <p>{{ formatValue(item.price) }}</p>
          </div>            
        </div>

        <p>{{ item.data }}</p>
    </div>     

    <div v-else class="not-found">
        <h3> Você ainda não realizou nenhuma transação </h3>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserTransactions } from '@/controllers/UserTransactionsController'
import { getCar } from '@/controllers/CarController' // Renomeado para carro

export default {
  name: 'UserHistory',
  data() {
    return {
      listFields: [
        { display: 'Imagem' },
        { display: 'Nome', name: 'name' },
        { display: 'Descrição', name: 'description' },
        { display: 'Preço', name: 'price' },
        { display: 'Data', name: 'date' }
      ],
      transactions: []
    }
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  methods: {
    formatValue(value) {
      if (!value) return 'R$ 0,00'
      return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    },
    async augmentTransaction(transaction) {
      const carro = await getCar(transaction.idCarro); // renomeado
      if (!carro) {
        console.error('Carro não encontrado para a transação: ', transaction);
        return;
      }

      transaction.name = carro.data.nome;
      transaction.description = carro.data.descricao;
      transaction.price = carro.data.preco;

      const photoLink = carro.data.foto.replace(/\\/g, '/').replace('uploads', 'uploads/');
      transaction.image = 'http://localhost:3000/' + photoLink;
    },
    fixLength(text) {
      return text.length > 50 ? text.substr(0, 50) + '...' : text;
    }
  },
  async mounted() {
    await getUserTransactions(this.loggedInUser.id).then(async (response) => {
      const transactions = response.data;

      for (let transaction of transactions) {
        const date = new Date(transaction.createdAt);
        transaction.data = date.toLocaleDateString('pt-BR');
        await this.augmentTransaction(transaction);
      }

      this.transactions = transactions;
    });
  }
}
</script>

<style lang="less">
.user-history {
  .list-header-vendor {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      align-items: center;
      margin-top: 20px;
      padding: 10px;
      
      h2 {
          font-size: 16px;
          font-weight: 500;
      }

      .header-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 10px;

          i {
              color: #232323;
          }
      }
  }

  .history-item {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    align-items: center;
    margin-top: 20px;
    padding: 10px;
    
    .image {
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 70px;
        height: 70px;
        display: flex;
        object-fit: contain;
      }
    }
  
    p {
        font-size: 16px;
        font-weight: 00;
        color: black;

    }

    .type {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;

      .sale {
        background-color: rgb(187, 92, 92);
        padding: 5px;
        border-radius: 5px;
      }

      .purchase {
        background-color: rgb(102, 175, 102);
        padding: 5px;
        border-radius: 5px;
      }

      .price{
        color: black;
      }

      
    .user-history .history-item .type i {
    color: black; /* Define a cor do ícone */
    font-size: 20px; /* Define o tamanho do ícone */
    }
    .user-history .history-item .type i {
    color: black !important; /* Assegura que a cor será aplicada */
    font-size: 20px !important; /* Assegura que o tamanho será aplicado */
}
    }
  }

  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;

    h3 {
      font-size: 22px;
      font-weight: 500;
    }
  }
}
</style>
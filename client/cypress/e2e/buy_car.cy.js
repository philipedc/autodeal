describe('Compra de Carro e Histórico', () => {
  // Define os dados para os dois usuários que serão criados
  const timestamp = Date.now();
  const seller = {
    email: `seller${timestamp}@example.com`,
    password: 'password123'
  };
  const buyer = {
    email: `buyer${timestamp}@example.com`,
    password: 'password123'
  };
  const carNameToSell = `Carro à Venda - ${timestamp}`;

  it('Deve permitir que um usuário compre um carro de outro e verifique a transação no histórico', () => {
    // Parte 1: Vendedor anuncia o carro
    cy.log('**Parte 1: VENDEDOR ANUNCIA O CARRO**');

    // Cria o usuário Vendedor. cy.register já faz o login inicial.
    cy.registerViaUI(seller.email, seller.password);

    // Navega para o perfil para cadastrar o carro
    cy.visit('/profile');
    cy.get('h2').contains('Cadastrar Carro').click();

    // Preenche os dados do carro
    cy.get('.vendor-car-modal input[placeholder="Ex: Honda Civic"]').type(carNameToSell);
    cy.get('.vendor-car-modal input[placeholder="Preço"]').type('55000');
    cy.get('.vendor-car-modal input[placeholder="Ex: 2018"]').type('2020');
    cy.get('.vendor-car-modal input[placeholder="Ex: 50000"]').type('25000');
    cy.get('.vendor-car-modal textarea.description-area').type('Descrição completa do carro para venda.');

    // Faz o upload da imagem
    cy.fixture('car.jpg', 'base64').then(b64 => {
      const blob = Cypress.Blob.base64StringToBlob(b64, 'image/jpeg');
      const file = new File([blob], 'car.jpg', { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      cy.get('.vendor-car-modal input[type="file"]').then($input => {
            $input[0].files = dataTransfer.files;
            $input[0].dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    cy.get('.vendor-car-modal button.save').click();
    cy.contains('Carro cadastrado com sucesso').should('be.visible');

    // Desloga o Vendedor. Adapte o seletor se necessário.
    cy.logout();

    // Parte 2: Comprador encontra e compra o carro
    cy.log('**Parte 2: COMPRADOR COMPRA O CARRO**');

    // Cria e loga o usuário Comprador
    cy.registerViaUI(buyer.email, buyer.password);

    // Encontra o carro na página inicial
    cy.visit('/');
    cy.contains('.list-item .title', carNameToSell).should('be.visible').click();

    // Na página de detalhes do carro, inicia a compra
    cy.url().should('include', '/car/');
    cy.get('.buy span').click();

    // Confirma a compra no modal
    cy.get('.buy-car-modal').should('be.visible');
    cy.get('.buy-car-modal .btn-confirm').click();

    // Parte 3: Verificações pós-compra
    cy.log('**Parte 3: VERIFICAÇÕES PÓS-COMPRA**');

    // Verifica a mensagem de sucesso e o redirecionamento
    cy.contains('Compra realizada com sucesso!').should('be.visible');
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);

    // Verifica que o carro comprado não está mais na lista principal
    cy.contains('.list-item .title', carNameToSell).should('not.exist');

    // Navega para o perfil do comprador para checar o histórico
    cy.visit('/profile');
    cy.get('.options h1').contains('Histórico').click();

    // Verifica se o carro comprado aparece na lista de transações
    cy.get('.user-history').should('be.visible');
    cy.contains('.history-item p', carNameToSell).should('be.visible');
  });
});


describe('Registra carro', () => {

  beforeEach(() => {
    cy.login('iago@gmail.com', '123');
      
    // abre o modal de cadastro
    cy.visit('/profile');
    cy.get('h2').contains('Cadastrar Carro').click();
  });

  it('Deve cadastrar carro com dados válidos', () => {
    cy.intercept('POST', '/cars').as('addCar');

    cy.get('input[placeholder="Ex: Honda Civic"]').type('Honda Civic');
    cy.get('input[placeholder="Preço"]').type('22000');
    cy.get('input[placeholder="Ex: 2018"]').type('2018');
    cy.get('input[placeholder="Ex: 50000"]').type('50000');
    cy.get('textarea.description-area').type('Carro de teste válido.');

    cy.fixture('car.jpg', 'base64').then(b64 => {
      const blob = Cypress.Blob.base64StringToBlob(b64, 'image/jpeg');
      const file = new File([blob], 'car.jpg', { type: 'image/jpeg' });
      const dt = new DataTransfer();
      dt.items.add(file);
      cy.get('input[type="file"]').then($input => {
        $input[0].files = dt.files;
        $input[0].dispatchEvent(new Event('change', { bubbles: true }));
      });
    });

    cy.get('button.save').click();
    cy.wait('@addCar').its('response.statusCode').should('eq', 200);
    cy.contains('Carro cadastrado com sucesso').should('be.visible');
  });

  it('Não deve cadastrar carro com quilometragem inválida', () => {
    cy.get('input[placeholder="Ex: Honda Civic"]').type('Honda Civic');
    cy.get('input[placeholder="Preço"]').type('15000');
    cy.get('input[placeholder="Ex: 2018"]').type('2018');
    cy.get('input[placeholder="Ex: 50000"]').type('-100');
    cy.get('textarea.description-area').type('Teste quilometragem negativa.');

    cy.get('button.save').click();
    cy.contains('Quilometragem inválida').should('be.visible');
  });

  it('Não deve cadastrar carro com ano inválido (2030)', () => {
    cy.get('input[placeholder="Ex: Honda Civic"]').type('Honda Civic');
    cy.get('input[placeholder="Preço"]').type('15000');
    cy.get('input[placeholder="Ex: 2018"]').type('2030');
    cy.get('input[placeholder="Ex: 50000"]').type('10000');
    cy.get('textarea.description-area').type('Teste ano futuro.');

    cy.get('button.save').click();
    cy.contains('Ano inválido').should('be.visible');
  });
});

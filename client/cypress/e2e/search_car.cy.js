describe('Carro - Buscar Carro', () => {
  let email;
  let password;

  before(() => {
    const timestamp = Date.now();
    email = `user${timestamp}@example.com`;
    password = '123';
    cy.register(email, password);
    cy.wait(500);
  });

  it('Deve buscar um carro pelo nome com sucesso', () => {
    // Intercepta a API para fornecer dados simulados de carros
    cy.intercept('GET', '/cars', {
      statusCode: 200,
      body: [
        {
          id: 1,
          nome: 'Toyota Corolla',
          descricao: 'Sedan confortável e econômico.',
          preco: 75000.0,
          ano: 2019,
          quilometragem: 45000,
          available: true,
          idVendedor: 2,
          foto: 'uploads\\corolla.jpg'
        },
        {
          id: 2,
          nome: 'Ford Fiesta',
          descricao: 'Compacto ideal para cidade.',
          preco: 45000.0,
          ano: 2018,
          quilometragem: 60000,
          available: true,
          idVendedor: 2,
          foto: 'uploads\\fiesta.jpg'
        },
        {
          id: 3,
          nome: 'Honda Civic',
          descricao: 'Desempenho e elegância em um só carro.',
          preco: 85000.0,
          ano: 2020,
          quilometragem: 30000,
          available: true,
          idVendedor: 2,
          foto: 'uploads\\civic.jpg'
        },
      ],
    }).as('getCars');

    // Visita a página inicial
    cy.visit('/');

    // Aguarda a API ser chamada e o DOM ser renderizado
    cy.wait('@getCars');

    // Verifica que todos os carros estão visíveis inicialmente
    cy.contains('Toyota Corolla').should('be.visible');
    cy.contains('Ford Fiesta').should('be.visible');
    cy.contains('Honda Civic').should('be.visible');

    // Busca por um carro específico
    cy.get('#search').type('Fiesta');
    cy.wait(500); // Aguarda debounce

    // Verifica que apenas o carro buscado está visível
    cy.contains('Ford Fiesta').should('be.visible');
    cy.contains('Toyota Corolla').should('not.exist');
    cy.contains('Honda Civic').should('not.exist');
  });
});

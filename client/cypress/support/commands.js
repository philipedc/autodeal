import 'cypress-file-upload';

/**
 * @description Comando para registrar um novo usuário via UI.
 * Ideal para ser usado APENAS no teste que valida a tela de registro.
 */
Cypress.Commands.add('registerViaUI', (email, password) => {
  cy.visit('/login');

  // Abrir o modal de registro
  cy.get('[data-testid="open-register-modal"]', { timeout: 10000 }).should('be.visible').click();

  // Preencher os campos de registro
  cy.get('input#nameReg').type('Teste Usuário');
  cy.get('input#emailReg').type(email);
  cy.get('input#cellphoneReg').type('(11) 91234-5678');
  cy.get('input#passwordReg').type(password);

  // Enviar o formulário de registro
  cy.get('.submit-register-btn button').click();

  // Verificar a mensagem de sucesso e redirecionamento
  cy.contains('Usuário cadastrado com sucesso!').should('be.visible');
  cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});

/**
 * @description Comando para logar na aplicação.
 */
Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login');
    
    // Preencher os campos de login
    cy.get('input#email').type(email);
    cy.get('input#password').type(password);
    
    // Enviar o formulário de login
    cy.get('.button button').click();
    
    // Verificar a mensagem de boas-vindas e redirecionamento
    cy.contains('Bem vindo(a)!').should('be.visible');
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});


/**
 * @description Comando para deslogar da aplicação.
 * O seletor deve ser robusto.
 */
Cypress.Commands.add('logout', () => {
  // ATENÇÃO: Adapte este seletor para o seu botão de logout.
  // É uma boa prática adicionar um atributo data-cy="logout-button" no seu componente.
  cy.get('[data-cy="logout-button"]').click();
  cy.url().should('include', '/login');
});
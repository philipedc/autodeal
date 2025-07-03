describe('Carro - Excluir Anúncio', () => {
    before(() => {
        cy.login('iago@gmail.com', '123');
    });

    it('Deve cadastrar e depois excluir um carro com sucesso', () => {
        // Parte 1: Cadastrar o Carro via UI 
        cy.visit('/profile');
        cy.get('h2').contains('Cadastrar Carro').click();

        const carName = `Carro de Teste ${Date.now()}`;
        cy.get('.vendor-car-modal input[placeholder="Ex: Honda Civic"]').type(carName);
        cy.get('.vendor-car-modal input[placeholder="Preço"]').type('35000');
        cy.get('.vendor-car-modal input[placeholder="Ex: 2018"]').type('2015');
        cy.get('.vendor-car-modal input[placeholder="Ex: 50000"]').type('78000');
        cy.get('.vendor-car-modal textarea.description-area').type('Carro que será excluído durante o teste.');

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

        // Parte 2: Excluir o Carro
        // pega o primeiro ".car" e clica nele
        cy.get('.car-list-profile .car').first().click();

        cy.get('.exc-car-modal').should('be.visible');
        cy.get('.exc-car-modal .btn-confirm').click();

        cy.contains('Carro deletado com sucesso!').should('be.visible');
        cy.contains('.car-list-profile .car .name', carName).should('not.exist');
    });
});

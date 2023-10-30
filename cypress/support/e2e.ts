Cypress.Commands.add('login', (email: string, password: string) => {
    // Visit the login page
    cy.visit('http://localhost:5173/login');

    // Fill out the login form and submit
    cy.get('input[name="email"]')
      .type(email);
      //.type('john.doe@example.com');

    cy.get('input[name="password"]') 
      .type(password);
      // .type('testPassword');

    cy.contains('Login').click(); // adjust if your login button has a different label

    cy.wait(1000);

    // After successful login, navigate to the main page
    cy.visit('http://localhost:5173');
});


Cypress.Commands.add('logout', () => {
    cy.visit('http://localhost:5173/');

    // Fill out the login form and submit
    cy.get('[data-testid="logout-button"]').click()
      //.type('john.doe@example.com');
});

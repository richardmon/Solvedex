declare namespace Cypress {
    interface Chainable<Subject> {
        login(username: string, password: string): Chainable<any>;
        logout(): Chainable<any>;
        // Add other custom commands here as needed
    }
}


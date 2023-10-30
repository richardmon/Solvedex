describe("Post Creation", () => {
  const title = "e2e test";
  const content = "random content for testing";

  beforeEach(() => {
    cy.login("john.doe@example.com", "testPassword");
    cy.visit("http://localhost:5173/");
    cy.url().should("include", "/");  // Ensure we're on the homepage after login
  });

  it("should create a new post", () => {
    cy.get('[data-test="new-post-button"]').click();
    cy.url().should("include", "/post");

    cy.get('[data-test="post-title-input"]').type(title);
    cy.get('[data-test="post-content-textarea"]').type(content);
        // Intercept the HTTP request
    cy.intercept({
      method: 'POST',      
      url: 'http://localhost:3000/api/v1/posts'
    }).as('createPost');
    cy.contains("Save").click();

    cy.wait('@createPost');
    cy.visit("http://localhost:5173/");

    cy.contains(title).should("be.visible"); // Make sure post title is visible on the page
  });
});

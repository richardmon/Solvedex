describe("Post Modification", () => {
  const originalTitle = "Modify Test";
  const updatedContent = "Updated content for testing";

  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  afterEach(() => {
    cy.logout();
  });

  describe("as John Doe", () => {
    before(() => {
      cy.login("john.doe@example.com", "testPassword");
    });

    it("should allow John Doe to modify his post", () => {
      cy.contains(originalTitle)
        .parents('[data-testid="post-card"]')
        .within(() => {
          cy.get('[data-testid="dropdown-pencil"]').click();
        });
      cy.get('[data-testid="dropdown-modify"]').click();

      cy.get("textarea").type(updatedContent);
      cy.contains("Save").click();

      cy.visit("http://localhost:5173/");
      cy.contains(updatedContent).should("exist");
    });
  });

  describe("as Richard User", () => {
    before(() => {
      cy.login("richard@example.com", "testPassword");
    });

    it("should not show the delete option for posts not belonging to Another User", () => {
      // Navigate to a post not belonging to 'Richard User'
      // For demonstration, we're using the title of John's post
      cy.contains(originalTitle)
        .parents('[data-testid="post-card"]')
        .within(() => {
          cy.get('[data-testid="dropdown-pencil"]').should("not.exist");
        });
    });
  });
});

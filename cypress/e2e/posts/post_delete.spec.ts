describe("Post Deletion", () => {
  const postToDeleteTitle = "Delete Test";
  const postBelongstoJohnDoe = "Static Test";

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

    it("should allow John Doe to delete his post", () => {
      cy.contains(postToDeleteTitle)
        .parents('[data-testid="post-card"]')
        .within(() => {
          cy.get('[data-testid="dropdown-pencil"]').click();
        });
      cy.get('[data-testid="dropdown-delete"]').click();

      cy.get("button").contains("Delete").click();

      cy.contains(postToDeleteTitle).should("not.exist");
    });
  });

  describe("as Richard User", () => {
    before(() => {
      cy.login("richard@example.com", "testPassword");
    });

    it("should not show the delete option for posts not belonging to Another User", () => {
      // Navigate to a post not belonging to 'Richard User'
      // For demonstration, we're using the title of John's post
      cy.contains(postBelongstoJohnDoe)
        .parents('[data-testid="post-card"]')
        .within(() => {
          cy.get('[data-testid="dropdown-pencil"]').should("not.exist");
        });
    });
  });
});

describe('Donor Screening Questionnaire', () => {
    const questionnaireUrl = '/portal/donors/appointments/1/screening-questionaires';

    before(() => {
        // Seed the database once for all tests in this block
        cy.seed('donor-with-appointment');
    });

    beforeEach(() => {
        // Log in as the donor before each test
        cy.loginAsDonor();
        cy.visit(questionnaireUrl);
    });

    it('should allow a first-time submission with confirmation modal', () => {
        cy.contains('h2', 'Donor Screening Questionnaire');

        // Answer 'NO' to all questions initially
        cy.get('input[value="NO"]').click({ multiple: true });

        // Answer 'YES' to the first question and provide details
        cy.get('input[value="YES"]').first().click();
        cy.get('textarea[placeholder*="additional information"]').should('be.visible').type('Test details for YES answer');

        // Open the confirmation modal
        cy.contains('button', 'Submit Questionnaire').click();

        // Check modal content
        cy.contains('h2', 'Confirm Your Answers').should('be.visible');
        cy.contains('li', 'YES').should('be.visible');
        cy.contains('li', 'Test details for YES answer').should('be.visible');

        // Confirm and submit
        cy.contains('button', 'Confirm & Submit').click();

        // Assert success and redirection
        cy.contains('Questionnaire submitted successfully.').should('be.visible');
        cy.url().should('include', '/portal/donors/appointments');
    });

    it('should allow updating an existing submission', () => {
        cy.visit(questionnaireUrl); // Re-visit the page to see the update flow

        // Verify form is pre-filled
        cy.get('input[value="YES"]:checked').should('exist');
        cy.get('textarea').should('have.value', 'Test details for YES answer');
        cy.contains('button', 'Update Questionnaire').should('be.visible');

        // Change the first answer to 'NO'
        cy.get('input[value="NO"]').first().click();
        cy.get('textarea[placeholder*="additional information"]').should('not.exist');

        // Open the confirmation modal
        cy.contains('button', 'Update Questionnaire').click();

        // Check modal for updated answer
        cy.contains('li', 'NO').should('be.visible');
        cy.contains('li', 'YES').should('not.exist');

        // Confirm and submit
        cy.contains('button', 'Confirm & Submit').click();
        cy.contains('Questionnaire submitted successfully.').should('be.visible');
    });

    it('should allow canceling from the confirmation modal', () => {
        cy.visit(questionnaireUrl);

        cy.contains('button', 'Update Questionnaire').click();
        cy.contains('h2', 'Confirm Your Answers').should('be.visible');

        // Go back to editing
        cy.contains('button', 'Go Back & Edit').click();
        cy.contains('h2', 'Confirm Your Answers').should('not.exist');

        // Ensure the form is still interactive
        cy.get('input[value="NO"]').first().click();
        cy.get('input[value="NO"]:checked').first().should('exist');
    });
});

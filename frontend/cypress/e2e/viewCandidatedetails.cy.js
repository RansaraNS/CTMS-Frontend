describe('Manage Candidates (Admin) CTMS', () => {
    it('View Candidates Details and download CV', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('Manage Candidate').should('be.visible').click()
      cy.wait(2000)
      cy.contains('View Details').click()
      cy.wait(2000)
      cy.contains('View CV').click()
      cy.wait(3000)
      cy.contains('Download CV').click()
      cy.wait(2000)
      cy.contains('Back to Candidates').click()
      cy.wait(2000)

      cy.get(':nth-child(1) > .px-6.font-medium > .flex > .text-blue-600').click()
      cy.wait(2000)
      cy.get('[name="phone"]').should('be.visible').type('{selectall}{backspace}0771234567')
      cy.wait(2000)
      cy.get('[name="skills"]').should('be.visible').type('HTML, CSS, JavaScript, React')
      cy.wait(2000)
      cy.contains('Save Changes').click()

      cy.get(':nth-child(1) > .px-6.font-medium > .flex > .text-red-600').click()


    })
})
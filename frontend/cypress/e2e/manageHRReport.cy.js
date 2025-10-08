describe('Manage HR CTMS', () => {
    it('manage HR REport Generation', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('Manage HR').click()
      cy.get('.space-y-8 > .flex > .bg-gradient-to-r').click()


 


    })
})
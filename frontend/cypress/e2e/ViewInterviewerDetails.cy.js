describe('View Interviewers CTMS', () => {
    it('View Interviewers View Feedbacks', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('View Interviews').click()

      cy.contains('View Feedback').click()
      cy.wait(2000)
      cy.contains('Print Feedback').click()
      cy.wait(2000)
      cy.contains('Back to Interviews').click()

    })

    it('View Interviewers Join Meeting ', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')    
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('View Interviews').click()
  
        cy.contains('Join Meeting').click()
  
      })
})
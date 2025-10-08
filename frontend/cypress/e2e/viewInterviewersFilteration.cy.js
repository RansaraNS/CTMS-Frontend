describe('View Interviewers CTMS', () => {
    it('View Interviewers', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('View Interviews').click()


      cy.get('[type="date"]').type('2025-10-05')
      cy.get('select.border-0').select('scheduled')
      cy.wait(2000)
      cy.get('select.border-0').select('completed')
      cy.wait(2000)
      cy.get('select.border-0').select('cancelled')
      
    })
})
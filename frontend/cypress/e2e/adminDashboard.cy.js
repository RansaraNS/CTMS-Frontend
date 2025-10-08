describe('Admin Daashboard CTMS', () => {
    it('Admin Dashboard Buttons Navigation', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('View All HRs').click()
      cy.contains('Dashboard').should('be.visible').click()
      cy.contains('View All HRs').should('be.visible').click()
      cy.contains('Dashboard').click()
      cy.contains('Add New HR').should('be.visible').click()
      cy.contains('Dashboard').click()
      cy.contains('View All Interviews').should('be.visible').click()
      cy.contains('Dashboard').click()

  
    })
  })
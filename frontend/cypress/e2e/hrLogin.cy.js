describe('Hr Login CTMS', () => {
    it('Admin Login with Valid Credentials ', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
      cy.get('[name="password"]').type('hr123456')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
  
    
  
    })
    it('Admin Login with Invalid Credentials', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('yoonus.hr.lk').should('have.value', 'yoonus.hr.lk')    
      cy.get('[name="password"]').type('123').should('have.value', '123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
  
  
  
    })
  })
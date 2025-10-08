describe('Admin Login CTMS', () => {
  it('Admin Login with Valid Credentials ', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[name="email"]').type('admin@ctms.com')    
    cy.get('[name="password"]').type('admin123')
    cy.get('.space-y-6 > .bg-gradient-to-r').click()

  

  })
  it('Admin Login with Invalid Credentials', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[name="email"]').type('admin.com')    
    cy.get('[name="password"]').type('admin123')
    cy.get('.space-y-6 > .bg-gradient-to-r').click()



  })
})
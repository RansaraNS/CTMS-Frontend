describe('Manage HR CTMS', () => {
    it('Search Manage HR with Valid Details', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('Manage HR').click()


      cy.get('.space-y-8 > .flex > .flex-1 > .w-full').type('Nimal Silva').should('have.value','Nimal Silva')
      cy.wait(2000)
      cy.get('.space-y-8 > .flex > .flex-1 > .w-full').clear()
      cy.wait(2000)
      cy.get('.space-y-8 > .flex > .flex-1 > .w-full').type('nimal@gmail.com').should('have.value','nimal@gmail.com')
      cy.wait(2000)
      cy.get('.space-y-8 > .flex > .flex-1 > .w-full').clear()

    

  
    })
    it('Search Manage HR with Invalid Details', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')    
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Manage HR').click()
  
  
        cy.get('.space-y-8 > .flex > .flex-1 > .w-full').type('John Doe')
        cy.wait(2000)
        cy.get('.space-y-8 > .flex > .flex-1 > .w-full').clear()
        cy.wait(2000)
        cy.get('.space-y-8 > .flex > .flex-1 > .w-full').type('john@gmail.com')
        cy.wait(2000)
        cy.get('.space-y-8 > .flex > .flex-1 > .w-full').clear()

 

})
})
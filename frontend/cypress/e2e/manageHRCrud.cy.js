describe('Manage HR CTMS', () => {
    it('Update Manage HR with Valid Details', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('Manage HR').click()


      cy.contains('Edit').click()
      cy.wait(2000)
      cy.get('#update-name').clear()
      cy.get('#update-name').type('jack perera')
      cy.wait(2000)
      cy.get('#update-email').clear()
      cy.get('#update-email').type('nimal@gmail.com')
      cy.wait(2000)
      cy.get('#update-password').type('nimal123')
      cy.wait(2000)
      cy.get('#update-role').clear()
      cy.get('#update-role').type('HR')
      cy.wait(2000)
      cy.get('.space-y-6 > .flex > .bg-gradient-to-r').click()
      cy.contains('Save').click()


    })

    it('Update Manage HR with Invalid Details (Email)', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')    
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Manage HR').click()
  
  
        cy.contains('Edit').click()
        cy.wait(2000)
        cy.get('#update-name').clear()
        cy.get('#update-name').type('11111')
        cy.wait(2000)
        cy.get('#update-email').clear()
        cy.get('#update-email').type('nimal.com')
        cy.wait(2000)
        cy.get('#update-password').type('123')
        cy.wait(2000)
        cy.get('#update-role').clear()
        cy.get('#update-role').type('Manager')
        cy.wait(2000)
        cy.get('.space-y-6 > .flex > .bg-gradient-to-r').click()
        cy.contains('Save').click()

  
      })

      it('Update Manage HR with Invalid Details (Role)', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')    
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Manage HR').click()
  
  
        cy.contains('Edit').click()
        cy.wait(2000)
        cy.get('#update-name').clear()
        cy.get('#update-name').type('11111')
        cy.wait(2000)
        cy.get('#update-email').clear()
        cy.get('#update-email').type('nimal@gmail.com')
        cy.wait(2000)
        cy.get('#update-password').type('123')
        cy.wait(2000)
        cy.get('#update-role').clear()
        cy.get('#update-role').type('Manager')
        cy.wait(2000)
        cy.get('.space-y-6 > .flex > .bg-gradient-to-r').click()
        cy.contains('Save').click()

      })
})
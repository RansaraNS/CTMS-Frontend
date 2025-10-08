describe('CreateHR CTMS', () => {
    it('Create HR Form with valid data', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('Create HR').click()


      cy.get('[name="name"]').type('Nimal Silva').should('have.value', 'Nimal Silva')
      cy.get('[name="email"]').type('nimal@gmail.com').should('have.value','nimal@gmail.com')
      cy.get('[name="password"]').type('nimal123').should('have.value','nimal123')
      cy.get('[name="role"]').type('HR').should('have.value','HR')
      cy.contains('Create New HR').click()
      
  
    })


    it('Should show validations in Email Address', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')   
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Create HR').click()


        cy.get('[name="name"]').type('Nimal Silva')
        cy.get('[name="email"]').type('nimal.com')
        cy.get('[name="password"]').type('nimal123')
        cy.get('[name="role"]').type('HR')
        cy.contains('Create New HR').click()

        cy.contains('Email must end with @hr.gamagerecruiters.lk').should('be.visible')
    
      })

      it('Should show validations in Password', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')   
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Create HR').click()


        cy.get('[name="name"]').type('Nimal Silva')
        cy.get('[name="email"]').type('nimal@gmail.com')
        cy.get('[name="password"]').type('123')
        cy.get('[name="role"]').type('HR')
        cy.contains('Create New HR').click()

        cy.contains('Password must be at least 6 characters').should('be.visible')
    
      })

      it('Should show validations in Role', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')   
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Create HR').click()


        cy.get('[name="name"]').type('Nimal Silva')
        cy.get('[name="email"]').type('nimal@gmail.com')
        cy.get('[name="password"]').type('nimal123')
        cy.get('[name="role"]').type('Manager')
        cy.contains('Create New HR').click()

        cy.contains('Role must be "hr"').should('be.visible')
    
      })


  })
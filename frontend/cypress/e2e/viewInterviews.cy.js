describe('View Interviewers CTMS', () => {
    it('View Interviewers', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('View Interviews').click()
    

    })

    it('Search candidates with valid details', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')    
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()

        cy.contains('View Interviews').click()
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').type('Example Test')
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').clear()
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').type('Quality Assurance Intern')  
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').clear()   
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').type('yoonusanees2002@gmail.com')
        cy.wait(2000)
         
      
  
      })

      it('Search candidates with Invalid details', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('admin@ctms.com')    
        cy.get('[name="password"]').type('admin123')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()

        cy.contains('View Interviews').click()
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').type('yyyy')
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').clear()
        cy.wait(2000)
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').type('yyyy')
        cy.wait(2000)   
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').clear()   
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').type('yyyy')
        cy.wait(2000)
        cy.get('#root > div > div > div > div.flex-1.p-10.overflow-auto > div > div:nth-child(1) > div > div.flex-1.relative > input').clear()

         
      
  
      })
})
describe('View Candidates (HR) CTMS', () => {
    it('Search functionality and filteration ', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
      cy.get('[name="password"]').type('hr123456')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
    
      cy.contains('View Candidates').should('be.visible').click()
      cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible') .type('kamal')
      cy.get('.flex > .border').select('New')
      cy.contains('Generate Report').click()
      cy.wait(2000)

      cy.contains('Refresh').click()

    
    })

    it('View Details of the candidate ', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
        cy.get('[name="password"]').type('hr123456')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
      
        cy.contains('View Candidates').should('be.visible').click()
        cy.contains('View Details').click()
        cy.contains('View CV').click()
        cy.wait(2000)
        cy.contains('Download CV').click()
        cy.wait(2000)
       
      
      })

      it('Delete Details of the candidate ', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
        cy.get('[name="password"]').type('hr123456')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
      
        cy.contains('View Candidates').should('be.visible').click()
        cy.get(':nth-child(1) > .px-6.font-medium > .flex > .text-red-600').click()
        cy.get('.justify-end > .px-6').click()
        cy.get('.justify-end > .px-6').click()
      
      })
})
describe('Manage Candidates CTMS', () => {
    it('View Candidates Details and filterations and Report Generations', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('admin@ctms.com')    
      cy.get('[name="password"]').type('admin123')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('Manage Candidate').should('be.visible').click()
      cy.wait(2000)
      cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible') .type('kamal')
      cy.wait(2000)
      cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible') .type('kamal').clear()
      cy.wait(2000)
      cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible').type('k@gmail.com')
      cy.wait(2000)
      cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible').type('k@gmail.com').clear()
      cy.wait(2000)
      cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible').type('Frontend Developer Intern')
      cy.wait(2000)
      cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible').type('Frontend Developer Intern').clear()


      cy.get('.flex > .border').select('New')
      cy.get('.flex > .border').select('Contacted')
      cy.get('.flex > .border').select('All Statuses')
      cy.wait(2000)

      cy.contains('Generate Report').click()
      cy.wait(2000)
      cy.contains('Download PDF').click()
      cy.wait(2000)
      cy.contains('Back to Candidates').click()
      cy.wait(2000)

      cy.contains('Refresh').click()

    


    })
})
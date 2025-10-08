describe('HR Dashboard CTMS', () => {
    
    it('Schedule Interview', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
      cy.get('[name="password"]').type('hr123456')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
     
      cy.contains('Schedule Interview').should('be.visible').click()
      cy.get('.ml-2').click()
      cy.wait(2000)
      
      // first need to add a candidate with valid details
      cy.get('[name="firstName"]').should('be.visible').type('Bobert')
      cy.wait(2000)
      cy.get('[name="lastName"]').should('be.visible').type('Silva')
      cy.wait(2000)
      cy.get('[name="email"]').should('be.visible').type('Bob@gmail.com')
      cy.wait(2000)
      cy.get('[name="phone"]').should('be.visible').type('0717621235')
      cy.get(':nth-child(2) > .flex > .px-6').click()
      cy.wait(2000)
      cy.get('[name="position"]').select('Data Analyst Intern')
      cy.wait(2000)
      cy.get('#cv').selectFile('cypress/fixtures/QA Task 2.pdf')
      cy.wait(2000)
      cy.get('[name="source"]').select('Company Website')
      cy.wait(2000)
      cy.get('[name="notes"]').should('be.visible').type('Good Candidate')
      cy.wait(2000)
      cy.get('.space-y-8 > .bg-gradient-to-r').click()
      cy.contains('Candidate added successfully!', { timeout: 10000 }).should('be.visible')

      cy.contains('Schedule Interview', { timeout: 10000 }).click()
      
      cy.get('#candidateId', { timeout: 15000 }) .should('be.visible').find('option').should('have.length.greaterThan', 1) 
      .then(($options) => {
        const firstCandidate = $options[1].value; 
        cy.wrap($options[1]).invoke('text').then((text) => {
          cy.log('Selected candidate:', text);
        });
        cy.get('#candidateId').select(firstCandidate, { force: true });
      });
      cy.get('#interviewDate').should('be.visible').type('2025-10-31')
      cy.wait(2000)
      cy.get('#interviewTime').type('14:30')
      cy.get('#interviewType').select('First Round')
      cy.get('#interviewers').type('John Doe, Jane Smith')
      cy.get('#meetingLink').type('https://meet.google.com/eyu-ghvr-axi')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      
    
    })
})
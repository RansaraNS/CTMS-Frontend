describe('Manage Interviews (HR) CTMS', () => {
    it('Search functionality and filteration ', () => {
      cy.visit('http://localhost:5173/')
      cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
      cy.get('[name="password"]').type('hr123456')
      cy.get('.space-y-6 > .bg-gradient-to-r').click()
      cy.contains('Manage Interviews').click()
      cy.get('input[placeholder*="Search"]', { timeout: 10000 }).should('be.visible') .type('kamal')
      
      cy.get('[type="date"]').type('2025-10-05')
      cy.get('select.border').select('scheduled')
      cy.wait(2000)
      
     
    
    })

    it('View Feedbacks', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
        cy.get('[name="password"]').type('hr123456')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Manage Interviews').click()
        cy.contains('View Feedback').click()
        cy.wait(2000)
        cy.contains('Print Feedback').click()
        cy.wait(2000)
        
        cy.contains('Edit Feedback').click()
        cy.wait(2000)
        cy.get(':nth-child(1) > .space-y-3 > :nth-child(2)').click()
        cy.get('[name="outcome"]').should('be.visible').select('failed')
        cy.wait(2000)
        cy.get('[name="submittedBy"]').clear().type('Yoonus A')
        cy.wait(2000)
        cy.contains('Submit Feedback').click()

      
      })

      it('Reschedule', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
        cy.get('[name="password"]').type('hr123456')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Manage Interviews').click()

        cy.contains('Reschedule').click()
        const newDateTime = '2025-10-08T15:00'
        cy.get('input[type="datetime-local"]', { timeout: 10000 }).should('be.visible').clear().type(newDateTime)
        cy.get('input[type="url"]').should('be.visible').clear() .type('https://meet.google.com/chd-zyqa-mfh')
        cy.contains('Reschedule Interview').click()
        
        
      })

      it('Cancel Interview', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
        cy.get('[name="password"]').type('hr123456')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Manage Interviews').click()

        cy.get(':nth-child(4) > .px-6.font-medium > .flex > .text-orange-600').click()
        cy.get('.justify-end > .px-6').click()
       
        
      })

      it('Delete Interview', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[name="email"]').type('yoonus.a@hr.gamagerecruiters.lk')    
        cy.get('[name="password"]').type('hr123456')
        cy.get('.space-y-6 > .bg-gradient-to-r').click()
        cy.contains('Manage Interviews').click()

        cy.get(':nth-child(4) > .px-6.font-medium > .flex > .text-red-600').click()
        cy.get('.justify-end > .px-6').click()
       
        
      })
})
describe('Otomi Web', () => {

    beforeEach(() => {
        cy.visit('localhost:3000')
    })

    it('should load Otomi Web app', () => {
        cy.title().should('eq', 'Otomi')
        cy.percySnapshot()
    })
})


describe('Otomi Web', () => {
    beforeEach(() => {
        cy.visit('localhost:3000')
    })
    it('should load Otomi Web Admin Dashboard', () => {
        cy.get('.MuiGrid-container > :nth-child(1) > .MuiTypography-root')
            .contains('Welcome to the team Admin dashboard')
        cy.percySnapshot()
    })

    it('should go to create team page', () => {
        cy.get('[data-cy="cy-create-team-btn"]').click()
        cy.location().should(loc => {
            expect(loc.pathname).to.eq('/create-team')
        })
        cy.percySnapshot()
    })
})


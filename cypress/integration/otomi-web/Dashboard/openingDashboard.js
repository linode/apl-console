import { Given } from 'cypress-cucumber-preprocessor/steps'

const url = 'http://localhost:3000'

Given(`Admin opens Dashboard`, () => {
  cy.visit(url)
})

Then(`Admin sees welcoming message`, () => {
  cy.get('.MuiGrid-container > :nth-child(1) > .MuiTypography-root').contains('Welcome to the team Admin dashboard')
  cy.percySnapshot()
})

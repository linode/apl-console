import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

Given(`Admin opens Dashboard`, () => {
  cy.visit('/')
})

Then(`Admin sees welcoming message`, () => {
  cy.get('.MuiGrid-container > :nth-child(1) > .MuiTypography-root').contains('Welcome to the team Admin dashboard')
  cy.percySnapshot()
})

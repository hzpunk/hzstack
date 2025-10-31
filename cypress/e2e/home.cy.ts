describe('Home page', () => {
  it('should show welcome and navigate to example', () => {
    cy.visit('/')
    cy.contains('Добро пожаловать, вы в системе HZ').should('be.visible')
    cy.contains('Начать').click()
    cy.url().should('include', '/example')
  })
})



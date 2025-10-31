describe('Example page', () => {
  it('should show React Query data and RHF form', () => {
    cy.visit('/example')
    cy.contains('Страница примера').should('be.visible')
    cy.contains('React Query').should('be.visible')
    cy.contains('RHF + Zod').should('be.visible')
  })
})



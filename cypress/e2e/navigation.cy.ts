describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('navigates to bet page', () => {
    cy.contains('投注').click()
    cy.url().should('include', '/bet')
    cy.contains('投注').should('be.visible')
  })

  it('navigates to reveal page', () => {
    cy.contains('揭秘').click()
    cy.url().should('include', '/reveal')
    cy.contains('揭秘').should('be.visible')
  })

  it('navigates to result page', () => {
    cy.contains('结果').click()
    cy.url().should('include', '/result')
    cy.contains('彩票结果').should('be.visible')
  })

  it('navigates to history page', () => {
    cy.contains('历史').click()
    cy.url().should('include', '/history')
    cy.contains('历史记录').should('be.visible')
  })

  it('navigates back to home', () => {
    cy.contains('首页').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('DD 3D 彩票').should('be.visible')
  })
})

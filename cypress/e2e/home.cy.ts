describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the main heading', () => {
    cy.contains('DD 3D 彩票').should('be.visible')
    cy.contains('去中心化3D彩票游戏').should('be.visible')
  })

  it('shows wallet connect component', () => {
    cy.contains('连接钱包').should('be.visible')
    cy.contains('请选择您的钱包进行连接').should('be.visible')
  })

  it('shows lottery phase component', () => {
    cy.contains('当前阶段').should('be.visible')
  })

  it('has navigation links', () => {
    cy.get('nav').should('be.visible')
    cy.contains('首页').should('be.visible')
    cy.contains('投注').should('be.visible')
    cy.contains('揭秘').should('be.visible')
    cy.contains('结果').should('be.visible')
    cy.contains('历史').should('be.visible')
  })

  it('has theme toggle button', () => {
    cy.get('button[aria-label="切换主题"]').should('be.visible')
  })
})

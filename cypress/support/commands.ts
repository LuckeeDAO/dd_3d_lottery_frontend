// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      connectWallet(walletType: 'keplr' | 'cosmostation'): Chainable<void>
      mockWalletConnection(): Chainable<void>
    }
  }
}

Cypress.Commands.add('connectWallet', (walletType: 'keplr' | 'cosmostation') => {
  cy.window().then((win) => {
    if (walletType === 'keplr') {
      cy.get('button').contains('连接 Keplr').click()
    } else {
      cy.get('button').contains('连接 Cosmostation').click()
    }
  })
})

Cypress.Commands.add('mockWalletConnection', () => {
  cy.window().then((win) => {
    // Mock successful wallet connection
    win.keplr = {
      enable: cy.stub().resolves(),
      getKey: cy.stub().resolves({
        bech32Address: 'cosmwasm1test...',
        pubKey: new Uint8Array(),
        algo: 'secp256k1',
        isNanoLedger: false
      })
    }
  })
})

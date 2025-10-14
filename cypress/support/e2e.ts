// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  // Mock wallet objects
  win.keplr = {
    enable: cy.stub().resolves(),
    getKey: cy.stub().resolves({
      bech32Address: 'cosmwasm1test...',
      pubKey: new Uint8Array(),
      algo: 'secp256k1',
      isNanoLedger: false
    }),
    signAndBroadcast: cy.stub().resolves({
      transactionHash: '0x123...',
      height: 1000000,
      gasUsed: 100000,
      gasWanted: 200000
    }),
    signMessage: cy.stub().resolves({
      signature: '0xabc...'
    })
  }

  win.cosmostation = {
    cosmos: {
      request: cy.stub().resolves()
    }
  }
})

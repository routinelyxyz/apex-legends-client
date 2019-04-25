import { hookInto } from '../util';

const h = hookInto`PlayerSearcher__main`;

describe('The Player Searcher', function() {

  beforeEach(function () {
    cy.visit('/');
  });

  /*
  describe('Platforms', function() {
    it('PC', function() {
      cy.get(h `input`).type('rockalone{enter}');
      cy.url().should('include', 'pc');
    });
    it('PS4', function() {
      cy.get(h `li`).eq(1).click();
      cy.get(h `input`).type('basedgodfearless{enter}');
      cy.url().should('include', 'ps4');
    });
    it('Xbox', function() {
      cy.get(h `li`).eq(2).click();
      cy.get(h `input`).type('Termk47{enter}');
      cy.url().should('include', 'xbox');
    });
  });
  */

  it('body scroll is hiding/showing properly [mobile]', function() {
    cy.clock();
    cy.viewport('iphone-6');

    cy.get(h `input`).focus();
    cy.tick(25);
    cy.get('body').should('have.class', 'hidden_scroll');
    cy.get('header').click();
    cy.tick(25);
    cy.get('body').should('not.have.class', 'hidden_scroll');
    cy.tick(25);
    
    cy.get(h `input`).type('rockalone');
    cy.get('body').should('have.class', 'hidden_scroll');
    cy.get(h `input`).type('{enter}');
    cy.url().should('include', `/stats/pc/rockalone`);
    cy.get('body').should('not.have.class', 'hidden_scroll');
  });

});

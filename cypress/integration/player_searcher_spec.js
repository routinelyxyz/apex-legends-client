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

  it('body scroll is hiding/showing properly', function() {
    cy.clock();

    cy.get(h `input`).focus();
    cy.get('body').should('have.class', 'hidden_scroll').click();
    cy.tick(50);
    cy.get('body').should('not.have.class', 'hidden_scroll');
    cy.tick(50);
    
    cy.get(h `input`).type('rockalone');
    cy.get('body').should('have.class', 'hidden_scroll');
    cy.get(h `input`).type('{enter}');
    cy.url().should('include', `/stats/pc/rockalone`);
    cy.get('body').should('not.have.class', 'hidden_scroll');
  });

});

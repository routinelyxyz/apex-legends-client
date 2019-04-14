import { hookInto } from '../util';

const p = hookInto`PlayerSearcher`;

describe('Stats page', function() {

  beforeEach(function () {
    cy.visit('/');
  });

  it('', function() {

    cy.get(p `input:first-child`).type('rockalone{enter}');
    cy.url().should('include', `/stats/pc/rockalone`);

    cy.get(p `input:first-child`).clear().type('nrg_dizzy{enter}');
    cy.url().should('include', `/stats/pc/nrg_dizzy`);

    cy.get(p `> div > ul li`).eq(1).click();
    cy.get(p `input:first-child`).clear().type('basedgodfearless{enter}');
    cy.url().should('include', `/stats/ps4/basedgodfearless`);

    cy.get(p `> div > ul li`).eq(2).click();
    cy.get(p `input:first-child`).clear().type('Termk47{enter}');
    cy.url().should('include', `/stats/xbox/Termk47`);
  });

});

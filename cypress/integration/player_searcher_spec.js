import { hookInto } from '../util';

describe('The Player Searcher', function() {

  beforeEach(function () {
    cy.visit('/');
  });

  it('allows to type name and change platform', function() {

    const g = hookInto`PlayerSearcher__main`;

    cy.get(g`li`).eq(1).click();
    cy.get(g`input`)
      .type('basedgodfearless{enter}');
    cy.url().should('include', `/stats/ps4/basedgodfearless`);
    
  });
});

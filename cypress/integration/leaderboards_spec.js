import { hookInto } from '../util';

const h = hookInto`Leaderboards__query-container`;

describe('Leaderboards', function() {

  beforeEach(function () {
    cy.visit('/leaderboards');
  });

  it('changes stats based on query', function() {
    cy.get(h `select`).eq(0).select('ps4');
    cy.url().should('include', 'platform=ps4');

    cy.get(h `select`).eq(0).select('xbox');
    cy.url().should('include', 'platform=xbox');

    cy.get(h `select`).eq(1).select('octane');
    cy.url().should('include', 'legend=octane');

    cy.get(h `select`).eq(1).select('wraith');
    cy.url().should('include', 'legend=wraith');

    cy.get(h `select`).eq(0).select('all');
    cy.url().should('not.include', 'platform');

    cy.get(h `select`).eq(2).select('damage');
    cy.url().should('include', 'prop=damage');
    cy.get('thead th').eq(2).contains('Damage');

    cy.get(h `select`).eq(2).select('damagePerKill');
    cy.url().should('include', 'prop=damagePerKill');
    cy.get('thead th').eq(2).contains('Damage / Kill');
  });

});
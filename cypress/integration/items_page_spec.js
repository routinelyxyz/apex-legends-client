import { hookInto } from '../util';

const i = hookInto`ItemsGrid__container`;

const input = hookInto`Items__input`;
const category = hookInto`Items__category`;
const ammo = hookInto`Items__ammo`;

const grid = hookInto`WeaponsGrid`;


describe('Items page', function() {
  
  beforeEach(function () {
    cy.visit('/items');
  });

  it('filtering items works properly', function() {
    cy.clock();
    cy.get('article input[type=text]').type('mozambique');
    cy.get(grid `div p`).contains('Mozambique Shotgun');

    cy.get('article input[type=text]').clear().type('g7');
    cy.get(grid `div p`).contains('G7 Scout');

    cy.get('article input[type=text]').clear().type('burst pdw');
    cy.get(grid `div p`).contains('Prowler Burst PDW');

    cy.get('article input[type=text]').clear().type('ma');
    cy.get(grid `> div`).its('length').should('be.lte', 4);
    cy.get(category `label`).eq(4).click();
    cy.get(grid `> div`).its('length').should('eq', 1);

    cy.get(category `label`).eq(3).click();
    cy.get(grid `> div`).its('length').should('be.gte', 1);

    cy.get(`h3:contains('Direction') ~ label`).click();
    cy.get(grid `> div:first-child p`).contains('Wingman');

    cy.get(`h3:contains('Direction') ~ label`).click();
    cy.get(grid `> div:last-child p`).contains('Wingman');

    cy.get(ammo `label span:contains('Energy')`).eq(0).click();
    cy.get(ammo `label span:contains('Heavy')`).eq(0).click();
    cy.get(grid `> div:first-child p`).contains('Wingman');
  });

  it('sorting works properly', function() {
    cy.get(grid `> div:first-child p`).contains('Alternator SMG');
    cy.get(`h3:contains('Direction') ~ label`).click();
    cy.get(grid `> div:last-child p`).contains('Alternator SMG');

    cy.get(`h3:contains('Sort By') ~ select`).select('ammoType');
    cy.get(grid `> div:last-child p`).contains('G7 Scout');
    cy.get(`h3:contains('Direction') ~ label`).click();
    cy.get(grid `> div:first-child p`).contains('G7 Scout');
  });

});
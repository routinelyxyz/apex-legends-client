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
    cy.tick(50);
    cy.get('article input[type=text]').type('mozambique');
    cy.get(grid `div p`).contains('Mozambique Shotgun');

    cy.get('article input[type=text]').clear().type('g7');
    cy.get(grid `div p`).contains('G7 Scout');

    cy.get('article input[type=text]').clear().type('ma');
    cy.get(grid `> div`).its('length').should('be.lte', 4);
    cy.get(category `label`).eq(4).click();
    cy.get('article input[type=text]').clear();

    cy.get(category `label`).eq(3).click();
    cy.get(grid `> div`).its('length').should('be.gte', 1);

    cy.get(ammo `label span:contains('Energy')`).eq(0).click();
    cy.get(ammo `label span:contains('Heavy')`).eq(0).click();
    cy.get(grid `> div`).its('length').should('be.gte', 1);
  });

  it('sorting works properly', async function() {
    cy.clock();

    const firstItemName = await cy.get(grid `> div:first-child p`).invoke('text');
    cy.get(`h3:contains('Direction') ~ label`).click();
    cy.get(grid `> div:last-child p`).contains(firstItemName);
    
    cy.get(`h3:contains('Sort By') ~ select`).select('ammoType');
    cy.tick(50);

    cy.get(`h3:contains('Direction') ~ label`).click();
    cy.tick(500);
    cy.url().should('include', 'sortBy=ammoType');
  });

});
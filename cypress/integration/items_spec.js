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

  it('', function() {
    cy.clock();
    cy.get('article input[type=text]').type('mozambique');
    cy.get(grid `div p`).contains('Mozambique Shotgun');

    cy.get('article input[type=text]').clear().type('g7');
    cy.get(grid `div p`).contains('G7 Scout');

    cy.get('article input[type=text]').clear().type('burst pdw');
    cy.get(grid `div p`).contains('Prowler Burst PDW');

    cy.get('article input[type=text]').type('ma');
    cy.get(grid `div`).its('length').should('be.lte', 4);
    cy.get(category `label`).eq(4).click();
    cy.tick(250);
    cy.get(grid `div`).its('length').should('eq', 1);
  });

});
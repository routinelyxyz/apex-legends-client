import cy from 'cypress';

const get = element => cy.get(
  `[data-testid="${element}"]`
);

function tag([string], ...values) {
  const [mainElement, ...rest] = string.split(/ /);
  return `[data-testid="${mainElement}"] ${rest.join(' ')}`;
}
const t = tag;

const tagMain = mainElement => rest => tag([mainElement + ' ' + rest.join(' ')]);


describe('The Player Searcher', function() {

  beforeEach(function () {
    cy.visit('/');
  });

  it('allows to type name and change platform', function() {
    cy.visit('/');
    
    const el = tagMain('PlayerSearcher_container');

    cy.get(t`PlayerSearcher_container li`).eq(2).click();

    cy.get(tag`PlayerSearcher_container input`)
      .type('basedgodfearless {enter}');

    cy.url().should('include', `/stats/ps4/basedgodfearless`);
  });
});

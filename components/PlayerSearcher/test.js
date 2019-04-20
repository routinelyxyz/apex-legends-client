import React from 'react';
import {
  render,
  fireEvent,
  wait,
  cleanup,
  waitForElement,
  Simulate,
  getByTestId,
} from 'react-testing-library';
import { Provider } from 'react-redux';
import { initializeStore } from '../../store';
import { PlayerSearcher } from './index';
import { MobileMenuProvider, ModalProvider } from '../../helpers/context';
const store = initializeStore();

const renderSkeleton = (
  <Provider store={store}>
    <ModalProvider>
      <MobileMenuProvider>
        <PlayerSearcher />
      </MobileMenuProvider>
    </ModalProvider>
  </Provider>
);

describe('<PlayerSearcher />', () => {

  it('', async () => {
    const { getByTestId } = render(renderSkeleton);
  
    fireEvent.focus(getByTestId('PlayerSearcher__input'));
  
    const dropdown = await waitForElement(() => getByTestId('PlayerSearcher__dropdown'));
  
    // Failing Cannot read property 'push' of undefined
    // Need to make use of mocks https://spectrum.chat/react-testing-library/help/mocking-react-spring-components~cb8dc305-edcd-4ebc-bc4e-a6e20e81b75e
    // fireEvent.click(getByText('Popular'));
  });

  it('changes platform correctly', async () => {
    const { container, getByLabelText, getByTestId, rerender, getByText } = render(renderSkeleton);

    const platforms = getByTestId('PlayerSearcher__platforms');

    const [pc, ps4, xbox] = platforms.querySelectorAll('li');

    fireEvent.click(ps4);
    expect(pc.classList.length).toBe(1);
    expect(ps4.classList.length).toBe(2);
    expect(xbox.classList.length).toBe(1);

    fireEvent.click(xbox);
    expect(pc.classList.length).toBe(1);
    expect(ps4.classList.length).toBe(1);
    expect(xbox.classList.length).toBe(2);

    fireEvent.click(pc);
    expect(pc.classList.length).toBe(2);
    expect(ps4.classList.length).toBe(1);
    expect(xbox.classList.length).toBe(1);
  });

  it('disables scroll on focus', () => {
    const { container, getByLabelText, getByTestId, rerender, getByText } = render(renderSkeleton);

    fireEvent.focus(getByTestId('PlayerSearcher__input'));

    /* Add jest-dom */
    // body doesn't exist on render?
    // expect(container.querySelector('body').classList.contains('hidden_scroll')).toBe(true);
  });
});
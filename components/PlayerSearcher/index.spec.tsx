import React from 'react';
import axiosMock from 'axios';
import { render, fireEvent, waitForElement, wait } from '@testing-library/react';
import { PlayerSearcher } from '.';
import { act } from 'react-test-renderer';


describe('<PlayerSeacher />', () => {

  test('finds player by name', async () => {
    (axiosMock.get as jest.Mock).mockResolvedValueOnce({
      data: [{
        id: 1,
        name: 'John Wick',
        avatar: false,
        avatarUrl: '',
        platform: 'pc'
      }]
    });
    const { getByTestId, getByText } = render(<PlayerSearcher />);
    const input = getByTestId('PlayerSearcher__input');

    act(() => {
      fireEvent.change(input, { target: { value: 'Jo' }});
    });

    const playerLabel = await waitForElement(() => getByText('Jo'));

    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(playerLabel).toHaveTextContent('John Wick');
  });

})
import React from 'react';
import axiosMock from 'axios';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { PlayerSearcher } from '.';


describe('<PlayerSeacher />', () => {

  /* Prints act rendering error probably due to react-spring */
  test('finds player by name', async () => {
    (axiosMock.get as jest.Mock).mockResolvedValueOnce({
      data: {
        data: [{
          id: 1,
          name: 'John Wick',
          avatar: false,
          avatarUrl: '',
          platform: 'pc'
        }]
      }
    });
    const { getByTestId, getByText } = render(<PlayerSearcher />);
    const input = getByTestId('PlayerSearcher__input');

    fireEvent.change(input, { target: { value: 'Jo' }});

    const playerLabel = await waitForElement(() => getByText('Jo'));

    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith('/stats/players/Jo');
    expect(playerLabel).toHaveTextContent('Jo');
  });

})
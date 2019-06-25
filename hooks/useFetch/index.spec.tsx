import React from 'react';
import { useFetch } from ".";
import { render } from '@testing-library/react';

jest.mock('fetch', () => ({
  json: jest.fn(async () => ({}))
}));


interface MockedComponentProps {
  todoId: number
}
interface MockedPayload {
  title: string
  userId: number
}
function MockedComponent(props: MockedComponentProps) {
  const { data, isError, isFetching } = useFetch<MockedPayload>(
    `https://jsonplaceholder.typicode.com/todos/${props.todoId}`
  );

  if (isError) {
    return <div>An error has occured.</div>;
  }
  
  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (data === null) {
    return <div>No data could be found.</div>
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <p>This todo has been made by user with id {data.userId}</p>
    </div>
  );
}


describe('useFetch hook', () => {

  test('', async () => {

    (fetch as jest.Mock).mockResolvedValueOnce({});

    const { container, findByText, rerender } = render(<MockedComponent todoId={1} />);
    
    rerender(<MockedComponent todoId={2} />);

  });
})
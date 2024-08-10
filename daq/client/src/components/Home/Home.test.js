import React from 'react';
import { render } from '@testing-library/react';
import Home from './Home';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders Home component', () => {
  const { getByText } = render(
    <Router>
      <Home />
    </Router>
  );
  expect(getByText('Data Structures and Algorithms')).toBeInTheDocument();
});

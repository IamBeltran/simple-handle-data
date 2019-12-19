// ▶ Import react dependecies
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';

// ▶ Import components
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
};

export default App;

import React from 'react';
import './App.css';

function AppContent() {
  return (
    <div className="App">
      <p className={'text-xl text-blue-600 underline'}>Daily Load</p>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;

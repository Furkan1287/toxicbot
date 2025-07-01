import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './components/Home';
import Chat from './components/Chat';
import Analysis from './components/Analysis';
import Header from './components/Header';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App; 
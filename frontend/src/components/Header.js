import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  padding: 0 20px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  text-decoration: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.active ? '#667eea' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

function Header() {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          🛡️ Manipülasyon Bot
        </Logo>
        <Nav>
          <NavLink to="/" active={location.pathname === '/'}>
            Ana Sayfa
          </NavLink>
          <NavLink to="/chat" active={location.pathname === '/chat'}>
            Sohbet
          </NavLink>
          <NavLink to="/analysis" active={location.pathname === '/analysis'}>
            Analiz
          </NavLink>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header; 
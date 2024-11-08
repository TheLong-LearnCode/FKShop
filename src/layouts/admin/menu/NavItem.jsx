import React from 'react';
import { Nav } from 'react-bootstrap';

const NavItem = ({ handleNavigation, path, iconSrc, label }) => {
  return (
    <Nav.Link 
      onClick={() => handleNavigation(path)} 
      className="d-flex align-items-center nav-link-item"
    >
      <span className="mr-2 d-flex align-items-center">
        <img src={iconSrc} alt={label} className="nav-item-image" />
      </span>
      <span className="size-nav-item"><strong>{label}</strong></span>
    </Nav.Link>
  );
};

export default NavItem;

// NavBar.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import {
  Collapse,
  NavbarToggler,
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown, DropdownToggle,
  DropdownMenu, DropdownItem,
  Input
} from 'reactstrap';
import LogoutButton from './buttons/LogoutButton.js';
import LoginButton from './buttons/LoginButton.js';

const NavBar = ({
  user,
  setSearchTerms,
  authInit,
  provider
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputString, setInputString] = useState({
    search: ''
  });
  const location = useLocation();

  const handleInputChange = (e) => {
    setInputString((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearchClick = () => {
    setSearchTerms(inputString.search);
    const tempObj = {
      search: ''
    };
    setInputString(tempObj);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearchClick();
    }
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const clearSearch = () => {
    setSearchTerms('');
  };

  return (
    <div>
      <Navbar light expand='md'>
        <Link className='navbar-brand' to='/' >Swimmer Buddy</Link>
        <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className='mr-auto' navbar>
              <NavItem>
                { user && <Link className='nav-link' to='/collections'
                  onClick={clearSearch}>Collections</Link> }
              </NavItem>
              { user && <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Workouts
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Link className='nav-link' to='/workouts'
                  onClick={clearSearch}>My Workouts</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link className='nav-link' to='/shared-workouts'
                  onClick={clearSearch}>Shared Workouts</Link>
                </DropdownItem>
              </DropdownMenu>
              </UncontrolledDropdown>
              }
              <NavItem>
                { !user && <Link className='nav-link' to='/shared-workouts'
                  onClick={clearSearch}>Workouts</Link> }
              </NavItem>
              <NavItem>
                { user && <Link className='nav-link' to='/account'>Profile</Link> }
              </NavItem>
              { (location.pathname === '/workouts' || location.pathname === '/shared-workouts')
              && <div className='input-group search-input-group'>
                <div className='form-outline search-form-outline'>
                  <Input className='form-control mr-sm-2' type='search' placeholder='Search'
                    name='search' value={inputString.search} onChange={handleInputChange}
                    onKeyDown={handleKeyDown}/>
                </div>
                <button type='button' className='btn btn-primary' onClick={handleSearchClick}>
                  <i className='fas fa-search'></i>
                </button>
              </div>
              }
            </Nav>
            { !user && <LoginButton
               authInit = {authInit}
               provider = {provider}/> }
            { user && <LogoutButton
               authInit = {authInit} /> }
          </Collapse>
      </Navbar>
    </div>
  );
};

NavBar.propTypes = {
  user: PropTypes.any,
  setSearchTerms: PropTypes.func,
  authInit: PropTypes.object,
  provider: PropTypes.object
};

export default NavBar;

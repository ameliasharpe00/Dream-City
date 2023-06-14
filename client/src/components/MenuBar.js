// All the imports
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "shards-react";

/*************************************
* MenuBar is the component that 
* handles routing to pages. It returns
* styling for te pages respectively 
* Home, Filter, CityRankings, News,
* and Map.
*************************************/
class MenuBar extends React.Component {
  render() {
    return (
      <Navbar className="color-nav" type="dark" expand="md">
        <NavbarBrand class='filter-white2' href="/">Dream City</NavbarBrand>
        <Nav navbar>
          <NavItem>
            <NavLink className="button" active href="/">
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="button" active href="/filter" >
              Get the best match!
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="button" active href="/cityrankings">
              City Rankings
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="button" active href="/news">
              News
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="button" active href="/map">
              Maps
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

export default MenuBar
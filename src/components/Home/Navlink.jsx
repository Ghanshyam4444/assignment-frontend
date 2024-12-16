import React from "react";
import { NavLink } from "react-router-dom";
import "./Navlink.css";
const NavLinks = () => {
  return (
    <div className="header-container">
      <nav className="all_pages">
        <ul className="left_pages mt-3">
          <li>
            <NavLink className="navitems text-white" to="/">
              User
            </NavLink>
          </li>
          <li>
            <NavLink className="navitems text-white" to="/Admin">
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink className="navitems text-white" to="/MyQuestions">
              MyQuestions
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavLinks;

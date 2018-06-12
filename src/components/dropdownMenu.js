import React, { Component } from 'react';
import './dropdownMenu.css';

export default class Card extends Component {
  constructor() {
    super();
    this.state = { showMenu: false, }
  }
  showMenu = event => {
    event.preventDefault();
    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }
  closeMenu = event => {
    if (!this.dropdownMenu.contains(event.target)) {
      this.setState({ showMenu: false }, () => {
        document.removeEventListener('click', this.closeMenu);
      });
    }
  }
  render() {
    return (
      <div className="dropdownMenu">
        <button onClick={this.showMenu} className="iconRight material-icons">
          more_horiz
        </button>

        {
          this.state.showMenu
            ? (
              <div
                className="menu"
                ref={(element) => {
                    this.dropdownMenu = element;
                }}
              >
                <button className="item"> View resume </button>
                <button className="item"> Duplicate resume </button>
                <button className="item"> Delete resume </button>
              </div>
            )
            : (
              null
            )
        }
      </div>
    );
  }
}
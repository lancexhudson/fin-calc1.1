import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';

const HamburgerMenu = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="hamburger-menu" onClick={toggleMenu}>
        <FaBars />
      </button>
      <nav className={`nav-links ${isOpen ? 'active' : ''}`}>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector(`#${section.id}`)
                .scrollIntoView({ behavior: 'smooth' });
              setIsOpen(false); // Close menu on selection
            }}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default HamburgerMenu;

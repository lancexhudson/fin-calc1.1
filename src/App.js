import React, { useState } from 'react';
import './App.css';
import SavingsRateCalculator from './components/SavingsRateCalculator';
import RetirementCalculator from './components/RetirementCalculator';
import CompoundGrowthCalculator from './components/CompoundGrowthCalculator';
import InflationCalculator from './components/InflationCalculator';
import TaxSavingsCalculator from './components/TaxSavingsCalculator';
import HamburgerMenu from './components/HamburgerMenu';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'savings-rate', label: 'Savings Rate Calculator' },
    { id: 'compound-growth', label: 'Compound Growth Calculator' },
    { id: 'retirement', label: 'Retirement Calculator' },
    { id: 'inflation', label: 'Inflation Calculator' },
    { id: 'tax-savings', label: 'Tax Savings Calculator' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <header>
        <div
          className="title-stack"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <span>Financial</span>
          <span>Wellness Calculator</span>
        </div>
        <HamburgerMenu sections={sections} />
      </header>
      <main>
        <section id="home">
          <h2>Welcome</h2>
          <p>Use the calculators below to plan your financial future.</p>
        </section>
        <section id="savings-rate" className="calculator-section">
          <SavingsRateCalculator />
        </section>
        <section id="compound-growth" className="calculator-section">
          <CompoundGrowthCalculator />
        </section>
        <section id="retirement" className="calculator-section">
          <RetirementCalculator />
        </section>
        <section id="inflation" className="calculator-section">
          <InflationCalculator />
        </section>
        <section id="tax-savings" className="calculator-section">
          <TaxSavingsCalculator />
        </section>
      </main>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default App;

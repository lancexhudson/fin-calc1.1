import React, { useState } from 'react';
import { toast } from 'react-toastify';

// Function to format input value with commas
const formatInput = (value) => {
  if (!value) return '';
  const num = parseFloat(value.replace(/,/g, '')); // Remove commas to parse
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
};

const TaxSavingsCalculator = () => {
  const [taxableIncome, setTaxableIncome] = useState('');
  const [results, setResults] = useState(null);

  const handleIncomeChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    setTaxableIncome(rawValue);
  };

  const preTaxSavingsCalc = () => {
    if (!taxableIncome) {
      toast.error('Please enter taxable income.');
      return;
    }
    const income = parseFloat(taxableIncome);
    if (isNaN(income) || income < 0) {
      toast.error('Please enter a valid positive number.');
      return;
    }

    const taxTiers = [
      { rate: 0.1, max: 10276 },
      { rate: 0.12, max: 41776 },
      { rate: 0.22, max: 89076 },
      { rate: 0.24, max: 170051 },
      { rate: 0.32, max: 215591 },
      { rate: 0.35, max: 539901 },
      { rate: 0.37, max: Infinity },
    ];
    let tax = 0;
    let remainingIncome = income;

    for (let tier of taxTiers) {
      if (remainingIncome <= 0) break;
      const taxableAmount =
        Math.min(remainingIncome, tier.max) -
        (taxTiers[taxTiers.indexOf(tier) - 1]?.max || 0);
      if (taxableAmount > 0) {
        tax += taxableAmount * tier.rate;
      }
      remainingIncome -= taxableAmount;
    }

    setResults({
      totalTax: tax.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      netIncome: (income - tax).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    });
  };

  return (
    <div className="calculator-section">
      <h2>Tax Savings Calculator</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="input-group">
          <label>Taxable Income ($):</label>
          <input
            type="text"
            value={formatInput(taxableIncome)}
            onChange={handleIncomeChange}
            placeholder="Enter income"
          />
          <button onClick={preTaxSavingsCalc} disabled={!taxableIncome}>
            Calculate
          </button>
        </div>
        <div className={`results-card ${!results ? 'collapsed' : ''}`}>
          {results && (
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value ($)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total Tax</td>
                  <td>${results.totalTax}</td>
                </tr>
                <tr>
                  <td>Net Income</td>
                  <td>${results.netIncome}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxSavingsCalculator;

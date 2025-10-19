import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const SavingsRateCalculator = () => {
  const [annualSalary, setAnnualSalary] = useState('');
  const [percentBeingSaved, setPercentBeingSaved] = useState('');
  const [results, setResults] = useState(null);
  const [investmentType, setInvestmentType] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [showHistorical, setShowHistorical] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Function to format input value with commas
  const formatInput = (value) => {
    if (!value) return '';
    const num = parseFloat(value.replace(/,/g, '')); // Remove commas to parse
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
  };

  const handleSalaryChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ''); // Get raw number
    setAnnualSalary(rawValue);
  };

  const handlePercentChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ''); // Get raw number
    setPercentBeingSaved(rawValue);
  };

  const calculateSavingsRate = async () => {
    if (!annualSalary || !percentBeingSaved) {
      toast.error('Please enter both annual salary and percent being saved.');
      return;
    }
    const salary = parseFloat(annualSalary);
    const percent = parseFloat(percentBeingSaved) / 100;
    if (
      isNaN(salary) ||
      isNaN(percent) ||
      salary <= 0 ||
      percent < 0 ||
      percent > 1
    ) {
      toast.error(
        'Please enter valid positive numbers for salary and 0-100 for percent.'
      );
      return;
    }

    const weeklySavings = (salary * percent) / 52;
    const biWeeklySavings = (salary * percent) / 26;
    const monthlySavings = (salary * percent) / 12;
    const annualSavings = salary * percent;

    setResults({
      weekly: weeklySavings.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      biWeekly: biWeeklySavings.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      monthly: monthlySavings.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      annual: annualSavings.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    });

    if (investmentType) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${investmentType}&apikey=${process.env.REACT_APP_ALPHA_KEY}`
        );
        const data = response.data['Monthly Time Series'];
        const dates = Object.keys(data).slice(0, 12).reverse();
        const historicalData = [];
        for (let i = 0; i < dates.length - 1; i++) {
          const currentClose = parseFloat(data[dates[i]]['4. close']);
          const nextClose = parseFloat(data[dates[i + 1]]['4. close']);
          const ror = ((nextClose - currentClose) / currentClose) * 100; // Percentage change
          historicalData.push({ date: dates[i], ror: ror.toFixed(2) + '%' });
        }
        setHistoricalData(historicalData);
      } catch (error) {
        toast.error('Error fetching historical data.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleCollapse = () => setResults(results ? null : results); // Toggle collapse
  const toggleHistorical = () => setShowHistorical(!showHistorical);

  return (
    <div className="calculator-section">
      <h2>Savings Rate Calculator</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="input-group">
          <input
            type="text"
            value={formatInput(annualSalary)}
            onChange={handleSalaryChange}
            placeholder="Enter salary"
          />
          <label>Percent Being Saved (%):</label>
          <input
            type="text"
            value={formatInput(percentBeingSaved)}
            onChange={handlePercentChange}
            placeholder="Enter percent (0-100)"
          />
          <label>Investment Type (e.g., SPY):</label>
          <input
            type="text"
            value={investmentType}
            onChange={(e) => setInvestmentType(e.target.value)}
            placeholder="Enter ticker"
          />
          <button
            onClick={calculateSavingsRate}
            disabled={!annualSalary || !percentBeingSaved}
          >
            Calculate
          </button>
        </div>
        <div className={`results-card ${!results ? 'collapsed' : ''}`}>
          {results && (
            <>
              <button className="collapse-btn" onClick={toggleCollapse}>
                X
              </button>
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Value ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Weekly</td>
                    <td>${results.weekly}</td>
                  </tr>
                  <tr>
                    <td>Bi-Weekly</td>
                    <td>${results.biWeekly}</td>
                  </tr>
                  <tr>
                    <td>Monthly</td>
                    <td>${results.monthly}</td>
                  </tr>
                  <tr>
                    <td>Annual</td>
                    <td>${results.annual}</td>
                  </tr>
                </tbody>
              </table>
              {investmentType && (
                <button onClick={toggleHistorical}>
                  {showHistorical
                    ? 'Hide Historical RoR'
                    : 'Show Historical RoR'}
                </button>
              )}
              {showHistorical && historicalData.length > 0 && (
                <div>
                  <h3>Historical Rate of Return</h3>
                  <ul>
                    {historicalData.map((data, index) => (
                      <li key={index}>
                        {data.date}: {data.ror}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {isLoading && <FaSpinner className="loading" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsRateCalculator;

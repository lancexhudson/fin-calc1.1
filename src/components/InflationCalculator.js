import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const InflationCalculator = () => {
  const [userContribution, setUserContribution] = useState('');
  const [results, setResults] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to format input value with commas
  const formatInput = (value) => {
    if (!value) return '';
    const num = parseFloat(value.replace(/,/g, '')); // Remove commas to parse
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
  };

  const handleContributionChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    setUserContribution(rawValue);
  };

  const calculateInflationHalving = async () => {
    if (!userContribution) {
      toast.error('Please enter the contribution amount.');
      return;
    }
    const contribution = parseFloat(userContribution);
    if (isNaN(contribution) || contribution <= 0) {
      toast.error('Please enter a valid positive number.');
      return;
    }

    const ruleOf72 = 72;
    const currentInflationRate = 9.1; // Fixed rate from Java code
    const yearsUntilHalved = ruleOf72 / currentInflationRate;

    setResults({
      yearsUntilHalved: yearsUntilHalved.toFixed(2),
      halvedValue: (contribution / 2).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    });

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=INFLATION&apikey=${process.env.REACT_APP_ALPHA_KEY}`
      );
      const data = response.data.data.slice(0, 12).reverse();
      setHistoricalData(
        data.map((item) => ({
          date: item.date,
          value: parseFloat(item.value),
        }))
      );
    } catch (error) {
      toast.error('Error fetching inflation data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="calculator-section">
      <h2>Inflation Calculator</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="input-group">
          <label>Contribution ($):</label>
          <input
            type="text"
            value={formatInput(userContribution)}
            onChange={handleContributionChange}
            placeholder="Enter amount"
          />
          <button
            onClick={calculateInflationHalving}
            disabled={!userContribution}
          >
            Calculate
          </button>
        </div>
        <div className={`results-card ${!results ? 'collapsed' : ''}`}>
          {results && (
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Years Until Halved</td>
                  <td>{results.yearsUntilHalved} years</td>
                </tr>
                <tr>
                  <td>Halved Value ($)</td>
                  <td>${results.halvedValue}</td>
                </tr>
              </tbody>
            </table>
          )}
          {historicalData.length > 0 && (
            <div>
              <h3>Historical Inflation</h3>
              <ul>
                {historicalData.map((data, index) => (
                  <li key={index}>
                    {data.date}: {data.value}%
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isLoading && <FaSpinner className="loading" />}
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;

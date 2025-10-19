import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const CompoundGrowthCalculator = () => {
  const [investmentLength, setInvestmentLength] = useState('');
  const [userContribution, setUserContribution] = useState('');
  const [interestRate, setInterestRate] = useState('');
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

  const handleLengthChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    setInvestmentLength(rawValue);
  };

  const handleContributionChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    setUserContribution(rawValue);
  };

  const handleInterestChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    setInterestRate(rawValue);
  };

  const calculateCompoundGrowth = async () => {
    if (!investmentLength || !userContribution || !interestRate) {
      toast.error('Please enter all fields.');
      return;
    }
    const length = parseInt(investmentLength);
    const contribution = parseFloat(userContribution);
    const interest = parseFloat(interestRate) / 100;
    if (
      isNaN(length) ||
      isNaN(contribution) ||
      isNaN(interest) ||
      length <= 0 ||
      contribution <= 0 ||
      interest < 0
    ) {
      toast.error('Please enter valid positive numbers.');
      return;
    }

    let totalUserStash = 0;
    let totalInterest = 0;
    for (let year = 1; year <= length; year++) {
      totalUserStash += contribution;
      const interestForThisYear = (totalUserStash + totalInterest) * interest;
      totalInterest += interestForThisYear;
    }

    setResults({
      contribution: totalUserStash.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      interest: totalInterest.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      total: (totalUserStash + totalInterest).toLocaleString('en-US', {
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
          const ror = ((nextClose - currentClose) / currentClose) * 100;
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

  const toggleCollapse = () => setResults(results ? null : results);
  const toggleHistorical = () => setShowHistorical(!showHistorical);

  return (
    <div className="calculator-section">
      <h2>Compound Growth Calculator</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="input-group">
          <label>Investment Length (years):</label>
          <input
            type="text"
            value={formatInput(investmentLength)}
            onChange={handleLengthChange}
            placeholder="Enter years"
          />
          <label>Annual Contribution ($):</label>
          <input
            type="text"
            value={formatInput(userContribution)}
            onChange={handleContributionChange}
            placeholder="Enter contribution"
          />
          <label>Interest Rate (%):</label>
          <input
            type="text"
            value={formatInput(interestRate)}
            onChange={handleInterestChange}
            placeholder="Enter rate (0-100)"
          />
          <label>Investment Type (e.g., SPY):</label>
          <input
            type="text"
            value={investmentType}
            onChange={(e) => setInvestmentType(e.target.value)}
            placeholder="Enter ticker"
          />
          <button
            onClick={calculateCompoundGrowth}
            disabled={!investmentLength || !userContribution || !interestRate}
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
                    <th>Metric</th>
                    <th>Value ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Total Contribution</td>
                    <td>${results.contribution}</td>
                  </tr>
                  <tr>
                    <td>Total Interest</td>
                    <td>${results.interest}</td>
                  </tr>
                  <tr>
                    <td>Contribution + Interest</td>
                    <td>${results.total}</td>
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

export default CompoundGrowthCalculator;

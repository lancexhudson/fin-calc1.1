import React, { useState } from 'react';
import { toast } from 'react-toastify';

const SavingsRateCalculator = () => {
  const [annualSalary, setAnnualSalary] = useState('');
  const [percentBeingSaved, setPercentBeingSaved] = useState('');
  const [results, setResults] = useState(null);

  // Format numbers with commas while typing
  const formatInput = (value) => {
    if (!value) return '';
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('en-US');
  };

  const handleSalaryChange = (e) => {
    const raw = e.target.value.replace(/,/g, '');
    setAnnualSalary(raw);
  };

  const handlePercentChange = (e) => {
    const raw = e.target.value.replace(/,/g, '');
    setPercentBeingSaved(raw);
  };

  const calculateSavingsRate = () => {
    if (!annualSalary || !percentBeingSaved) {
      toast.error('Please fill in both fields.');
      return;
    }

    const salary = parseFloat(annualSalary);
    const percent = parseFloat(percentBeingSaved);

    if (
      isNaN(salary) ||
      isNaN(percent) ||
      salary <= 0 ||
      percent < 0 ||
      percent > 100
    ) {
      toast.error(
        'Please enter a valid salary and a percent between 0 and 100.'
      );
      return;
    }

    const rate = percent / 100;
    const weekly = (salary * rate) / 52;
    const biWeekly = (salary * rate) / 26;
    const monthly = (salary * rate) / 12;
    const annual = salary * rate;

    setResults({
      weekly: weekly.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      biWeekly: biWeekly.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      monthly: monthly.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      annual: annual.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    });
  };

  const clearResults = () => setResults(null);

  return (
    <div className="calculator-section">
      <h2>Savings Rate Calculator</h2>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Input Section */}
        <div className="input-group" style={{ minWidth: '320px' }}>
          <label>Annual Salary ($):</label>
          <input
            type="text"
            value={formatInput(annualSalary)}
            onChange={handleSalaryChange}
            placeholder="e.g. 85,000"
            style={{ width: '100%', marginBottom: '12px' }}
          />

          <label>Percent Being Saved (%):</label>
          <input
            type="text"
            value={formatInput(percentBeingSaved)}
            onChange={handlePercentChange}
            placeholder="e.g. 20"
            style={{ width: '100%', marginBottom: '20px' }}
          />

          <button
            onClick={calculateSavingsRate}
            disabled={!annualSalary || !percentBeingSaved}
            // style={{ width: '100%' }}
          >
            Calculate
          </button>
        </div>

        {/* Results Card – appears right next to inputs */}
        <div className={`results-card ${!results ? 'collapsed' : ''}`}>
          {results && (
            <>
              <button className="collapse-btn" onClick={clearResults}>
                ×
              </button>

              <h3 style={{ margin: '0 0 12px 0' }}>Savings Breakdown</h3>

              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th align="left">Period</th>
                    <th align="right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Weekly</td>
                    <td align="right">${results.weekly}</td>
                  </tr>
                  <tr>
                    <td>Bi-Weekly</td>
                    <td align="right">${results.biWeekly}</td>
                  </tr>
                  <tr>
                    <td>Monthly</td>
                    <td align="right">${results.monthly}</td>
                  </tr>
                  <tr>
                    <td>Annual</td>
                    <td align="right">${results.annual}</td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsRateCalculator;

// import React, { useState } from 'react';
// import { toast } from 'react-toastify';

// const SavingsRateCalculator = () => {
//   const [annualSalary, setAnnualSalary] = useState('');
//   const [percentBeingSaved, setPercentBeingSaved] = useState('');
//   const [results, setResults] = useState(null);

//   // Format numbers with commas as user types
//   const formatInput = (value) => {
//     if (!value) return '';
//     const num = parseFloat(value.replace(/,/g, ''));
//     if (isNaN(num)) return '';
//     return num.toLocaleString('en-US');
//   };

//   const handleSalaryChange = (e) => {
//     const rawValue = e.target.value.replace(/,/g, '');
//     setAnnualSalary(rawValue);
//   };

//   const handlePercentChange = (e) => {
//     const rawValue = e.target.value.replace(/,/g, '');
//     setPercentBeingSaved(rawValue);
//   };

//   const calculateSavingsRate = () => {
//     if (!annualSalary || !percentBeingSaved) {
//       toast.error('Please enter both annual salary and percent being saved.');
//       return;
//     }

//     const salary = parseFloat(annualSalary);
//     const percent = parseFloat(percentBeingSaved);

//     if (
//       isNaN(salary) ||
//       isNaN(percent) ||
//       salary <= 0 ||
//       percent < 0 ||
//       percent > 100
//     ) {
//       toast.error('Please enter a valid salary and percent (0–100).');
//       return;
//     }

//     const normalizedPercent = percent / 100;
//     const weeklySavings = (salary * normalizedPercent) / 52;
//     const biWeeklySavings = (salary * normalizedPercent) / 26;
//     const monthlySavings = (salary * normalizedPercent) / 12;
//     const annualSavings = salary * normalizedPercent;

//     setResults({
//       weekly: weeklySavings.toLocaleString('en-US', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }),
//       biWeekly: biWeeklySavings.toLocaleString('en-US', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }),
//       monthly: monthlySavings.toLocaleString('en-US', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }),
//       annual: annualSavings.toLocaleString('en-US', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }),
//     });
//   };

//   // Clear results when clicking X
//   const clearResults = () => setResults(null);

//   return (
//     <div className="calculator-section">
//       <h2>Savings Rate Calculator</h2>

//       <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
//         {/* Input Group - Fixed width for consistency */}
//         <div className="input-group" style={{ minWidth: '320px' }}>
//           <label>Annual Salary ($):</label>
//           <input
//             type="text"
//             value={formatInput(annualSalary)}
//             onChange={handleSalaryChange}
//             placeholder="e.g. 85,000"
//             style={{ width: '100%', marginBottom: '12px' }}
//           />

//           <label>Percent Being Saved (%):</label>
//           <input
//             type="text"
//             value={formatInput(percentBeingSaved)}
//             onChange={handlePercentChange}
//             placeholder="e.g. 15"
//             style={{ width: '100%', marginBottom: '20px' }}
//           />

//           <button
//             onClick={calculateSavingsRate}
//             disabled={!annualSalary || !percentBeingSaved}
//             style={{ width: '100%' }}
//           >
//             Calculate Savings Rate
//           </button>
//         </div>

//         {/* Results Card - Appears right beside inputs */}
//         <div className={`results-card ${!results ? 'collapsed' : ''}`}>
//           {results && (
//             <>
//               <button className="collapse-btn" onClick={clearResults}>
//                 ×
//               </button>
//               <h3 style={{ marginTop: 0, marginBottom: '12px' }}>
//                 Your Savings Breakdown
//               </h3>
//               <table style={{ width: '100%' }}>
//                 <thead>
//                   <tr>
//                     <th align="left">Period</th>
//                     <th align="right">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>Weekly</td>
//                     <td align="right">${results.weekly}</td>
//                   </tr>
//                   <tr>
//                     <td>Bi-Weekly</td>
//                     <td align="right">${results.biWeekly}</td>
//                   </tr>
//                   <tr>
//                     <td>Monthly</td>
//                     <td align="right">${results.monthly}</td>
//                   </tr>
//                   <tr>
//                     <td>Annual</td>
//                     <td align="right">${results.annual}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SavingsRateCalculator;

// import React, { useState } from 'react';
// import { toast } from 'react-toastify';

// const SavingsRateCalculator = () => {
//   const [annualSalary, setAnnualSalary] = useState('');
//   const [percentBeingSaved, setPercentBeingSaved] = useState('20'); // Default 20%
//   const [results, setResults] = useState(null);

//   // Format numbers with commas as user types
//   const formatInput = (value) => {
//     if (!value) return '';
//     const num = parseFloat(value.toString().replace(/,/g, ''));
//     if (isNaN(num)) return '';
//     return num.toLocaleString('en-US');
//   };

//   const handleSalaryChange = (e) => {
//     const rawValue = e.target.value.replace(/,/g, '');
//     setAnnualSalary(rawValue);
//   };

//   const handlePercentChange = (e) => {
//     let rawValue = e.target.value.replace(/,/g, '');
//     // Enforce 0–100 range
//     if (rawValue === '') {
//       setPercentBeingSaved('');
//     } else {
//       const num = parseFloat(rawValue);
//       if (!isNaN(num)) {
//         if (num > 100) rawValue = '100';
//         if (num < 0) rawValue = '0';
//       }
//       setPercentBeingSaved(rawValue);
//     }
//   };

//   const calculateSavingsRate = () => {
//     if (!annualSalary || !percentBeingSaved) {
//       toast.error(
//         'Please enter both your annual salary and savings percentage.'
//       );
//       return;
//     }

//     const salary = parseFloat(annualSalary);
//     const percent = parseFloat(percentBeingSaved) / 100;

//     if (
//       isNaN(salary) ||
//       isNaN(percent) ||
//       salary <= 0 ||
//       percent < 0 ||
//       percent > 1
//     ) {
//       toast.error(
//         'Please enter a valid salary and a savings rate between 0–100%.'
//       );
//       return;
//     }

//     const weeklySavings = (salary * percent) / 52;
//     const biWeeklySavings = (salary * percent) / 26;
//     const monthlySavings = (salary * percent) / 12;
//     const annualSavings = salary * percent;

//     setResults({
//       weekly: weeklySavings.toFixed(2),
//       biWeekly: biWeeklySavings.toFixed(2),
//       monthly: monthlySavings.toFixed(2),
//       annual: annualSavings.toFixed(2),
//     });
//   };

//   const clearResults = () => setResults(null);

//   return (
//     <div className="calculator-section">
//       <h2>Savings Rate Calculator</h2>

//       <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//         {/* Input Card */}
//         <div className="input-group" style={{ minWidth: '300px' }}>
//           <label>Annual Gross Salary ($):</label>
//           <input
//             type="text"
//             value={formatInput(annualSalary)}
//             onChange={handleSalaryChange}
//             placeholder="e.g. 85,000"
//             style={{ fontSize: '1.1em' }}
//           />

//           <label style={{ marginTop: '1rem' }}>
//             Savings Rate (% of gross income):
//             <span
//               style={{ fontSize: '0.8em', color: '#666', marginLeft: '8px' }}
//             >
//               💡 15% = Solid | 20–30% = Strong | 50%+ = FIRE track
//             </span>
//           </label>
//           <input
//             type="text"
//             value={percentBeingSaved}
//             onChange={handlePercentChange}
//             placeholder="20"
//             style={{ fontSize: '1.1em', fontWeight: 'bold' }}
//           />

//           <button
//             onClick={calculateSavingsRate}
//             disabled={!annualSalary || !percentBeingSaved}
//             style={{ marginTop: '1.5rem', padding: '12px 24px' }}
//           >
//             Calculate My Savings Breakdown
//           </button>
//         </div>

//         {/* Results Card */}
//         <div className={`results-card ${!results ? 'collapsed' : ''}`}>
//           {results && (
//             <>
//               <button className="collapse-btn" onClick={clearResults}>
//                 ×
//               </button>
//               <h3>Your Savings Breakdown</h3>
//               <p
//                 style={{
//                   color: '#2e8b57',
//                   fontWeight: 'bold',
//                   marginBottom: '1rem',
//                 }}
//               >
//                 You're saving {percentBeingSaved}% of your income —{' '}
//                 {parseFloat(percentBeingSaved) >= 50
//                   ? 'that’s elite!'
//                   : parseFloat(percentBeingSaved) >= 30
//                   ? 'excellent progress!'
//                   : parseFloat(percentBeingSaved) >= 20
//                   ? 'very strong!'
//                   : parseFloat(percentBeingSaved) >= 15
//                   ? 'solid foundation!'
//                   : 'room to grow!'}
//               </p>

//               <table style={{ width: '100%' }}>
//                 <thead>
//                   <tr>
//                     <th>Period</th>
//                     <th>Amount Saved</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>Weekly</td>
//                     <td>
//                       <strong>${results.weekly}</strong>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Bi-Weekly</td>
//                     <td>
//                       <strong>${results.biWeekly}</strong>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Monthly</td>
//                     <td>
//                       <strong>${results.monthly}</strong>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>Annual</td>
//                     <td style={{ fontSize: '1.3em', color: '#2e8b57' }}>
//                       <strong>${results.annual}</strong>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SavingsRateCalculator;

import React from 'react';
import { IndianRupee, CheckCircle } from 'lucide-react';

const Payouts = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1e293b' }}>Editor Payouts (UPI)</h1>
      
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '1rem' }}>Editor</th>
              <th style={{ padding: '1rem' }}>Requested Date</th>
              <th style={{ padding: '1rem' }}>UPI ID</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '1rem', fontWeight: 500 }}>Rahul Sharma</td>
              <td style={{ padding: '1rem' }}>Oct 12, 2026</td>
              <td style={{ padding: '1rem', fontFamily: 'monospace' }}>rahul@ybl</td>
              <td style={{ padding: '1rem', fontWeight: 'bold', color: '#10b981' }}>₹4,500</td>
              <td style={{ padding: '1rem' }}>
                <button style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14}/> Mark as Paid</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payouts;

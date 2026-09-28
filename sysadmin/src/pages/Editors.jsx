import React from 'react';
import { ShieldCheck, UserCheck, Search, XCircle } from 'lucide-react';

const Editors = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1e293b' }}>Editor Management</h1>
      
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
              <th style={{ padding: '1rem' }}>Editor Name</th>
              <th style={{ padding: '1rem' }}>Specialization</th>
              <th style={{ padding: '1rem' }}>Rating</th>
              <th style={{ padding: '1rem' }}>Active Jobs</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '1rem', fontWeight: 500 }}>Rahul Sharma</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: '#e0f2fe', color: '#0284c7', borderRadius: '4px', fontSize: '0.8rem' }}>Video Grading</span></td>
              <td style={{ padding: '1rem', color: '#f59e0b', fontWeight: 'bold' }}>4.9 ★</td>
              <td style={{ padding: '1rem' }}>2</td>
              <td style={{ padding: '1rem' }}>
                <button style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Suspend</button>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '1rem', fontWeight: 500 }}>Priya Reddy</td>
              <td style={{ padding: '1rem' }}><span style={{ padding: '4px 8px', background: '#dcfce7', color: '#16a34a', borderRadius: '4px', fontSize: '0.8rem' }}>Photo Culling</span></td>
              <td style={{ padding: '1rem', color: '#f59e0b', fontWeight: 'bold' }}>4.5 ★</td>
              <td style={{ padding: '1rem' }}>5</td>
              <td style={{ padding: '1rem' }}>
                <button style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Suspend</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Editors;

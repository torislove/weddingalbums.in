import React from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';

const Invoices = () => {
  return (
    <div className="page-content fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Billing & Invoices</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your studio's GST compliant invoices.</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Amount</th>
              <th>GST Input</th>
              <th>Status</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} color="var(--text-muted)"/> INV-2026-089</div></td>
              <td>Oct 01, 2026</td>
              <td>₹12,500</td>
              <td>₹2,250 (18%)</td>
              <td><span className="badge badge-completed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Paid</span></td>
              <td><button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}><Download size={14} /> PDF</button></td>
            </tr>
            <tr>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} color="var(--text-muted)"/> INV-2026-074</div></td>
              <td>Sep 15, 2026</td>
              <td>₹8,000</td>
              <td>₹1,440 (18%)</td>
              <td><span className="badge badge-completed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Paid</span></td>
              <td><button className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}><Download size={14} /> PDF</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;

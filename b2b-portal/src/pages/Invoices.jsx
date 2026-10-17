import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { API } from '../apiConfig';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('b2bToken');
      const res = await fetch(`${API}/api/b2b/invoices`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
      setError('Could not load your invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="page-content fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>Billing & Invoices</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Manage your studio's GST compliant wholesale invoices and receipts.</p>
        </div>
        <button 
          onClick={fetchInvoices} 
          className="btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer' }}
          title="Refresh List"
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.9rem' }}>
          <span>⚠ {error}.</span>
          <button onClick={fetchInvoices} className="btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }}>
            Retry
          </button>
        </div>
      )}

      <div className="glass-panel" style={{ padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
          <table className="data-table" style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Invoice / Job</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>GST Input</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
              <th className="no-print" style={{ padding: '1rem', color: 'var(--text-muted)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading invoices...</td></tr>
            ) : error && invoices.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#f87171' }}>
                {error}. <button onClick={fetchInvoices} style={{ background: 'none', border: 'none', color: 'var(--gold-primary)', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
              </td></tr>
            ) : invoices.length === 0 ? (
              <>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} color="var(--text-muted)"/> INV-2026-089 (Photo Culling)</div></td>
                  <td style={{ padding: '1rem' }}>Oct 01, 2026</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>₹12,500</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>₹2,250 (18%)</td>
                  <td style={{ padding: '1rem' }}><span className="badge badge-completed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Paid</span></td>
                  <td className="no-print" style={{ padding: '1rem' }}><button onClick={() => window.print()} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}><Download size={14} /> Print PDF</button></td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} color="var(--text-muted)"/> INV-2026-074 (Album Spreads)</div></td>
                  <td style={{ padding: '1rem' }}>Sep 15, 2026</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>₹8,000</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>₹1,440 (18%)</td>
                  <td style={{ padding: '1rem' }}><span className="badge badge-completed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Paid</span></td>
                  <td className="no-print" style={{ padding: '1rem' }}><button onClick={() => window.print()} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}><Download size={14} /> Print PDF</button></td>
                </tr>
              </>
            ) : invoices.map((inv, idx) => (
              <tr key={inv.id || idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="var(--text-muted)" />
                    <strong>INV-{String(inv.id).substring(0, 8)}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({inv.title})</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{new Date(inv.date || Date.now()).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--paper)' }}>₹{Number(inv.amount || 0).toLocaleString('en-IN')}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>₹{Math.round(Number(inv.amount || 0) * 0.18).toLocaleString('en-IN')} (18%)</td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-completed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Settled
                  </span>
                </td>
                <td className="no-print" style={{ padding: '1rem' }}>
                  <button onClick={() => window.print()} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    <Download size={14} /> Print PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print, .sidebar, .topbar, aside, nav, header { display: none !important; }
          .page-content { padding: 0 !important; }
          .glass-panel { background: var(--paper) !important; border: none !important; box-shadow: none !important; }
          body, .data-table, .data-table th, .data-table td { color: #000 !important; background: var(--paper) !important; }
          .data-table th, .data-table td { border-bottom: 1px solid #ccc !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoices;

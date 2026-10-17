import React, { useState, useEffect } from 'react';
import { IndianRupee, CheckCircle, XCircle, RefreshCw, ArrowUpRight } from 'lucide-react';
import { API } from '../apiConfig';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast from '../components/ui/Toast';

const token = () => localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');

const Payouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [dialog, setDialog] = useState(null); // { kind: 'approve' | 'reject', id }
  const [toast, setToast] = useState(null);   // { msg, tone }

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/payouts`, {
        headers: { 'Authorization': `Bearer ${token()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayouts(Array.isArray(data) ? data : []);
      } else {
        setToast({ msg: 'Could not load payouts', tone: 'danger' });
      }
    } catch (err) {
      console.error('Failed to load payouts', err);
      setToast({ msg: 'Network error loading payouts', tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  /* Runs the approved/rejected action for the open dialog; the dialog closes itself. */
  const runDialog = async (value) => {
    if (!dialog) return;
    const { kind, id } = dialog;
    setProcessingId(id);
    try {
      const res = await fetch(`${API}/api/admin/payouts/${id}/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
        body: kind === 'reject' ? JSON.stringify({ reason: value }) : undefined,
      });
      if (res.ok) {
        setToast({ msg: kind === 'approve' ? 'Payout approved & settled' : 'Payout request rejected', tone: kind === 'approve' ? 'success' : 'default' });
        setDialog(null);
        fetchPayouts();
      } else {
        setToast({ msg: `Failed to ${kind} payout`, tone: 'danger' });
      }
    } catch {
      setToast({ msg: 'Network error', tone: 'danger' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1400px', margin: '0 auto', color: 'var(--paper)', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Editor &amp; Studio Payout Requests</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '13px' }}>Review, approve, and disburse UPI transfers from the Escrow pool.</p>
        </div>
        <button
          onClick={fetchPayouts}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.25)', color: '#22d3ee',
            borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
            whiteSpace: 'nowrap'
          }}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh Payouts
        </button>
      </div>

      <div style={{
        background: 'rgba(0,6,15,0.6)',
        border: '1px solid rgba(14,165,233,0.1)',
        borderRadius: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <table style={{ width: '100%', minWidth: '750px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
              <th style={{ padding: '14px 16px' }}>Request ID</th>
              <th style={{ padding: '14px 16px' }}>Recipient User</th>
              <th style={{ padding: '14px 16px' }}>UPI ID</th>
              <th style={{ padding: '14px 16px' }}>Amount</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px' }}>Requested At</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading payouts...</td></tr>
            ) : payouts.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>No pending payout requests.</td></tr>
            ) : payouts.map(item => (
              <tr key={item.id || item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#22d3ee' }}>
                  #{String(item.id || item._id).substring(0, 8)}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--paper)' }}>
                  {item.user_name || item.user_id || 'Editor Partner'}
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: 'var(--brand)' }}>
                  {item.upi_id || 'editor@upi'}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--ok)', fontSize: '14px' }}>
                  ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                    background: item.status === 'approved' ? 'rgba(16,185,129,0.15)' : item.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: item.status === 'approved' ? '#34d399' : item.status === 'rejected' ? '#f87171' : '#fbbf24',
                    textTransform: 'uppercase'
                  }}>
                    {item.status || 'pending'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(item.created_at || Date.now()).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  {item.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setDialog({ kind: 'approve', id: item.id || item._id })}
                        disabled={processingId === (item.id || item._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', background: 'rgba(16,185,129,0.2)',
                          border: '1px solid rgba(16,185,129,0.4)', color: '#34d399',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                        }}
                      >
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button
                        onClick={() => setDialog({ kind: 'reject', id: item.id || item._id })}
                        disabled={processingId === (item.id || item._id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', background: 'rgba(239,68,68,0.2)',
                          border: '1px solid rgba(239,68,68,0.4)', color: '#f87171',
                          borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!dialog}
        tone={dialog?.kind === 'reject' ? 'danger' : 'success'}
        title={dialog?.kind === 'reject' ? 'Reject payout request?' : 'Approve payout?'}
        message={dialog?.kind === 'reject'
          ? 'The editor will see this reason. Funds stay in escrow until re-requested.'
          : 'Approve this payout and mark the escrow funds as settled? This cannot be undone.'}
        confirmLabel={dialog?.kind === 'reject' ? 'Reject payout' : 'Approve & settle'}
        withInput={dialog?.kind === 'reject'}
        inputLabel="Rejection reason"
        inputPlaceholder="e.g. UPI ID does not match bank records"
        busy={processingId === dialog?.id}
        onConfirm={runDialog}
        onCancel={() => setDialog(null)}
      />

      <Toast message={toast?.msg} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
};

export default Payouts;

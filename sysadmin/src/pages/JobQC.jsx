import React, { useState, useEffect, useCallback } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Eye, CheckCircle, XCircle, RefreshCw, ExternalLink, SlidersHorizontal, X } from 'lucide-react';
import { API } from '../apiConfig';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast from '../components/ui/Toast';

const SAMPLE_RAW = '/images/bride-raw.jpg';
const SAMPLE_POLISHED = '/images/bride-polished.jpg';

const JobQC = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [compareJob, setCompareJob] = useState(null);
  const [dialog, setDialog] = useState(null); // { kind: 'approve' | 'reject', id }
  const [toast, setToast] = useState(null);   // { msg, tone }

  // Esc closes the visual compare overlay
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setCompareJob(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* Runs the approve/reject action for the open dialog; the dialog closes itself. */
  const runDialog = async (value) => {
    if (!dialog) return;
    const { kind, id } = dialog;
    setActionId(id);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken');
      const res = await fetch(`${API}/api/admin/jobs/${id}/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: kind === 'reject' ? JSON.stringify({ feedback: value }) : undefined,
      });
      if (res.ok) {
        setToast({ msg: kind === 'approve' ? 'Job passed QC — escrow released' : 'Revision feedback sent to editor', tone: kind === 'approve' ? 'success' : 'default' });
        setDialog(null);
        fetchJobs();
      } else {
        setToast({ msg: `Failed to ${kind === 'approve' ? 'approve' : 'reject'} job`, tone: 'danger' });
      }
    } catch {
      setToast({ msg: 'Network error', tone: 'danger' });
    } finally {
      setActionId(null);
    }
  };

  const qcJobs = jobs.filter(j => 
    j.status === 'submitted' || 
    j.status === 'QC Review' || 
    j.status === 'qc_review' || 
    j.status === 'in_progress'
  );

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: '1400px', margin: '0 auto', color: 'var(--paper)', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Quality Control (QC) Gate</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '13px' }}>Review deliverables submitted by editors before final client release.</p>
        </div>
        <button 
          onClick={fetchJobs}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', background: 'rgba(14,165,233,0.1)',
            border: '1px solid rgba(14,165,233,0.25)', color: '#22d3ee',
            borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
            whiteSpace: 'nowrap'
          }}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh QC
        </button>
      </div>

      <div style={{
        background: 'rgba(0,6,15,0.6)',
        border: '1px solid rgba(14,165,233,0.1)',
        borderRadius: '12px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
              <th style={{ padding: '14px 16px' }}>Job ID</th>
              <th style={{ padding: '14px 16px' }}>Studio / Event</th>
              <th style={{ padding: '14px 16px' }}>Editor Deliverable</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>QC Decision</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Checking QC submissions...</td></tr>
            ) : qcJobs.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>All jobs reviewed! Queue is clear.</td></tr>
            ) : qcJobs.map(job => (
              <tr key={job.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', color: '#22d3ee' }}>
                  #{String(job.id).substring(0, 8)}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--paper)' }}>{job.title || job.client_name || 'Project'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{job.type || 'Photo Retouch'}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {job.work_link ? (
                    <a 
                      href={job.work_link} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        color: 'var(--brand)', textDecoration: 'none', fontWeight: 600
                      }}
                    >
                      <ExternalLink size={14} /> Inspect Files
                    </a>
                  ) : (
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Awaiting Submission</span>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                    background: job.status === 'submitted' ? 'rgba(245,158,11,0.15)' : 'rgba(14,165,233,0.15)',
                    color: job.status === 'submitted' ? '#fbbf24' : '#38bdf8',
                    textTransform: 'uppercase'
                  }}>
                    {job.status === 'submitted' ? 'Needs QC Review' : job.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setCompareJob(job)}
                      disabled={actionId === job.id}
                      title="Open visual before/after comparison"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', background: 'rgba(212,175,55,0.12)',
                        border: '1px solid rgba(212,175,55,0.4)', color: 'var(--brand)',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                      }}
                    >
                      <SlidersHorizontal size={13} /> Visual QC
                    </button>
                    <button 
                      onClick={() => setDialog({ kind: 'approve', id: job.id })} 
                      disabled={actionId === job.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', background: 'rgba(16,185,129,0.2)',
                        border: '1px solid rgba(16,185,129,0.4)', color: '#34d399',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                      }}
                    >
                      <CheckCircle size={13} /> Pass QC
                    </button>
                    <button 
                      onClick={() => setDialog({ kind: 'reject', id: job.id })} 
                      disabled={actionId === job.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '6px 12px', background: 'rgba(239,68,68,0.2)',
                        border: '1px solid rgba(239,68,68,0.4)', color: '#f87171',
                        borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                      }}
                    >
                      <XCircle size={13} /> Request Rework
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual QC compare overlay */}
      {compareJob && (
        <div onClick={() => setCompareJob(null)} style={{
          position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(2,6,23,0.92)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 4vw, 3rem)',
          backdropFilter: 'blur(6px)',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 'min(1000px, 100%)', maxHeight: '92vh', overflowY: 'auto',
            background: 'rgba(8,14,26,0.9)', border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '16px', padding: 'clamp(1rem, 2.5vw, 1.75rem)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.35rem', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: 'var(--paper)' }}>
                  Visual QC — #{String(compareJob.id || '').substring(0, 8)}
                </h2>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                  {compareJob.title || compareJob.client_name || 'Project'} · {compareJob.type || 'Photo Retouch'} — drag the divider right to verify the edit lift.
                </p>
              </div>
              <button onClick={() => setCompareJob(null)} aria-label="Close visual QC" style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--paper)', borderRadius: 8, cursor: 'pointer', padding: '8px 10px', flexShrink: 0,
              }}><X size={16} /></button>
            </div>

            <ReactCompareSlider
              position={50}
              style={{ width: '100%', aspectRatio: '16/10', borderRadius: '12px', overflow: 'hidden' }}
              itemOne={
                <ReactCompareSliderImage
                  src={compareJob.input_image || SAMPLE_RAW}
                  alt="RAW / unedited input"
                  style={{ objectFit: 'cover' }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={compareJob.output_image || compareJob.work_link_image || SAMPLE_POLISHED}
                  alt="Edited output"
                  style={{ objectFit: 'cover' }}
                />
              }
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '12px', color: 'rgba(255,255,255,0.45)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>LEFT: RAW input{!compareJob.input_image && ' (sample placeholder — link job input images to replace)'}</span>
              <span>{!compareJob.output_image && !compareJob.work_link_image && 'Sample placeholder — attach job output images to replace. '}RIGHT: Editor output</span>
            </div>

            {compareJob.work_link && (
              <a href={compareJob.work_link} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: '1rem',
                color: 'var(--brand)', fontWeight: 600, fontSize: 13, textDecoration: 'none',
              }}>
                <ExternalLink size={14} /> Open full deliverable in new tab
              </a>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!dialog}
        tone={dialog?.kind === 'reject' ? 'danger' : 'success'}
        title={dialog?.kind === 'reject' ? 'Request rework?' : 'Pass QC?'}
        message={dialog?.kind === 'reject'
          ? 'The editor receives this feedback and re-submits the deliverable.'
          : 'Pass QC for this job and release the editor escrow? This cannot be undone.'}
        confirmLabel={dialog?.kind === 'reject' ? 'Send for rework' : 'Pass QC & release'}
        withInput={dialog?.kind === 'reject'}
        inputLabel="Revision feedback"
        inputPlaceholder="e.g. Skin tones too warm on slides 4-7; re-grade and resubmit"
        busy={actionId === dialog?.id}
        onConfirm={runDialog}
        onCancel={() => setDialog(null)}
      />

      <Toast message={toast?.msg} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
};

export default JobQC;

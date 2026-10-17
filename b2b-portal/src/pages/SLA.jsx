import React from 'react';
import { Camera, Clapperboard, BookOpen, Scissors, ShieldCheck, Percent, Clock3, Headset } from 'lucide-react';

const SLA_ITEMS = [
  { icon: Scissors, title: 'RAW Culling', sla: '48 h', detail: 'Story-based first pass with eye-AF verification. Flash-crown frames flagged for your review, not silently dropped.', useTag: '#photo-cull' },
  { icon: Camera, title: 'Photo Editing', sla: '72 h', detail: 'Your preset, our finish — Warm Gold Telugu, Teal, Sathi-Ranga or Kodak Portra looks applied with batch-consistency QC.', useTag: 'per 100 photos' },
  { icon: BookOpen, v: true, title: 'Album Design', sla: '96 h', detail: 'Ritual sequencing with gutter-safe margins measured against your exact album size and sheet style.', useTag: 'per 40-sheet album' },
  { icon: Clapperboard, title: 'Video Editing', sla: '120 h', detail: '4K teasers, reels and highlight films with Telugu-timed subtitles and licensed audio.', useTag: 'per project' },
];

const SLA = () => {
  return (
    <div className="page-content fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>SLA Guarantees</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          Contractual turnaround windows for every studio partner. Miss one window and a service credit is applied automatically — you never have to chase us.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(1rem, 2vw, 2rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {SLA_ITEMS.map(({ icon: Icon, title, sla, detail, useTag }) => (
          <div key={title} style={{
            border: '1px solid var(--glass-border)', borderRadius: 14, padding: '1.35rem',
            background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: '0.65rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Icon size={22} color="var(--gold-primary, var(--brand))" />
              <span className="badge badge-active" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Clock3 size={12} /> {sla}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{title}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65 }}>{detail}</p>
            <span style={{ marginTop: 'auto', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{useTag}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.35rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <Percent size={22} color="var(--gold-primary, var(--brand))" />
          <div>
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>10% Service Credit</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65 }}>
              Every hour past a missed window accrues credit against your next job — computed at invoice, not negotiated later.
            </p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.35rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <ShieldCheck size={22} color="var(--gold-primary, var(--brand))" />
          <div>
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>White-Label Protection</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65 }}>
              Deliverables carry your brand and your tone. Our network stays invisible to your couples — always.
            </p>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.35rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <Headset size={22} color="var(--gold-primary, var(--brand))" />
          <div>
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem' }}>Peak-Season Escalation</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.65 }}>
              Nov–Jun wedding rush gets priority lanes: flag a job urgent from the Submit Job wizard to jump the queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLA;

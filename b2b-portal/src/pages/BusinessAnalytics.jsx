import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, IndianRupee, Clock, Star } from 'lucide-react';

const BusinessAnalytics = () => {
  return (
    <div className="page-content fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Business Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Track your studio's growth and post-production efficiency.</p>
        </div>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Export PDF Report
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
            <IndianRupee size={24} color="var(--gold-primary)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Total Spend (YTD)</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>₹45,200</h3>
            <p style={{ fontSize: '0.8rem', color: '#10b981', margin: '0.25rem 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> +12% from last year
            </p>
          </div>
        </div>
        
        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <Clock size={24} color="var(--accent-blue)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Avg Turnaround Time</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>2.4 Days</h3>
            <p style={{ fontSize: '0.8rem', color: '#10b981', margin: '0.25rem 0 0 0' }}>Faster than industry average (4 days)</p>
          </div>
        </div>

        <div className="glass-panel stat-card" style={{ padding: '1.5rem' }}>
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle size={24} color="var(--accent-green)" />
          </div>
          <div className="stat-info">
            <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-secondary)' }}>Jobs Completed</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>84</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Chart 1 */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BarChart3 size={20} color="var(--gold-primary)" /> Monthly Volume</h3>
            <select className="form-control" style={{ padding: '0.3rem 1rem', width: 'auto', background: 'transparent', borderColor: 'var(--glass-border)' }}>
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
            {/* Mock Bar Chart */}
            {[40, 60, 45, 80, 100, 75, 30].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '100%', height: `${h}%`, background: h > 80 ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.3)', borderRadius: '4px 4px 0 0', transition: 'height 1s ease' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2 */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PieChart size={20} color="var(--gold-primary)" /> Service Breakdown</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', gap: '2rem' }}>
            {/* Mock Pie Chart UI */}
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'conic-gradient(var(--gold-primary) 0% 45%, var(--accent-blue) 45% 75%, var(--accent-green) 75% 100%)', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gold-primary)' }}></div>
                <span style={{ fontSize: '0.9rem' }}>Cinematic Videos (45%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-blue)' }}></div>
                <span style={{ fontSize: '0.9rem' }}>Photo Culling/Grade (30%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-green)' }}></div>
                <span style={{ fontSize: '0.9rem' }}>Album Design (25%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Editor Performance Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Your Top Dedicated Editors</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>We try to route your jobs to the same highly-rated editors to maintain your signature style.</p>
        
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Editor Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Speciality</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Jobs Done for You</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Your Average Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1rem', fontWeight: 500 }}>Rahul K.</td>
              <td style={{ padding: '1rem' }}>Cinematic Videos</td>
              <td style={{ padding: '1rem' }}>14</td>
              <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--gold-primary)' }}>
                <Star size={16} fill="var(--gold-primary)" /> 5.0
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '1rem', fontWeight: 500 }}>Sneha V.</td>
              <td style={{ padding: '1rem' }}>Photo Culling & Grading</td>
              <td style={{ padding: '1rem' }}>28</td>
              <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--gold-primary)' }}>
                <Star size={16} fill="var(--gold-primary)" /> 4.9
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

// Quick fix for missing CheckCircle import which I forgot at top
import { CheckCircle } from 'lucide-react';
export default BusinessAnalytics;

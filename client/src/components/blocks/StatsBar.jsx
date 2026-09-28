import React from 'react';
import ScrollReveal from '../ScrollReveal';
import AnimatedCounter from '../AnimatedCounter';

const StatsBar = (props) => {
  const stats = props.stats || [];

  return (
    <section className="stats-bar">
      <div className="container">
        <div className="grid grid-4 text-center">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 120}>
              <div className="stat-item">
                <div className="stat-ring">
                  <svg viewBox="0 0 80 80" width="80" height="80">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="3" />
                    <circle cx="40" cy="40" r="35" fill="none" stroke="#D4AF37" strokeWidth="3"
                      strokeDasharray={`${2 * Math.PI * 35 * 0.75} ${2 * Math.PI * 35 * 0.25}`}
                      strokeLinecap="round" transform="rotate(-90 40 40)" opacity="0.5" />
                  </svg>
                  <div className="stat-value">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                </div>
                <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;

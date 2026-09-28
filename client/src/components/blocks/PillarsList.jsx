import React from 'react';
import ScrollReveal from '../ScrollReveal';
import { Camera, Film, MonitorPlay, Users, History, Smartphone } from 'lucide-react';

const iconMap = { Camera, Film, MonitorPlay, Users, History, Smartphone };

const PillarsList = (props) => {
  const { pillars = [] } = props;

  return (
    <div className="pillars-container container">
      {pillars.map((pillar, index) => {
        const IconComponent = iconMap[pillar.icon] || Camera;
        return (
          <ScrollReveal 
            key={index} 
            delay={index * 100}
            className="pillar-card glass-3d"
          >
            <div className="pillar-icon-wrapper">
              <div className="pillar-icon">
                <IconComponent size={48} />
              </div>
              <div className="icon-glow"></div>
            </div>
            
            <div className="pillar-content">
              <h3 className="pillar-title font-serif">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.desc}</p>
            </div>
            
            <div className="pillar-number">0{index + 1}</div>
          </ScrollReveal>
        );
      })}
    </div>
  );
};

export default PillarsList;

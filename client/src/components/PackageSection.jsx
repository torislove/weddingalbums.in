import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './PackageSection.css';

const PACKAGE_TABS = [
  { id: 'combo', label: 'Combo Packages' },
  { id: 'photo', label: 'Photo Editing' },
  { id: 'video', label: 'Video Editing' },
  { id: 'albums', label: 'Album Printing' },
  { id: 'flex', label: 'Flex & Hoardings' },
];

const PackageSection = ({ type = 'b2c' }) => {
  const [activeTab, setActiveTab] = useState('combo');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/packages?type=${type}`);
        if (!res.ok) throw new Error('Failed to fetch packages');
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error('Error fetching packages', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [type]);

  const filteredPackages = packages.filter(pkg => pkg.category === activeTab);

  return (
    <div className="package-section">
      <ScrollReveal className="text-center mb-5">
        <h2 className="text-gradient font-serif mb-4">Transparent Pricing</h2>
        <p className="text-muted mb-4">Choose a category to view our standard packages.</p>
        
        <div className="package-tabs">
          {PACKAGE_TABS.map(tab => (
            <button 
              key={tab.id}
              className={`package-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-3 package-grid">
        {loading ? (
          <div className="col-span-3 flex justify-center py-10">
            <Loader className="animate-spin text-[#D4AF37]" size={32} />
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 py-10">
            No packages available in this category.
          </div>
        ) : (
          filteredPackages.map((pkg, i) => (
            <ScrollReveal key={pkg._id} delay={i * 100} className={`package-card glass-3d ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && <div className="popular-badge">⭐ Most Popular</div>}
              <div className="pkg-tier" style={{ color: pkg.color }}>{pkg.tier}</div>
              <div className="pkg-price-wrap">
                <span className="pkg-price">{pkg.price}</span>
                {pkg.suffix && <span className="pkg-suffix">{pkg.suffix}</span>}
              </div>
              <ul className="pkg-list">
                {pkg.features.map((item, j) => (
                  <li key={j}><span style={{ color: pkg.color }}>✓</span> {item}</li>
                ))}
              </ul>
              <a href="/order" className="btn btn-outline package-btn" style={{ borderColor: pkg.color, color: pkg.color }}>
                Enquire Now <ArrowRight size={14} />
              </a>
            </ScrollReveal>
          ))
        )}
      </div>
    </div>
  );
};

export default PackageSection;

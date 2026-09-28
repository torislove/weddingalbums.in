import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BeforeAfter from '../components/BeforeAfter';
import { UploadCloud, Scissors, BookOpen, Truck, CheckCircle2, Layers, ShieldCheck, Star } from 'lucide-react';
import './B2B.css';

const B2B = () => {
  const [sheetCount, setSheetCount] = useState(30);
  const [sheetTypes, setSheetTypes] = useState([]);
  const [selectedSheetType, setSelectedSheetType] = useState(null);
  
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/admin/configs');
        const data = await res.json();
        const types = data.find(c => c.key === 'sheet_types')?.options || [];
        setSheetTypes(types);
        if (types.length > 0) setSelectedSheetType(types[0]);
      } catch (err) {
        console.error('Error fetching sheet types', err);
      }
    };
    fetchConfigs();
  }, []);

  // Calculator Math
  const inHouseCostPerSheet = 250; // Approximated studio lab cost
  const ourCost = selectedSheetType ? selectedSheetType.price * sheetCount : 0;
  const inHouseCost = inHouseCostPerSheet * sheetCount;
  const savings = Math.max(0, inHouseCost - ourCost);

  return (
    <div className="b2b-page">
      
      {/* Abstract Ambient Glows */}
      <div className="b2b-ambient-1"></div>
      <div className="b2b-ambient-2"></div>

      {/* Hero Section */}
      <section className="b2b-hero">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="b2b-badge">
            WHOLESALE PRINTING & EDITING FOR STUDIOS
          </div>
          <h1 className="b2b-title">
            Scale Your Studio. <br /> Maximize Margins.
          </h1>
          <p className="b2b-subtitle">
            Outsource your album printing and editing at wholesale per-sheet rates. We handle the production so you can shoot more weddings.
          </p>
          <Link to="/login?role=b2b" className="btn btn-gold-3d">
            Create Studio Account
          </Link>
        </motion.div>
      </section>

      {/* The Process Section (Bento Grid) */}
      <section className="b2b-workflow">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">The Workflow</h2>
          <p className="b2b-section-subtitle">Seamless integration with your studio.</p>
        </div>

        <div className="b2b-bento-grid">
          {[
            { icon: <UploadCloud size={28} />, title: '1. Upload RAWs', desc: 'Securely upload massive files via our high-speed studio portal.' },
            { icon: <Scissors size={28} />, title: '2. Dedicated Editing', desc: 'Your assigned editor applies your signature LUTs and style.' },
            { icon: <BookOpen size={28} />, title: '3. Client Proofing', desc: 'Send white-labeled 3D album links directly to your couples.' },
            { icon: <Truck size={28} />, title: '4. Print & Ship', desc: 'We print, bind, and ship luxury albums in your name.' }
          ].map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="b2b-bento-card"
            >
              <div className="b2b-icon-wrapper">
                {step.icon}
              </div>
              <h3 className="b2b-card-title">{step.title}</h3>
              <p className="b2b-card-desc">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Printing Arsenal & Sheet Types */}
      <section className="b2b-printing-arsenal">
        <div className="b2b-section-header">
          <h2 className="b2b-section-title">Our Printing Arsenal</h2>
          <p className="b2b-section-subtitle">Wholesale printing with premium Indian market sheets.</p>
        </div>
        
        <div className="b2b-printing-grid">
          {sheetTypes.slice(0, 4).map((type, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="b2b-sheet-card">
              <Layers className="b2b-sheet-icon" />
              <h3>{type.label.split('(')[0].trim()}</h3>
              <p>Wholesale Rate: <strong>₹{type.price} / sheet</strong></p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* White Label Guarantee */}
      <section className="b2b-whitelabel-section">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="b2b-whitelabel-card">
          <ShieldCheck size={48} className="text-[#D4AF37] mb-4 mx-auto" />
          <h2>100% White-Label Guarantee</h2>
          <p>Your Brand. Our Execution. We drop-ship albums directly to your clients with NO branding from our side. They will think you printed it in-house.</p>
        </motion.div>
      </section>

      {/* The Math Calculator Section */}
      <section className="b2b-calculator-section">
        <div className="b2b-calc-grid">
          
          <div className="b2b-calc-info">
            <h2>Calculate Printing Margins</h2>
            <p>
              Standard retail print labs charge studios exorbitant per-sheet rates.
            </p>
            <p>
              By outsourcing printing to us at our wholesale rates, you can instantly see how much profit you retain per album based on sheet count and finish type.
            </p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="b2b-savings-badge"
            >
              <h4>
                <CheckCircle2 size={24}/> Save approx {savings > 0 ? `₹${savings.toLocaleString('en-IN')}` : '₹0'} per album.
              </h4>
              <p>Keep more money in your pocket on every wedding.</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="b2b-calc-widget"
          >
            <h3 className="b2b-calc-title">Wholesale Estimator</h3>
            
            <div className="b2b-slider-container">
              <div className="b2b-slider-header">
                <span className="b2b-slider-label">Sheet Type</span>
              </div>
              <select 
                className="w-full bg-black/50 border border-white/20 text-white p-3 rounded mt-2 outline-none"
                value={selectedSheetType?.value || ''}
                onChange={(e) => {
                  const type = sheetTypes.find(t => t.value === e.target.value);
                  setSelectedSheetType(type);
                }}
              >
                {sheetTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label} - ₹{type.price}/sheet</option>
                ))}
              </select>
            </div>

            <div className="b2b-slider-container mt-6">
              <div className="b2b-slider-header">
                <span className="b2b-slider-label">Number of Sheets</span>
                <span className="b2b-slider-value">{sheetCount}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={sheetCount} 
                onChange={(e) => setSheetCount(Number(e.target.value))}
                className="b2b-range"
              />
            </div>
            
            <div className="b2b-comparison">
              <div className="b2b-comp-row">
                <span className="b2b-comp-label">Avg Retail Lab Cost</span>
                <span className="b2b-comp-val">₹{inHouseCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="b2b-comp-row highlight">
                <span className="b2b-comp-label">Our Wholesale Cost</span>
                <span className="b2b-comp-val">₹{ourCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="b2b-total-savings">
              <p className="b2b-total-label">Margin Retained</p>
              <p className="b2b-total-val">
                {savings > 0 ? `₹${savings.toLocaleString('en-IN')}` : '₹0'}
              </p>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Testimonials */}
      <section className="b2b-testimonials" style={{ padding: '80px 5%', textAlign: 'center' }}>
        <h2>Trusted by Andhra's Top Studios</h2>
        <div className="grid grid-3" style={{ gap: '30px', marginTop: '40px' }}>
          {[
            { name: "Srikanth Photography", location: "Vijayawada", text: "అద్భుతమైన క్వాలిటీ! మా కస్టమర్లు NT షీట్స్ చూసి చాలా సంతోషపడ్డారు. డెలివరీ కూడా ఆన్ టైం లో జరిగింది." },
            { name: "Rajesh Weddings", location: "Hyderabad", text: "The white-label shipping is a game changer for my studio. I just send the order and my clients get a luxury box with zero hassle for me." },
            { name: "Suresh Clicks", location: "Vizag", text: "హోల్ సేల్ ప్రైసింగ్ చాలా బాగుంది. 12x18 కరిజ్మా ఆల్బమ్స్ క్వాలిటీ టాప్ క్లాస్. Highly recommended for studio owners!" }
          ].map((t, i) => (
            <div key={i} className="glass-3d p-8 rounded-xl text-left">
              <div className="flex text-[#D4AF37] mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#D4AF37" />)}
              </div>
              <p className="italic text-gray-300 mb-6">"{t.text}"</p>
              <h4 className="font-bold text-white m-0">{t.name}</h4>
              <p className="text-sm text-gray-500 m-0">{t.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="b2b-hero" style={{ paddingBottom: '180px' }}>
         <h2 className="b2b-section-title">Ready to scale?</h2>
         <p className="b2b-section-subtitle">Join hundreds of top studios optimizing their workflow.</p>
         <Link to="/login?role=b2b" className="btn btn-gold-3d" style={{ marginTop: '20px' }}>
           Create Studio Account
         </Link>
      </section>
      
    </div>
  );
};

export default B2B;

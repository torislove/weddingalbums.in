import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MockWhatsApp = () => {
  const [sent, setSent] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        maxWidth: '320px',
        margin: '0 auto',
        backgroundColor: '#f0f2f5',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        fontFamily: 'Helvetica, Arial, sans-serif'
      }}
    >
      {/* WA Header */}
      <div style={{ backgroundColor: '#075e54', color: 'white', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ddd', marginRight: '15px' }}></div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>My Wedding Invitation</h4>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>online</span>
        </div>
      </div>
      
      {/* WA Body */}
      <div style={{ padding: '20px', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', height: '350px', position: 'relative', overflowY: 'auto' }}>
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            style={{ backgroundColor: '#e2ffc7', padding: '5px', borderRadius: '8px', maxWidth: '85%', marginLeft: 'auto', marginBottom: '10px', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
          >
            <div style={{ padding: '5px' }}>
              {/* Mock video player UI */}
              <div style={{ position: 'relative', width: '100%', height: '150px', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400" alt="Video thumb" style={{position:'absolute', width:'100%', height:'100%', objectFit:'cover', opacity: 0.6}} />
                 {/* Play button overlay */}
                 <motion.div 
                   animate={{ scale: [1, 1.1, 1] }}
                   transition={{ repeat: Infinity, duration: 1.5 }}
                   whileHover={{ scale: 1.2 }}
                   whileTap={{ scale: 0.9 }}
                   style={{ zIndex: 10, width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                 >
                   <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid #000', marginLeft: '5px' }}></div>
                 </motion.div>
              </div>
              <p style={{ margin: '8px 0 4px', fontSize: '0.9rem', color: '#303030', lineHeight: 1.4 }}>
                We invite you to share our joy as we get married! 💍✨
              </p>
              <span style={{ fontSize: '0.7rem', color: '#999', display: 'block', textAlign: 'right' }}>10:42 AM</span>
            </div>
          </motion.div>

          {sent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ backgroundColor: '#fff', padding: '10px 15px', borderRadius: '8px', maxWidth: '85%', marginRight: 'auto', marginBottom: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            >
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#303030', lineHeight: 1.4 }}>
                Thanks! The test link has been sent to your WhatsApp number. Check your phone.
              </p>
              <span style={{ fontSize: '0.7rem', color: '#999', display: 'block', textAlign: 'right', marginTop: '4px' }}>Just now</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Action Area */}
      <div style={{ padding: '15px', backgroundColor: 'white', textAlign: 'center' }}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSent(true)}
          className="btn btn-primary"
          style={{ width: '100%', fontSize: '0.9rem', backgroundColor: '#075e54', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {sent ? 'Link Sent!' : 'Send Test Invite'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MockWhatsApp;

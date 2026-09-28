import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Mock Nodemailer transport for now, configure with real SMTP in production
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER || 'test@ethereal.email',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

export const sendEmailNotification = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"WeddingAlbums.in" <no-reply@weddingalbums.in>',
      to,
      subject,
      html
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
};

export const generateInvoicePDF = (order, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(filePath));
      
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Order ID: ${order.id}`);
      doc.text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      
      doc.text(`Customer: ${order.data.customerName || 'N/A'}`);
      doc.text(`Total Amount: Rs. ${order.data.totalAmount || 0}`);
      doc.moveDown();
      
      doc.text('Thank you for choosing WeddingAlbums.in!', { align: 'center' });
      
      doc.end();
      resolve(filePath);
    } catch (err) {
      reject(err);
    }
  });
};

export const sendWhatsAppMessage = async (to, message) => {
  try {
    // Mocking WhatsApp API call via a generic webhook/service like Twilio or Meta Graph API
    console.log(`[WhatsApp] Sending to ${to}: ${message}`);
    
    // Example implementation using Meta Cloud API
    const token = process.env.WHATSAPP_TOKEN || 'mock_token';
    const phoneId = process.env.WHATSAPP_PHONE_ID || 'mock_id';
    
    if (token !== 'mock_token') {
      await axios.post(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    
    return true;
  } catch (error) {
    console.error('WhatsApp send failed:', error.message);
    return false;
  }
};

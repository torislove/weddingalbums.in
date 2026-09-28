import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingSocials from './components/FloatingSocials';
import AudioEffectManager from './components/AudioEffectManager';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import About from './pages/About';
import Testimonials from './pages/Testimonials';
import OrderAlbum from './pages/OrderAlbum';
import MuhurthamCalendar from './pages/MuhurthamCalendar';
import PhotographerDashboard from './pages/PhotographerDashboard';
import ClientProofing from './pages/ClientProofing';
import PortalLogin from './pages/PortalLogin';
import B2B from './pages/B2B';
import B2C from './pages/B2C';
import Careers from './pages/Careers';
import Pricing from './pages/Pricing';
import EditorDashboard from './pages/EditorDashboard';
import AlbumsShowcase from './pages/AlbumsShowcase';
import OrderTracking from './pages/OrderTracking';
import BookingPage from './pages/BookingPage';
import ForgotPassword from './pages/ForgotPassword';
import Blog from './pages/Blog';
import PhotoCulling from './pages/PhotoCulling';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CustomCursor from './components/CustomCursor';
import PushNotification from './components/PushNotification';
import LeadCaptureModal from './components/LeadCaptureModal';
import ScrollToTop from './components/ScrollToTop';
import MobileBookingBar from './components/MobileBookingBar';
import PageTransition from './components/PageTransition';
import IntroScreen from './components/IntroScreen';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import ClientDashboard from './pages/ClientDashboard';
import OrderHistory from './pages/OrderHistory';
import AlbumProofGallery from './pages/AlbumProofGallery';
import ProfileSettings from './pages/ProfileSettings';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  const isIframe = window.self !== window.top;

  return (
    <ContentProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
          {!isIframe && <ScrollToTop />}
          <CustomCursor />
          <IntroScreen />
          <div className="app-container">
            <PushNotification />
            <Navbar />
            <CartDrawer />
            <main>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/b2b" element={<B2B />} />
                  <Route path="/b2c" element={<B2C />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/tools/ai-culling" element={<PhotoCulling />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/login" element={<PortalLogin />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/order" element={<OrderAlbum />} />
                  <Route path="/photographer" element={<PhotographerDashboard />} />
                  <Route path="/editor" element={<EditorDashboard />} />
                  <Route path="/proofing/:id" element={<ClientProofing />} />
                  <Route path="/albums" element={<AlbumsShowcase />} />
                  <Route path="/track" element={<OrderTracking />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/muhurtham" element={<MuhurthamCalendar />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route element={<ProtectedRoute allowedRoles={['b2c', 'admin']} />}>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/client" element={<ClientDashboard />}>
                      <Route path="orders" element={<OrderHistory />} />
                      <Route path="proofs" element={<AlbumProofGallery />} />
                      <Route path="settings" element={<ProfileSettings />} />
                    </Route>
                  </Route>
                </Routes>
              </PageTransition>
            </main>
            <Footer />
            {!isIframe && (
              <>
                <AudioEffectManager />
                <FloatingSocials />
                <MobileBookingBar />
                <LeadCaptureModal />
              </>
            )}
          </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ContentProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Package, Plus, Tag, Layers, Settings, Box } from 'lucide-react';
import { API } from '../apiConfig';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast from '../components/ui/Toast';
import CatalogHints from './pricing/CatalogHints';
import ServiceGrid from './pricing/ServiceGrid';
import SizeGrid from './pricing/SizeGrid';
import SheetGrid from './pricing/SheetGrid';
import PackageGrid from './pricing/PackageGrid';
import PricingItemModal from './pricing/PricingItemModal';

const PricingEngine = () => {
  const [activeTab, setActiveTab] = useState('services'); // services, sizes, sheets, packages
  const [loading, setLoading] = useState(true);

  // Data Stores
  const [services, setServices] = useState([]);
  const [sheets, setSheets] = useState([]);
  const [packages, setPackages] = useState([]);
  const [albumSizes, setAlbumSizes] = useState([]);
  /* Client catalog (servicesCatalog via public content API) — powers the estimator builder */
  const [contentCat, setContentCat] = useState({});

  // Modals & Forms
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [dialog, setDialog] = useState(null); // { id }
  const [toast, setToast] = useState(null);   // { msg, tone }
  const [deleting, setDeleting] = useState(false);

  // Forms states
  const initService = { category: 'Premium Album Printing & Design', name: '', telugu: '', basePrice: '', studioBasePrice: '', estimatedDaysToDeliver: 2, processDescription: '', popular: false, isActive: true };
  const initSize = { name: '', dimensions: '', orientation: 'landscape', basePrice: 7500, studioBasePrice: 5200, telugu: '', description: '', popular: false, isBundle: false, bundleDiscount: 0, isActive: true };
  const initSheet = { name: '', telugu: '', pricePerSheet: '', studioPricePerSheet: '', premiumCoverSurcharge: 0, studioCoverSurcharge: 0, multiplier: 1.0, description: '', popular: false, isActive: true };
  const initPackage = { tier: '', category: 'combo', priceType: 'fixed', price: '', priceMax: '', suffix: '', includedServiceIds: [], features: [], popular: false, isActive: true, b2bOrB2c: 'b2c', color: 'var(--brand)', apply: { intent: 'edit_print', sizeId: 'size-12x36', pages: 60, finishMode: 'mix', mix: {}, coverId: 'leatherette-box', engrave: false, parentBooks: 0, videos: {} } };

  const [formData, setFormData] = useState({});
  const [coverImageFile, setCoverImageFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [srvRes, shtRes, pkgRes, szRes, cntRes] = await Promise.all([
        fetch(`${API}/api/builder/services`),
        fetch(`${API}/api/builder/sheets`),
        fetch(`${API}/api/admin/packages`, { headers }),
        fetch(`${API}/api/builder/album-sizes`),
        fetch(`${API}/api/content`).catch(() => null)
      ]);
      setServices(await srvRes.json());
      setSheets(await shtRes.json());
      setPackages(await pkgRes.json());
      setAlbumSizes(await szRes.json());
      if (cntRes && cntRes.ok) {
        const doc = await cntRes.json();
        setContentCat(doc.global?.servicesCatalog || doc.servicesCatalog || {});
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pricing data', err);
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setCoverImageFile(null);
    if (item) {
      setFormData(item);
    } else {
      if (activeTab === 'services') setFormData(initService);
      if (activeTab === 'sizes') setFormData(initSize);
      if (activeTab === 'sheets') setFormData(initSheet);
      if (activeTab === 'packages') setFormData(initPackage);
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');
      let endpoint = '';
      if (activeTab === 'services') endpoint = `${API}/api/admin/builder/services`;
      if (activeTab === 'sizes') endpoint = `${API}/api/admin/builder/album-sizes`;
      if (activeTab === 'sheets') endpoint = `${API}/api/admin/builder/sheets`;
      if (activeTab === 'packages') endpoint = `${API}/api/admin/packages`;

      const method = editingItem ? 'PUT' : 'POST';
      const itemId = editingItem ? (editingItem._id || editingItem.id) : null;
      const url = editingItem ? `${endpoint}/${itemId}` : endpoint;

      let body, headers = { 'Authorization': `Bearer ${token}` };

      if (activeTab === 'packages') {
        const payload = { ...formData };
        if (!payload.includedServiceIds) payload.includedServiceIds = [];
        
        const fData = new FormData();
        Object.keys(payload).forEach(key => {
          if (key === 'features' || key === 'includedServiceIds' || key === 'apply') {
            fData.append(key, (payload[key] === undefined || payload[key] === null) ? 'null' : JSON.stringify(payload[key]));
          }
          else fData.append(key, payload[key]);
        });
        if (coverImageFile) fData.append('coverImage', coverImageFile);
        body = fData;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(formData);
      }

      await fetch(url, { method, headers, body });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Error saving', err);
    }
  };

  const handleDelete = (id) => setDialog({ id });

  const confirmDelete = async () => {
    if (!dialog) return;
    const { id } = dialog;
    setDeleting(true);
    try {
      const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');
      let endpoint = '';
      if (activeTab === 'services') endpoint = `${API}/api/admin/builder/services`;
      if (activeTab === 'sizes') endpoint = `${API}/api/admin/builder/album-sizes`;
      if (activeTab === 'sheets') endpoint = `${API}/api/admin/builder/sheets`;
      if (activeTab === 'packages') endpoint = `${API}/api/admin/packages`;

      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        setToast({ msg: 'Deleted', tone: 'success' });
        fetchData();
      } else {
        setToast({ msg: 'Failed to delete', tone: 'danger' });
      }
    } catch (err) {
      console.error('Error deleting', err);
      setToast({ msg: 'Network error — nothing deleted', tone: 'danger' });
    } finally {
      setDeleting(false);
      setDialog(null);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading Engine...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-(--n-950)">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="text-[var(--brand)]" /> Dynamic Pricing Engine
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Manage your A La Carte services, Album sizes & bubbles, Print Lab sheets, and pre-built bundles.</p>
        </div>
        <button onClick={() => openModal()} className="w-full sm:w-auto px-5 py-2.5 bg-[var(--brand)] hover:bg-[#b8952b] text-black font-bold rounded-lg flex items-center justify-center gap-2 transition shadow-lg text-sm shrink-0">
          <Plus size={18} /> Add {activeTab === 'services' ? 'Service' : activeTab === 'sizes' ? 'Album Size' : activeTab === 'sheets' ? 'Sheet Type' : 'Bundle'}
        </button>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'services', label: 'A La Carte Services', icon: Layers },
          { id: 'sizes', label: 'Album Sizes & Bubbles', icon: Box },
          { id: 'sheets', label: 'Print Lab Sheet Types', icon: Tag },
          { id: 'packages', label: 'Pre-Bundled Packages', icon: Package }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 font-medium transition text-xs sm:text-sm whitespace-nowrap ${
              activeTab === tab.id ? 'bg-[var(--brand)] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <CatalogHints activeTab={activeTab} albumSizes={albumSizes} sheets={sheets} services={services} contentCat={contentCat} />

      <ServiceGrid services={services} contentCat={contentCat} openModal={openModal} handleDelete={handleDelete} />

      <SizeGrid albumSizes={albumSizes} contentCat={contentCat} openModal={openModal} handleDelete={handleDelete} />

      <SheetGrid sheets={sheets} contentCat={contentCat} openModal={openModal} handleDelete={handleDelete} />

      <PackageGrid packages={packages} openModal={openModal} handleDelete={handleDelete} />

      {/* Dynamic Modal */}
      {showModal && (
        <PricingItemModal
          activeTab={activeTab}
          editingItem={editingItem}
          formData={formData}
          setFormData={setFormData}
          services={services}
          contentCat={contentCat}
          coverImageFile={coverImageFile}
          setCoverImageFile={setCoverImageFile}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={!!dialog}
        tone="danger"
        title="Delete this item?"
        message="This permanently removes it from the pricing catalog. Existing orders and the CMS Studio catalog are unaffected; bundles referencing it may need review."
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDialog(null)}
      />

      <Toast message={toast?.msg} tone={toast?.tone} onDone={() => setToast(null)} />
    </div>
  );
};

export default PricingEngine;

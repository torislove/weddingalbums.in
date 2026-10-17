/**
 * PricingItemModal — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Add/Edit modal shell — dispatches to the per-tab form component.
 */
import { X, Save } from 'lucide-react';
import ServiceForm from './forms/ServiceForm';
import SizeForm from './forms/SizeForm';
import SheetForm from './forms/SheetForm';
import PackageForm from './forms/PackageForm';

export default function PricingItemModal({
  activeTab, editingItem, formData, setFormData,
  services, contentCat, coverImageFile, setCoverImageFile, onClose, onSave,
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl p-4 sm:p-8 relative my-6 sm:my-10 max-h-[92vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close dialog" title="Close" className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={24} /></button>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
          {editingItem ? 'Edit' : 'Add New'} {activeTab === 'services' ? 'Service' : activeTab === 'sizes' ? 'Album Size' : activeTab === 'sheets' ? 'Sheet Type' : 'Bundle'}
        </h2>

        <div className="space-y-4">
          {activeTab === 'services' && <ServiceForm formData={formData} setFormData={setFormData} />}
          {activeTab === 'sizes' && <SizeForm formData={formData} setFormData={setFormData} />}
          {activeTab === 'sheets' && <SheetForm formData={formData} setFormData={setFormData} />}
          {activeTab === 'packages' && (
            <PackageForm
              formData={formData}
              setFormData={setFormData}
              services={services}
              contentCat={contentCat}
              coverImageFile={coverImageFile}
              setCoverImageFile={setCoverImageFile}
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
          <button onClick={onClose} className="px-5 py-2 text-gray-400 hover:text-white transition">Cancel</button>
          <button onClick={onSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition"><Save size={18} /> Save</button>
        </div>
      </div>
    </div>
  );
}

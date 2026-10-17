import React, { useState, useEffect } from 'react';
import { API } from '../apiConfig';

const TaskQueue = () => {
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editors, setEditors] = useState([]);
  const [selectedEditors, setSelectedEditors] = useState({});
  const [loading, setLoading] = useState(true);

  const getHeaders = () => {
    const token = localStorage.getItem('sysadminToken') || localStorage.getItem('adminToken') || localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchTasks();
    fetchOrders();
    fetchEditors();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/api/admin/jobs`, { headers: getHeaders() });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/admin/orders`, { headers: getHeaders() });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const fetchEditors = async () => {
    try {
      const res = await fetch(`${API}/api/admin/users?role=editor`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEditors(data);
      }
    } catch (err) {
      console.error('Failed to fetch editors', err);
    }
  };

  const updateTaskStatus = async (id, newStatus, editorId = null) => {
    try {
      const body = { status: newStatus };
      if (editorId) body.assigned_editor_id = editorId;
      await fetch(`${API}/api/admin/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getHeaders() },
        body: JSON.stringify(body)
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 animate-slide-up h-full flex flex-col max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-serif text-white mb-2">Form Submissions Queue</h1>
        <p className="text-gray-400 text-sm md:text-base">Manage incoming B2B editing jobs and B2C retail orders.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        
        {/* Editor Tasks Column */}
        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
          <h2 className="text-2xl text-[var(--brand)] font-medium mb-6 border-b border-white/10 pb-4">B2B Job Requests (Photographers)</h2>
          <div className="space-y-6">
            {tasks.length === 0 && <p className="text-gray-500 italic">No pending B2B jobs.</p>}
            {tasks.slice().reverse().map(task => (
              <div key={task.id} className="bg-white/5 border border-white/10 p-6 rounded-xl relative hover:border-[var(--brand)]/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl text-white font-medium">{task.clientName} Wedding</h3>
                    <p className="text-sm text-[var(--brand)]">Submitted by: {task.studioName}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {task.status}
                  </span>
                </div>
                
                <div className="bg-black/40 p-4 rounded-lg mb-4 text-sm text-gray-300">
                  <p className="font-semibold text-white mb-2 border-b border-white/10 pb-2">Job Specifications:</p>
                  <p>{task.details}</p>
                  {task.raw_files_link && (
                    <div className="mt-2 text-[var(--brand)] break-all">Media Link: <a href={task.raw_files_link} target="_blank" rel="noreferrer" className="underline">{task.raw_files_link}</a></div>
                  )}
                </div>

                <div className="bg-black/20 p-4 rounded-lg border border-white/5 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Assign Editor</p>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--brand)]"
                      value={selectedEditors[task.id] || task.assigned_editor_id || ''}
                      onChange={(e) => setSelectedEditors(prev => ({ ...prev, [task.id]: e.target.value }))}
                    >
                      <option value="">Unassigned</option>
                      {editors.length > 0 ? (
                        editors.map(ed => (
                          <option key={ed.id || ed._id} value={ed.id || ed._id}>
                            {ed.name || ed.email} ({ed.role || 'Editor'})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="editor-001">Suresh (In-House)</option>
                          <option value="editor-002">Rahul (Freelancer)</option>
                          <option value="editor-003">Divya (Video Dept)</option>
                        </>
                      )}
                    </select>
                    <button 
                      className="bg-[var(--brand)]/20 hover:bg-[var(--brand)]/40 text-[var(--brand)] px-4 py-2 rounded-lg text-sm font-medium transition border border-[var(--brand)]/50" 
                      onClick={() => updateTaskStatus(task.id, 'Assigned', selectedEditors[task.id])}
                    >
                      Dispatch
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium transition" onClick={() => updateTaskStatus(task.id, 'Designing')}>
                    Mark Designing
                  </button>
                  <button className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg text-sm font-medium transition border border-emerald-500/30" onClick={() => updateTaskStatus(task.id, 'Completed')}>
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B2C Orders Column */}
        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
          <h2 className="text-2xl text-[var(--brand)] font-medium mb-6 border-b border-white/10 pb-4">B2C Retail Orders (Couples)</h2>
          <div className="space-y-6">
            {orders.length === 0 && <p className="text-gray-500 italic">No retail orders yet.</p>}
            {orders.slice().reverse().map(order => (
              <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-xl relative hover:border-[var(--brand)]/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl text-white font-medium">{order.name}</h3>
                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    ₹{order.total?.toLocaleString() || '0'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300 bg-black/40 p-4 rounded-lg mb-4">
                  <div>
                    <p className="text-gray-500 mb-1">Contact</p>
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Album Specs</p>
                    <p>{order.size?.label || order.size || 'N/A'} Size</p>
                    <p className="capitalize">{order.coverType?.label || order.coverType || 'N/A'} Cover</p>
                    <p className="capitalize">{order.sheetType?.label || order.paperType || 'N/A'} Paper</p>
                  </div>
                  <div className="col-span-2 border-t border-white/10 pt-2 mt-2">
                    <p className="text-gray-500 mb-1">Shipping Address</p>
                    <p className="whitespace-pre-wrap">{order.address}</p>
                  </div>
                  {order.instructions && (
                    <div className="col-span-2 border-t border-white/10 pt-2 mt-2">
                      <p className="text-gray-500 mb-1">Special Instructions</p>
                      <p className="italic text-[var(--brand)]">"{order.instructions}"</p>
                    </div>
                  )}
                  {order.cloudLink && (
                    <div className="col-span-2 border-t border-white/10 pt-2 mt-2">
                      <p className="text-gray-500 mb-1">Cloud Link Provided</p>
                      <a href={order.cloudLink} target="_blank" rel="noreferrer" className="text-[var(--brand)] underline break-all">{order.cloudLink}</a>
                    </div>
                  )}
                  {order.uploadPreference === 'physical' && (
                    <div className="col-span-2 border-t border-white/10 pt-2 mt-2">
                      <p className="text-gray-500 mb-1">Media Preference</p>
                      <p className="text-[var(--brand)] font-bold">Waiting for Physical Hard Drive</p>
                    </div>
                  )}
                </div>

                <div className="bg-black/20 p-4 rounded-lg border border-white/5 mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Assign Editor</p>
                  <div className="flex gap-2">
                    <select 
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--brand)]"
                      value={selectedEditors[order.id || order._id] || order.assigned_editor_id || ''}
                      onChange={(e) => setSelectedEditors(prev => ({ ...prev, [order.id || order._id]: e.target.value }))}
                    >
                      <option value="">Unassigned</option>
                      {editors.length > 0 ? (
                        editors.map(ed => (
                          <option key={ed.id || ed._id} value={ed.id || ed._id}>
                            {ed.name || ed.email} ({ed.role || 'Editor'})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="editor-001">Suresh (In-House)</option>
                          <option value="editor-002">Rahul (Freelancer)</option>
                        </>
                      )}
                    </select>
                    <button 
                      className="bg-[var(--brand)]/20 hover:bg-[var(--brand)]/40 text-[var(--brand)] px-4 py-2 rounded-lg text-sm font-medium transition border border-[var(--brand)]/50"
                      onClick={() => updateTaskStatus(order.id || order._id, 'Assigned', selectedEditors[order.id || order._id])}
                    >
                      Dispatch
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">📸 {order.photos?.length || (order.items?.length || 0)} items/photos</p>
                  <button 
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-6 py-2 rounded-lg text-sm font-medium transition border border-emerald-500/30"
                    onClick={async () => {
                      try {
                        await fetch(`${API}/api/admin/orders/${order.id || order._id}/transition`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', ...getHeaders() },
                          body: JSON.stringify({ newStatus: 'IN_PRODUCTION' })
                        });
                        fetchOrders();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    Process Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskQueue;

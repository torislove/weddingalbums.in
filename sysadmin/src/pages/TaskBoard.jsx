import React, { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const TaskQueue = () => {
  const [tasks, setTasks] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchOrders();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await fetch(`${API}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  return (
    <div className="p-10 animate-slide-up h-full flex flex-col max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-white mb-2">Form Submissions Queue</h1>
        <p className="text-gray-400">Manage incoming B2B editing jobs and B2C retail orders.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        
        {/* Editor Tasks Column */}
        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
          <h2 className="text-2xl text-[#D4AF37] font-medium mb-6 border-b border-white/10 pb-4">B2B Job Requests (Photographers)</h2>
          <div className="space-y-6">
            {tasks.length === 0 && <p className="text-gray-500 italic">No pending B2B jobs.</p>}
            {tasks.slice().reverse().map(task => (
              <div key={task.id} className="bg-white/5 border border-white/10 p-6 rounded-xl relative hover:border-[#D4AF37]/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl text-white font-medium">{task.clientName} Wedding</h3>
                    <p className="text-sm text-[#D4AF37]">Submitted by: {task.studioName}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${task.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {task.status}
                  </span>
                </div>
                
                <div className="bg-black/40 p-4 rounded-lg mb-4 text-sm text-gray-300">
                  <p className="font-semibold text-white mb-2 border-b border-white/10 pb-2">Job Specifications:</p>
                  <p>{task.details}</p>
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
          <h2 className="text-2xl text-[#D4AF37] font-medium mb-6 border-b border-white/10 pb-4">B2C Retail Orders (Couples)</h2>
          <div className="space-y-6">
            {orders.length === 0 && <p className="text-gray-500 italic">No retail orders yet.</p>}
            {orders.slice().reverse().map(order => (
              <div key={order.id} className="bg-white/5 border border-white/10 p-6 rounded-xl relative hover:border-[#D4AF37]/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl text-white font-medium">{order.name}</h3>
                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                    ₹{order.total?.toLocaleString() || '0'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 bg-black/40 p-4 rounded-lg mb-4">
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
                      <p className="italic text-[#D4AF37]">"{order.instructions}"</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">📸 {order.photos?.length || 0} photos uploaded</p>
                  <button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-6 py-2 rounded-lg text-sm font-medium transition border border-emerald-500/30">
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

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Search } from 'lucide-react';

const CustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mock fetch for customers
    const mockCustomers = [
      { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', type: 'B2C', joined: 'Oct 1, 2026', orders: 1 },
      { id: 2, name: 'Dream Studios', email: 'hello@dreamstudios.in', phone: '9123456780', type: 'B2B', joined: 'Sep 15, 2026', orders: 14 },
      { id: 3, name: 'Priya Reddy', email: 'priya.reddy@gmail.com', phone: '9988776655', type: 'B2C', joined: 'Oct 5, 2026', orders: 1 },
    ];
    setCustomers(mockCustomers);
    setLoading(false);
  }, []);

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-10 animate-slide-up max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Customer Directory</h1>
          <p className="text-gray-400">Manage B2B studios and B2C direct clients.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      <div className="glass-panel border border-white/10 rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-gray-400 font-medium">Customer Name</th>
                <th className="p-4 text-gray-400 font-medium">Contact Details</th>
                <th className="p-4 text-gray-400 font-medium">Type</th>
                <th className="p-4 text-gray-400 font-medium">Orders</th>
                <th className="p-4 text-gray-400 font-medium">Joined Date</th>
                <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(customer => (
                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-300 flex items-center gap-2"><Mail size={14}/> {customer.email}</span>
                      <span className="text-sm text-gray-400 flex items-center gap-2"><Phone size={14}/> {customer.phone}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${customer.type === 'B2B' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                      {customer.type}
                    </span>
                  </td>
                  <td className="p-4 text-white">{customer.orders}</td>
                  <td className="p-4 text-gray-400 text-sm">{customer.joined}</td>
                  <td className="p-4 text-right">
                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg border border-white/10 transition-colors">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManager;

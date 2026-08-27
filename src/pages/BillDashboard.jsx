import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Zap, Wheat, Search, Filter } from 'lucide-react';
import { getUtilityBills, getHarvestBills } from '../services/billApiService';
import BillCard from '../components/BillCard';

const BillDashboard = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all'); // all, utility, harvest
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBills = async () => {
        setLoading(true);
        try {
            const [utilityData, harvestData] = await Promise.all([
                getUtilityBills().catch(() => []),
                getHarvestBills().catch(() => [])
            ]);
            
            // Format bills and combine
            const combinedBills = [
                ...(Array.isArray(utilityData) ? utilityData : []).map(b => ({ ...b, type: 'utility' })),
                ...(Array.isArray(harvestData) ? harvestData : []).map(b => ({ ...b, type: 'harvest' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setBills(combinedBills);
        } catch (error) {
            console.error('Failed to fetch bills:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const filteredBills = bills.filter(bill => {
        const matchesType = filterType === 'all' || bill.type === filterType;
        const matchesSearch = (bill.invoice_number || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#1F3B21] tracking-tight mb-2">
                        Bill Generator
                    </h1>
                    <p className="text-gray-600 text-sm max-w-2xl">
                        Manage, create, and download utility and harvest invoices.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/bills/utility/new')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#C49E40] text-[#C49E40] hover:bg-amber-50 font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all"
                    >
                        <Zap size={15} /> Utility Bill
                    </button>
                    <button
                        onClick={() => navigate('/bills/harvest/new')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#C49E40] hover:bg-[#b38f3a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                    >
                        <Wheat size={15} /> Harvest Bill
                    </button>
                </div>
            </div>

            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-gray-200/80 shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by Invoice Number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium text-gray-900 focus:outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'utility', 'harvest'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                                    filterType === type 
                                    ? 'bg-[#213E20] text-white border-[#213E20] shadow-sm' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <RefreshCw className="animate-spin text-[#C49E40]" size={32} />
                </div>
            ) : filteredBills.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-16 flex flex-col items-center justify-center border border-gray-200 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Bills Found</h3>
                    <p className="text-gray-500 text-sm">Get started by creating a new utility or harvest bill.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBills.map((bill, index) => (
                        <BillCard key={`${bill.id || bill._id || index}`} bill={bill} />
                    ))}
                </div>
            )}
        </main>
    );
};

export default BillDashboard;

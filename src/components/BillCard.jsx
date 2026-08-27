import React from 'react';
import { Download, Calendar, FileText, Zap, Wheat, IndianRupee } from 'lucide-react';
import { downloadBillPdf } from '../services/billApiService';
import toast from 'react-hot-toast';

const BillCard = ({ bill }) => {
    // Utility bills usually have electricity_amount, harvest bills have net_payable
    const isUtility = bill.type === 'utility' || bill.electricity_amount !== undefined;
    
    const handleDownload = async () => {
        try {
            await downloadBillPdf(isUtility ? 'utility' : 'harvest', bill.id || bill._id, bill.invoice_number);
            toast.success('PDF downloaded successfully');
        } catch (error) {
            toast.error('Failed to download PDF');
        }
    };

    const totalAmount = isUtility ? bill.total : bill.net_payable;
    
    return (
        <div className="bg-white rounded-2xl border border-gray-200/80 hover:border-[#C49E40]/50 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden group">
            {/* Top Badge and Date */}
            <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${isUtility ? 'bg-blue-50 text-blue-800 border-blue-200/60' : 'bg-emerald-50 text-emerald-800 border-emerald-200/60'}`}>
                            {isUtility ? 'Utility Bill' : 'Harvest Bill'}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            {bill.status || 'Generated'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                        <Calendar size={12} />
                        <span>{new Date(bill.created_at || new Date()).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Invoice Number */}
                <h3 className="text-xl font-serif font-black text-gray-900 group-hover:text-[#C49E40] transition-colors mb-1">
                    {bill.invoice_number || 'INV-XXXX'}
                </h3>

                {/* Icon & Subtitle */}
                <div className="space-y-1 mb-6 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                        {isUtility ? <Zap size={14} className="text-blue-500" /> : <Wheat size={14} className="text-emerald-500" />}
                        <span>{isUtility ? `Billing Month: ${bill.billing_month || ''} ${bill.billing_year || ''}` : `Crop: ${bill.crop_name || 'N/A'}`}</span>
                    </div>
                </div>
            </div>

            {/* Price & Action Section */}
            <div className="bg-gray-50/90 rounded-xl p-4 border border-gray-100 flex items-end justify-between">
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Total Amount</span>
                    <span className="text-2xl font-black text-[#1F3B21] flex items-center">
                        <IndianRupee size={20} className="mr-0.5" />
                        {Number(totalAmount || 0).toLocaleString('en-IN')}
                    </span>
                </div>
                
                <button
                    onClick={handleDownload}
                    className="p-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 transition-all shadow-sm group-hover:shadow"
                    title="Download PDF"
                >
                    <Download size={18} />
                </button>
            </div>
        </div>
    );
};

export default BillCard;

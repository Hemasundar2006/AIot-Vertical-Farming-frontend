import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { createHarvestBill, downloadBillPdf } from '../services/billApiService';
import BillPreviewPanel from '../components/BillPreviewPanel';
import { BILLING_CONSTANTS } from '../config/billingConstants';

const HarvestBillForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        unit: 'Unit 1',
        crop_name: '',
        harvest_quantity: BILLING_CONSTANTS.DEFAULT_HARVEST_QUANTITY_KG,
        market_rate: 0,
        packaging_fee: 0,
        logistics_fee: 0,
        commission_percent: BILLING_CONSTANTS.DEFAULT_COMMISSION_PERCENT,
        harvest_date: new Date().toISOString().split('T')[0],
        quality_grade: 'A'
    });

    // Calculated Preview State
    const [preview, setPreview] = useState({
        gross_amount: 0,
        commission_amount: 0,
        total_deductions: 0,
        net_payable: 0
    });

    useEffect(() => {
        const qty = Number(formData.harvest_quantity);
        const rate = Number(formData.market_rate);
        const gross = qty * rate;
        
        const commAmt = gross * (Number(formData.commission_percent) / 100);
        const pack = Number(formData.packaging_fee);
        const log = Number(formData.logistics_fee);
        const deductions = commAmt + pack + log;
        
        setPreview({
            gross_amount: gross,
            commission_amount: commAmt,
            total_deductions: deductions,
            net_payable: gross - deductions
        });
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.crop_name) {
            toast.error("Please enter a crop name");
            return;
        }
        setLoading(true);
        try {
            const billData = { ...formData, ...preview };
            const response = await createHarvestBill(billData);
            
            toast.success(
                (t) => (
                    <div className="flex flex-col gap-2">
                        <span>Harvest bill created successfully!</span>
                        <button 
                            onClick={() => {
                                downloadBillPdf('harvest', response.id || response._id, response.invoice_number);
                                toast.dismiss(t.id);
                            }}
                            className="bg-[#213E20] text-white px-3 py-1.5 rounded text-xs font-bold w-full"
                        >
                            Download PDF
                        </button>
                    </div>
                ),
                { duration: 5000 }
            );
            
            navigate('/bills');
        } catch (error) {
            toast.error(error.message || 'Failed to create harvest bill');
        } finally {
            setLoading(false);
        }
    };

    // Prepare preview props
    const previewItems = [
        { label: 'Gross Value', subtext: `${formData.harvest_quantity} kg @ ${BILLING_CONSTANTS.CURRENCY_SYMBOL}${formData.market_rate}/kg`, value: preview.gross_amount },
        { label: 'Packaging Fee', value: Number(formData.packaging_fee) },
        { label: 'Logistics Fee', value: Number(formData.logistics_fee) },
        { label: `Commission (${formData.commission_percent}%)`, value: preview.commission_amount }
    ];

    const previewTotals = [
        { label: 'Total Deductions', value: preview.total_deductions },
        { label: 'Net Payable', value: preview.net_payable, isMain: true }
    ];

    return (
        <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/bills')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-3xl font-serif font-black text-[#1F3B21] tracking-tight">Create Harvest Bill</h1>
                    <p className="text-gray-600 text-sm">Generate a new harvest invoice and calculate net payable.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-gray-200/80 shadow-md">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Farm Unit</label>
                                    <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none">
                                        <option value="Unit 1">Unit 1</option>
                                        <option value="Unit 2">Unit 2</option>
                                        <option value="Unit 3">Unit 3</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Crop Name</label>
                                    <input type="text" placeholder="e.g. Tomato, Spinach" name="crop_name" value={formData.crop_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Harvest Quantity (kg)</label>
                                    <input type="number" min="0" step="0.1" name="harvest_quantity" value={formData.harvest_quantity} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Market Rate ({BILLING_CONSTANTS.CURRENCY_SYMBOL}/kg)</label>
                                    <input type="number" min="0" step="0.1" name="market_rate" value={formData.market_rate} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Harvest Date</label>
                                    <input type="date" name="harvest_date" value={formData.harvest_date} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Quality Grade</label>
                                    <select name="quality_grade" value={formData.quality_grade} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none">
                                        <option value="A">Grade A (Premium)</option>
                                        <option value="B">Grade B (Standard)</option>
                                        <option value="C">Grade C (Processing)</option>
                                    </select>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Packaging Fee ({BILLING_CONSTANTS.CURRENCY_SYMBOL})</label>
                                    <input type="number" min="0" step="0.1" name="packaging_fee" value={formData.packaging_fee} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Logistics Fee ({BILLING_CONSTANTS.CURRENCY_SYMBOL})</label>
                                    <input type="number" min="0" step="0.1" name="logistics_fee" value={formData.logistics_fee} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Commission (%)</label>
                                    <input type="number" min="0" step="0.1" name="commission_percent" value={formData.commission_percent} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-[#213E20] hover:bg-[#152914] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-70">
                                    <Save size={16} /> {loading ? 'Saving...' : 'Generate Bill'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-28">
                        <BillPreviewPanel 
                            title={`Harvest Bill - ${formData.crop_name || 'Crop'}`}
                            items={previewItems}
                            totals={previewTotals}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HarvestBillForm;

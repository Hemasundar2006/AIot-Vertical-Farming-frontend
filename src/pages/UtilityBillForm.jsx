import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { createBill, downloadBillPdf } from '../services/billApiService';
import BillPreviewPanel from '../components/BillPreviewPanel';
import { BILLING_CONSTANTS } from '../config/billingConstants';

const UtilityBillForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        unit: 'Unit 1',
        billing_month: new Date().toLocaleString('default', { month: 'long' }),
        billing_year: new Date().getFullYear(),
        electricity_units: 0,
        electricity_rate: BILLING_CONSTANTS.DEFAULT_ELECTRICITY_RATE_PER_UNIT,
        motor_hours: 0,
        motor_rate: BILLING_CONSTANTS.DEFAULT_MOTOR_RATE_PER_HOUR,
        maintenance_fee: BILLING_CONSTANTS.DEFAULT_MAINTENANCE_FEE,
        tax_percent: BILLING_CONSTANTS.DEFAULT_TAX_PERCENT,
        due_date: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0]
    });

    // Calculated Preview State
    const [preview, setPreview] = useState({
        electricity_amount: 0,
        motor_amount: 0,
        subtotal: 0,
        tax: 0,
        total: 0
    });

    useEffect(() => {
        const electAmt = Number(formData.electricity_units) * Number(formData.electricity_rate);
        const motorAmt = Number(formData.motor_hours) * Number(formData.motor_rate);
        const maint = Number(formData.maintenance_fee);
        const sub = electAmt + motorAmt + maint;
        const taxAmt = sub * (Number(formData.tax_percent) / 100);
        
        setPreview({
            electricity_amount: electAmt,
            motor_amount: motorAmt,
            subtotal: sub,
            tax: taxAmt,
            total: sub + taxAmt
        });
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const billData = { ...formData, ...preview, type: 'utility' };
            const response = await createBill(billData);
            
            toast.success(
                (t) => (
                    <div className="flex flex-col gap-2">
                        <span>Bill created successfully!</span>
                        <button 
                            onClick={() => {
                                downloadBillPdf(response.id || response._id, response.invoice_number);
                                toast.dismiss(t.id);
                            }}
                            className="bg-[#213E20] text-white px-3 py-1.5 rounded text-sm md:text-xs font-bold w-full"
                        >
                            Download PDF
                        </button>
                    </div>
                ),
                { duration: 5000 }
            );
            
            navigate('/bills');
        } catch (error) {
            toast.error(error.message || 'Failed to create utility bill');
        } finally {
            setLoading(false);
        }
    };

    // Prepare preview props
    const previewItems = [
        { label: 'Electricity Charges', subtext: `${formData.electricity_units} units @ ${BILLING_CONSTANTS.CURRENCY_SYMBOL}${formData.electricity_rate}/unit`, value: preview.electricity_amount },
        { label: 'Motor Usage', subtext: `${formData.motor_hours} hrs @ ${BILLING_CONSTANTS.CURRENCY_SYMBOL}${formData.motor_rate}/hr`, value: preview.motor_amount },
        { label: 'Maintenance Fee', value: Number(formData.maintenance_fee) }
    ];

    const previewTotals = [
        { label: 'Subtotal', value: preview.subtotal },
        { label: `Tax (${formData.tax_percent}%)`, value: preview.tax },
        { label: 'Total Payable', value: preview.total, isMain: true }
    ];

    return (
        <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/bills')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-3xl font-serif font-black text-[#1F3B21] tracking-tight">Create Utility Bill</h1>
                    <p className="text-gray-600 text-sm">Generate a new utility invoice for a farm unit.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-gray-200/80 shadow-md">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Farm Unit</label>
                                    <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none">
                                        <option value="Unit 1">Unit 1</option>
                                        <option value="Unit 2">Unit 2</option>
                                        <option value="Unit 3">Unit 3</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Month</label>
                                        <input type="text" name="billing_month" value={formData.billing_month} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Year</label>
                                        <input type="number" name="billing_year" value={formData.billing_year} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Electricity Units (kWh)</label>
                                    <input type="number" min="0" step="0.1" name="electricity_units" value={formData.electricity_units} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Electricity Rate ({BILLING_CONSTANTS.CURRENCY_SYMBOL})</label>
                                    <input type="number" min="0" step="0.1" name="electricity_rate" value={formData.electricity_rate} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Motor Hours</label>
                                    <input type="number" min="0" step="0.1" name="motor_hours" value={formData.motor_hours} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Motor Rate ({BILLING_CONSTANTS.CURRENCY_SYMBOL}/hr)</label>
                                    <input type="number" min="0" step="0.1" name="motor_rate" value={formData.motor_rate} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Maintenance Fee</label>
                                    <input type="number" min="0" step="0.1" name="maintenance_fee" value={formData.maintenance_fee} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Tax (%)</label>
                                    <input type="number" min="0" step="0.1" name="tax_percent" value={formData.tax_percent} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Due Date</label>
                                    <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-[#C49E40] rounded-xl text-sm font-medium focus:outline-none" required />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-[#213E20] hover:bg-[#152914] text-white font-bold text-sm md:text-xs uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-70">
                                    <Save size={16} /> {loading ? 'Saving...' : 'Generate Bill'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-28">
                        <BillPreviewPanel 
                            title={`Utility Bill - ${formData.billing_month} ${formData.billing_year}`}
                            items={previewItems}
                            totals={previewTotals}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default UtilityBillForm;

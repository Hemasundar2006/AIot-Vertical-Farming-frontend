import React from 'react';
import { IndianRupee } from 'lucide-react';

const BillPreviewPanel = ({ title, items, totals }) => {
    return (
        <div className="bg-[#FAF8F5] rounded-2xl border border-gray-200 p-6 flex flex-col h-full shadow-inner relative overflow-hidden">
            {/* Receipt ZigZag Top */}
            <div className="absolute top-0 left-0 right-0 flex space-x-2 -mt-2">
                 {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-white transform rotate-45 flex-shrink-0" />
                 ))}
            </div>

            <div className="text-center mb-6 pt-4 border-b border-gray-200 border-dashed pb-4 relative z-10">
                <h3 className="text-lg font-serif font-black text-gray-900 tracking-wider uppercase">Live Preview</h3>
                <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">{title}</p>
            </div>

            <div className="flex-1 space-y-4 text-sm font-medium relative z-10">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                        <div className="text-gray-600">
                            <span className="block">{item.label}</span>
                            {item.subtext && <span className="text-[10px] text-gray-400 font-bold block">{item.subtext}</span>}
                        </div>
                        <span className="text-gray-900 font-bold flex items-center">
                            <IndianRupee size={12} className="mr-0.5" />
                            {Number(item.value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 border-dashed space-y-3 relative z-10">
                {totals.map((total, index) => (
                    <div key={index} className={`flex justify-between items-center ${total.isMain ? 'text-lg font-black text-[#1F3B21]' : 'text-sm font-bold text-gray-600'}`}>
                        <span>{total.label}</span>
                        <span className="flex items-center">
                            <IndianRupee size={total.isMain ? 16 : 12} className="mr-0.5" />
                            {Number(total.value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
            
            {/* Receipt ZigZag Bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex space-x-2 -mb-2">
                 {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-white transform rotate-45 flex-shrink-0" />
                 ))}
            </div>
        </div>
    );
};

export default BillPreviewPanel;

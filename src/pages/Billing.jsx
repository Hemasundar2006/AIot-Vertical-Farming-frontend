import React from 'react';

const Billing = () => {
  return (
    <div className="pt-24 px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-amber-900/10">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">Customer Service Billing</h1>
        <p className="text-amber-800 mb-6">
          View and download monthly generated bills for customer services.
        </p>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-amber-900/20">
                        <th className="py-4 px-4 text-amber-900">Month</th>
                        <th className="py-4 px-4 text-amber-900">Service Plan</th>
                        <th className="py-4 px-4 text-amber-900">Amount</th>
                        <th className="py-4 px-4 text-amber-900">Status</th>
                        <th className="py-4 px-4 text-amber-900">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-amber-900/10 hover:bg-amber-50/50 transition-colors">
                        <td className="py-4 px-4 text-amber-800">August 2026</td>
                        <td className="py-4 px-4 text-amber-800">Premium API Access</td>
                        <td className="py-4 px-4 font-semibold text-amber-900">$49.99</td>
                        <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Paid</span>
                        </td>
                        <td className="py-4 px-4">
                            <button className="text-amber-600 hover:text-amber-900 underline text-sm">Download Invoice</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;

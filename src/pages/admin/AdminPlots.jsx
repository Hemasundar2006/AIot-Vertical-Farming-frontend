import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sprout, DollarSign, ArrowRight, Download, Plus } from 'lucide-react';
import { downloadSettlementPDF } from '../../services/pdfService';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminPlots = () => {
  const [plots, setPlots] = useState([]);
  const [users, setUsers] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [plotsPage, setPlotsPage] = useState(1);
  const [settlementsPage, setSettlementsPage] = useState(1);
  const itemsPerPage = 10;
  
  const [showPlotModal, setShowPlotModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);

  const [plotForm, setPlotForm] = useState({ userId: '', zoneId: '', plotNumber: '', area: '', cropType: '', sowingDate: '' });
  const [settlementForm, setSettlementForm] = useState({ yieldKg: '', marketRate: '', monthlyServiceFee: '' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('farm_token');
      const [plotsRes, usersRes, settlementsRes] = await Promise.allSettled([
        axios.get(`${API_URL}/admin/plots`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/settlements`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (plotsRes.status === 'fulfilled') setPlots(plotsRes.value.data.data || []);
      else toast.error('Failed to load plots');
      
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data.data || []);
      else toast.error('Failed to load users');
      
      if (settlementsRes.status === 'fulfilled') setSettlements(settlementsRes.value.data.data || []);
      
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreatePlot = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('farm_token');
      await axios.post(`${API_URL}/admin/plots`, { ...plotForm, user: plotForm.userId }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Plot created successfully');
      setShowPlotModal(false);
      setPlotForm({ userId: '', zoneId: '', plotNumber: '', area: '', cropType: '', sowingDate: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create plot');
    }
  };

  const handleAdvanceStatus = async (plot) => {
    let nextStatus = 'Growing';
    if (plot.status === 'Growing') nextStatus = 'Harvested';
    if (plot.status === 'Harvested') return; // Cannot advance further

    try {
      const token = localStorage.getItem('farm_token');
      await axios.put(`${API_URL}/admin/plots/${plot._id}`, { status: nextStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Plot status advanced to ${nextStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleTriggerSettlement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('farm_token');
      const payload = {
        plotId: selectedPlot._id,
        userId: selectedPlot.user._id,
        yieldKg: Number(settlementForm.yieldKg),
        marketRate: Number(settlementForm.marketRate),
        monthlyServiceFee: Number(settlementForm.monthlyServiceFee)
      };
      
      const res = await axios.post(`${API_URL}/admin/settlements`, payload, { headers: { Authorization: `Bearer ${token}` } });
      
      // Auto-generate and upload PDF for convenience if needed, but for now we just create the backend record
      // The user can download it on their portal. 
      // For Admin, we can also provide a download button in the settlements list.
      
      toast.success('Settlement processed successfully');
      setShowSettlementModal(false);
      setSettlementForm({ yieldKg: '', marketRate: '', monthlyServiceFee: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to process settlement');
    }
  };

  const handleDownloadPDF = (settlement) => {
    const data = {
      statementId: settlement.statementId || settlement._id || settlement.id,
      clientName: settlement.user?.name || 'Unknown',
      plotNumber: settlement.plot?.plotNumber || 'Unknown',
      cropName: settlement.plot?.cropType || 'Unknown',
      statementDate: settlement.statementDate,
      harvestDate: settlement.plot?.harvestDate || settlement.createdAt,
      yieldKg: settlement.yieldKg || (settlement.grossRevenue ? (settlement.grossRevenue / 250).toFixed(1) : '--'),
      marketRate: settlement.marketRate || (settlement.grossRevenue ? 250 : '--'),
      grossRevenue: settlement.grossRevenue,
      monthlyServiceFee: settlement.monthlyServiceFee,
      status: settlement.status
    };
    
    downloadSettlementPDF(data);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Active Plots */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-900">Managed Plots</h3>
          <button onClick={() => setShowPlotModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#213E20] text-white rounded-xl hover:bg-[#1a3119] transition-colors text-sm font-bold">
            <Plus size={16} /> Add New Plot
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full shadow-sm">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Plot Info</th>
                <th className="px-6 py-4">Landowner</th>
                <th className="px-6 py-4">Crop & Timeline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plots.slice((plotsPage - 1) * itemsPerPage, plotsPage * itemsPerPage).map(plot => (
                <tr key={plot._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {plot.plotNumber} <br/><span className="text-sm md:text-xs font-normal text-gray-500">{plot.area} Acres {plot.zoneId ? `| ESP Zone ${plot.zoneId}` : ''}</span>
                  </td>
                  <td className="px-6 py-4">{plot.user?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#C49E40]">{plot.cropType}</span><br/>
                    <span className="text-sm md:text-xs">Sown: {new Date(plot.sowingDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm md:text-xs font-bold ${
                      plot.status === 'Sowing' ? 'bg-blue-100 text-blue-700' :
                      plot.status === 'Growing' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {plot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2 flex-wrap">
                    {plot.status !== 'Harvested' ? (
                      <button onClick={() => handleAdvanceStatus(plot)} className="flex items-center gap-1 text-sm md:text-xs px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded font-bold transition-colors">
                        Advance <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button onClick={() => { setSelectedPlot(plot); setShowSettlementModal(true); }} className="flex items-center gap-1 text-sm md:text-xs px-3 py-1.5 bg-[#C49E40] text-white hover:bg-[#b38f3a] rounded font-bold transition-colors">
                        <DollarSign size={14} /> Settle Payout
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {plots.length === 0 && <tr><td colSpan="5" className="px-6 py-4 text-center">No active plots found.</td></tr>}
            </tbody>
          </table>
          <Pagination 
            currentPage={plotsPage} 
            totalPages={Math.ceil(plots.length / itemsPerPage)} 
            onPageChange={setPlotsPage} 
          />
        </div>
      </div>

      {/* Settlements History */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-4">Settlements History</h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full shadow-sm">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Statement ID</th>
                <th className="px-6 py-4">Landowner / Plot</th>
                <th className="px-6 py-4">Gross Rev</th>
                <th className="px-6 py-4">Net Payout (80%)</th>
                <th className="px-6 py-4">PDF</th>
              </tr>
            </thead>
            <tbody>
              {settlements.slice((settlementsPage - 1) * itemsPerPage, settlementsPage * itemsPerPage).map(set => (
                <tr key={set._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{set.statementId && !set.statementId.includes('$') ? set.statementId : (set._id ? `STM-${set._id.slice(-6).toUpperCase()}` : 'N/A')}</td>
                  <td className="px-6 py-4">
                    {set.user?.name} <br/>
                    <span className="text-sm md:text-xs">{set.plot?.plotNumber}</span>
                  </td>
                  <td className="px-6 py-4">₹{set.grossRevenue.toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-green-700">₹{set.netPayout.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDownloadPDF(set)} className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm md:text-xs font-bold">
                      <Download size={16} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
              {settlements.length === 0 && <tr><td colSpan="5" className="px-6 py-4 text-center">No settlements found.</td></tr>}
            </tbody>
          </table>
          <Pagination 
            currentPage={settlementsPage} 
            totalPages={Math.ceil(settlements.length / itemsPerPage)} 
            onPageChange={setSettlementsPage} 
          />
        </div>
      </div>

      {/* Modals */}
      {showPlotModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Add New Plot</h3>
            <form onSubmit={handleCreatePlot} className="space-y-4">
              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assign Landowner</label>
                <select required value={plotForm.userId} onChange={e => setPlotForm({...plotForm, userId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                  <option value="">-- Choose User --</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assign ESP32 Zone (Optional)</label>
                <select value={plotForm.zoneId} onChange={e => setPlotForm({...plotForm, zoneId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200">
                  <option value="">-- No Zone --</option>
                  <option value="1">Zone 1 (Black Soil)</option>
                  <option value="2">Zone 2 (Red Soil)</option>
                  <option value="3">Zone 3 (Sand)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Plot Number</label>
                  <input type="text" required placeholder="e.g. B-14" value={plotForm.plotNumber} onChange={e => setPlotForm({...plotForm, plotNumber: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Area (Acres)</label>
                  <input type="number" step="0.1" required placeholder="2.5" value={plotForm.area} onChange={e => setPlotForm({...plotForm, area: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Crop Type</label>
                <input type="text" required placeholder="e.g. Organic Tomatoes" value={plotForm.cropType} onChange={e => setPlotForm({...plotForm, cropType: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sowing Date</label>
                <input type="date" required value={plotForm.sowingDate} onChange={e => setPlotForm({...plotForm, sowingDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowPlotModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-[#213E20] text-white font-bold rounded-xl hover:bg-[#1a3119]">Create Plot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSettlementModal && selectedPlot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-1">Trigger Settlement</h3>
            <p className="text-sm text-gray-500 mb-4">Plot: {selectedPlot.plotNumber} | {selectedPlot.cropType}</p>
            <form onSubmit={handleTriggerSettlement} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Yield (kg)</label>
                  <input type="number" step="0.1" required placeholder="4200" value={settlementForm.yieldKg} onChange={e => setSettlementForm({...settlementForm, yieldKg: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Market Rate (₹)</label>
                  <input type="number" step="0.1" required placeholder="35" value={settlementForm.marketRate} onChange={e => setSettlementForm({...settlementForm, marketRate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
                </div>
              </div>
              <div>
                <label className="block text-sm md:text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly Service Fee (Total ₹ Deducted)</label>
                <input type="number" required placeholder="5000" value={settlementForm.monthlyServiceFee} onChange={e => setSettlementForm({...settlementForm, monthlyServiceFee: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200" />
              </div>
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl mt-4">
                <p className="text-sm md:text-xs text-amber-800 font-bold mb-1">Auto-Split Breakdown (Preview):</p>
                <p className="text-sm md:text-xs text-amber-700">10% Soil Reserve | 10% Platform Margin | 80% Client Payout</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowSettlementModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-[#C49E40] text-white font-bold rounded-xl hover:bg-[#b38f3a]">Process Settlement</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPlots;


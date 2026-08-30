import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sprout, DollarSign, ArrowRight, Download, Plus, Mail, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { downloadSettlementPDF } from '../../services/pdfService';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const AdminPlots = () => {
  const [plots, setPlots] = useState([]);
  const [users, setUsers] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingSettlement, setProcessingSettlement] = useState(false);
  
  const [plotsPage, setPlotsPage] = useState(1);
  const [settlementsPage, setSettlementsPage] = useState(1);
  const itemsPerPage = 10;
  
  const [showPlotModal, setShowPlotModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);

  const [plotForm, setPlotForm] = useState({ userId: '', zoneId: '', plotNumber: '', area: '', cropType: '', sowingDate: '' });
  const [settlementForm, setSettlementForm] = useState({ yieldKg: '', marketRate: '', monthlyServiceFee: '0' });

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
    if (plot.status === 'Harvested') return;

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
    if (!selectedPlot) return;

    setProcessingSettlement(true);
    try {
      const token = localStorage.getItem('farm_token');
      const payload = {
        plotId: selectedPlot._id,
        userId: selectedPlot.user?._id || selectedPlot.user,
        yieldKg: Number(settlementForm.yieldKg),
        marketRate: Number(settlementForm.marketRate),
        monthlyServiceFee: Number(settlementForm.monthlyServiceFee || 0)
      };
      
      const res = await axios.post(`${API_URL}/admin/settlements`, payload, { headers: { Authorization: `Bearer ${token}` } });
      
      const recipientEmail = selectedPlot.user?.email || 'the user';
      toast.success(
        `Settlement processed! PDF statement & breakdown dispatched to ${recipientEmail}`,
        { duration: 5000 }
      );
      
      setShowSettlementModal(false);
      setSettlementForm({ yieldKg: '', marketRate: '', monthlyServiceFee: '0' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process settlement');
    } finally {
      setProcessingSettlement(false);
    }
  };

  const handleDownloadPDF = (settlement) => {
    const data = {
      statementId: settlement.statementId || settlement._id || settlement.id,
      clientName: settlement.user?.name || 'Unknown',
      plotNumber: settlement.plot?.plotNumber || 'Unknown',
      cropName: settlement.plot?.cropType || 'Unknown',
      statementDate: settlement.statementDate || settlement.createdAt,
      harvestDate: settlement.plot?.harvestDate || settlement.createdAt,
      yieldKg: settlement.totalYieldKg || settlement.yieldKg || (settlement.grossRevenue ? (settlement.grossRevenue / (settlement.marketRate || 250)).toFixed(1) : '--'),
      marketRate: settlement.marketRate || (settlement.grossRevenue ? 250 : '--'),
      grossRevenue: settlement.grossRevenue,
      monthlyServiceFee: settlement.monthlyServiceFee || 0,
      status: settlement.status || 'Paid'
    };
    
    downloadSettlementPDF(data);
  };

  // Live calculation preview values
  const yieldVal = parseFloat(settlementForm.yieldKg) || 0;
  const rateVal = parseFloat(settlementForm.marketRate) || 0;
  const feeVal = parseFloat(settlementForm.monthlyServiceFee) || 0;
  const calcGross = yieldVal * rateVal;
  const calcAdjusted = Math.max(0, calcGross - feeVal);
  const calcSoil = calcAdjusted * 0.10;
  const calcPlatform = calcAdjusted * 0.10;
  const calcNetPayout = calcAdjusted * 0.80;

  if (loading) return <div className="text-center py-12 text-gray-500 font-medium">Loading Farm &amp; Settlement Data...</div>;

  return (
    <div className="space-y-8">
      {/* Active Plots */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Managed Plots</h3>
            <p className="text-xs text-gray-500">Track cycle progress, update plot stages, and settle harvest payouts.</p>
          </div>
          <button onClick={() => setShowPlotModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#213E20] text-white rounded-xl hover:bg-[#1a3119] transition-colors text-sm font-bold shadow-sm">
            <Plus size={16} /> Add New Plot
          </button>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full shadow-sm">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-sm md:text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Plot Info</th>
                <th className="px-6 py-4">Landowner &amp; Contact</th>
                <th className="px-6 py-4">Crop &amp; Timeline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plots.slice((plotsPage - 1) * itemsPerPage, plotsPage * itemsPerPage).map(plot => (
                <tr key={plot._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <span className="font-bold text-base">{plot.plotNumber}</span> <br/>
                    <span className="text-xs font-normal text-gray-500">{plot.area} Acres {plot.zoneId ? `• ESP Zone ${plot.zoneId}` : ''}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800">{plot.user?.name || 'Unknown'}</span> <br/>
                    <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                      <Mail size={12} className="text-gray-400" /> {plot.user?.email || 'No email attached'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#C49E40]">{plot.cropType}</span><br/>
                    <span className="text-xs text-gray-500">Sown: {new Date(plot.sowingDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      plot.status === 'Sowing' ? 'bg-blue-100 text-blue-700' :
                      plot.status === 'Growing' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {plot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap items-center">
                      {plot.status !== 'Harvested' ? (
                        <button onClick={() => handleAdvanceStatus(plot)} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-bold transition-colors">
                          Advance <ArrowRight size={13} />
                        </button>
                      ) : null}
                      <button 
                        onClick={() => { 
                          setSelectedPlot(plot); 
                          setSettlementForm({ yieldKg: '', marketRate: '', monthlyServiceFee: '0' });
                          setShowSettlementModal(true); 
                        }} 
                        className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
                          plot.status === 'Harvested' 
                            ? 'bg-[#C49E40] text-white hover:bg-[#b38f3a] ring-2 ring-[#C49E40]/20' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <DollarSign size={14} /> Settle Payout
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {plots.length === 0 && <tr><td colSpan="5" className="px-6 py-6 text-center text-gray-500">No active plots found.</td></tr>}
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Settlements &amp; Dispatched Statements</h3>
            <p className="text-xs text-gray-500">Automated financial statements generated and emailed directly to investors upon harvest settlement.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto w-full shadow-sm">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Statement ID</th>
                <th className="px-6 py-4">Landowner &amp; Plot</th>
                <th className="px-6 py-4">Yield &amp; Rate</th>
                <th className="px-6 py-4">Gross Rev</th>
                <th className="px-6 py-4">Net Payout (80%)</th>
                <th className="px-6 py-4">Status &amp; Email</th>
                <th className="px-6 py-4">Statement PDF</th>
              </tr>
            </thead>
            <tbody>
              {settlements.slice((settlementsPage - 1) * itemsPerPage, settlementsPage * itemsPerPage).map(set => (
                <tr key={set._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 font-mono text-xs">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-bold">
                      {set.statementId && !set.statementId.includes('$') ? set.statementId : (set._id ? `STM-${set._id.slice(-6).toUpperCase()}` : 'N/A')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{set.user?.name || 'Unknown'}</span> <br/>
                    <span className="text-xs text-gray-500">Plot #{set.plot?.plotNumber} ({set.plot?.cropType})</span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="font-semibold text-gray-800">{set.totalYieldKg || set.yieldKg || '--'} kg</span> <br/>
                    <span className="text-gray-400">@ ₹{set.marketRate || '--'}/kg</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">₹{(set.grossRevenue || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-bold text-emerald-700 text-base">₹{(set.netPayout || 0).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1 w-max px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        set.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        <CheckCircle2 size={11} /> {set.status || 'Processed'}
                      </span>
                      <span className="text-[11px] text-gray-400 truncate max-w-[140px]" title={set.user?.email}>
                        {set.user?.email || 'Email dispatched'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDownloadPDF(set)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      <Download size={14} /> PDF Statement
                    </button>
                  </td>
                </tr>
              ))}
              {settlements.length === 0 && <tr><td colSpan="7" className="px-6 py-6 text-center text-gray-500">No settlements found.</td></tr>}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Add New Plot</h3>
            <form onSubmit={handleCreatePlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assign Landowner</label>
                <select required value={plotForm.userId} onChange={e => setPlotForm({...plotForm, userId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm">
                  <option value="">-- Choose User --</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assign ESP32 Zone (Optional)</label>
                <select value={plotForm.zoneId} onChange={e => setPlotForm({...plotForm, zoneId: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm">
                  <option value="">-- No Zone --</option>
                  <option value="1">Zone 1 (Black Soil)</option>
                  <option value="2">Zone 2 (Red Soil)</option>
                  <option value="3">Zone 3 (Sand)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Plot Number</label>
                  <input type="text" required placeholder="e.g. B-14" value={plotForm.plotNumber} onChange={e => setPlotForm({...plotForm, plotNumber: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Area (Acres)</label>
                  <input type="number" step="0.1" required placeholder="2.5" value={plotForm.area} onChange={e => setPlotForm({...plotForm, area: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Crop Type</label>
                <input type="text" required placeholder="e.g. Organic Tomatoes" value={plotForm.cropType} onChange={e => setPlotForm({...plotForm, cropType: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sowing Date</label>
                <input type="date" required value={plotForm.sowingDate} onChange={e => setPlotForm({...plotForm, sowingDate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowPlotModal(false)} className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-[#213E20] text-white font-bold rounded-xl hover:bg-[#1a3119] text-sm">Create Plot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Payout & Email Modal */}
      {showSettlementModal && selectedPlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="text-[#C49E40]" size={22} /> Process Harvest Settlement
              </h3>
            </div>
            
            {/* Target Plot & User Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <span className="text-gray-500">Target Plot: </span>
                  <span className="font-bold text-gray-900">#{selectedPlot.plotNumber} ({selectedPlot.cropType})</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                  {selectedPlot.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <Mail size={13} className="text-emerald-600 shrink-0" />
                <span>Recipient Email: </span>
                <span className="font-semibold text-emerald-700 font-mono">{selectedPlot.user?.email || 'No email attached'}</span>
              </div>
            </div>

            <form onSubmit={handleTriggerSettlement} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Total Yield (kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    required 
                    placeholder="e.g. 4200" 
                    value={settlementForm.yieldKg} 
                    onChange={e => setSettlementForm({...settlementForm, yieldKg: e.target.value})} 
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#C49E40]/20 focus:border-[#C49E40]" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Market Rate (₹/kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    required 
                    placeholder="e.g. 35" 
                    value={settlementForm.marketRate} 
                    onChange={e => setSettlementForm({...settlementForm, marketRate: e.target.value})} 
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#C49E40]/20 focus:border-[#C49E40]" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Monthly Maintenance / Service Fee (₹)</label>
                <input 
                  type="number" 
                  step="1" 
                  placeholder="e.g. 5000" 
                  value={settlementForm.monthlyServiceFee} 
                  onChange={e => setSettlementForm({...settlementForm, monthlyServiceFee: e.target.value})} 
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#C49E40]/20 focus:border-[#C49E40]" 
                />
              </div>

              {/* Dynamic Live Financial Breakdown */}
              <div className="bg-linear-to-br from-amber-50/70 to-emerald-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 border-b border-amber-200/60 pb-2">
                  <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-[#C49E40]" /> Dynamic Settlement Breakdown</span>
                  <span className="text-gray-500 font-normal">Auto-calculated</span>
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 pt-1">
                  <span>Gross Market Revenue:</span>
                  <span className="font-semibold text-gray-900">₹{calcGross.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {feeVal > 0 && (
                  <div className="flex justify-between text-xs text-red-600">
                    <span>Less Service Fee Deduction:</span>
                    <span className="font-semibold">- ₹{feeVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Soil &amp; Input Reserve (10%):</span>
                  <span className="font-semibold text-gray-800">₹{calcSoil.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Platform Margin (10%):</span>
                  <span className="font-semibold text-gray-800">₹{calcPlatform.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-emerald-800 bg-white/80 p-2.5 rounded-lg border border-emerald-200 mt-2">
                  <span>Net Landowner Payout (80%):</span>
                  <span className="text-base font-black text-emerald-600">₹{calcNetPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Automatic Email & PDF Notice */}
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900">
                <Mail className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <div>
                  <span className="font-bold">Automated Email &amp; PDF Dispatch:</span>
                  <p className="text-blue-700 mt-0.5">
                    Upon clicking Settle, the formal <span className="font-mono font-semibold">Settlement_STM-*.pdf</span> statement will be generated and emailed directly to <strong className="underline">{selectedPlot.user?.email || 'the user'}</strong> along with the detailed HTML statement breakdown.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  disabled={processingSettlement}
                  onClick={() => setShowSettlementModal(false)} 
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 text-sm transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={processingSettlement}
                  className="flex-1 py-2.5 bg-[#C49E40] text-white font-bold rounded-xl hover:bg-[#b38f3a] text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-75 cursor-pointer"
                >
                  {processingSettlement ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Processing &amp; Emailing...
                    </>
                  ) : (
                    <>
                      <FileText size={16} /> Settle &amp; Dispatch Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPlots;



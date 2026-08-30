import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFarm } from '../context/FarmContext';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Droplets, Wind, Zap, Gauge, Sun, Leaf, Sprout, Download, ArrowRight } from 'lucide-react';
import { downloadSettlementPDF } from '../services/pdfService';

const API_URL = import.meta.env.VITE_API_URL || 'https://aiot-vertical-farming-backend.onrender.com/api';

const MyFarm = () => {
    const { layers, isConnected, togglePump } = useFarm();
    const { user } = useAuth();

    const [plots, setPlots] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFarmData = async () => {
            try {
                const token = localStorage.getItem('farm_token');
                const [plotsRes, settlementsRes] = await Promise.all([
                    axios.get(`${API_URL}/user/plots`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_URL}/user/settlements`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setPlots(plotsRes.data.data || []);
                setSettlements(settlementsRes.data.data || []);
            } catch (error) {
                console.error('Failed to fetch farm data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFarmData();
    }, []);

    const handleDownloadStatement = (settlement) => {
        const data = {
            statementId: settlement.statementId || settlement._id || settlement.id,
            clientName: user?.name || 'Unknown',
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

    // Filter zones based on plot zoneIds
    const myZones = [];
    const layersList = Array.isArray(layers) ? layers : Object.values(layers);
    const assignedZoneIds = plots.map(p => p.zoneId).filter(z => z);

    if (user?.role === 'admin') {
        myZones.push(...layersList);
    } else {
        layersList.forEach(layer => {
            if (assignedZoneIds.includes(layer.id) || (user?.zoneId && String(layer.id) === String(user.zoneId))) {
                myZones.push(layer);
            }
        });
    }

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto font-sans space-y-12">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm border border-emerald-100">
                    <Leaf size={32} />
                </div>
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">My <span className="text-emerald-600">Farm</span></h1>
                    <p className="text-slate-500 mt-1">Welcome back, {user?.name || 'Farmer'}. Manage your plots and track live telemetry.</p>
                </div>
            </div>

            {/* LIVE TELEMETRY DASHBOARD */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Gauge size={20} className="text-emerald-500" /> Live Sensor Telemetry</h3>
                {myZones.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
                        <p className="text-gray-500 font-medium">No active ESP32 sensor zones linked to your plots.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {myZones.map((zone) => {
                            const isPumpOn = isConnected && zone.pumpInfo?.status;
                            const motorStatus = isConnected ? (zone.motor || (isPumpOn ? 'ON' : 'OFF')) : 'OFF';
                            const isMotorActive = isConnected && motorStatus === 'ON';
                            
                            return (
                                <div key={zone.id} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/5 transition-all">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/80 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h2 className="text-2xl font-black text-slate-800 mb-2">{zone.name}</h2>
                                                <div className="flex gap-2">
                                                    <span className="text-sm md:text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">Zone {zone.id}</span>
                                                    <span className={`text-sm md:text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border ${isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                        {isConnected ? '• Live' : 'Offline'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl text-sm md:text-xs font-black uppercase tracking-widest border-2 flex items-center gap-2 ${isMotorActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                                <div className={`w-2 h-2 rounded-full ${isMotorActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                                MOTOR {motorStatus}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <StatBox icon={Thermometer} label="Temp" value={isConnected ? `${zone.temperature}°C` : '--'} color="text-orange-500" bgColor="bg-orange-50" />
                                            <StatBox icon={Wind} label="Humidity" value={isConnected ? `${zone.humidity}%` : '--'} color="text-blue-500" bgColor="bg-blue-50" />
                                            <StatBox icon={Droplets} label="Moisture" value={isConnected ? `${zone.moisture}%` : '--'} color="text-emerald-500" bgColor="bg-emerald-50" />
                                            <StatBox icon={Sun} label="Light" value={isConnected ? `${zone.light}` : '--'} color="text-amber-500" bgColor="bg-amber-50" />
                                        </div>

                                        <button onClick={() => togglePump(zone.id)} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isMotorActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                                            {isMotorActive ? 'Stop Irrigation' : 'Start Irrigation'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ACTIVE PLOTS LIFECYCLE */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Sprout size={20} className="text-[#C49E40]" /> Plot Lifecycle</h3>
                <div className="space-y-4">
                    {plots.map(plot => (
                        <div key={plot._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5"><Sprout size={120} /></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-1">{plot.plotNumber}</h4>
                                        <p className="text-sm text-gray-500">{plot.area} Acres • <span className="font-bold text-[#C49E40]">{plot.cropType}</span> {plot.zoneId && `• Linked to Zone ${plot.zoneId}`}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm md:text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Sown On</p>
                                        <p className="text-sm font-medium text-gray-900">{new Date(plot.sowingDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Status Tracker */}
                                <div className="relative pt-4 max-w-3xl">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 rounded-full -translate-y-1/2 z-0"></div>
                                    <div className={`absolute top-1/2 left-0 h-1 bg-[#C49E40] rounded-full -translate-y-1/2 z-0 transition-all duration-1000`} style={{ width: plot.status === 'Sowing' ? '15%' : plot.status === 'Growing' ? '50%' : '100%' }}></div>
                                    <div className="relative z-10 flex justify-between">
                                        {['Sowing', 'Growing', 'Harvested'].map((step, idx) => {
                                            const isActive = plot.status === step || (idx === 0 && plot.status !== 'Sowing') || (idx === 1 && plot.status === 'Harvested');
                                            return (
                                                <div key={step} className="flex flex-col items-center gap-2">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-500 ${isActive ? 'bg-[#C49E40] text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>{idx + 1}</div>
                                                    <span className={`text-sm md:text-xs font-bold uppercase tracking-wider ${isActive ? 'text-[#C49E40]' : 'text-gray-400'}`}>{step}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {plots.length === 0 && (
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                            <p className="text-gray-500 font-medium">You do not have any active plots assigned currently.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* SETTLEMENTS */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Download size={20} className="text-blue-500" /> Post-Harvest Settlements &amp; Statements
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Official settlement reports and payout distribution breakdown.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {settlements.map(set => (
                        <div key={set._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">{set.status || 'Settled'}</span>
                                        <span className="text-xs text-gray-400 font-mono font-medium">ID: {set.statementId && !set.statementId.includes('$') ? set.statementId : (set._id ? `STM-${set._id.slice(-6).toUpperCase()}` : 'N/A')}</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">{set.plot?.plotNumber} • {set.plot?.cropType}</h4>
                                    <p className="text-xs text-gray-500">
                                        Yield: <strong className="text-gray-700">{set.totalYieldKg || set.yieldKg || '--'} kg</strong> @ ₹{set.marketRate || '--'}/kg • Harvest Date: {new Date(set.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Gross Rev</p>
                                        <p className="text-base font-semibold text-gray-900">₹{(set.grossRevenue || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Soil Reserve (10%)</p>
                                        <p className="text-base font-semibold text-gray-700">₹{(set.soilReserve || (set.grossRevenue ? set.grossRevenue * 0.1 : 0)).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">Net Payout (80%)</p>
                                        <p className="text-xl font-black text-emerald-600">₹{(set.netPayout || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                <div>
                                    <button onClick={() => handleDownloadStatement(set)} className="w-full lg:w-auto px-6 py-3 bg-[#213E20] text-white rounded-xl font-bold hover:bg-[#1a3119] transition-colors flex items-center justify-center gap-2 shadow-sm text-sm">
                                        <Download size={18} /> Download Statement PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {settlements.length === 0 && (
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                            <p className="text-gray-500 font-medium">No harvest settlements available yet.</p>
                        </div>
                    )}
                </div>
            </div>

        </main>
    );
};

const StatBox = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white border border-slate-100/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bgColor} ${color} transition-transform group-hover:scale-110`}>
            <Icon size={20} />
        </div>
        <p className="text-sm md:text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">{label}</p>
        <p className="text-lg font-black text-slate-800">{value}</p>
    </div>
);

export default MyFarm;

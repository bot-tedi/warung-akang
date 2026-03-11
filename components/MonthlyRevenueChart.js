'use client';

import { useState, useEffect } from 'react';
import { calculateMonthlyRevenue, saveMonthlyRevenue, getMonthlyRevenue, exportToExcel } from '@/lib/monthlyRevenue';
import { TrendingUp, Download, Calculator, RefreshCw } from 'lucide-react';

export default function MonthlyRevenueChart() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const data = await getMonthlyRevenue();
      setMonthlyData(data);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateRevenue = async () => {
    try {
      setCalculating(true);
      const calculatedData = await calculateMonthlyRevenue();

      // Save calculated data to database
      await saveMonthlyRevenue(calculatedData);

      // Update state with new data
      setMonthlyData(prev => {
        const existingMonths = new Set(prev.map(item => `${item.month}-${item.year}`));
        const newData = calculatedData.filter(item => !existingMonths.has(`${item.month}-${item.year}`));
        return [...prev, ...newData];
      });
    } catch (error) {
      console.error('Error calculating revenue:', error);
      alert('Error calculating revenue: ' + error.message);
    } finally {
      setCalculating(false);
    }
  };

  const handleExport = () => {
    try {
      const result = exportToExcel(monthlyData, 'monthly-revenue-report.csv');
      if (result.success) {
        alert('Data berhasil diekspor ke Excel!');
      } else {
        alert('Error exporting data: ' + result.error);
      }
    } catch (error) {
      alert('Error exporting data: ' + error.message);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalOrders = monthlyData.reduce((sum, item) => sum + item.orderCount, 0);

  // Simple bar chart using divs instead of recharts
  const maxRevenue = monthlyData.length > 0 ? Math.max(...monthlyData.map(item => item.totalRevenue)) : 0;
  const chartHeight = 300;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Pendapatan Bulanan</h2>
          <p className="text-slate-600">Analisis pendapatan per bulan dan tahun</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCalculateRevenue}
            disabled={calculating}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {calculating ? 'Menghitung...' : 'Hitung Pendapatan'}
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>

          <button
            onClick={fetchMonthlyData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-emerald-900">Total Pendapatan</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm text-emerald-600">{monthlyData.length} bulan</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Total Order</h3>
          </div>
          <p className="text-2xl font-bold text-blue-900">{totalOrders.toLocaleString()}</p>
          <p className="text-sm text-blue-600">Selesai</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="w-6 h-6 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-900">Rata-rata</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {monthlyData.length > 0 ? formatCurrency(totalRevenue / monthlyData.length) : 'Rp 0'}
          </p>
          <p className="text-sm text-slate-600">per bulan</p>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Grafik Pendapatan</h3>

        {monthlyData.length > 0 ? (
          <div className="relative">
            <div className="flex items-end justify-center space-x-2" style={{ height: `${chartHeight}px` }}>
              {monthlyData.map((item, index) => {
                const barHeight = maxRevenue > 0 ? (item.totalRevenue / maxRevenue) * chartHeight : 0;
                const barWidth = 60;
                const spacing = 4;

                return (
                  <div key={index} className="relative flex flex-col items-center">
                    <div
                      className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 rounded-t"
                      style={{
                        height: `${barHeight}px`,
                        width: `${barWidth}px`,
                        marginBottom: `${spacing}px`
                      }}
                    >
                      <div className="text-white text-xs font-bold text-center py-2">
                        {formatCurrency(item.totalRevenue)}
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 text-center mt-1">
                      {item.month} {item.year}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p>Belum ada data pendapatan</p>
            <p className="text-sm mt-2">Klik "Hitung Pendapatan" untuk memproses data</p>
          </div>
        )}
      </div>

      {/* Data Table */}
      {monthlyData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Detail Pendapatan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-700">Bulan</th>
                  <th className="px-4 py-3 text-left text-slate-700">Tahun</th>
                  <th className="px-4 py-3 text-right text-slate-700">Total Revenue</th>
                  <th className="px-4 py-3 text-right text-slate-700">Jumlah Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {monthlyData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3">{item.month}</td>
                    <td className="px-4 py-3">{item.year}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.totalRevenue)}</td>
                    <td className="px-4 py-3 text-right">{item.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

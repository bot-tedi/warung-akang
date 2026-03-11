// Helper functions untuk monthly revenue dan Excel export
import { supabase } from './supabase';

// Calculate monthly revenue dari orders
export async function calculateMonthlyRevenue() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, status, created_at')
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching orders for monthly revenue:', error);
      throw error;
    }

    // Group by month and year
    const monthlyData = {};

    orders.forEach(order => {
      const date = new Date(order.created_at);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const monthKey = `${month} ${year}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month,
          year,
          totalRevenue: 0,
          orderCount: 0
        };
      }

      monthlyData[monthKey].totalRevenue += order.total_amount || 0;
      monthlyData[monthKey].orderCount += 1;
    });

    return Object.values(monthlyData);
  } catch (error) {
    console.error('Error calculating monthly revenue:', error);
    return [];
  }
}

// Save monthly revenue ke database
export async function saveMonthlyRevenue(monthlyData) {
  try {
    // Map data dengan correct column names
    const mappedData = monthlyData.map(item => ({
      month: item.month,
      year: item.year,
      total_revenue: item.totalRevenue,
      order_count: item.orderCount
    }));

    const { error } = await supabase
      .from('monthly_revenue')
      .upsert(mappedData, {
        onConflict: 'month, year'  // Simple string format
      });

    if (error) {
      console.error('Error saving monthly revenue:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error in saveMonthlyRevenue:', error);
    return { success: false, error: error.message };
  }
}

// Get monthly revenue dari database
export async function getMonthlyRevenue() {
  try {
    const { data, error } = await supabase
      .from('monthly_revenue')
      .select('month, year, total_revenue, order_count')
      .order('year', 'desc')
      .order('month', 'asc');

    if (error) {
      console.error('Error fetching monthly revenue:', error);
      throw error;
    }

    // Map data dengan correct field names
    return (data || []).map(item => ({
      month: item.month,
      year: item.year,
      totalRevenue: item.total_revenue,
      orderCount: item.order_count
    }));
  } catch (error) {
    console.error('Error in getMonthlyRevenue:', error);
    return [];
  }
}

// Export data ke Excel format
export function exportToExcel(data, filename = 'monthly-revenue.xlsx') {
  try {
    if (!data || data.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return { success: false, error: 'No data available' };
    }

    // Create CSV content dengan proper headers
    const headers = ['Month', 'Year', 'Total Revenue', 'Order Count'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        `"${row.month}"`,
        row.year,
        row.totalRevenue,
        row.orderCount
      ].join(','))
    ].join('\n');

    // Create Blob dengan proper MIME type untuk Excel
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);

    console.log('✅ Export berhasil:', filename, 'dengan', data.length, 'baris data');

    return { success: true, rows: data.length };
  } catch (error) {
    console.error('❌ Error exporting to Excel:', error);
    return { success: false, error: error.message };
  }
}

// Generate chart data untuk Chart.js
export function generateChartData(monthlyData) {
  return {
    labels: monthlyData.map(item => `${item.month} ${item.year}`),
    datasets: [{
      label: 'Monthly Revenue',
      data: monthlyData.map(item => item.totalRevenue),
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      tension: 0.4
    }]
  };
}

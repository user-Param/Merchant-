import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/api/v1';
const STORE_ID = 'STORE-1775527562244-i6whzo';

async function testChartEndpoints() {
  const endpoints = [
    { name: 'Visitors Trend', url: `${API_BASE}/analytics/visitors-trend` },
    { name: 'Orders Trend', url: `${API_BASE}/analytics/orders-trend` },
    { name: 'Retention Trend', url: `${API_BASE}/analytics/retention-trend` },
    { name: 'Sales Trend', url: `${API_BASE}/analytics/sales-trend` }
  ];

  console.log('Testing chart data endpoints...\n');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        headers: { 'x-store-id': STORE_ID }
      });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        console.log(`✓ ${endpoint.name}`);
        console.log(`  - Count: ${data.length} records`);
        if (data.length > 0) {
          console.log(`  - First: ${JSON.stringify(data[0])}`);
          console.log(`  - Last: ${JSON.stringify(data[data.length - 1])}`);
        }
      } else {
        console.log(`✗ ${endpoint.name} - Invalid response:`, data);
      }
    } catch (err) {
      console.log(`✗ ${endpoint.name} - Error:`, err.message);
    }
    console.log();
  }
}

testChartEndpoints();

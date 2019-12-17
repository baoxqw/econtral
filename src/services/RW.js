import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchRW(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceH/projectrecieptstat`,{
    method:'POST',
    body: params,
  });
}
export async function fetchChild(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceH/queryincludeb`,{
    method:'POST',
    body: str,
  });
}


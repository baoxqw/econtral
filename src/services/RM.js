import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchRM(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pma/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchTicket(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceH/queryincludeb`,{
    method:'POST',
    body: str,
  });
}

export async function endhandle(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmInvoiceH/settle`,{
    method:'POST',
    body: str,
  });
}

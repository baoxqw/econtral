import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchAA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmContractH/queryaudittaskbyuserid`,{
    method:'POST',
    body: str,
  });
}


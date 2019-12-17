import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/wfClaimformH/query`,{
    method:'POST',
    body: str,
  });
}


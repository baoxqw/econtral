import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchBL(params) {
  const str = JSON.stringify(params);
  return request(`/rest/bl/query`,{
    method:'POST',
    body: str,
  });
}


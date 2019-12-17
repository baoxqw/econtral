import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchNF(params) {
  const str = JSON.stringify(params);
  return request(`/rest/nf/query`,{
    method:'POST',
    body: str,
  });
}


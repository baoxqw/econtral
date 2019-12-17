import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchFP(params) {
  const str = JSON.stringify(params);
  return request(`/rest/projectfind/query`,{
    method:'POST',
    body: str,
  });
}

export async function updateFP(params) {
  const str = JSON.stringify(params);
  return request(`/rest/projectfind/update`,{
    method:'POST',
    body: str,
  });
}

export async function deleteFP(params) {
  const str = JSON.stringify(params);
  return request(`/rest/projectfind/delete`,{
    method:'POST',
    body: str,
  });
}


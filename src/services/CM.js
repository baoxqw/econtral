import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchCM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/cm/query`,{
    method:'POST',
    body: str,
  });
}

export async function addCM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/cm/add`,{
    method:'POST',
    body: str,
  });
}

export async function updateCM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/cm/update`,{
    method:'POST',
    body: str,
  });
}
export async function deleteCM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/cm/delete`,{
    method:'POST',
    body: str,
  });
}

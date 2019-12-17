import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchMR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/onaudit/query`,{
    method:'POST',
    body: str,
  });
}
export async function checkMR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/agree`,{
    method:'POST',
    body: str,
  });
}

export async function refuseMR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/reject`,{
    method:'POST',
    body: str,
  });
}

export async function returnMR(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/return`,{
    method:'POST',
    body: str,
  });
}

export async function detailcheck(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/approval/queryprocessbyid`,{
    method:'POST',
    body: str,
  });
}

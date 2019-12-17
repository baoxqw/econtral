import request from '@/utils/request';

const baseUrl = '/wookong';


export async function fetchBP(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/salesperformance/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchDept(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/dept`,{
    method:'POST',
    body: str,
  });
}


export async function fetchPerson(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bd/psndoc`,{
    method:'POST',
    body: str,
  });
}

export async function fetchProject(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/query`,{
    method:'POST',
    body: str,
  });
}

export async function dataList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/sm/user`,{
    method:'POST',
    body: str,
  });
}

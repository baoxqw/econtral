import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchPMA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pma/query`,{
    method:'POST',
    body: str,
  });
}

export async function addPMA(params) {
  const str = JSON.stringify(params);
  console.log('添加的数据：',str)
  return request(`${baseUrl}/rest/pma/add`,{
    method:'POST',
    body: str,
  });
}

export async function deletePMA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pma/remove`,{
    method:'POST',
    body: str,
  });
}

export async function updatePMA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pma/add`,{
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
export async function fetchTree(params) {
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

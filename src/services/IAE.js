import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchTree(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdCostsubj/query`,{
    method:'POST',
    body: str,
  });
}

export async function queryIAE(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdCostsubj/querybyid`,{
    method:'POST',
    body: str,
  });
}

export async function removenewdata(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdCostsubj/delete`,{
    method:'POST',
    body: str,
  });
}

export async function addData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/bdCostsubj/add`,{
    method:'POST',
    body: str,
  });
}


import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchPMA(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pma/query`,{
    method:'POST',
    body: str,
  });
}
export async function matype(params) {
  return request(`${baseUrl}/rest/bdInvcl/query`,{
    method:'POST',
    body: params,
  });
}
export async function queryMatemanage(params) {
  return request(`${baseUrl}/rest/bdMaterialBase/query`,{
    method:'POST',
    body: params,
  });
}

export async function topadd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmProjectBmr/add`,{
    method:'POST',
    body: str,
  });
}

export async function toplist(params) {
  return request(`${baseUrl}/rest/pmProjectBmr/query`,{
    method:'POST',
    body: params,
  });
}

export async function childAdd(params) {
  const str = JSON.stringify(params);
  console.log('提交的内容',str);
  return request(`${baseUrl}/rest/pmProjectBmrDetail/add`,{
    method:'POST',
    body: str,
  });
}

export async function topDelete(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmProjectBmr/delete`,{
    method:'POST',
    body: str,
  });
}

export async function childDelete(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmProjectBmrDetail/delete`,{
    method:'POST',
    body: str,
  });
}

export async function childList(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmProjectBmrDetail/query`,{
    method:'POST',
    body: str,
  });
}
export async function childAdds(params) {
  return request(`${baseUrl}/rest/pmProjectBmrDetail/batchadd`,{
    method:'POST',
    body: params,
  });
}
export async function queryPId(params) {
  return request(`${baseUrl}/rest/pmProjectBmr/querybyprojectidmaxversion`,{
    method:'POST',
    body: params,
  });
}

import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchpApproval(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/query`,{
    method:'POST',
    body: str,
  });
}
export async function removeApproval(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/remove`,{
    method:'POST',
    body: str,
  });
}

export async function approvalAdd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/add`,{
    method:'POST',
    body: str,
  });
}
export async function fetchProjectNode(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/querybypidandtype`,{
    method:'POST',
    body: str,
  });
}

export async function fetchMarketNode(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/querybypidandtype`,{
    method:'POST',
    body: str,
  });
}
export async function proAdd(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/milestone/add`,{
    method:'POST',
    body: str,
  });
}

export async function fetchModle(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmBdMsnTemplateH/query`,{
    method:'POST',
    body: str,
  });
}

export async function fetchChildModle(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmBdMsnTemplateB/query`,{
    method:'POST',
    body: str,
  });
}
export async function deleteNode(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectmilestone/remove`,{
    method:'POST',
    body: str,
  });
}

export async function endHandle(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/projectapproval/commit`,{
    method:'POST',
    body: str,
  });
}

export async function proAddModleData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmBdMsnTemplateH/add`,{
    method:'POST',
    body: str,
  });
}


export async function proAddModleArray(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmBdMsnTemplateB/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function addModleData(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/milestone/batchadd`,{
    method:'POST',
    body: str,
  });
}

export async function addModleDataMarket(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/milestone/batchadd`,{
    method:'POST',
    body: str,
  });
}
export async function deleteProTop(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmBdMsnTemplateH/delete`,{
    method:'POST',
    body: str,
  });
}

export async function deleteAddModleArray(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmBdMsnTemplateB/deletebypid`,{
    method:'POST',
    body: str,
  });
}

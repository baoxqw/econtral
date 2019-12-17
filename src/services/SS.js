import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchSS(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmSettlebillH/query`,{
    method:'POST',
    body: str,
  });
}

export async function removeSS(params) {
  const str = JSON.stringify(params);
  return request(`${baseUrl}/rest/pmSettlebillH/delete`,{
    method:'POST',
    body: str,
  });
}


export async function findChild(params) {
  const str = JSON.stringify(params);
  console.log('提交的',str)
  return request(`${baseUrl}/rest/pmSettlebillH/querybypid`,{
    method:'POST',
    body: str,
  });
}

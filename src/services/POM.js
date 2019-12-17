import request from '@/utils/request';

const baseUrl = '/wookong';

export async function fetchPOM(params) {
  const str = JSON.stringify(params);
  return request(`/rest/pom/query`,{
    method:'POST',
    body: str,
  });
}


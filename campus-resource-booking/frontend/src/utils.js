
export function getUserId(){ return localStorage.getItem('userId') || '' }
export function setUserId(id){ localStorage.setItem('userId', id || '') }
export async function api(path, { method='GET', body, userId } = {}){
  const headers = { 'Content-Type': 'application/json' }
  const uid = userId ?? getUserId()
  if(uid) headers['X-User-Id'] = uid
  const res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined })
  if(!res.ok){
    const t = await res.json().catch(()=>({error: res.statusText}))
    throw new Error(t.error || '请求失败')
  }
  return res.json()
}
export function formatDateTimeLocal(dt){
  const pad = n => String(n).padStart(2,'0')
  const y=dt.getFullYear(), m=pad(dt.getMonth()+1), d=pad(dt.getDate()), h=pad(dt.getHours()), mi=pad(dt.getMinutes())
  return `${y}-${m}-${d}T${h}:${mi}`
}

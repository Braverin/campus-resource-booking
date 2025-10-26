
import React from 'react'
import { api } from '../utils'

export default function AdminResource(){
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState('ROOM')
  const [capacity, setCapacity] = React.useState(1)
  const [msg, setMsg] = React.useState('')

  async function submit(e){
    e.preventDefault()
    try{
      const res = await api('/api/resources', { method:'POST', body:{ name, type, capacity: Number(capacity) } })
      setMsg(`创建成功：ID ${res.id}`)
    }catch(e){ setMsg(`失败：${e.message}`) }
  }

  return (
    <form onSubmit={submit} className="neo-card p-6">
      <div className="text-xl font-semibold mb-4">资源管理（管理员）</div>
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">名称</span>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="教学楼A-101" required/>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">类型</span>
          <select className="input" value={type} onChange={e=>setType(e.target.value)}>
            <option value="ROOM">ROOM</option>
            <option value="LAB">LAB</option>
            <option value="DEVICE">DEVICE</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">容量</span>
          <input className="input" type="number" min="1" value={capacity} onChange={e=>setCapacity(e.target.value)} />
        </label>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button className="btn-primary" type="submit">新增资源</button>
        {msg && <div className="text-sm text-gray-600">{msg}</div>}
      </div>
      <div className="mt-2 text-xs text-gray-500"></div>
    </form>
  )
}

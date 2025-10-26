import React from 'react'
import { api } from '../utils'

export default function MyBookings() {
  const [list, setList] = React.useState([])
  const [msg, setMsg] = React.useState('')

  // 加载预约列表
  async function load() {
    try {
      setList(await api('/api/bookings'))
    } catch (e) {
      setMsg(e.message)
    }
  }

  React.useEffect(() => { load() }, [])

  // 取消预约
  async function cancel(id) {
    try {
      await api(`/api/bookings/${id}/cancel`, { method: 'POST' })
      setMsg(`已取消：${id}`)
      load()
    } catch (e) {
      setMsg(`取消失败：${e.message}`)
    }
  }

  return (
      <div className="neo-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold">我的预约</div>
          <button className="btn-ghost" onClick={load}>刷新</button>
        </div>

        {msg && <div className="mb-3 text-sm text-gray-600">{msg}</div>}

        <div className="grid gap-3">
          {list.map(b => (
              <div key={b.id} className="p-4 rounded-xl border border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                  {/*  去掉 # */}
                  <div className="font-medium">预约 {b.id}</div>
                  <div className="text-sm text-gray-500">{b.status}</div>
                </div>

                {/*  押金改为信用值 */}
                <div className="text-sm text-gray-600 mt-1">
                  资源ID：{b.resourceId} · 时间：{b.start} ~ {b.end} · 信用值：{b.creditRequired ?? 20}
                </div>

                {/*  只保留“取消”按钮 */}
                {b.status === 'NEW' && (
                    <div className="mt-3 flex gap-2">
                      <button className="btn-ghost" onClick={() => cancel(b.id)}>取消</button>
                    </div>
                )}
              </div>
          ))}

          {list.length === 0 && <div className="text-gray-500">暂无预约</div>}
        </div>
      </div>
  )
}


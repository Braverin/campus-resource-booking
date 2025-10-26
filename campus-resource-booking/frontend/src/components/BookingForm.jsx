import React from 'react'
import { api } from '../utils'

function getNextHourDate(base = new Date()) {
  const d = new Date(base)
  d.setMinutes(0, 0, 0)
  d.setHours(d.getHours() + 1)
  return d
}
function formatHourLocal(dt) {
  const pad = n => String(n).padStart(2, '0')
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:00`
}

export default function BookingForm() {
  const [resources, setResources] = React.useState([])
  const [type, setType] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [expanded, setExpanded] = React.useState(false)
  const [form, setForm] = React.useState({
    resourceId: '',
    start: '',
    end: '',
    creditRequired: 0
  })
  const [msg, setMsg] = React.useState('')

  React.useEffect(() => { api('/api/resources').then(setResources) }, [])

  React.useEffect(() => {
    if (!form.resourceId) return
    const selected = resources.find(r => r.id === Number(form.resourceId))
    const start = getNextHourDate()
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
    setForm(s => ({
      ...s,
      creditRequired: selected?.creditRequired ?? 20,
      start: formatHourLocal(start),
      end: formatHourLocal(end)
    }))
  }, [form.resourceId])

  function update(k, v) { setForm(s => ({ ...s, [k]: v })) }

  async function submit(e) {
    e.preventDefault(); setMsg('')
    try {
      const res = await api('/api/bookings', {
        method: 'POST',
        body: {
          resourceId: Number(form.resourceId),
          start: form.start,
          end: form.end
        }
      })
      setMsg(` 预约成功：ID ${res.id}`)
    } catch (e) {
      setMsg(` 失败：${e.message}`)
    }
  }

  // 筛选可预约资源
  const filtered = resources.filter(r =>
      (!type || r.type === type) &&
      (!location || r.name.includes(location)) &&
      r.available
  )

  //  展示逻辑：选中后仅显示该资源，否则只显示一个或全部
  const displayed = form.resourceId
      ? filtered.filter(r => r.id === Number(form.resourceId))
      : (expanded ? filtered : filtered.slice(0, 1))

  return (
      <form onSubmit={submit} className="neo-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold">创建预约</div>

          {/*  右上角展开/收起按钮 */}
          {!form.resourceId && filtered.length > 1 && (
              <button
                  type="button"
                  className="btn-ghost text-sm"
                  onClick={() => setExpanded(!expanded)}
              >
                {expanded ? '收起资源' : '展开更多资源'}
              </button>
          )}
        </div>

        {/* --- 筛选条件 --- */}
        <div className="flex gap-3 mb-4">
          <select className="input w-40" value={type} onChange={e => setType(e.target.value)}>
            <option value="">全部类型</option>
            <option value="ROOM">教室</option>
            <option value="LAB">实验室</option>
            <option value="DEVICE">设备</option>
          </select>

          <select className="input w-40" value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">全部地点</option>
            <option value="博学主楼">博学主楼(新一)</option>
            <option value="博学东楼">博学东楼(新二)</option>
            <option value="博学西楼">博学西楼(新三)</option>
            <option value="博学北楼">博学北楼(新四)</option>
          </select>
        </div>

        {/* --- 可选资源 --- */}
        <div className="grid gap-3 mb-4">
          {displayed.map(r => (
              <div
                  key={r.id}
                  onClick={() => update('resourceId', r.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition
              ${form.resourceId == r.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-100 bg-white hover:bg-gray-50'}`}
              >
                <div className="font-medium">{r.name}</div>
                <div className="text-gray-500 text-sm">
                  类型：{r.type} · 容量：{r.capacity} · 信用需求：{r.creditRequired}
                </div>
              </div>
          ))}
        </div>

        {/* --- 预约时间与信用值 --- */}
        {form.resourceId && (
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">开始时间（整点）</span>
                <input
                    type="datetime-local"
                    step="3600"
                    className="input"
                    value={form.start}
                    min={formatHourLocal(new Date())}
                    max={formatHourLocal(new Date(Date.now() + 7 * 24 * 3600 * 1000))}
                    onChange={e => update('start', e.target.value)}
                    required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">结束时间（整点）</span>
                <input
                    type="datetime-local"
                    step="3600"
                    className="input"
                    value={form.end}
                    min={form.start}
                    max={formatHourLocal(new Date(Date.now() + 7 * 24 * 3600 * 1000))}
                    onChange={e => update('end', e.target.value)}
                    required
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-gray-600">所需信用值</span>
                <input className="input bg-gray-100" type="number" value={form.creditRequired} readOnly />
              </label>
            </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button className="btn-primary" type="submit" disabled={!form.resourceId}>提交预约</button>
          {msg && <div className="text-sm text-gray-600">{msg}</div>}
        </div>
      </form>
  )
}



import React from 'react'
import { api } from '../utils'

export default function ResourceList() {
    const [data, setData] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState('')
    const [type, setType] = React.useState('')
    const [location, setLocation] = React.useState('')
    const [showDetail, setShowDetail] = React.useState(false)
    const [detail, setDetail] = React.useState(null)

    //  控制展开/折叠状态
    const [expanded, setExpanded] = React.useState(false)

    async function load() {
        setLoading(true)
        setError('')
        try {
            const res = await api('/api/resources')
            setData(res)
        } catch (e) {
            setError(e.message)
        }
        setLoading(false)
    }

    React.useEffect(() => { load() }, [])

    //  根据筛选条件过滤资源
    const filtered = data.filter(it =>
        (!type || it.type === type) &&
        (!location || it.name.includes(location))
    )

    //  控制显示数量：默认3个，展开时全部
    const displayed = expanded ? filtered : filtered.slice(0, 3)

    return (
        <div className="neo-card p-6 relative">
            <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-semibold">资源列表</div>

                {/*  在右上角添加展开/收起按钮 */}
                {filtered.length > 3 && (
                    <button
                        className="btn-ghost text-sm"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? '收起资源' : '展开更多资源'}
                    </button>
                )}
            </div>

            {/* 筛选框 */}
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

            {/* 状态提示 */}
            {loading && <div className="text-gray-500">加载中...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {/*  展示的资源卡片（默认3条） */}
            <div className="grid gap-3">
                {displayed.map(it => (
                    <div
                        key={it.id}
                        onClick={() => { setDetail(it); setShowDetail(true) }}
                        className="p-4 rounded-xl border border-gray-100 bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                    >
                        <div>
                            <div className="font-medium">{it.name}</div>
                            <div className="text-gray-500 text-sm">类型：{it.type} · 容量：{it.capacity}</div>
                        </div>
                        <div className="text-gray-400 text-sm">ID: {it.id}</div>
                    </div>
                ))}
                {!loading && filtered.length === 0 && <div className="text-gray-400">暂无匹配的资源</div>}
            </div>

            {/*  如果资源多于3个，在底部也放一个按钮 */}
            {filtered.length > 3 && (
                <div className="mt-4 text-center">
                    <button
                        className="btn-ghost"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? '收起资源' : '展开更多资源'}
                    </button>
                </div>
            )}

            {/* 详情弹窗 */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
                        <h2 className="text-lg font-semibold mb-2">{detail.name}</h2>
                        <p className="text-gray-600 mb-1">类型：{detail.type}</p>
                        <p className="text-gray-600 mb-3">容量：{detail.capacity}</p>
                        <button className="btn-primary mt-3" onClick={() => setShowDetail(false)}>关闭</button>
                    </div>
                </div>
            )}
        </div>
    )
}


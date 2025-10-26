import React, { useEffect, useState } from 'react'
import { api } from '../utils'

export default function MyInfo({ user }) {
    const [info, setInfo] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    //  从后端加载完整用户信息（包括 creditScore 和 password）
    useEffect(() => {
        async function loadInfo() {
            try {
                const res = await api('/api/auth/me')
                setInfo(res)
            } catch (e) {
                console.error('加载用户信息失败:', e)
            }
        }
        loadInfo()
    }, [])

    if (!info) {
        return (
            <div className="text-center text-gray-500 mt-10">
                加载中...
            </div>
        )
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-start pt-12">
            <div className="neo-card p-8 mx-auto w-full max-w-2xl bg-white rounded-2xl shadow-lg">
                <h2 className="text-3xl font-semibold text-blue-600 mb-8 text-center">
                    我的信息
                </h2>

                <div className="space-y-5 text-gray-700 text-lg">
                    {/* 校园卡号 */}
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">校园卡号：</span>
                        <span>{info.campusCard || '未知'}</span>
                    </div>

                    {/* 姓名 */}
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">姓名：</span>
                        <span>{info.name || '未命名'}</span>
                    </div>

                    {/*  密码，默认隐藏，可切换显示 */}
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-medium">密码：</span>
                        <span className="flex items-center gap-2">
              {info.password
                  ? (showPassword ? info.password : '********')
                  : '未设置'}
                            {info.password && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-blue-500 hover:underline text-sm"
                                >
                                    {showPassword ? '隐藏' : '显示'}
                                </button>
                            )}
            </span>
                    </div>

                    {/*  信用值，从数据库读取 */}
                    <div className="flex justify-between border-b pb-2">
                        <span className="font-medium">信用值：</span>
                        <span>{info.creditScore ?? 0}</span>
                    </div>
                </div>
            </div>

            {/*  底部固定居中 */}
            <div className="mt-auto mb-6 flex justify-center items-center text-gray-500/40 text-sm select-none w-full">
                <span className="text-2xl font-bold mr-2">ⓦ</span>
                <span>WUT 校园资源预约</span>
            </div>
        </div>
    )
}



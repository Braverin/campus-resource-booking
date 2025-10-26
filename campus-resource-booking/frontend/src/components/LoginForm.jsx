import React, { useState } from 'react'
import { api, setUserId } from '../utils'

function LoginForm({ onLogin }) {
    const [cardNumber, setCardNumber] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            //  调用后端登录接口
            const response = await api('/api/auth/login', {
                method: 'POST',
                body: {
                    campusCard: cardNumber,
                    password: password,
                },
            })

            if (!response.success) {
                setError(response.message || '账号或密码错误')
                return
            }

            //  保存用户 ID
            setUserId(response.id)

            //  组装用户信息
            const userData = {
                id: response.id,
                campusCard: response.campusCard,
                name: response.name,
                role: response.role,          // 👈 确保有管理员字段
                creditScore: response.creditScore,
            }

            //  本地保存
            localStorage.setItem('user', JSON.stringify(userData))

            //  通知父组件（App.jsx）
            onLogin(userData)
        } catch (err) {
            console.error(err)
            setError('登录失败，请检查服务器连接或重试')
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100 relative">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 z-10">
                <div className="flex flex-col items-center mb-6">
                    <img src="/WUT-logo.png" alt="WUT Logo" className="h-16 w-16 object-contain" />
                    <h2 className="text-2xl font-semibold text-gray-700 mt-2">用户登录</h2>
                </div>

                {error && (
                    <div className="mb-4 text-center text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* 校园卡号 */}
                    <div className="relative w-3/4 mb-6 mx-auto">
                        <input
                            type="text"
                            id="cardNumber"
                            placeholder=" "
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="peer w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                        <label
                            htmlFor="cardNumber"
                            className={`absolute left-2 transition-all bg-white px-1 
                ${cardNumber ? 'top-0 text-xs text-blue-500' : 'top-2.5 text-gray-400 text-base'}
                peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`}
                        >
                            校园卡号
                        </label>
                    </div>

                    {/* 密码 */}
                    <div className="relative w-3/4 mb-6 mx-auto">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer w-full border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                        <label
                            htmlFor="password"
                            className={`absolute left-2 transition-all bg-white px-1 
                ${password ? 'top-0 text-xs text-blue-500' : 'top-2.5 text-gray-400 text-base'}
                peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`}
                        >
                            密码
                        </label>

                        {/* 👁 显示/隐藏密码按钮 */}
                        <button
                            type="button"
                            disabled={!password}
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-2 top-2 transition ${password ? 'text-gray-500 hover:text-blue-500' : 'text-gray-300 cursor-default'}`}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.98 9.98 0 012.105-3.558M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-3/4 block mx-auto bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                    >
                        登录
                    </button>
                </form>
            </div>

            <div className="absolute bottom-6 flex items-center text-gray-500/40 text-sm select-none">
                <span className="text-2xl font-bold mr-2">ⓦ</span>
                <span>WUT 校园资源预约</span>
            </div>
        </div>
    )
}

export default LoginForm




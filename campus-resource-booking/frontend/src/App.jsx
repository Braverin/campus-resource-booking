import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm.jsx'
import TopBar from './components/TopBar'
import ResourceList from './components/ResourceList'
import MyBookings from './components/MyBookings'
import AdminResource from './components/AdminResource.jsx'
import BookingForm from './components/BookingForm'
import MyInfo from './components/MyInfo'

function App() {
    const [user, setUser] = useState(null)
    const [currentTab, setCurrentTab] = useState('resources')

    //  页面加载时读取登录状态
    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    //  登录回调
    const handleLogin = (userData) => {
        setUser(userData)
        setCurrentTab('resources')
    }

    //  未登录时
    if (!user) {
        return <LoginForm onLogin={handleLogin} />
    }

    //  已登录时
    return (
        <div className="App">
            {/* 顶部导航栏 */}
            <TopBar user={user} currentTab={currentTab} onTabChange={setCurrentTab} />

            {/* 内容区域 */}
            <div className="p-4">
                {currentTab === 'resources' && <ResourceList />}
                {currentTab === 'create' && <BookingForm />}
                {currentTab === 'my' && <MyBookings />}
                {currentTab === 'myinfo' && <MyInfo user={user} />}

                {/*  仅管理员显示管理页面 */}
                {user.role === 'ADMIN' && currentTab === 'manage' && <AdminResource user={user} />}
            </div>
        </div>
    )
}

export default App



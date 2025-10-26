// TopBar.jsx
import React from 'react';

function TopBar({ user, currentTab, onTabChange }) {
    return (
        <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
            {/* 左侧导航按钮 */}
            <div className="flex space-x-6">
                <button
                    className={`pb-2 border-b-2 ${currentTab === 'resources'
                        ? 'border-blue-600 text-blue-600 font-semibold'
                        : 'border-transparent text-gray-700 hover:text-blue-600'}`}
                    onClick={() => onTabChange('resources')}
                >
                    资源列表
                </button>
                <button
                    className={`pb-2 border-b-2 ${currentTab === 'create'
                        ? 'border-blue-600 text-blue-600 font-semibold'
                        : 'border-transparent text-gray-700 hover:text-blue-600'}`}
                    onClick={() => onTabChange('create')}
                >
                    创建预约
                </button>
                <button
                    className={`pb-2 border-b-2 ${currentTab === 'my'
                        ? 'border-blue-600 text-blue-600 font-semibold'
                        : 'border-transparent text-gray-700 hover:text-blue-600'}`}
                    onClick={() => onTabChange('my')}
                >
                    我的预约
                </button>
                {user.role === 'ADMIN' && (
                    <button
                        className={`pb-2 border-b-2 ${currentTab === 'manage'
                            ? 'border-blue-600 text-blue-600 font-semibold'
                            : 'border-transparent text-gray-700 hover:text-blue-600'}`}
                        onClick={() => onTabChange('manage')}
                    >
                        管理
                    </button>
                )}
            </div>

            {/* 右侧：我的按钮 */}
            <button
                onClick={() => onTabChange('myinfo')}
                className="text-sm text-gray-700 hover:text-blue-600 transition"
            >
                我的
            </button>
        </div>
    );
}

export default TopBar;


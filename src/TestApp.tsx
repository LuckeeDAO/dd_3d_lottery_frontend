import React from 'react'

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>DD 3D彩票系统测试页面</h1>
      <p>如果您看到这个页面，说明React应用正在正常运行。</p>
      <div style={{ 
        background: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h2>系统状态</h2>
        <ul>
          <li>✅ React应用已启动</li>
          <li>✅ 组件渲染正常</li>
          <li>✅ 样式加载正常</li>
        </ul>
      </div>
      <button 
        onClick={() => alert('按钮点击正常！')}
        style={{
          background: '#1976d2',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        测试按钮
      </button>
    </div>
  )
}

export default TestApp

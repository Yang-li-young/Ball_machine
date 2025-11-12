import React, { useState } from 'react';

// 定义训练数据类型
interface TrainingRecord {
  id: string;
  mode: string;
  date: string;
  duration: string;
  fhCount: number;
  bhCount: number;
  avgSpeed: number;
  // 击球落点数据，每个点包含x和y坐标
  hitPoints: { x: number; y: number; type: 'fh' | 'bh' }[];
}

// 模拟训练数据
const mockTrainingData: TrainingRecord[] = [
  {
    id: '1',
    mode: 'Rally',
    date: '9 Nov 15:16',
    duration: '2 min',
    fhCount: 27,
    bhCount: 27,
    avgSpeed: 28,
    hitPoints: [] as TrainingRecord['hitPoints']
  },
  {
    id: '2',
    mode: 'Rally',
    date: '9 Nov 15:12',
    duration: '2 min',
    fhCount: 25,
    bhCount: 20,
    avgSpeed: 26,
    hitPoints: [] as TrainingRecord['hitPoints']
  }
];

// 填充模拟数据
mockTrainingData.forEach(record => {
  // 添加正手机球点
  for (let i = 0; i < record.fhCount; i++) {
    record.hitPoints.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: 'fh'
    });
  }

  // 添加反手机球点
  for (let i = 0; i < record.bhCount; i++) {
    record.hitPoints.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: 'bh'
    });
  }
});

export function TrainingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [nav, setNav] = useState("training");
  // 训练概览数据
  const overviewData = {
    totalHits: mockTrainingData.reduce((sum, record) => sum + record.fhCount + record.bhCount, 0),
    totalDuration: '1h'
  };

  const handleNavClick = (page: string) => {
    setNav(page);
    onNavigate(page);
  };

  // 渲染击球落点图 - 标准网球场半场样式
  const renderHitMap = (hitPoints: TrainingRecord['hitPoints']) => {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '180px',
        backgroundColor: '#bbf7d0', // 浅绿色代表草地
        border: '1px solid #84cc16',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* 单打边界线 */}
        <div style={{
          position: 'absolute',
          left: '12%',
          top: '10%',
          right: '12%',
          bottom: '10%',
          border: '2px solid #0369a1', // 蓝色单打边界线
          borderRadius: '2px'
        }} />

        {/* 双打边线 - 与单打边界线颜色一致 */}
        <div style={{
          position: 'absolute',
          left: '8%',
          top: '10%',
          width: '2px',
          height: '80%',
          backgroundColor: '#0369a1', // 与单打边界线颜色一致
          opacity: 0.8
        }} />
        <div style={{
          position: 'absolute',
          right: '8%',
          top: '10%',
          width: '2px',
          height: '80%',
          backgroundColor: '#0369a1', // 与单打边界线颜色一致
          opacity: 0.8
        }} />

        {/* 发球区横线（前发球线） - 不超出单打边线 */}
        <div style={{
          position: 'absolute',
          left: '12%',
          top: '50%',
          right: '12%',
          height: '2px',
          backgroundColor: '#0369a1',
          transform: 'translateY(-50%)'
        }} />

        {/* 网袋示意线 - 横向延长至双打边线并向上移动 */}
        <div style={{
          position: 'absolute',
          left: '8%', // 双打边线位置
          top: '10%', // 向上移动到10%高度位置
          right: '8%', // 双打边线位置
          height: '2px',
          backgroundColor: '#0369a1',
          opacity: 0.8
        }} />

        {/* 中线 - 向上延长至网袋示意线 */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '10%', // 网袋示意线位置
          height: '40%', // 延伸到发球线
          width: '2px',
          backgroundColor: '#0369a1',
          transform: 'translateX(-50%)'
        }} />



        {/* 底线标记 */}
        <div style={{
          position: 'absolute',
          left: '8%',
          bottom: '10%',
          right: '8%',
          height: '2px',
          backgroundColor: '#0369a1'
        }} />

        {/* 绘制击球点 - 将随机坐标映射到网球场区域 */}
        {hitPoints.map((point, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              // 将0-100%的随机坐标映射到包括双打边线的整个场地区域内
              left: `${8 + point.x * 0.84}%`, // 从8%到92%的宽度范围
              top: `${10 + point.y * 0.8}%`, // 从10%到90%的高度范围
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: point.type === 'fh' ? '#16a34a' : '#ef4444',
              border: '1px solid white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
              transform: 'translate(-50%, -50%)',
              opacity: 0.9
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
      color: '#1f2937'
    }}>
      <div style={{ width: '100%', maxWidth: '448px', marginTop: '8px' }}>
        {/* 顶部标题 */}
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Training
        </div>

        {/* 训练概览卡片 */}
        <div style={{
          backgroundColor: '#f0fdf4',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 背景装饰 */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            backgroundColor: '#22c55e',
            opacity: 0.1,
            borderRadius: '50%'
          }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <div style={{
                fontSize: '14px',
                color: '#059669',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Hits
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold'
              }}>
                {overviewData.totalHits}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '14px',
                color: '#059669',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Duration
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold'
              }}>
                {overviewData.totalDuration}
              </div>
            </div>

            {/* 网球和发球机图标 */}
            <div style={{
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              {/* 简单的网球图标 */}
              <div style={{
                position: 'relative',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#facc15',
                border: '2px solid #84cc16',
                boxShadow: 'inset 0 0 0 3px rgba(255, 255, 255, 0.3)'
              }} />
            </div>
          </div>
        </div>

        {/* 训练记录列表 */}
        <div style={{ marginBottom: '20px' }}>
          {mockTrainingData.map((record) => (
            <div
              key={record.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* 训练记录头部 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div>🎾</div>
                  {record.mode}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  <div>{record.date}</div>
                  <div>⌛ {record.duration}</div>
                </div>
              </div>

              {/* 击球落点图 */}
              {renderHitMap(record.hitPoints)}

              {/* 训练统计 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#4ade80'
                      }}
                    />
                    <span style={{ fontSize: '12px' }}>FH</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{record.fhCount}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#f97316'
                      }}
                    />
                    <span style={{ fontSize: '12px' }}>BH</span>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{record.bhCount}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#6b7280' }}>speed</span>
                  <span style={{ fontWeight: '500' }}>{record.avgSpeed} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部导航 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '12px'
        }}>
          <nav style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button style={{
              flex: 1,
              padding: '8px',
              textAlign: 'center',
              color: nav === "rally" ? '#059669' : '#6b7280',
              fontWeight: nav === "rally" ? '600' : 'normal',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px'
            }} onClick={() => handleNavClick("rally")}>
              Rally
            </button>
            <button style={{
              flex: 1,
              padding: '8px',
              textAlign: 'center',
              color: nav === "ball-machine" ? '#059669' : '#6b7280',
              fontWeight: nav === "ball-machine" ? '600' : 'normal',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px'
            }} onClick={() => handleNavClick("ball-machine")}>
              Ball Machine
            </button>
            <button style={{
              flex: 1,
              padding: '8px',
              textAlign: 'center',
              color: nav === "training" ? '#059669' : '#6b7280',
              fontWeight: nav === "training" ? '600' : 'normal',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px'
            }} onClick={() => handleNavClick("training")}>
              Training
            </button>
            <button style={{
              flex: 1,
              padding: '8px',
              textAlign: 'center',
              color: nav === "me" ? '#059669' : '#6b7280',
              fontWeight: nav === "me" ? '600' : 'normal',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px'
            }} onClick={() => handleNavClick("me")}>
              我的
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
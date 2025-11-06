import React, { useState, useEffect } from 'react';

interface Coordinates {
  depth: number;
  height: number;
}

interface ReferencePosition {
  position: string;
  depth: string;
  height: string;
}

// 校准弹窗组件
function CalibrationModal({
  isVisible,
  onClose,
  onStartCalibration
}: {
  isVisible: boolean;
  onClose: () => void;
  onStartCalibration: () => void;
}) {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            color: '#6b7280',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          ×
        </button>

        {/* 提示文字 */}
        <div style={{
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a4d2e',
            marginBottom: '16px',
            lineHeight: '1.4'
          }}>
            请在标准网球场上将ACEMATE放置于图示位置:
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#374151',
            lineHeight: '1.6',
            margin: 0
          }}>
            ACEMATE位于底线中央，后轮胎紧贴底线，确保镜头无遮挡;机器放置正确后请点击"开始校准"，整个过程预计3-5mins.
          </p>
        </div>

        {/* 网球场示意图 */}
        <div style={{
          backgroundColor: '#f0fdf4',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '2px solid #bbf7d0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <img
              src={`${process.env.PUBLIC_URL}/calibration_sample.jpeg`}
              alt="网球场校准示意图"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '12px',
                border: '2px solid #86efac',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onError={(e) => {
                // 如果图片加载失败，显示备用文本
                console.error('图片加载失败:', e);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('图片加载成功');
              }}
            />
            <div style={{
              fontSize: '14px',
              color: '#15803d',
              fontWeight: '600',
              marginTop: '16px'
            }}>
              标准网球场校准示意图
            </div>
          </div>
        </div>

        {/* 开始校准按钮 */}
        <button
          onClick={onStartCalibration}
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)'
          }}
        >
          开始校准
        </button>
      </div>
    </div>
  );
}

interface NavItemProps {
  label: string;
  keyName: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ label, keyName, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '8px',
        textAlign: 'center',
        color: active ? '#059669' : '#6b7280',
        fontWeight: active ? '600' : 'normal',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      <div>{label}</div>
    </button>
  );
}

export function DistanceCalibration({ onBack }: { onBack: () => void }) {
  const [nav, setNav] = useState("me");
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [realtimeCoords, setRealtimeCoords] = useState<Coordinates>({ depth: 0, height: 0 });
  const [showCalibrationHint, setShowCalibrationHint] = useState(false);
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const handleNavClick = (page: string) => {
    setNav(page);
    // 可以根据需要调用 onBack 或其他导航处理
  };

  // 参考坐标数据
  const referencePositions: ReferencePosition[] = [
    { position: "同侧发球线中央", depth: "5.48±0.3m", height: "1m" },
    { position: "网球网中央", depth: "12±0.5m", height: "0.914m" },
    { position: "对侧发球线中央", depth: "18.6±0.7m", height: "1m" },
    { position: "底线中央", depth: "24±1m", height: "1m" }
  ];

  // 模拟实时坐标更新
  useEffect(() => {
    if (!isMeasuring) return;

    const interval = setInterval(() => {
      // 模拟坐标变化
      setRealtimeCoords({
        depth: Math.random() * 25,
        height: Math.random() * 3
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isMeasuring]);

  const startMeasurement = () => {
    setIsMeasuring(true);
    setShowCalibrationHint(false);
  };

  const stopMeasurement = () => {
    setIsMeasuring(false);
  };

  const confirmCalibration = () => {
    setShowCalibrationModal(true);
  };

  const handleStartCalibration = () => {
    setShowCalibrationModal(false);
    setIsCalibrating(true);
    // 模拟3-5分钟的校准过程
    setTimeout(() => {
      setIsCalibrating(false);
      setShowCalibrationHint(true);
      setTimeout(() => setShowCalibrationHint(false), 5000);
    }, 4000); // 为了演示，使用4秒
  };

  const closeCalibrationModal = () => {
    if (!isCalibrating) {
      setShowCalibrationModal(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a4d2e 0%, #2d5a3d 50%, #1a4d2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ width: '100%', maxWidth: '448px', marginTop: '8px' }}>
        {/* 顶部导航栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '0 8px'
        }}>
          <button
            onClick={onBack}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            ← 返回
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            网球距离识别
          </h1>
          <div style={{ width: '80px' }}></div>
        </div>

        {/* 网球距离测量区域 */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a4d2e',
            marginBottom: '16px',
            textAlign: 'center'
          }}>网球距离测量</h2>

          {/* 说明文字 */}
          <div style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#15803d', marginBottom: '8px' }}>说明:</div>
            <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
              请先将ACEMATE正对球场放置于底线，点击"开始测量"后手持网球移动，网球坐标实时更新，对比参考坐标确认测量是否准确。
            </div>
          </div>

          {/* 实时坐标显示 */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a4d2e',
              marginBottom: '16px',
              textAlign: 'center'
            }}>网球实时坐标:</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>深度</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: isMeasuring ? '#22c55e' : '#1a4d2e'
                }}>
                  {isMeasuring ? realtimeCoords.depth.toFixed(2) : 'X.XX'} m
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>高度</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: isMeasuring ? '#22c55e' : '#1a4d2e'
                }}>
                  {isMeasuring ? realtimeCoords.height.toFixed(2) : 'X.XX'} m
                </div>
              </div>
            </div>
          </div>

          {/* 参考坐标表格 */}
          <div style={{
            backgroundColor: '#f1f5f9',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a4d2e',
              marginBottom: '16px',
              textAlign: 'center'
            }}>参考坐标:</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#e2e8f0' }}>
                    <th style={{
                      padding: '12px 8px',
                      textAlign: 'left',
                      color: '#374151',
                      fontWeight: '600',
                      borderBottom: '2px solid #cbd5e1'
                    }}>参考位置</th>
                    <th style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#374151',
                      fontWeight: '600',
                      borderBottom: '2px solid #cbd5e1'
                    }}>深度</th>
                    <th style={{
                      padding: '12px 8px',
                      textAlign: 'center',
                      color: '#374151',
                      fontWeight: '600',
                      borderBottom: '2px solid #cbd5e1'
                    }}>高度</th>
                  </tr>
                </thead>
                <tbody>
                  {referencePositions.map((position, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{
                        padding: '12px 8px',
                        color: '#374151',
                        fontWeight: '500'
                      }}>{position.position}</td>
                      <td style={{
                        padding: '12px 8px',
                        color: '#374151',
                        textAlign: 'center'
                      }}>{position.depth}</td>
                      <td style={{
                        padding: '12px 8px',
                        color: '#374151',
                        textAlign: 'center'
                      }}>{position.height}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 测量按钮 */}
          <button
            onClick={isMeasuring ? stopMeasurement : startMeasurement}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '16px',
              background: isMeasuring
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isMeasuring
                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                : '0 6px 20px rgba(34, 197, 94, 0.4)'
            }}
          >
            {isMeasuring ? '停止测量' : '开始测量'}
          </button>
        </div>

        {/* 相机校准区域 */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a4d2e',
            marginBottom: '16px',
            textAlign: 'center'
          }}>相机校准</h2>

          {/* 校准提示 */}
          <div style={{
            backgroundColor: '#fef3c7',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid #fcd34d'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#d97706', marginBottom: '8px' }}>提示:</div>
            <div style={{ fontSize: '13px', color: '#92400e', lineHeight: '1.5' }}>
              当网球实时坐标与参考坐标差距过大时才需要相机校准，点击确认校准后请按照提示摆放ACEMATE。
            </div>
          </div>

          {/* 校准确认提示 */}
          {(showCalibrationHint || isCalibrating) && (
            <div style={{
              backgroundColor: isCalibrating ? '#fef3c7' : '#dbeafe',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              border: `1px solid ${isCalibrating ? '#fcd34d' : '#93c5fd'}`
            }}>
              <div style={{
                fontSize: '13px',
                color: isCalibrating ? '#92400e' : '#1e40af',
                lineHeight: '1.5'
              }}>
                {isCalibrating ? (
                  <>
                    ⏳ 正在校准中，请耐心等待...<br/>
                    校准进度: 进行中<br/>
                    预计剩余时间: 3-5分钟<br/>
                    请勿移动ACEMATE设备
                  </>
                ) : (
                  <>
                    ✓ 校准完成！<br/>
                    请重启ACEMATE设备以应用新的校准参数
                  </>
                )}
              </div>
            </div>
          )}

          <button
            onClick={confirmCalibration}
            disabled={isCalibrating}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '16px',
              background: isCalibrating
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              cursor: isCalibrating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isCalibrating
                ? '0 4px 12px rgba(156, 163, 175, 0.3)'
                : '0 4px 16px rgba(59, 130, 246, 0.3)'
            }}
          >
            {isCalibrating ? '校准中...' : '确认校准'}
          </button>
        </div>

        {/* 添加额外间距来匹配BallMachine页面的内容高度 */}
        <div style={{ height: '200px' }}></div>

        {/* 底部导航 - 与BallMachineUI完全一致 */}
        <div style={{
          marginTop: '24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '12px'
        }}>
          <nav style={{ display: 'flex', justifyContent: 'space-around' }}>
            <NavItem label="Rally" keyName="rally" active={nav === "rally"} onClick={() => handleNavClick("rally")} />
            <NavItem label="Ball Machine" keyName="ball-machine" active={nav === "ball-machine"} onClick={() => handleNavClick("ball-machine")} />
            <NavItem label="Training" keyName="training" active={nav === "training"} onClick={() => handleNavClick("training")} />
            <NavItem label="Me" keyName="me" active={nav === "me"} onClick={() => handleNavClick("me")} />
          </nav>
        </div>
      </div>

      {/* 校准弹窗 */}
      <CalibrationModal
        isVisible={showCalibrationModal}
        onClose={closeCalibrationModal}
        onStartCalibration={handleStartCalibration}
      />
    </div>
  );
}
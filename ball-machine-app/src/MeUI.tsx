import React, { useState } from 'react';
import { DistanceCalibration } from './DistanceCalibration';
import { FeedbackForm } from './FeedbackForm';
import { UserManual } from './UserManual';

export function MePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [nav, setNav] = useState("me");
  const [showDistanceCalibration, setShowDistanceCalibration] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showUserManual, setShowUserManual] = useState(false);

  const handleNavClick = (page: string) => {
    setNav(page);
    onNavigate(page);
  };

  const handleDistanceCalibrationClick = () => {
    setShowDistanceCalibration(true);
  };

  const handleBackToMe = () => {
    setShowDistanceCalibration(false);
  };

  const handleFeedbackClick = () => {
    setShowFeedbackForm(true);
  };

  const handleBackToMeFromFeedback = () => {
    setShowFeedbackForm(false);
  };

  const handleUserManualClick = () => {
    setShowUserManual(true);
  };

  const handleBackToMeFromManual = () => {
    setShowUserManual(false);
  };

  // 如果显示距离测量页面，显示DistanceCalibration组件
  if (showDistanceCalibration) {
    return <DistanceCalibration onBack={handleBackToMe} />;
  }

  // 如果显示用户反馈页面，显示FeedbackForm组件
  if (showFeedbackForm) {
    return <FeedbackForm onBack={handleBackToMeFromFeedback} />;
  }

  // 如果显示用户手册页面，显示UserManual组件
  if (showUserManual) {
    return <UserManual onBack={handleBackToMeFromManual} />;
  }

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
      {/* 内容包装器 - 与BallMachineUI保持一致 */}
      <div style={{ width: '100%', maxWidth: '448px', marginTop: '8px' }}>
        {/* 顶部示意图区域 - 只保留连接状态，删除"主画板"标题 */}
        <div style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#ef4444',
                borderRadius: '50%'
              }} />
              <span style={{ color: '#374151', fontWeight: '500' }}>Disconnected</span>
            </div>
          </div>
        </div>

        {/* 控制区 - 删除"手动控制"标题，保留按钮 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '48px'
          }}>
            {/* 方向控制 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              <div></div>
              <button style={{
                backgroundColor: '#22c55e',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}>↑</button>
              <div></div>
              <button style={{
                backgroundColor: '#22c55e',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}>←</button>
              <div></div>
              <button style={{
                backgroundColor: '#22c55e',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}>→</button>
              <div></div>
              <button style={{
                backgroundColor: '#22c55e',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}>↓</button>
              <div></div>
            </div>

            {/* 旋转控制 */}
            <div style={{
              display: 'flex',
              gap: '16px'
            }}>
              <button style={{
                backgroundColor: '#4ade80',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}>⟲</button>
              <button style={{
                backgroundColor: '#4ade80',
                color: 'white',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer'
              }}>⟳</button>
            </div>
          </div>
        </div>

        {/* 功能卡片区 - 删除标题，保留内容 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            {[
              { label: "ACEMATE用户手册", action: handleUserManualClick },
              { label: "用户反馈", action: handleFeedbackClick },
              { label: "网球距离测量与校正", action: handleDistanceCalibrationClick },
              { label: "固件版本", action: () => alert("固件版本功能开发中...") }
            ].map((item, index) => (
              <div
                key={index}
                onClick={item.action}
                style={{
                  width: '100%',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  fontWeight: '500',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
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
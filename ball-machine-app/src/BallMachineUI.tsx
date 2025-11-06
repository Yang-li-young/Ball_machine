import React, { useState } from "react";
import { MePage } from './MeUI';

// 球组数据结构（内部 id 用于稳定性，显示序号使用数组索引+1）
const defaultGroup = (id: number) => ({
  id,
  interval: 2, // s, 1-6 step 0.5
  upperRpm: 5, // 1-10 step 1 (速度无量纲)
  lowerRpm: 0, // -5 to 5 (旋转：-5下旋到5上旋，0为平击)
  pitch: 30, // 20-40 step 2
  direction: 0, // -50..50 step 5
});

interface Group {
  id: number;
  interval: number;
  upperRpm: number;
  lowerRpm: number;
  pitch: number;
  direction: number;
}

export default function BallMachineUI() {
  const [groups, setGroups] = useState<Group[]>([]);
  // selectedIndex 用于保证显示编号为 1,2,3...（基于数组位置）
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [nav, setNav] = useState("ball-machine");
  // 全局发球时间间隔（作用整个球组）
  const [globalInterval, setGlobalInterval] = useState(2);

  // 安全取值
  const selectedGroup = groups[selectedIndex];

  function addGroup() {
    if (groups.length >= 12) return; // 限制最大12个球组
    const newGroups = [...groups, defaultGroup(Date.now())];
    setGroups(newGroups);
    setSelectedIndex(newGroups.length - 1);
  }

  function removeSelected() {
    if (groups.length === 0) return; // 只有在完全没球时才不执行删除
    const newGroups = groups.filter((_, i) => i !== selectedIndex);
    setGroups(newGroups);
    // 保证选中索引有效，优先选中同一位置的下一项或最后一项
    const newIndex = Math.min(selectedIndex, Math.max(0, newGroups.length - 1));
    setSelectedIndex(newIndex);
  }

  function updateSelected(partial: Partial<Group>) {
    setGroups(groups.map((g, i) => (i === selectedIndex ? { ...g, ...partial } : g)));
  }

  function clearAllGroups() {
    // 清除所有球组，设置为空数组
    setGroups([]);
    setSelectedIndex(0);
  }

  // 当 direction 改变时，让发球机与箭头一起旋转
  const rotation = selectedGroup ? -selectedGroup.direction : 0;

  // 计算发球方向示意线长度
  // 基础长度100px，速度增加时长度增加（每个速度单位+15px），俯仰角度增加时长度减小（每度-3px）
  const calculateArrowLength = () => {
    if (!selectedGroup) return 100; // 默认基础长度100px
    const baseLength = 100;
    const speedBonus = selectedGroup.upperRpm * 15; // 速度1-10，每个单位增加15px
    const pitchPenalty = (selectedGroup.pitch - 20) * 3; // 俯仰角度20-40，超过20度的每度减少3px
    return Math.max(40, Math.min(250, baseLength + speedBonus - pitchPenalty)); // 限制在40-250px范围内
  };

  // 简易开始/停止逻辑
  function toggleRun() {
    setRunning(!running);
  }

  // 如果导航到Me页面，显示MePage组件
  if (nav === "me") {
    return <MePage onNavigate={setNav} />; // Updated with navigation handler
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
      {/* 顶部示意图 */}
      <div style={{ width: '100%', maxWidth: '448px', marginTop: '8px' }}>
        <div style={{
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <button style={{
              padding: '4px 12px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}>Disconnect</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '320px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {/* 上半部分：球场显示区域 */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '120px', // 减小高度从200px到120px
                backgroundColor: '#bbf7d0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* 网线（中线） - 已隐藏 */}
                {/* <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '4px',
                  backgroundColor: 'black'
                }}></div> */}

              {/* 左边线 - 已隐藏 */}
              {/* <div style={{
                position: 'absolute',
                left: '32px',
                top: '24px',
                bottom: '24px',
                width: '2px',
                backgroundColor: 'white',
                opacity: 0.9
              }}></div> */}

              {/* 右边线 - 已隐藏 */}
              {/* <div style={{
                position: 'absolute',
                right: '32px',
                top: '24px',
                bottom: '24px',
                width: '2px',
                backgroundColor: 'white',
                opacity: 0.9
              }}></div> */}

              {/* 底线（上/下） - 已隐藏 */}
              {/* <div style={{
                position: 'absolute',
                left: '32px',
                right: '32px',
                top: '24px',
                height: '2px',
                backgroundColor: 'white',
                opacity: 0.9
              }}></div>
              <div style={{
                position: 'absolute',
                left: '32px',
                right: '32px',
                bottom: '24px',
                height: '2px',
                backgroundColor: 'white',
                opacity: 0.9
              }}></div> */}

              {/* 发球线/服务线 - 已隐藏 */}
              {/* <div style={{
                position: 'absolute',
                left: '32px',
                right: '32px',
                top: '80px',
                height: '2px',
                backgroundColor: 'white',
                opacity: 0.9
              }}></div>
              <div style={{
                position: 'absolute',
                left: '32px',
                right: '32px',
                bottom: '80px',
                height: '2px',
                backgroundColor: 'white',
                opacity: 0.9
              }}></div> */}

              {/* 中心服务线 - 已隐藏 */}
              {/* <div style={{
                position: 'absolute',
                top: '80px',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                backgroundColor: 'white',
                opacity: 0.9
              }}></div> */}

              {/* 发球机容器 */}
              <div
                style={{
                  position: 'absolute',
                  left: '24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* 发球机图标 - 固定不旋转 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <img
                    src="/img_ballmachine.png"
                    alt="发球机"
                    width="40"
                    height="40"
                    style={{
                      display: 'block',
                      transformOrigin: 'center bottom'
                    }}
                  />
                </div>

                {/* 箭头 - 水平指向右侧 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '64px', // 发球机右侧40px + 一些间距
                    width: `${calculateArrowLength()}px`, // 动态计算箭头长度
                    height: '2px',
                    backgroundColor: '#215ad3ff',
                    transformOrigin: 'left center',
                    transition: 'all 0.3s ease',
                    transform: `
                      translateY(-50%)
                      rotate(${rotation}deg)
                    `
                  }}
                >
                  {/* 箭头头部 - 指向右端 */}
                  <div
                    style={{
                      position: 'absolute',
                      right: '-8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 0,
                      height: 0,
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderLeft: '8px solid #111827'
                    }}
                  />
                </div>
              </div>

              {/* 左右发球点 - 已隐藏 */}
              {/* <div style={{
                position: 'absolute',
                left: '4px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'black'
                }}></div>
              </div>
              <div style={{
                position: 'absolute',
                right: '4px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'black'
                }}></div>
              </div> */}
            </div>

              {/* 下半部分：ball_height图片显示区域 */}
              <div style={{
                width: '100%',
                height: '76px', // 计算为总高度200-球场120-间距4=76px
                backgroundColor: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid #e5e7eb'
              }}>
                <img
                  src="/ball_height.jpeg"
                  alt="Ball Height Reference"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '6px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 中部球区域与球组控制 */}
        <div style={{
          marginTop: '16px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '16px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: '#fdf2f8',
            color: '#374151'
          }}>预设训练方案</div>

          <div style={{ marginTop: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>Serve Sequence</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* 一键清除按钮 */}
                <button
                  onClick={clearAllGroups}
                  disabled={groups.length === 0}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: groups.length === 0 ? '#f9fafb' : '#fef2f2',
                    border: groups.length === 0 ? '1px solid #e5e7eb' : '1px solid #fecaca',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '12px',
                    color: groups.length === 0 ? '#9ca3af' : '#dc2626',
                    cursor: groups.length === 0 ? 'not-allowed' : 'pointer',
                    marginRight: '8px'
                  }}
                  title={groups.length === 0 ? "没有球组可清除" : "清除所有球组"}
                >
                  一键清除
                </button>
                <button
                  onClick={addGroup}
                  disabled={groups.length >= 12}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: groups.length >= 12 ? '#f9fafb' : 'white',
                    border: groups.length >= 12 ? '1px solid #e5e7eb' : '1px solid #d1d5db',
                    borderRadius: '9999px',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '20px',
                    cursor: groups.length >= 12 ? 'not-allowed' : 'pointer',
                    opacity: groups.length >= 12 ? 0.5 : 1
                  }}
                  title={groups.length >= 12 ? "已达到最大球组数量" : "添加球组"}
                >
                  +
                </button>
              </div>
            </div>

            {/* 球组网格：两行每行6个，最多12个 */}
            {groups.length === 0 ? (
              // 空状态提示
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '2px dashed #d1d5db'
              }}>
                <div style={{
                  fontSize: '48px',
                  color: '#9ca3af',
                  marginBottom: '16px'
                }}>🎾</div>
                <div style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>还没有添加训练球组</div>
                <div style={{
                  fontSize: '14px',
                  color: '#9ca3af'
                }}>
                  点击右上角的 <strong>"+"</strong> 按钮添加第一个球
                </div>
              </div>
            ) : (
              // 球组网格布局
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '16px',
                padding: '4px'
              }}>
                {groups.map((g, i) => (
                  <div key={g.id} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setSelectedIndex(i)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        backgroundColor: i === selectedIndex ? 'white' : '#f3f4f6',
                        border: i === selectedIndex ? '2px solid #34d399' : 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {i + 1}
                    </button>

                    {/* 删除标识：当该编号被选中时显示在右上角 */}
                    {i === selectedIndex && (
                      <button
                        onClick={removeSelected}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          cursor: 'pointer',
                          border: 'none'
                        }}
                        title="删除当前球"
                      >
                        -
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}


            {/* 参数区域（默认展示） */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 发球方向 - 移到第一位 */}
              <ParamRow
                label="发球方向 (°)"
                min={-50}
                max={50}
                step={5}
                value={selectedGroup?.direction || 0}
                onChange={(v) => selectedGroup && updateSelected({ direction: v })}
                format={(v) => `${v}°`}
              />

              <ParamRow
                label="速度"
                min={1}
                max={10}
                step={1}
                value={selectedGroup?.upperRpm || 5}
                onChange={(v) => selectedGroup && updateSelected({ upperRpm: v })}
                format={(v) => `速度 ${v}`}
              />

              <ParamRow
                label="旋转"
                min={-5}
                max={5}
                step={1}
                value={selectedGroup?.lowerRpm || 0}
                onChange={(v) => selectedGroup && updateSelected({ lowerRpm: v })}
                format={(v) => {
                  if (v < 0) return `下旋 ${Math.abs(v)}`;
                  if (v > 0) return `上旋 ${v}`;
                  return '平击球';
                }}
              />

              <ParamRow
                label="俯仰角度 (°)"
                min={20}
                max={40}
                step={2}
                value={selectedGroup?.pitch || 30}
                onChange={(v) => selectedGroup && updateSelected({ pitch: v })}
                format={(v) => `${v}°`}
              />

              {/* 发球时间间隔 - 改为全局控制，移到最后 */}
              <ParamRow
                label="发球时间间隔 (s)"
                min={1}
                max={6}
                step={0.5}
                value={globalInterval}
                onChange={(v) => setGlobalInterval(v)}
                format={(v) => v.toFixed(1)}
                disabled={groups.length === 0} // 没有球时禁用
              />

              {/* Start/Stop 按钮 */}
              <div style={{ marginTop: '12px' }}>
                <button
                  onClick={toggleRun}
                  disabled={!selectedGroup || groups.length === 0}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '500',
                    backgroundColor: (!selectedGroup || groups.length === 0) ? '#9ca3af' : (running ? '#dc2626' : 'black'),
                    border: 'none',
                    cursor: (!selectedGroup || groups.length === 0) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {running ? "⏸ Stop" : "⏵ Start"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div style={{
          marginTop: '24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          padding: '12px'
        }}>
          <nav style={{ display: 'flex', justifyContent: 'space-around' }}>
            <NavItem label="Rally" keyName="rally" active={nav === "rally"} onClick={() => setNav("rally")} />
            <NavItem label="Ball Machine" keyName="ball-machine" active={nav === "ball-machine"} onClick={() => setNav("ball-machine")} />
            <NavItem label="Training" keyName="training" active={nav === "training"} onClick={() => setNav("training")} />
            <NavItem label="Me" keyName="me" active={nav === "me"} onClick={() => setNav("me")} />
          </nav>
        </div>
      </div>
    </div>
  );
}

interface ParamRowProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  disabled?: boolean;
}

function ParamRow({ label, min, max, step, value, onChange, format, disabled }: ParamRowProps) {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px'
      }}>
        <div style={{ fontSize: '14px' }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: '500' }}>
          {format ? format(value) : value}
        </div>
      </div>
      <input
        type="range"
        style={{
          width: '100%',
          WebkitAppearance: 'none',
          appearance: 'none',
          height: '6px',
          borderRadius: '3px',
          background: disabled ? '#d1d5db' : '#e5e7eb',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          if (!disabled) {
            const v = Number(e.target.value);
            onChange(v);
          }
        }}
      />
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
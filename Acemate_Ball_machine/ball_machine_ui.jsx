import React, { useState, useEffect } from "react";

// 单文件 React 组件（使用 Tailwind CSS 类）
// 默认导出组件：BallMachineUI

export default function BallMachineUI() {
  // 球组数据结构（内部 id 用于稳定性，显示序号使用数组索引+1）
  const defaultGroup = (id) => ({
    id,
    interval: 2, // s, 1-6 step 0.5
    upperRpm: 3500, // 2000-7000 step 500
    lowerRpm: 3500, // 2000-7000
    pitch: 30, // 20-40 step 2
    direction: 0, // -50..50 step 5
  });

  const [groups, setGroups] = useState([defaultGroup(Date.now())]);
  // selectedIndex 用于保证显示编号为 1,2,3...（基于数组位置）
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [nav, setNav] = useState("ball-machine");

  // 安全取值
  const selectedGroup = groups[selectedIndex] || groups[0];

  function addGroup() {
    const newGroups = [...groups, defaultGroup(Date.now())];
    setGroups(newGroups);
    setSelectedIndex(newGroups.length - 1);
  }

  function removeSelected() {
    if (groups.length <= 1) return;
    const newGroups = groups.filter((_, i) => i !== selectedIndex);
    setGroups(newGroups);
    // 保证选中索引有效，优先选中同一位置的下一项或最后一项
    const newIndex = Math.min(selectedIndex, Math.max(0, newGroups.length - 1));
    setSelectedIndex(newIndex);
  }

  function updateSelected(partial) {
    setGroups(groups.map((g, i) => (i === selectedIndex ? { ...g, ...partial } : g)));
  }

  // 当 direction 改变时，让发球机与箭头一起旋转
  const rotation = selectedGroup ? -selectedGroup.direction : 0;

  // 简易开始/停止逻辑
  function toggleRun() {
    setRunning(!running);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 text-gray-800">
      {/* 顶部示意图 */}
      <div className="w-full max-w-md mt-2">
        <div className="relative bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <button className="px-3 py-1 bg-gray-200 rounded">Disconnect</button>
            <div className="text-sm text-gray-500"> </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-64 bg-green-200 rounded-lg flex items-center justify-center">
              {/* 网线（中线） */}
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-black"></div>

              {/* 左边线 */}
              <div className="absolute left-8 top-6 bottom-6 w-0.5 bg-white opacity-90"></div>

            {/* 右边线 */}
              <div className="absolute right-8 top-6 bottom-6 w-0.5 bg-white opacity-90"></div>

            {/* 底线（上/下） - 网球场应有两条底线 */}
              <div className="absolute left-8 right-8 top-6 h-0.5 bg-white opacity-90"></div>
              <div className="absolute left-8 right-8 bottom-6 h-0.5 bg-white opacity-90"></div>

            {/* 发球线/服务线（靠近中场的两条线） */}
              <div className="absolute left-8 right-8 top-20 h-0.5 bg-white opacity-90"></div>
            <div className="absolute left-8 right-8 bottom-20 h-0.5 bg-white opacity-90"></div>

            {/* 中心服务线（将发球区分左右的垂直线）- 延长对齐发球线 */}
            <div className="absolute top-20 bottom-20 left-1/2 transform -translate-x-1/2 w-0.5 bg-white opacity-90"></div>

              {/* 发球机 3D旋转容器 */}
              <div
                className="absolute top-6"
                style={{
                  left: '50%',
                  transform: 'translateX(-50%)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* 发球机图标 - Y轴旋转 */}
                <div
                  className="flex flex-col items-center"
                  style={{
                    transform: `rotateY(${rotation}deg)`,
                    transformOrigin: 'center bottom',
                    transition: 'transform 0.3s ease',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <img
                    src="../img/img_ballmachine.png"
                    alt="发球机"
                    width="40"
                    height="40"
                    style={{
                      display: 'block',
                      transformOrigin: 'center bottom'
                    }}
                  />
                </div>

                {/* 箭头 - 简单旋转，连接到发球机 */}
                <div
                  className="absolute"
                  style={{
                    top: '65px',
                    left: '50%',
                    width: '2px',
                    height: '120px',
                    backgroundColor: '#215ad3ff',
                    transformOrigin: 'center top',
                    transition: 'all 0.3s ease',
                    transform: `
                      translateX(-50%)
                      rotate(${rotation}deg)
                    `
                  }}
                >
                  {/* 箭头头部 */}
                  <div
                    className="absolute"
                    style={{
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: '8px solid #111827'
                    }}
                  />
                </div>
              </div>

              {/* 左右发球点（示意） */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full bg-black"></div>
              </div>
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full bg-black"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 中部球区域与球组控制 */}
        <div className="mt-4 bg-white rounded-xl shadow p-4">
          <div className="text-center py-3 rounded-md bg-pink-50 text-gray-700">预设训练方案</div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Serve Sequence</div>
              <div className="flex items-center">
                <button
                  onClick={addGroup}
                  className="ml-2 px-3 py-1 bg-white border rounded-full shadow text-xl"
                  title="Add group"
                >
                  +
                </button>
              </div>
            </div>

            {/* 球组编号：显示为 1,2,3...；删除标识出现在对应圆形右上角 */}
            <div className="flex gap-4 items-center mb-4 overflow-x-auto">
              {groups.map((g, i) => (
                <div key={g.id} className="relative">
                  <button
                    onClick={() => setSelectedIndex(i)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow ${
                      i === selectedIndex ? "bg-white border-2 border-green-400" : "bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>

                  {/* 删除标识：当该编号被选中且有多个组时显示在右上角 */}
                  {groups.length > 1 && i === selectedIndex && (
                    <button
                      onClick={removeSelected}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs shadow"
                      title="删除当前球组"
                    >
                      -
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 参数区域（只显示被选中的组） */}
            <div className="space-y-4">
              <ParamRow
                label="发球时间间隔 (s)"
                min={1}
                max={6}
                step={0.5}
                value={selectedGroup.interval}
                onChange={(v) => updateSelected({ interval: v })}
                format={(v) => v.toFixed(1)}
              />

              <ParamRow
                label="上发球轮转速 (rpm)"
                min={2000}
                max={7000}
                step={500}
                value={selectedGroup.upperRpm}
                onChange={(v) => updateSelected({ upperRpm: v })}
                format={(v) => `${v} rpm`}
              />

              <ParamRow
                label="下发球轮转速 (rpm)"
                min={2000}
                max={7000}
                step={500}
                value={selectedGroup.lowerRpm}
                onChange={(v) => updateSelected({ lowerRpm: v })}
                format={(v) => `${v} rpm`}
              />

              <ParamRow
                label="俯仰角度 (°)"
                min={20}
                max={40}
                step={2}
                value={selectedGroup.pitch}
                onChange={(v) => updateSelected({ pitch: v })}
                format={(v) => `${v}°`}
              />

              <ParamRow
                label="发球方向 (°)"
                min={-50}
                max={50}
                step={5}
                value={selectedGroup.direction}
                onChange={(v) => updateSelected({ direction: v })}
                format={(v) => `${v}°`}
              />

              {/* Start/Stop 按钮 */}
              <div className="mt-3">
                <button
                  onClick={toggleRun}
                  className={`w-full py-4 rounded-xl text-white text-lg font-medium ${running ? "bg-red-600" : "bg-black"}`}
                >
                  {running ? "⏸ Stop" : "⏵ Start"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div className="mt-6 bg-white rounded-xl shadow p-3">
          <nav className="flex justify-around">
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

function ParamRow({ label, min, max, step, value, onChange, format }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="text-sm">{label}</div>
        <div className="text-sm font-medium">{format ? format(value) : value}</div>
      </div>
      <input
        type="range"
        className="w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(v);
        }}
      />
    </div>
  );
}

function NavItem({ label, keyName, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-center ${active ? "text-green-600 font-semibold" : "text-gray-500"}`}
    >
      <div className="text-sm">{label}</div>
    </button>
  );
}



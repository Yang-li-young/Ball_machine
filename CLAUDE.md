# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个网球发球机控制系统，包含多种实现方式：

1. **React TypeScript 应用** (`ball-machine-app/`) - 控制ACEMATE网球机器人的现代化Web界面
2. **静态HTML/CSS/JS** (`index.html`, `style.css`, `script.js`) - 可直接在浏览器中打开的兼容版本
3. **React JSX 组件** (`Acemate_Ball_machine/ball_machine_ui.jsx`) - 原始独立组件

## 常用命令

### React开发 (ball-machine-app/)
```bash
# 启动开发服务器 (默认端口3000)
cd ball-machine-app && npm start

# 在指定端口启动 (如果端口3000被占用)
cd ball-machine-app && PORT=3003 npm start

# 生产构建
cd ball-machine-app && npm run build

# 运行测试
cd ball-machine-app && npm test

# 以监视模式运行单个测试
cd ball-machine-app && npm test -- --watch --testNamePattern="specific-test"
```

### 静态HTML版本
```bash
# 直接在浏览器中打开
start index.html

# 或打开React版本
start react_version.html
```

## 架构

### React应用结构
- **App.tsx** - 入口文件，渲染BallMachineUI组件
- **BallMachineUI.tsx** - 包含所有网球机控制逻辑的主组件
- **index.css** - 基础样式 (React应用使用内联样式而非CSS类)

### 状态管理模式
应用使用React内置状态管理，具有以下关键模式：

```typescript
// 核心数据结构
interface Group {
  id: number;           // 唯一标识符 (时间戳)
  interval: number;     // 发球间隔秒数 (1-6, 步长0.5)
  upperRpm: number;     // 上轮转速 (2000-7000, 步长500)
  lowerRpm: number;     // 下轮转速 (2000-7000, 步长500)
  pitch: number;        // 俯仰角度 (20-40, 步长2)
  direction: number;    // 发球方向 (-50到50, 步长5)
}

// 状态管理
const [groups, setGroups] = useState<Group[]>([defaultGroup(Date.now())]);
const [selectedIndex, setSelectedIndex] = useState(0); // 数组索引，不是组ID
const [running, setRunning] = useState(false);
const [nav, setNav] = useState("ball-machine");
```

### 关键组件函数
- **addGroup()** - 创建具有唯一时间戳ID的新组
- **removeSelected()** - 删除当前选中的组 (最少保留1个组)
- **updateSelected()** - 更新当前选中组的参数
- **toggleRun()** - 开始/停止训练序列

### UI组件
- **ParamRow** - 可重用的滑块组件，带标签和格式化值显示
- **NavItem** - 底部导航按钮组件
- 球场可视化，带有基于方向参数的旋转机器指示器

### 样式方案
React应用使用内联样式 (style对象) 而非CSS类。这样做是为了避免Tailwind CSS配置问题。静态HTML版本使用传统CSS类。

## 网球机背景

此系统控制ACEMATE网球机器人，具有两种操作模式：

### Rally模式
- 5x5网格定位系统 (总共25个位置)
- 机器人自动追踪和回球
- 模拟真实网球比赛

### 发球机模式
- 传统发球机功能
- 用户控制位置、旋转、速度和轨迹
- 参数：上/下轮转速、俯仰角度、发球方向

### 硬件集成
UI参数映射到物理硬件：
- **upperRpm/lowerRpm** - 控制球的旋转和速度
- **pitch** - 垂直发射角度 (过网高度)
- **direction** - 水平发射角度 (球场定位)
- **interval** - 发球间隔时间

## 开发注意事项

### 测试
项目包含一个默认的React测试 (`App.test.tsx`)，当前失败是因为它期望默认的React模板内容。可以更新该测试以匹配实际的BallMachineUI组件，如果不需要也可以删除。

```bash
# 运行一次测试
cd ball-machine-app && npm test -- --watchAll=false

# 以监视模式运行测试
cd ball-machine-app && npm test
```

### 端口冲突
常用端口可能被占用 (3000-3002)。使用备用端口：
```bash
PORT=3003 npm start
```

### React版本 vs 静态版本
- 开发时使用React版本，支持热重载
- 直接在浏览器中打开时使用静态HTML版本，无需构建工具
- 两个版本保持完全相同的功能

### 组件架构
应用设计为单一的综合组件，而不是拆分为更小的组件。这种方法是为了保持来自独立JSX文件的原始结构。

### 样式决策
React应用使用内联样式 (style对象) 而非CSS类。这样做是为了避免Tailwind CSS配置问题。虽然devDependencies中包含Tailwind CSS包，但在当前实现中并未主动使用。
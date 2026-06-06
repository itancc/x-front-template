# X Front Template

企业级前端后台模板，技术栈为 Vue 3 + TypeScript + TSX + Vite + Element Plus + Pinia + Vue Router。

当前版本已经提供可直接作为项目起点的骨架能力：

- 登录页与登录态管理（Mock 登录）
- 应用壳布局（侧栏 + 顶栏 + 面包屑 + 多标签页）
- 路由元信息与守卫（登录鉴权、访客页、权限路由）
- 路由级 + 按钮级权限示例
- 主题切换（日间/夜间）
- 用户管理示例（基于 XTable 的筛选、分页、排序、多选、操作列）
- 标准表单页、标准详情页、消息待办页模板
- 系统设置、403、404 页面
- 统一请求层（axios + token 注入 + 响应解包）
- Mock / 真实接口双轨切换
- GET 请求自动重试（仅网络异常/5xx）
- users 模块 repository 分层（mock/remote 实现可替换）
- 写操作可选 `Idempotency-Key` 防重
- SearchPanel、空态/错误态/骨架屏统一组件
- XTable 列配置工厂（预设 selection/index/text/date/actions）
- 支持后端路由配置驱动的动态路由与动态菜单
- 新增 XForm / XModal / XChart 二次封装组件

## 快速开始

```bash
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
```

工程规范命令：

```bash
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

首次克隆后可执行一次 `pnpm prepare`，启用本地 Git Hooks（pre-commit + commit-msg）。

## 环境变量

复制 `.env.example` 为 `.env.development` 或 `.env.production`，按需调整：

- `VITE_API_MODE=mock | remote`：接口模式
- `VITE_API_BASE_URL=/api`：远程接口基地址

当 `VITE_API_MODE=mock` 时，用户模块会走本地 service mock；设置为 `remote` 后走真实 HTTP 请求。

请求层约定：

- `httpRequest`：标准请求（默认不重试）
- `httpRequestWithRetry`：带重试请求（默认仅 `GET`，且仅网络异常或 `5xx`）
- `httpRequest(..., { autoIdempotencyKey: true })`：为写操作自动注入 `Idempotency-Key`
- `mapTableQueryParams`：统一分页/排序参数映射，避免各仓储层重复拼装 query

## 默认账号

- admin：完整权限
- viewer：工作台 + 消息待办权限（访问用户管理/系统设置等会被拦截到 403）

## 项目结构

```text
src/
	App.vue                        # 应用根组件，仅承载路由
	main.ts                        # 应用入口，挂载 Pinia + Router
	style.css                      # 全局主题与通用样式变量
	router/
		index.ts                     # Router 实例 + 全局守卫
		routes.ts                    # 静态路由（登录、异常页、工作台）
		async-routes.ts              # 动态路由注册表（由后端配置驱动）
	stores/
		auth.ts                      # 登录态与权限
		ui.ts                        # 主题、侧栏状态、访问标签页
	layouts/
		default/                     # 默认后台布局壳
	features/
		auth/pages/                  # 登录页
		dashboard/pages/             # 工作台页
		showcase/pages/              # 通用组件封装示例页
		users/                       # 用户管理（页 + 数据）
			services/                  # 业务 service（请求与 mock 双轨）
			repositories/              # 仓储接口 + mock/remote 实现
		system/pages/                # 系统设置页
		exception/pages/             # 403/404
	components/
		XTable/                      # 配置化 TSX 表格组件
		XForm/                       # Schema 驱动表单封装
		XModal/                      # 统一弹窗封装
		XChart/                      # ECharts 图表封装
```

## 路由元信息约定

`RouteMeta` 扩展字段：

- `title`: 页面标题
- `requiresAuth`: 需要登录
- `guestOnly`: 仅访客可访问（例如登录页）
- `permission`: 页面所需权限点
- `affix`: 标签页固定
- `hidden`: 隐藏菜单项
- `fullScreen`: 全屏页面（不走后台布局）

## 权限模型（当前）

- 路由级：通过 `meta.permission` + 守卫进行拦截
- 按钮级：通过 `XTableAction.permission` 控制显隐
- 指令级：通过 `v-permission` 控制任意元素显隐

## 下一步建议

- 加入 CI 与质量门禁（lint/build/test）

## Docker 运行与部署

默认 `Dockerfile` 为生产模式多阶段构建：Node 构建静态资源，Nginx 托管产物并支持 SPA 路由回退。

生产运行：

```bash
docker compose up --build -d
```

访问地址：`http://localhost:8080`

开发模式（热更新，挂载源码）：

```bash
docker compose --profile dev up --build
```

访问地址：`http://localhost:5678`

export type Project = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  status: "building" | "exploring" | "showcase";
  category: "应用工具" | "交互实验" | "视觉创作";
  audience?: string;
  steps?: { title: string; text: string }[];
  preview?: "workspace" | "diagram" | "art";
  demo?: string;
  image?: { src: string; width: number; height: number; caption: string };
  video?: string;
  gallery?: { src: string; title: string; width: number; height: number }[];
  overview: string;
  focus: string[];
};

export const projects: Project[] = [
  {
    slug: "campus-takeout", title: "Campus Takeout", description: "面向校园场景的微信点餐小程序。", stack: ["Vue", "Node.js", "微信小程序"], status: "building",
    category: "应用工具", audience: "校园点餐用户。完整流程需要微信环境与后端服务；这里展示已有界面。",
    steps: [{ title: "找到想吃的", text: "按分类浏览商品，在菜单中查看图片和价格。" }, { title: "选择与加购", text: "围绕规格选择和购物车组织点餐操作。" }, { title: "进入订单流程", text: "继续在微信与后端环境中完成订单，本站提供成果介绍。" }],
    image: { src: "/images/projects/campus-menu.png", width: 392, height: 714, caption: "商家菜单 · 2026 年 9 月实际界面，项目持续迭代" },
    overview: "围绕校园点餐场景构建微信小程序，连接商品浏览、规格选择、购物车和订单。菜单界面把分类、价格与加购入口集中呈现，帮助用户完成点餐。这里展示迭代过程中保存的真实界面；完整使用需要微信环境与后端服务。",
    focus: ["梳理点餐流程，让商品与规格信息易于理解。", "结合前后端实现，关注订单与交互行为的一致性。", "通过版本管理与验证记录，让每次改进可追踪。"],
  },
  {
    slug: "pyscreen", title: "PyScreen · Python 练习台", description: "在浏览器里运行 Python，让代码、变量与画面相互连接。", stack: ["Python", "Pyodide", "Canvas"], status: "showcase",
    category: "交互实验", preview: "workspace", audience: "正在学习 Python、希望看清程序执行过程的初学者。",
    steps: [{ title: "读任务，改代码", text: "从左侧任务开始，在中间编辑区修改 Python 代码。" }, { title: "运行并观察", text: "运行后，同时查看画布、变量和执行轨迹。" }, { title: "回看，再试一次", text: "逐帧回看结果，依据反馈修改；遇到错误时保留错误提示。" }],
    demo: "/demos/pyscreen/playground.html?level=6",
    image: { src: "/images/projects/pyscreen.png", width: 1440, height: 1000, caption: "实际运行 · 代码、变量、执行轨迹与画布同时呈现" },
    overview: "面向 Python 初学者的互动练习台。左侧理解任务，中间编写代码，右侧观察画布、变量和执行轨迹，让抽象的语句变成可以看见的变化。支持再次运行、查看错误和逐帧回看。首次打开需要加载约 14 MB 的 Python 运行时；课程首页也可从练习台进入。",
    focus: ["把程序运行过程变成可以观察的反馈。", "将练习、画布与变量面板放在同一个学习界面。", "保留错误提示，支持在反馈中修改和再次运行。"],
  },
  {
    slug: "kmp-visualizer", title: "KMP 算法可视化", description: "逐步观察模式匹配、前缀表与失配回退。", stack: ["JavaScript", "算法", "可视化"], status: "showcase",
    category: "交互实验", preview: "diagram", audience: "正在学习字符串匹配，希望理解前缀表与回退过程的学习者。",
    steps: [{ title: "设置两串字符", text: "输入主串和模式串，或使用已有示例。" }, { title: "理解前缀表", text: "从前缀和后缀的关系开始，逐步推导 next / LPS。" }, { title: "跟随匹配过程", text: "暂停或单步观察比较与失配回退，检查最终匹配结果。" }],
    demo: "/demos/kmp/index.html",
    image: { src: "/images/projects/kmp.png", width: 1440, height: 810, caption: "实际运行 · 从前缀与后缀理解 KMP" },
    overview: "将 KMP 字符串匹配过程拆成可播放的步骤。通过主串与模式串的位置、next / LPS 表和失配回退过程，理解算法如何避免重复比较。",
    focus: ["同时呈现字符比较与指针变化。", "支持暂停、单步观察与自定义输入。", "用可重复的匹配轨迹验证算法行为。"],
  },
  {
    slug: "linked-list-merge", title: "有序链表二路归并", description: "跟随指针移动，观察两个有序链表合并。", stack: ["JavaScript", "链表", "动画"], status: "showcase",
    category: "交互实验", preview: "diagram", audience: "学习链表与稳定归并、需要看清节点和指针变化的学习者。",
    steps: [{ title: "准备两条链表", text: "输入升序数据，也可使用随机生成的数据。" }, { title: "跟随节点移动", text: "逐步比较两端节点，观察指针和连线的变化。" }, { title: "检查归并结果", text: "回看结果链表，关注重复值的顺序和剩余节点的连接。" }],
    demo: "/demos/linked-list/index.html",
    image: { src: "/images/projects/linked-list.png", width: 1440, height: 1000, caption: "实际运行 · 节点归并完成后的结果链表" },
    overview: "通过节点和连线展示两个有序链表的稳定归并。输入或随机生成数据，逐步观察比较、摘取节点以及结果链表的形成过程。",
    focus: ["让指针与链表结构的变化保持一致。", "支持重复值、不同长度和逐步播放。", "将线性时间、常量辅助空间的过程直观呈现。"],
  },
  {
    slug: "gdp-timeline", title: "全球 GDP 时间轴", description: "用动态柱状图观察 1960–2019 年的历史排名。", stack: ["Python", "pyecharts", "ECharts"], status: "showcase",
    category: "交互实验", audience: "练习时间序列与数据可视化的学习者；数据是历史练习资料。",
    steps: [{ title: "选择历史年份", text: "在 1960–2019 年的时间轴中选择一年。" }, { title: "播放排名变化", text: "播放时间轴，观察原练习数据中各年的前八名。" }, { title: "回到具体一年", text: "暂停并对照图表数值；这份练习不提供最新经济数据。" }],
    demo: "/demos/gdp/index.html",
    image: { src: "/images/projects/gdp.png", width: 1440, height: 810, caption: "实际运行 · 2019 年历史数据视图" },
    overview: "来自数据可视化练习的历史 GDP 动态图表。拖动年份或播放时间轴，观察每年排名前八的国家。数据范围为 1960–2019 年，图中数值沿用原练习数据，不作为最新经济数据或研究依据。图表库通过 pyecharts 的公共资源服务加载。",
    focus: ["用时间轴连接各年的排名变化。", "保留原图表数据与交互。", "在小屏幕上适配图表尺寸。"],
  },
  {
    slug: "jd-protocol-engine", title: "JD Protocol Engine", description: "本地任务控制台的界面成果与产品演示。", stack: ["Python", "任务工作流", "产品设计"], status: "showcase",
    category: "应用工具", audience: "需要集中查看本地任务状态与日志的用户。本站提供截图与静音演示。",
    steps: [{ title: "查看工作区", text: "从控制台了解任务入口和拍摄时的状态。" }, { title: "观察运行信息", text: "通过截图与视频查看状态、日志和恢复入口的组织方式。" }, { title: "理解使用边界", text: "业务操作依赖本地服务和用户登录环境，本站不执行业务任务。" }],
    image: { src: "/images/projects/jd-dashboard.png", width: 1600, height: 1000, caption: "本地控制台 · 实际界面截图" }, video: "/videos/jd-product-film.mp4",
    overview: "展示已有的任务控制台界面截图和产品演示视频。项目把任务、状态、日志与恢复入口集中在一个工作区。实际业务操作依赖本地服务和用户自己的登录环境；这里提供界面成果展示。截图中的状态和数量是拍摄时的界面内容。",
    focus: ["让任务状态、阻塞原因与下一步动作容易找到。", "把运行过程与结果集中到可观察的界面。", "展示产品表达，同时保持登录凭据与业务数据在本地。"],
  },
  {
    slug: "poster-collection", title: "海报与视觉作品", description: "从日常灵感到产品表达，让想法成为画面。", stack: ["AI 视觉", "海报", "拼贴", "界面概念"], status: "showcase",
    category: "视觉创作", preview: "art",
    overview: "精选 18 张已有作品：旅行与美食拼贴、风景插画、水彩风格化、四套 ZWLY Lab 网站概念和产品海报。保留完整画幅，点击图片可查看原图。AI 生成或风格化画面作为视觉作品展示；网站概念图展示设计方向，图中的界面、数量与宣传文案不代表实际产品状态。",
    gallery: [
      { src: "/images/posters/food-illustration.png", title: "美食手绘 · 日式餐桌", width: 1122, height: 1402 },
      { src: "/images/posters/food-diary-corgi.png", title: "美食拼贴 · More Good Days", width: 1122, height: 1402 },
      { src: "/images/posters/food-diary.png", title: "美食拼贴 · 餐桌日记", width: 1122, height: 1402 },
      { src: "/images/posters/travel-family-corgi.png", title: "旅行拼贴 · 日落与陪伴", width: 1122, height: 1402 },
      { src: "/images/posters/travel-family.png", title: "旅行拼贴 · 温暖时刻", width: 1122, height: 1402 },
      { src: "/images/posters/travel-diary.png", title: "旅行拼贴 · 圣托里尼", width: 1122, height: 1402 },
      { src: "/images/posters/santorini-illustration.png", title: "风景插画 · 海岛日落", width: 1122, height: 1402 },
      { src: "/images/posters/santorini-sunset.png", title: "风景视觉 · 金色时刻", width: 1122, height: 1402 },
      { src: "/images/posters/watercolor-kites.png", title: "水彩风格化 · 风筝与歌声", width: 919, height: 1712 },
      { src: "/images/posters/watercolor-wallpaper.png", title: "水彩风格化 · 竖屏构图", width: 845, height: 1860 },
      { src: "/images/posters/watercolor-space.png", title: "水彩风格化 · 留白构图", width: 845, height: 1860 },
      { src: "/images/posters/portfolio-style-b.png", title: "网站概念 · Style B 极简编辑", width: 1448, height: 1086 },
      { src: "/images/posters/portfolio-style-a.png", title: "网站概念 · Style A 科技夜色", width: 1448, height: 1086 },
      { src: "/images/posters/portfolio-style-c.png", title: "网站概念 · Style C 柔和未来", width: 1448, height: 1086 },
      { src: "/images/posters/portfolio-style-d.png", title: "网站概念 · Style D 创意手绘", width: 1448, height: 1086 },
      { src: "/images/posters/jd-overview.png", title: "产品总览 · A4", width: 794, height: 1123 },
      { src: "/images/posters/jd-recovery.png", title: "异常恢复 · 4:5", width: 864, height: 1080 },
      { src: "/images/posters/jd-privacy.png", title: "隐私安全 · 16:9", width: 1920, height: 1080 },
    ],
    focus: ["探索拼贴、插画和水彩之间不同的视觉表达。", "让不同画幅适应展示场景，同时保留完整图片。", "区分视觉概念与实际实现，记录从灵感到产品的过程。"],
  },
  {
    slug: "ai-writing-coach", title: "AI Writing Coach", description: "探索 AI 如何支持写作练习与反馈。", stack: ["AI", "教育", "Prompt"], status: "exploring",
    category: "应用工具",
    image: { src: "/images/posters/portfolio-style-c.png", width: 1448, height: 1086, caption: "早期作品集概念 · 含写作工具的视觉方向，尚未实现的界面" },
    overview: "这是一个探索方向：让 AI 成为写作练习中的反馈伙伴，帮助学习者观察表达、组织思路并自主修改。这里记录研究目标，不代表已有可用产品。",
    focus: ["让反馈指向具体文本与可执行的修改。", "区分提示、评价与代写，保留学习者的思考空间。", "探索多轮反馈与练习之间的连接。"],
  },
  {
    slug: "ai-agent-lab", title: "AI Agent Lab", description: "探索智能体与开发工作流。", stack: ["Agent", "MCP", "Python"], status: "exploring",
    category: "应用工具",
    image: { src: "/images/posters/portfolio-style-a.png", width: 1448, height: 1086, caption: "早期作品集概念 · 含 Agent Lab 的视觉方向，尚未实现的界面" },
    overview: "这是一个持续探索的方向：研究智能体如何与工具、上下文和软件工程流程协作。优先关注能被验证的小任务，再逐步形成可复用的实践。",
    focus: ["明确工具与上下文的边界。", "用可重复的验证判断任务是否真正完成。", "记录自动化适用的场景与失败条件。"],
  },
];

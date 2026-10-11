export type Project = {
  slug: string;
  title: string;
  description: string;
  stack: string[];
  status: "building" | "exploring";
  overview: string;
  focus: string[];
};

export const projects: Project[] = [
  {
    slug: "campus-takeout", title: "Campus Takeout", description: "面向校园场景的微信点餐小程序。", stack: ["Vue", "Node.js", "微信小程序"], status: "building",
    overview: "围绕校园点餐场景构建微信小程序，关注从商品浏览、规格选择到购物车和订单的完整体验。项目仍在迭代，作品集将逐步补充真实界面、设计过程和验证记录。",
    focus: ["梳理点餐流程，让商品与规格信息易于理解。", "结合前后端实现，关注订单与交互行为的一致性。", "通过版本管理与验证记录，让每次改进可追踪。"],
  },
  {
    slug: "ai-writing-coach", title: "AI Writing Coach", description: "探索 AI 如何支持写作练习与反馈。", stack: ["AI", "教育", "Prompt"], status: "exploring",
    overview: "这是一个探索方向：让 AI 成为写作练习中的反馈伙伴，帮助学习者观察表达、组织思路并自主修改。这里记录研究目标，不代表已有可用产品。",
    focus: ["让反馈指向具体文本与可执行的修改。", "区分提示、评价与代写，保留学习者的思考空间。", "探索多轮反馈与练习之间的连接。"],
  },
  {
    slug: "ai-agent-lab", title: "AI Agent Lab", description: "探索智能体与开发工作流。", stack: ["Agent", "MCP", "Python"], status: "exploring",
    overview: "这是一个持续探索的方向：研究智能体如何与工具、上下文和软件工程流程协作。优先关注能被验证的小任务，再逐步形成可复用的实践。",
    focus: ["明确工具与上下文的边界。", "用可重复的验证判断任务是否真正完成。", "记录自动化适用的场景与失败条件。"],
  },
];
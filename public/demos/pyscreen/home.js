"use strict";

const chapters = [
  {
    number: "01",
    title: "Python 程序设计基础",
    summary: "从程序与数据表达，延伸到输入输出、坐标和电子屏函数调用；可任选顺序。",
    groups: [
      {
        title: "核心练习",
        detail: "8 项 · 可任选顺序",
        lessons: [
      { title: "顺序执行与状态", detail: "预测输出并追踪变量变化", href: "./playground.html?level=1", label: "01" },
      { title: "变量与数据类型", detail: "对应变量含义和基本类型", href: "./playground.html?level=2", label: "02" },
      { title: "坐标表达式", detail: "预测方块移动后的坐标", href: "./playground.html?level=3", label: "03" },
      { title: "输入、计算与输出", detail: "用输入数据计算矩形面积", href: "./playground.html?level=4", label: "04" },
      { title: "修复类型错误", detail: "理解字符串与数值转换", href: "./playground.html?level=5", label: "05" },
      { title: "位置与绘制", detail: "拆解函数调用并移动方块", href: "./playground.html?level=6", label: "06" },
      { title: "绘制文字", detail: "在画面中表达任务状态", href: "./playground.html?level=7", label: "07" },
      { title: "读取按键", detail: "观察输入如何成为程序数据", href: "./playground.html?level=8", label: "08" },
        ],
      },
      {
        title: "拓展体验",
        detail: "1 项 · 不计入核心练习",
        lessons: [
          { title: "帧间节奏", detail: "选做：调整两帧之间的间隔", href: "./playground.html?level=9", label: "EX" },
        ],
      },
      {
        title: "PyCharm 项目",
        detail: "1 项项目 · 学生自编并运行",
        lessons: [
          { title: "01 移动方块", detail: "自己编写函数调用并观察两帧", href: "./playground.html?project=move-square", label: "LAB" },
        ],
      },
    ],
  },
  {
    number: "02",
    title: "程序控制与组合数据",
    summary: "用控制结构表达路线、可用量和服务规则；游戏仅作短小的可视化例子。",
    groups: [{
      title: "核心练习",
      detail: "6 项 · 可任选顺序",
      lessons: [
        { title: "预测边界判断", detail: "判断坐标分支与合法范围", href: "./playground.html?chapter=2&exercise=1", label: "01" },
        { title: "追踪站点状态列表", detail: "预测借还后的集合变化", href: "./playground.html?chapter=2&exercise=2", label: "02" },
        { title: "修改可用量规则", detail: "用循环更新并检查容量边界", href: "./playground.html?chapter=2&exercise=3", label: "03" },
        { title: "有限循环绘制", detail: "让方块连续移动三步", href: "./playground.html?chapter=2&exercise=4", label: "04" },
        { title: "验证移动边界", detail: "比较普通与边界输入", href: "./playground.html?chapter=2&exercise=5", label: "05" },
        { title: "审阅路线边界测试", detail: "检查 AI 建议是否覆盖障碍反例", href: "./playground.html?chapter=2&exercise=6", label: "06" },
      ],
    }, {
      title: "拓展体验",
      detail: "1 项 · 不计入核心练习",
      lessons: [
        { title: "俄罗斯方块：落地边界", detail: "用条件和循环确定最后合法行", href: "./playground.html?chapter=2&exercise=7", label: "EX" },
      ],
    }, {
      title: "PyCharm 项目",
      detail: "4 项 · 含 1 个游戏样例选做",
      lessons: [
        { title: "02 方向键移动方块", detail: "自己实现控制，再与示例对照", href: "./playground.html?project=keyboard-move", label: "LAB" },
        { title: "贪吃蛇：完整样例（选做）", detail: "只挑一条规则观察或修改，不要求逐章扩成整款游戏", href: "./playground.html?project=snake", label: "EX" },
        { title: "末端配送机器人", detail: "校园、社区或楼宇路线；交付任务卡与状态轨迹", href: "./playground.html?project=grid-robot", label: "LAB" },
        { title: "共享出行站点", detail: "用合成数据判断借还与容量边界", href: "./playground.html?project=shared-mobility", label: "LAB" },
      ],
    }],
  },
  {
    number: "03",
    title: "函数、模块与程序组织",
    summary: "定义自己的函数，把配送规则与日常任务组织成可复用步骤。",
    groups: [{
      title: "核心练习",
      detail: "5 项 · 可任选顺序",
      lessons: [
        { title: "划分函数职责", detail: "明确任务、参数与副作用", href: "./playground.html?chapter=3&exercise=1", label: "01" },
        { title: "追踪局部变量", detail: "区分参数、局部值与返回值", href: "./playground.html?chapter=3&exercise=2", label: "02" },
        { title: "定义绘制函数", detail: "自己实现并调用 draw_square()", href: "./playground.html?chapter=3&exercise=3", label: "03" },
        { title: "提取方向更新", detail: "重构后回归边界行为", href: "./playground.html?chapter=3&exercise=4", label: "04" },
        { title: "审阅 AI 函数拆分", detail: "选择接口并验证同组输入", href: "./playground.html?chapter=3&exercise=5", label: "05" },
      ],
    }, {
      title: "拓展体验",
      detail: "4 项 · 不计入核心练习",
      lessons: [
        { title: "俄罗斯方块：旋转函数", detail: "用函数变换 3×3 网格坐标", href: "./playground.html?chapter=3&exercise=6", label: "EX" },
        { title: "递归估算任务", detail: "分解嵌套任务并追踪调用轨迹", href: "./playground.html?chapter=3&exercise=7", label: "EX" },
        { title: "闭包与 lambda", detail: "保存阈值策略并按可用量排序", href: "./playground.html?chapter=3&exercise=8", label: "EX" },
        { title: "调用记录装饰器", detail: "给接单规则增加审计记录", href: "./playground.html?chapter=3&exercise=9", label: "EX" },
      ],
    }, {
      title: "PyCharm 项目",
      detail: "1 项 · 个人任务计划与函数",
      lessons: [
        { title: "个人任务计划：函数拆分", detail: "明确输入、返回值与状态变化，交接给同伴复核", href: "./playground.html?project=daily-planner", label: "LAB" },
      ],
    }],
  },
  {
    number: "04",
    title: "面向对象程序设计",
    summary: "用对象表达工单、机器人等独立状态，理解流程如何协作。",
    groups: [{
      title: "核心练习",
      detail: "5 项 · 可任选顺序",
      lessons: [
        { title: "设计 Ticket 职责", detail: "区分工单状态、行为与队列流程", href: "./playground.html?chapter=4&exercise=1", label: "01" },
        { title: "追踪两个工单对象", detail: "验证实例状态彼此独立", href: "./playground.html?chapter=4&exercise=2", label: "02" },
        { title: "把工单状态交给对象", detail: "用 Ticket 保存并更新状态", href: "./playground.html?chapter=4&exercise=3", label: "03" },
        { title: "核对工单初始化", detail: "检查构造参数和状态转换", href: "./playground.html?chapter=4&exercise=4", label: "04" },
        { title: "审阅类与继承", detail: "按需求判断职责和共享行为", href: "./playground.html?chapter=4&exercise=5", label: "05" },
      ],
    }, {
      title: "拓展体验",
      detail: "3 项 · 不计入核心练习",
      lessons: [
        { title: "俄罗斯方块：Piece 对象", detail: "把形状与位置组织为实例状态", href: "./playground.html?chapter=4&exercise=6", label: "EX" },
        { title: "工单的 str 与 repr", detail: "区分面向使用者与开发者的对象表示", href: "./playground.html?chapter=4&exercise=7", label: "EX" },
        { title: "多继承 MRO", detail: "观察同名方法的查找顺序", href: "./playground.html?chapter=4&exercise=8", label: "EX" },
      ],
    }, {
      title: "PyCharm 项目",
      detail: "1 项 · 服务流程对象建模",
      lessons: [
        { title: "服务工单：对象与状态", detail: "用虚构号码记录等待、处理与完成", href: "./playground.html?project=service-queue", label: "LAB" },
      ],
    }],
  },
  {
    number: "05",
    title: "数据组织与程序设计",
    summary: "管理多站点与设施记录，练习状态、集合和可解释的阈值规则。",
    groups: [{
      title: "核心练习",
      detail: "5 项 · 可任选顺序",
      lessons: [
        { title: "追踪站点集合", detail: "观察借还前后的记录与容量", href: "./playground.html?chapter=5&exercise=1", label: "01" },
        { title: "修复遍历删除遗漏", detail: "复现并修复列表更新问题", href: "./playground.html?chapter=5&exercise=2", label: "02" },
        { title: "集中管理提醒阈值", detail: "用配置解释多条记录状态", href: "./playground.html?chapter=5&exercise=3", label: "03" },
        { title: "选择记录的数据结构", detail: "比较列表、字典和对象", href: "./playground.html?chapter=5&exercise=4", label: "04" },
        { title: "暂停与恢复服务队列", detail: "核对暂停期间队列是否保持", href: "./playground.html?chapter=5&exercise=5", label: "05" },
      ],
    }, {
      title: "拓展体验",
      detail: "2 项 · 不计入核心练习",
      lessons: [
        { title: "俄罗斯方块：棋盘碰撞", detail: "用二维列表检查越界和重叠", href: "./playground.html?chapter=5&exercise=6", label: "EX" },
        { title: "生成器筛选工单", detail: "按需产出已完成的工单编号", href: "./playground.html?chapter=5&exercise=7", label: "EX" },
      ],
    }, {
      title: "PyCharm 项目",
      detail: "1 项 · 站点与设施状态",
      lessons: [
        { title: "楼宇能耗观察", detail: "用合成样例组织时段、阈值和状态", href: "./playground.html?project=energy-watch", label: "LAB" },
      ],
    }],
  },
  {
    number: "06",
    title: "异常、文件与调试",
    summary: "处理文件异常，为服务、任务或路线保存可复核的本地记录。",
    groups: [{
      title: "核心练习",
      detail: "4 项 · 可任选顺序",
      lessons: [
        { title: "读取项目记录文件", detail: "区分有效文件与文件缺失", href: "./playground.html?chapter=6&exercise=1", label: "01" },
        { title: "定位 JSON 错误", detail: "构造最小复现并识别异常", href: "./playground.html?chapter=6&exercise=2", label: "02" },
        { title: "修复文件路径", detail: "根据证据定位名称不一致", href: "./playground.html?chapter=6&exercise=3", label: "03" },
        { title: "审阅异常处理", detail: "避免宽泛捕获掩盖损坏数据", href: "./playground.html?chapter=6&exercise=4", label: "04" },
      ],
    }, {
      title: "拓展体验",
      detail: "2 项 · 不计入核心练习",
      lessons: [
        { title: "项目记录 JSON 快照", detail: "在隔离临时目录写入并读回", href: "./playground.html?chapter=6&exercise=5", label: "EX" },
        { title: "正则校验编号", detail: "区分格式合法与编号真实存在", href: "./playground.html?chapter=6&exercise=6", label: "EX" },
      ],
    }, {
      title: "PyCharm 项目",
      detail: "1 项项目 · JSON 持久化",
      lessons: [
        { title: "服务与任务记录：JSON", detail: "保存、读回并解释缺失或损坏数据", href: "./playground.html?project=service-records", label: "LAB" },
      ],
    }],
  },
  {
    number: "07",
    title: "测试与代码改进",
    summary: "为配送、出行或服务流程设计反例，重构后用测试保护行为。",
    groups: [{
      title: "核心练习",
      detail: "4 项 · 可任选顺序",
      lessons: [
        { title: "测试站点借还规则", detail: "覆盖正常、边界和反例", href: "./playground.html?chapter=7&exercise=1", label: "01" },
        { title: "用 assert 验证函数", detail: "检查正常值、零值与非法值", href: "./playground.html?chapter=7&exercise=2", label: "02" },
        { title: "重构后做回归", detail: "保持规则并比较改前改后", href: "./playground.html?chapter=7&exercise=3", label: "03" },
        { title: "审阅 AI 测试建议", detail: "补上能区分错误实现的用例", href: "./playground.html?chapter=7&exercise=4", label: "04" },
      ],
    }, {
      title: "拓展体验",
      detail: "1 项 · 不计入核心练习",
      lessons: [
        { title: "短例：网格碰撞测试", detail: "覆盖重合与横纵向擦边", href: "./playground.html?chapter=7&exercise=5", label: "EX" },
      ],
    }, {
      title: "PyCharm 项目",
      detail: "1 项项目 · 关键规则测试",
      lessons: [
        { title: "跨场景规则：回归测试", detail: "为一条业务规则补正常、边界和反例", href: "./playground.html?project=domain-tests", label: "LAB" },
      ],
    }],
  },
  {
    number: "08",
    title: "Python 综合应用",
    summary: "把已学知识迁移到文件整理助手等现实任务。",
    groups: [{
      title: "核心练习",
      detail: "4 项 · 可任选顺序",
      lessons: [
        { title: "定义文件分类规则", detail: "明确后缀、未知类型与冲突", href: "./playground.html?chapter=8&exercise=1", label: "01" },
        { title: "生成 dry run 计划", detail: "先报告去向，不移动文件", href: "./playground.html?chapter=8&exercise=2", label: "02" },
        { title: "测试空目录与冲突", detail: "使用隔离的临时文件样例", href: "./playground.html?chapter=8&exercise=3", label: "03" },
        { title: "审阅 AI 整理计划", detail: "用测试验证安全边界", href: "./playground.html?chapter=8&exercise=4", label: "04" },
      ],
    }, {
      title: "拓展体验",
      detail: "1 项 · 为正文后实践做准备",
      lessons: [
        { title: "现实微项目最小版本计划", detail: "写清目标、范围、验收和下一步迁移", href: "./playground.html?chapter=8&exercise=5", label: "EX" },
      ],
    }, {
      title: "PyCharm 项目",
      detail: "1 项项目 · 现实问题迁移",
      lessons: [
        { title: "文件整理助手：先做 dry run", detail: "制定分类计划并检查冲突，不碰真实目录", href: "./playground.html?project=file-organizer", label: "LAB" },
      ],
    }],
  },
  {
    number: "09",
    title: "AI 辅助 Python 学习与编程",
    summary: "向 AI 说明任务、审阅实现建议，并用可复现的证据验证结果。",
    groups: [{
      title: "核心练习",
      detail: "4 项 · 可任选顺序",
      lessons: [
        { title: "改写求助请求", detail: "提供目标、现象与最小复现", href: "./playground.html?chapter=9&exercise=1", label: "01" },
        { title: "比较 AI 方案", detail: "检查假设、影响范围和证据", href: "./playground.html?chapter=9&exercise=2", label: "02" },
        { title: "反例检查借还边界", detail: "修复空站借出与满站归还规则", href: "./playground.html?chapter=9&exercise=3", label: "03" },
        { title: "记录 AI 使用与验证", detail: "保留自己的判断和运行证据", href: "./playground.html?chapter=9&exercise=4", label: "04" },
      ],
    }, {
      title: "拓展体验",
      detail: "1 项 · 不计入核心练习",
      lessons: [
        { title: "AI 协作改进小项目", detail: "限定一次改动，用证据决定是否采纳", href: "./playground.html?chapter=9&exercise=5", label: "EX" },
      ],
    }, {
      title: "PyCharm 项目",
      detail: "1 项项目 · AI 建议由证据验收",
      lessons: [
        { title: "AI 协作：小步改进", detail: "选一项改动，先判断再测试", href: "./playground.html?project=ai-collaboration", label: "LAB" },
      ],
    }],
  },
];

const courseTotals = { core: 0, extensions: 0, projects: 0 };
for (const chapter of chapters) {
  for (const group of chapter.groups || []) {
    if (group.title === "核心练习") courseTotals.core += group.lessons.length;
    if (group.title === "拓展体验") courseTotals.extensions += group.lessons.length;
    if (group.title === "PyCharm 项目") courseTotals.projects += group.lessons.length;
  }
}
document.querySelector("#course-totals").textContent = `${chapters.length} 章共 ${courseTotals.core} 项核心练习、${courseTotals.extensions} 项选做拓展和 ${courseTotals.projects} 项 PyCharm 项目实践；可自由进入。`;

const grid = document.querySelector("#chapter-grid");

function syncChapter(disclosure) {
  const card = disclosure.closest(".chapter-card");
  card.classList.toggle("is-expanded", disclosure.open);
  card.querySelector(".chapter-toggle-action").textContent = disclosure.open ? "收起章节" : "展开章节";
}

function toggleChapter(disclosure) {
  // Stop an in-flight native scroll before changing the target or collapsing it.
  window.scrollTo({ top: window.scrollY, behavior: "instant" });
  const card = disclosure.closest(".chapter-card");
  const previousTop = card.getBoundingClientRect().top;
  disclosure.open = !disclosure.open;
  // Named details closes the previous chapter; sync all widths in the same turn.
  grid.querySelectorAll(".chapter-details").forEach(syncChapter);
  window.scrollBy({ top: card.getBoundingClientRect().top - previousTop, behavior: "instant" });
  if (disclosure.open) {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    card.scrollIntoView({ behavior, block: "start" });
  }
}

for (const chapter of chapters) {
  const groups = chapter.groups || [{ title: "", detail: "", lessons: chapter.lessons }];
  const hasPages = groups.some((group) => group.lessons.some((lesson) => lesson.href));
  const coreCount = groups.filter((group) => group.title === "核心练习").reduce((count, group) => count + group.lessons.length, 0);
  const extensionCount = groups.filter((group) => group.title === "拓展体验").reduce((count, group) => count + group.lessons.length, 0);
  const projectCount = groups.filter((group) => group.title === "PyCharm 项目").reduce((count, group) => count + group.lessons.length, 0);
  const card = document.createElement("article");
  card.className = `chapter-card${hasPages ? " is-available" : " is-planned"}`;
  const disclosure = document.createElement("details");
  disclosure.className = "chapter-details";
  disclosure.name = "course-chapters";

  const summaryControl = document.createElement("summary");
  summaryControl.className = "chapter-toggle";
  const header = document.createElement("div");
  header.className = "chapter-card-header";
  const number = document.createElement("span");
  number.className = "chapter-number";
  number.textContent = chapter.number;
  const status = document.createElement("span");
  status.className = "chapter-status";
  status.textContent = hasPages ? "" : "筹备中";
  status.hidden = hasPages;
  header.append(number, status);

  const title = document.createElement("h3");
  title.textContent = chapter.title;
  const summary = document.createElement("p");
  summary.className = "chapter-summary";
  summary.textContent = chapter.summary;

  const footer = document.createElement("div");
  footer.className = "chapter-toggle-footer";
  const count = document.createElement("span");
  count.className = "chapter-count";
  count.textContent = !hasPages
    ? `${groups.reduce((total, group) => total + group.lessons.length, 0)} 项练习待制作`
    : [coreCount ? `${coreCount} 项核心` : "", extensionCount ? `${extensionCount} 项选做` : "", projectCount ? `${projectCount} 项项目` : ""]
      .filter(Boolean).join(" · ");
  const action = document.createElement("span");
  action.className = "chapter-toggle-action";
  action.textContent = "展开章节";
  const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  chevron.setAttribute("viewBox", "0 0 20 20");
  chevron.setAttribute("aria-hidden", "true");
  chevron.setAttribute("focusable", "false");
  chevron.classList.add("ui-icon", "chapter-chevron");
  const chevronPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  chevronPath.setAttribute("d", "m7 4 6 6-6 6");
  chevron.append(chevronPath);
  footer.append(count, action, chevron);
  summaryControl.append(header, title, summary, footer);

  const content = document.createElement("div");
  content.className = "chapter-content";
  for (const groupData of groups) {
    const group = document.createElement("section");
    group.className = `lesson-group${groupData.title === "核心练习" ? " is-core" : ""}${groupData.title === "拓展体验" ? " is-extension" : ""}${groupData.title === "PyCharm 项目" ? " is-project" : ""}`;
    if (groupData.title) {
      const groupHeading = document.createElement("div");
      groupHeading.className = "lesson-group-heading";
      const groupTitle = document.createElement("h4");
      groupTitle.textContent = groupData.title === "拓展体验" ? "选做拓展" : groupData.title;
      const groupDetail = document.createElement("span");
      groupDetail.textContent = groupData.detail.replace(/^\d+ 项/, `${groupData.lessons.length} 项`);
      groupHeading.append(groupTitle, groupDetail);
      group.append(groupHeading);
    }
    const lessonList = document.createElement("div");
    lessonList.className = "lesson-list";
    lessonList.dataset.count = String(groupData.lessons.length);

    for (const lessonData of groupData.lessons) {
      const lesson = document.createElement(lessonData.href ? "a" : "div");
      lesson.className = `lesson-card${lessonData.href ? "" : " is-coming"}`;
      if (lessonData.href) lesson.href = lessonData.href;
      else lesson.setAttribute("aria-disabled", "true");

      const label = document.createElement("span");
      label.className = "lesson-label";
      label.textContent = lessonData.label;
      const copy = document.createElement("span");
      copy.className = "lesson-copy";
      const lessonTitle = document.createElement("strong");
      lessonTitle.textContent = lessonData.title;
      const detail = document.createElement("small");
      detail.textContent = lessonData.detail;
      copy.append(lessonTitle, detail);
      const arrow = document.createElement("span");
      arrow.className = "lesson-arrow";
      arrow.setAttribute("aria-hidden", "true");
      if (lessonData.href) {
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("viewBox", "0 0 20 20");
        icon.setAttribute("focusable", "false");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M6 14 14 6M7 6h7v7");
        icon.append(path);
        arrow.append(icon);
      } else {
        arrow.textContent = "· · ·";
      }
      lesson.append(label, copy, arrow);
      lessonList.append(lesson);
    }

    group.append(lessonList);
    content.append(group);
  }

  disclosure.append(summaryControl, content);
  summaryControl.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    event.preventDefault();
    toggleChapter(disclosure);
  });
  disclosure.addEventListener("toggle", () => syncChapter(disclosure));
  card.append(disclosure);
  grid.append(card);
}

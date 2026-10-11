"use strict";

const editor = document.querySelector("#code-editor");
const canvas = document.querySelector("#preview-canvas");
const runButton = document.querySelector("#run-button");
const statusBox = document.querySelector("#run-status");
const emptyState = document.querySelector("#preview-empty");
const frameLabel = document.querySelector("#frame-label");
const framePosition = document.querySelector("#frame-position");
const variableReadout = document.querySelector("#variable-readout");
const variableInspector = document.querySelector("#variable-inspector");
const variableValues = document.querySelector("#variable-values");
const traceList = document.querySelector("#trace-list");
const traceCount = document.querySelector("#trace-count");
const previousButton = document.querySelector("#previous-frame");
const nextButton = document.querySelector("#next-frame");
const playButton = document.querySelector("#play-frames");
const playLabel = document.querySelector("#play-label");
const runLabel = document.querySelector("#run-label");
const levelTrack = document.querySelector("#level-track");
const keyControl = document.querySelector("#key-control");
const keyInput = document.querySelector("#key-input");
const workspace = document.querySelector("#practice-workspace");
const taskRail = document.querySelector(".task-rail");
const apiCard = document.querySelector(".api-card");
const editorPanel = document.querySelector(".editor-panel");
const previewPanel = document.querySelector(".preview-panel");
const screenPreview = document.querySelector(".preview-canvas-wrap");
const guidedPanel = document.querySelector("#guided-panel");
const guidedPrompt = document.querySelector("#guided-prompt");
const guidedCode = document.querySelector("#guided-code");
const guidedQuestions = document.querySelector("#guided-questions");
const guidedFeedback = document.querySelector("#guided-feedback");
const guidedCheck = document.querySelector("#check-guided");
const resetButton = document.querySelector("#reset-button");
const copyButton = document.querySelector("#copy-button");
const stopRunButton = document.querySelector("#stop-run-button");
const inputEditor = document.querySelector("#input-editor");
const runtimeTools = document.querySelector("#runtime-tools");
const programOutput = document.querySelector("#program-output");
const workspaceFiles = document.querySelector("#workspace-files");

const insertions = {
  clear: "screen.clear()",
  rect: 'screen.draw_rect(x, y, width=1, height=1, color="moss", label="方块")',
  text: 'screen.draw_text("提示文字", x, y, color="terracotta")',
  update: 'screen.update(note="说明当前画面")',
  key: "key = screen.get_key()",
  sleep: "screen.sleep(0.5)",
};

function hasScreenFrames(run, count) {
  return run.history.length === count &&
    run.trace.filter((step) => step.detail === "清空画面").length >= count &&
    run.trace.filter((step) => step.detail === "提交当前画面").length === count;
}

const levels = [
  {
    mode: "guided",
    short: "顺序与状态",
    title: "追踪语句执行后的状态",
    description: "先按从上到下的顺序阅读程序，预测每次输出和变量变化，再核对。",
    steps: ["先独立预测每行输出。", "逐行追踪 x 的变化。", "填写结果后核对，并解释赋值语句与输出语句的区别。"],
    acceptance: "输出顺序与 x 的最终值正确，并能用语句执行顺序解释结果。",
    prompt: "阅读代码，填写完整输出和程序结束时 x 的值。",
    code: 'print("开始")\nx = 5\nx = x + 2\nprint("当前位置：", x)\nx = x - 1\nprint("更新后：", x)',
    questions: [
      { key: "output", label: "程序输出（每行一项）", type: "textarea", answer: "开始\n当前位置： 7\n更新后： 6", wide: true },
      { key: "x", label: "程序结束时 x 的值", type: "number", answer: "6" },
    ],
    feedback: {
      output: { wrongResult: "某一行的输出会被读错；后续推理也会把已经显示的旧值和当前变量状态混在一起。", why: "print() 在执行到该行时立即输出。x 先从 5 变成 7，再变成 6，所以三次输出分别是开始、当前位置 7、更新后 6。" },
      x: { wrongResult: "后续位置或计算会从错误的 x 开始，和程序结束时的实际状态不一致。", why: "赋值语句按顺序更新当前值：5 + 2 = 7，随后 7 - 1 = 6。" },
    },
  },
  {
    mode: "guided",
    short: "变量与类型",
    title: "让变量对应现实信息",
    description: "把程序中的变量和现实含义、基本数据类型对应起来。",
    steps: ["观察变量名和值。", "为每个变量选择最合适的现实含义与数据类型。", "特别注意整数坐标和小数成绩的区别。"],
    acceptance: "七个变量的现实含义和基本数据类型均匹配；能区分 None 与具体的零值、真假值和空文本。",
    prompt: "为每个变量选择它表示的信息及数据类型。",
    code: 'name = "小林"\nage = 18\nscore = 87.5\npassed = True\nselected_target = None\nx = 2\ny = 4',
    questions: [
      { key: "name", label: "name", type: "select", answer: "姓名 · str", choices: ["姓名 · str", "年龄 · int", "成绩 · float", "是否通过 · bool"] },
      { key: "age", label: "age", type: "select", answer: "年龄 · int", choices: ["姓名 · str", "年龄 · int", "成绩 · float", "是否通过 · bool"] },
      { key: "score", label: "score", type: "select", answer: "成绩 · float", choices: ["姓名 · str", "年龄 · int", "成绩 · float", "是否通过 · bool"] },
      { key: "passed", label: "passed", type: "select", answer: "是否通过 · bool", choices: ["姓名 · str", "年龄 · int", "成绩 · float", "是否通过 · bool"] },
      { key: "selected_target", label: "selected_target", type: "select", answer: "尚未选择目标 · None", choices: ["尚未选择目标 · None", "目标编号为 0 · int", "已完成选择 · False", "目标名称为空文本 · str"] },
      { key: "x", label: "x", type: "select", answer: "横坐标 · int", choices: ["横坐标 · int", "纵坐标 · int", "横坐标 · float", "纵坐标 · float"] },
      { key: "y", label: "y", type: "select", answer: "纵坐标 · int", choices: ["横坐标 · int", "纵坐标 · int", "横坐标 · float", "纵坐标 · float"] },
    ],
    feedback: {
      name: { wrongResult: "姓名会被误当成其他信息；若按整数处理，中文姓名无法转换，显示或保存时也会发生字段错位。", why: '"小林" 是文本，str 用来保存姓名这类字符信息。' },
      age: { wrongResult: "年龄会被当成文本、小数或真假状态；按年龄比较、筛选或计算时结果会不可靠。", why: "18 是没有小数部分的整数，int 适合表示整岁年龄。" },
      score: { wrongResult: "成绩的小数精度或含义会丢失，平均分和区间判断可能因此出错。", why: "87.5 含有小数部分，float 能保留这类数值。" },
      passed: { wrongResult: "通过状态会被当成数字或文本；if 条件可能不能准确表达通过/未通过。", why: "True 表示二选一的逻辑状态，bool 用于真假判断。" },
      selected_target: {
        wrongResult: "程序会把“尚未选目标”误当成一个真实编号、已完成选择或空名称；后续可能错误地移动或处理目标。",
        why: "None 表示目前没有目标值；0 是整数，False 是布尔值，空字符串仍是字符串。",
        choiceHelp: {
          "尚未选择目标 · None": "None 用来明确表示当前没有选定的值，不是数字 0、False 或空字符串。",
          "目标编号为 0 · int": "0 是一个具体整数编号；程序可以把它当作真实目标编号处理。",
          "已完成选择 · False": "False 是布尔状态；它表示否，不表示缺少目标值。",
          "目标名称为空文本 · str": "空字符串仍是文本值；它与没有设置任何值不同。",
        },
      },
      x: { wrongResult: "横纵轴可能混淆，或方块位置落在格子之间；移动和绘制会偏离网格。", why: "x 表示横坐标；电子屏按整格定位，因此使用 int。" },
      y: { wrongResult: "横纵轴可能混淆，或方块位置落在格子之间；上下移动会画到错误位置。", why: "y 表示纵坐标；电子屏按整格定位，因此使用 int。" },
    },
  },
  {
    mode: "guided",
    short: "坐标表达式",
    title: "预测坐标表达式的结果",
    description: "通过 x、y 的变化描述方块在电子屏网格上的移动。",
    steps: ["写出起点坐标。", "按顺序计算 x = x + 1 和 y = y - 1。", "填写最终坐标，并结合电子屏坐标约定判断方向。"],
    acceptance: "最终坐标为 (3, 3)，相对起点向右一格、向上一格。",
    prompt: "先不要运行，预测程序最后输出的 x、y，并判断方块相对起点的移动方向。",
    code: "x = 2\ny = 4\nx = x + 1\ny = y - 1\nprint(x, y)",
    questions: [
      { key: "x", label: "最终 x", type: "number", answer: "3" },
      { key: "y", label: "最终 y", type: "number", answer: "3" },
      { key: "direction", label: "相对起点的移动方向", type: "select", answer: "向右一格、向上一格", choices: ["向右一格、向上一格", "向左一格、向下一格", "向右一格、向下一格"] },
    ],
    feedback: {
      x: { wrongResult: "方块下一步会从错误的横坐标移动，画面位置与代码追踪不符。", why: "x 从 2 执行 x = x + 1，结果是 3。" },
      y: { wrongResult: "方块会被画到错误的纵向位置；屏幕坐标向下增大、向上减小。", why: "y 从 4 执行 y = y - 1，结果是 3。" },
      direction: { wrongResult: "把坐标变化解释成另一方向，会让后续移动规则写反。", why: "x 增加表示向右；y 减少表示向上。" },
    },
  },
  {
    mode: "guided",
    short: "输入与面积",
    title: "把输入转换为计算结果",
    description: "从输入、处理、输出三个环节理解矩形面积程序。",
    steps: ["把输入 3 和 4 代入面积公式。", "再检查宽为 0 时的结果。", "判断 input() 返回的数据为什么需要转换。"],
    acceptance: "两组面积分别为 12 和 0，并知道 input() 返回字符串。",
    prompt: "使用 area = width * height，预测两组输入的面积，并选择转换原因。",
    code: 'width = float(input("请输入宽："))\nheight = float(input("请输入高："))\narea = width * height\nprint("面积：", area)',
    questions: [
      { key: "area1", label: "宽 3、高 4 时的面积", type: "number", answer: "12" },
      { key: "area2", label: "宽 0、高 4 时的面积", type: "number", answer: "0" },
      { key: "conversion", label: "为什么先转换 input() 的结果？", type: "select", answer: "input() 返回字符串，需要转成数字才能计算", choices: ["input() 返回字符串，需要转成数字才能计算", "input() 返回整数，不需要转换", "乘法只适用于字符串"] },
    ],
    feedback: {
      area1: { wrongResult: "面积会与矩形实际占用的格数不一致，后续显示或统计会采用错误结果。", why: "面积等于宽乘高：3 × 4 = 12。" },
      area2: { wrongResult: "零宽矩形仍被算出非零面积，表示没有把零宽边界情况纳入推理。", why: "任一边长为 0 时，宽 × 高 = 0 × 4 = 0。" },
      conversion: {
        wrongResult: "把键盘输入当数字直接运算会导致类型不匹配；本题中宽和高都需先转成数值。",
        why: "input() 读取到的是 str；float() 将数字文本转成可参与乘法的数值。",
        choiceHelp: {
          "input() 返回字符串，需要转成数字才能计算": "input() 读取文本并返回 str；int() 或 float() 可把数字文本转换成数字。",
          "input() 返回整数，不需要转换": "input() 不会自动判断数字格式，输入 3 得到的仍是字符串 " + '"3"' + "。",
          "乘法只适用于字符串": "数字也可以相乘；这里需要先把输入文本转换为数值，再计算面积。",
        },
      },
    },
  },
  {
    mode: "guided",
    short: "修复类型错误",
    title: "定位并修复输入类型问题",
    description: "观察 input() 的结果类型，找到字符串与数字参与运算时的问题。",
    steps: ["先说明 speed 的数据类型。", "选择把输入转换成整数的最小修改。", "用输入 2 预测修复后的 x。"],
    acceptance: "指出 input() 返回 str，选择 int 转换，预测 x 为 7。",
    prompt: "程序将输入的移动量加到 x 上。",
    code: 'speed = input("请输入移动量：")\nx = 5\nx = x + speed',
    questions: [
      { key: "cause", label: "发生运算问题的原因", type: "select", answer: "input() 返回字符串，不能直接与整数相加", choices: ["input() 返回字符串，不能直接与整数相加", "变量 x 不能保存整数", "加法运算不能使用变量"] },
      { key: "fix", label: "把输入转换为整数", type: "select", answer: "speed = int(input(...))", choices: ["speed = int(input(...))", "speed = str(input(...))", "x = input + speed"] },
      { key: "x", label: "输入 2 后修复程序中的 x", type: "number", answer: "7" },
    ],
    feedback: {
      cause: { wrongResult: "程序仍会把文字和整数相加，运行时会出现 TypeError，无法得到新坐标。", why: "input() 返回 str；x 是 int，Python 不允许把这两种类型直接相加。" },
      fix: {
        wrongResult: "选 str() 仍保留文本，不能和整数 x 相加；直接写 input 也没有调用输入函数并会造成类型错误。",
        why: "input() 读取文本，int() 把像 2 这样的数字文本转换成整数，之后才能与 x 相加。",
        choiceHelp: {
          "speed = int(input(...))": "input() 读取文本；int() 把数字文本转为整数，可用于 x + speed。",
          "speed = str(input(...))": "str() 得到的仍是文本；把它与整数 x 相加仍会报类型错误。",
          "x = input + speed": "input 是函数名，需要写成 input() 才会读取；此处还没有把输入转换成整数。",
        },
      },
      x: { wrongResult: "方块的目标横坐标会偏一格或更多；之后按该值绘制就会显示在错误位置。", why: "x 从 5 开始，输入 2 经 int() 转换后相加，5 + 2 = 7。" },
    },
  },
  {
    mode: "code",
    short: "位置与绘制",
    title: "让方块向右一步",
    description: "需求：把方块从 (2, 4) 向右移动一格。先拆出坐标变化与绘制步骤，再自行补出第二帧。",
    steps: ["运行前预测第二帧的 x 坐标。", "列出 clear()、draw_rect()、update() 及所需实参和顺序。", "先更新位置，再组织第二帧的绘制调用。", "运行后对照两帧、变量和执行轨迹，解释画面为何改变。"],
    acceptance: "第一帧方块位于 x=2，第二帧位于 x=3；轨迹显示位置更新在第二帧绘制前。",
    apis: ["clear", "rect", "update"],
    starterCode: editor.value,
    passes: (run) => run.history.length >= 2 && run.history[0].objects.some((item) => item.type === "rect" && item.x === 2) && run.history[1].objects.some((item) => item.type === "rect" && item.x === 3),
    failureFeedback: (run) => {
      if (run.history.length < 2) return `当前只提交了 ${run.history.length} 帧，无法比较移动前后；补齐第二次 clear()、绘制和 update()，让坐标变化成为可见画面。`;
      const positions = run.history.slice(0, 2).map((frame) => frame.objects.filter((item) => item.type === "rect").map((item) => item.x).join("、") || "没有矩形");
      return `前两帧矩形的 x 为 ${positions.join(" → ")}，本题应为 2 → 3；先保留起点，再把 x 加 1 后绘制。若先画再改变量，已提交画面不会自动移动。`;
    },
  },
  {
    mode: "code",
    short: "绘制文字",
    title: "给画面加上提示",
    description: "任务：在方块上方的 (1, 1) 显示“准备开始”，让画面同时表达当前状态。",
    steps: ["先预测 draw_text() 放在 update() 前后会有什么区别。", "确定文字和坐标实参，在提示位置补上调用。", "运行并检查文字内容、位置和所属画面帧。", "说明调用顺序怎样决定文字是否进入已提交的画面。"],
    acceptance: "预览中出现文字“准备开始”，坐标为 (1, 1)，且出现在已提交帧中。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: '# 在 update() 之前补一条 draw_text() 调用\nx = 3\ny = 4\nscreen.clear()\nscreen.draw_rect(x, y, width=2, height=2, label="方块")\n# 在这里绘制提示文字\nscreen.update(note="加入说明")',
    passes: (run) => run.history.some((frame) => frame.objects.some((item) => item.type === "text" && item.text === "准备开始" && item.x === 1 && item.y === 1)),
    failureFeedback: (run) => {
      const texts = run.history.flatMap((frame) => frame.objects.filter((item) => item.type === "text"));
      if (!texts.length) return "已提交帧中没有文字；draw_text() 要在 update() 之前调用，否则本帧不会包含新文字。请在 (1, 1) 绘制“准备开始”。";
      return `当前已提交文字为 ${texts.map((item) => `${JSON.stringify(item.text)} @ (${item.x}, ${item.y})`).join("；")}；应包含“准备开始” @ (1, 1)。文字或坐标不同，会让状态提示不符或出现在错误位置。`;
    },
  },
  {
    mode: "code",
    short: "读取按键",
    title: "读取并显示方向键",
    description: "在左侧任务卡的“模拟输入按键”中选择一个按键，把它读入变量 key，再将读取结果显示在电子屏上。",
    steps: ["先选“→ 右”，预测 key 的返回值；再补上 get_key() 读取与画面显示。", "按起始代码顺序列出 get_key() 并赋值、clear()、两次 draw_text() 和 update()。", "自行补出读取与显示调用。", "运行后对照按键选择器、变量读数、电子屏文字和执行轨迹。"],
    acceptance: "选择“→ 右”时 key 为 'ArrowRight'；变量与屏幕文字应一致，轨迹包含 get_key() 和绘制调用。",
    requiresKey: true,
    apis: ["key", "clear", "text", "update"],
    starterCode: '# 先在左侧选择“模拟输入按键”\n# 在这里调用 get_key() 并保存到 key\nscreen.clear()\nscreen.draw_text("收到的按键：", 1, 2)\n# 再把 key 绘制在下一行\nscreen.update(note="读取并显示按键")',
    passes: (run) => {
      const key = keyInput.value;
      return run.variables.key === `'${key}'` && run.trace.some((step) => step.detail === "读取一个按键") && run.history.some((frame) => frame.objects.some((item) => item.type === "text" && item.text === key));
    },
    failureFeedback: (run) => {
      const key = keyInput.value;
      const label = keyInput.selectedOptions[0]?.textContent.trim() || "所选按键";
      if (run.variables.key !== `'${key}'`) {
        return `${label} 会由 get_key() 返回 ${JSON.stringify(key)}；当前 key 与此值不同，后续程序会按另一个按键处理。`;
      }
      if (!run.trace.some((step) => step.detail === "读取一个按键")) {
        return `变量值虽然是 ${JSON.stringify(key)}，但执行轨迹里没有 get_key()；请实际读取选择器中的按键，而不是手动写入常量。`;
      }
      if (!run.history.some((frame) => frame.objects.some((item) => item.type === "text" && item.text === key))) {
        return `变量 key 已读到 ${JSON.stringify(key)}，但屏幕没有显示完整键名；把 key 作为 draw_text() 的文字参数，才能看到输入与画面的对应关系。`;
      }
      return "检查画面帧与执行轨迹：本题需要同时展示读取到的键名，并实际调用读取和绘制函数。";
    },
  },
  {
    mode: "code",
    short: "帧间节奏（选做）",
    extension: true,
    title: "为连续画面设置播放间隔",
    description: "选做拓展：在两次 update() 之间自行插入 sleep()。它改变帧间等待，不改变方块的位置。",
    steps: ["预测程序会提交几帧，并区分位置变化与播放等待。", "拆出第一帧、sleep()、位置更新和第二帧的先后顺序。", "在提示位置补上 screen.sleep(0.5)。", "运行并播放，按执行轨迹确认等待发生在两帧之间。"],
    acceptance: "至少有两帧；sleep() 位于两次 update() 之间；能解释它影响播放间隔而非坐标。",
    apis: ["clear", "rect", "update", "sleep", "wait"],
    starterCode: 'x = 2\ny = 4\nscreen.clear()\nscreen.draw_rect(x, y, width=2, height=2, label="方块")\nscreen.update(note="起点")\n# 在这里：调用 screen.sleep(0.5) 设置帧间等待\nx = x + 1\nscreen.clear()\nscreen.draw_rect(x, y, width=2, height=2, label="方块")\nscreen.update(note="向右一步")',
    passes: (run) => {
      const firstUpdate = run.trace.findIndex((step) => step.source.startsWith("screen.update("));
      const wait = run.trace.findIndex((step) => step.source.startsWith("screen.sleep("));
      const nextUpdate = run.trace.findIndex((step, index) => index > firstUpdate && step.source.startsWith("screen.update("));
      return run.history.length >= 2 && run.sleep_total >= 0.1 && firstUpdate >= 0 && wait > firstUpdate && nextUpdate > wait;
    },
  },
  {
    chapter: "02",
    mode: "guided",
    short: "边界判断",
    title: "预测边界判断",
    description: "方块为 2 × 2，屏幕宽 20 格，左上角 x 的最大合法值是 18。",
    steps: ["先判断 x + 1 <= 18 的真假。", "再写出分支执行后的 x。", "特别检查已经到达边界时是否会越界。"],
    acceptance: "x=0、17、18 的移动结果分别为 1、18、18。",
    prompt: "阅读条件 x + 1 <= 18：若条件成立就令 x 增加 1，否则保持原值。填写三种起点的最终坐标。",
    code: "if x + 1 <= 18:\n    x = x + 1\n# else: 保持 x 不变",
    questions: [
      { key: "zero", label: "从 x=0 向右一步", type: "number", answer: "1" },
      { key: "near", label: "从 x=17 向右一步", type: "number", answer: "18" },
      { key: "edge", label: "从 x=18 向右一步", type: "number", answer: "18" },
    ],
    feedback: {
      zero: { wrongResult: "从左边界出发会得到错误位置；普通移动规则本身应允许向右一格。", why: "0 + 1 = 1，而且 1 不超过最大合法 x=18。" },
      near: { wrongResult: "最后一格前的移动被漏掉或多走，方块不能正确到达右边界。", why: "17 + 1 = 18，正好到达最大合法 x。" },
      edge: { wrongResult: "如果答案大于 18，2×2 方块会越出宽 20 的屏幕；如果小于 18，则错误地阻止了合法状态。", why: "18 + 1 > 18，条件不成立，x 保持 18。" },
    },
  },
  {
    chapter: "02",
    mode: "guided",
    short: "站点状态列表",
    title: "追踪站点状态列表",
    description: "列表依次保存站点编号、可用量和容量；每次借还只改变目标站点且必须检查边界。",
    steps: ["先独立写出初始状态。", "追踪从 A 借出、向 B 归还。", "检查向已满的 C 归还时状态是否保持。"],
    acceptance: "最终集合为 [('A', 2, 8), ('B', 1, 6), ('C', 5, 5)]。",
    prompt: "从 [('A', 3, 8), ('B', 0, 6), ('C', 5, 5)] 出发，依次从 A 借出、向 B 归还、向已满的 C 归还。写出每步完整状态。",
    code: "stations = [(\"A\", 3, 8), (\"B\", 0, 6), (\"C\", 5, 5)]\n# 每项依次是站点编号、可用量、容量；只更新符合规则的目标项",
    questions: [
      { key: "states", label: "借出、归还、满站归还后的完整状态（每行一步）", type: "textarea", answer: "[('A', 2, 8), ('B', 0, 6), ('C', 5, 5)]\n[('A', 2, 8), ('B', 1, 6), ('C', 5, 5)]\n[('A', 2, 8), ('B', 1, 6), ('C', 5, 5)]", wide: true },
      { key: "available", label: "最终 B 站可用量", type: "number", answer: "1" },
      { key: "full_station", label: "满站 C 的最终可用量", type: "number", answer: "5" },
    ],
    feedback: {
      states: { wrongResult: "借还后站点数量或顺序会错；满站归还若增加数量，会突破容量并让后续调度依据失真。", why: "A 借出后 3→2；B 归还后 0→1；C 已满 (5/5)，归还失败且状态不变。" },
      available: { wrongResult: "B 站后续会显示错误的可用数量，用户可能被错误地告知无车或有车。", why: "B 初始可用量为 0，成功归还一辆后变成 1。" },
      full_station: { wrongResult: "C 的数量若超过 5，就违反容量约束；若减少，则误改了没有成功的操作。", why: "C 初始可用量已经等于容量 5，归还被拒绝，所以仍为 5。" },
    },
  },
  {
    chapter: "02",
    mode: "code",
    short: "站点借还规则",
    title: "修改可用量规则并验证",
    description: "循环处理借还指令；只有符合数量边界的操作会更新站点，再用电子屏对照状态。",
    steps: ["先写出空站、满站和普通站点规则。", "在循环中按操作更新对应可用量。", "保留不合法操作前后的原状态。", "用 PyScreen 绘制更新后的站点数量并核对结果。"],
    acceptance: "借还后的状态正确，空站不能借、满站不能还；预览显示操作后的站点数量。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'stations = {"A": {"available": 1, "capacity": 3}, "B": {"available": 3, "capacity": 3}}\noperations = [("A", "borrow"), ("B", "return"), ("A", "return"), ("B", "borrow")]\n\nfor station_id, action in operations:\n    station = stations[station_id]\n    # TODO：只有符合借还边界时才更新 available\n    pass\n\nresults = [(name, data["available"], data["capacity"]) for name, data in stations.items()]\n\n# TODO：调用绘制函数展示各站点可用量和容量，再提交画面\nscreen.clear()\n# TODO：逐项绘制站点状态',
    code: '',
    passes: (run) => {
      const rectangles = run.history[0]?.objects.filter((item) => item.type === "rect") ?? [];
      return run.variables.results === "[('A', 2, 3), ('B', 2, 3)]" && hasScreenFrames(run, 1) && rectangles.length === 2 && run.history[0].objects.filter((item) => item.type === "text").length >= 2;
    },
  },
  {
    chapter: "02",
    mode: "code",
    short: "有限循环",
    title: "把单步绘制改成有限循环",
    description: "从 x=2 出发，循环三次；每轮更新状态并提交一帧。",
    steps: ["先预测三帧坐标和结束时的 x。", "使用有限次数循环，避免程序一直运行。", "每轮按状态更新、清屏、绘制、提交的顺序执行。", "检查帧数、坐标和执行轨迹。"],
    acceptance: "三帧方块的 x 依次为 3、4、5，最终 x=5。",
    apis: ["clear", "rect", "update"],
    starterCode: 'x = 2\ny = 4\nwidth = 2\nheight = 2\n\n# TODO：循环 3 次；每轮先更新 x，再清屏、绘制并提交一帧',
    passes: (run) => run.history.length === 3 && run.history.every((frame, index) => frame.objects.some((item) => item.type === "rect" && item.x === index + 3)) && run.variables.x === "5",
  },
  {
    chapter: "02",
    mode: "code",
    short: "移动边界测试",
    title: "验证移动边界规则",
    description: "使用条件实现方块边界规则，再把四组测试的起点与实际落点绘制到电子屏。",
    steps: ["先为四组输入写出预期值。", "使用 if 判断移动后的坐标是否仍不超过 18。", "把实际结果按输入顺序保存到 results。", "逐组绘制 2×2 方块的起点和落点，比较正常移动与边界行为。"],
    acceptance: "四组结果依次为 5、18、18、18；电子屏逐帧呈现每组起点与结果，且方块不越界。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'tests = [(4, 1), (17, 1), (18, 1), (18, 2)]\nresults = []\nfor x, step in tests:\n    # TODO：仅在 x + step <= 18 时移动，然后记录 x\n    pass\n\n# TODO：逐组用 PyScreen 绘制起点和实际结果；每组提交一帧\nfor (start_x, step), end_x in zip(tests, results):\n    screen.clear()\n    # TODO：绘制 2×2 起点与结果方块，标注坐标并提交本帧',
    passes: (run) => run.variables.results === "[5, 18, 18, 18]" && hasScreenFrames(run, 4) && run.history.every((frame, index) => {
      const rectangles = frame.objects.filter((item) => item.type === "rect");
      const starts = rectangles.filter((item) => item.x === [4, 17, 18, 18][index]);
      const results = rectangles.filter((item) => item.x === [5, 18, 18, 18][index]);
      return starts.some((start) => results.some((result) => result.y !== start.y));
    }),
  },
  {
    chapter: "02",
    mode: "guided",
    short: "路线边界测试",
    title: "审阅 AI 提出的路线边界测试",
    description: "先独立列出路线边界、障碍与无效指令，再对照 AI 建议并运行反例。",
    steps: ["先写下自己会检查的规则。", "让 AI 只建议测试，不生成完整程序。", "从选项中辨认能区分正确与错误规则的用例。", "把最终采用的测试和理由记录到练习单。"],
    supplement: "在 PyCharm 中用 strip() 去除首尾空白、split(\",\") 按逗号拆开“右,右,下”；空输入或未知方向要在查询 delta 字典前拒绝。还可将障碍保存为坐标集合，并用 in 判断候选格是否被占用。记录一组解析前后的数据；本项不计入练习台自动验收。",
    acceptance: "测试建议覆盖边界和障碍反例，且能说明机器人为何保持原状态。",
    prompt: "选择能检查网格路线障碍与边界的用例。AI 的建议需要由你亲自运行验证。",
    code: "规则：候选位置越界或落入障碍时，机器人保持原位置并报告受阻。",
    questions: [
      { key: "boundary", label: "最有价值的边界测试", type: "select", answer: "机器人在最右列继续向右：坐标保持不变", choices: ["机器人在最右列继续向右：坐标保持不变", "只测试地图中央的向右移动", "忽略网格宽度"] },
      { key: "counterexample", label: "能揭露遗漏障碍检查的反例", type: "select", answer: "候选位置正好是障碍格：不移动并显示受阻", choices: ["候选位置正好是障碍格：不移动并显示受阻", "候选位置是普通空格：允许移动", "重复运行相同的空格输入"] },
      { key: "evidence", label: "测试证据应包含", type: "select", answer: "输入状态、预期、实际结果和判断理由", choices: ["输入状态、预期、实际结果和判断理由", "AI 的自信程度", "代码行数"] },
    ],
    feedback: {
      boundary: { wrongResult: "只测地图中央可能通过，但程序在最右列仍会走到 x=19，使 2×2 机器人越界。", why: "从最右列继续向右是边界条件；预期应保持坐标不变并给出受阻反馈。" },
      counterexample: { wrongResult: "只测普通空格不会暴露漏掉的障碍检查，机器人可能直接穿过障碍。", why: "把候选位置设为障碍格，才能区分“检查障碍”和“只检查边界”的实现。" },
      evidence: { wrongResult: "没有可复现输入和实际结果，无法判断 AI 建议是否真的覆盖问题。", why: "输入状态、预期、实际结果与理由能让他人重复测试并核对结论。" },
    },
  },
  {
    chapter: "03",
    mode: "guided",
    short: "函数职责",
    title: "为程序步骤划分职责",
    description: "按任务职责安排函数接口，不要求把每一行都包装成函数。",
    steps: ["辨认状态更新、碰撞判断、绘制和主流程。", "为每类任务选择输入与返回值或副作用。", "指出哪项需要 screen 对象。", "把你的接口表和理由保存到练习单。"],
    acceptance: "接口能区分状态更新、判断、绘制和流程组织，绘制副作用清楚。",
    prompt: "为移动步骤设计最小函数划分，选择职责、输入与输出/副作用都匹配的一组接口。",
    code: "需求步骤：更新蛇头、判断碰撞、绘制蛇、组织一轮程序。",
    questions: [
      { key: "move", label: "更新蛇头的合适接口", type: "select", answer: "move_head(snake, direction) → 新蛇身状态", choices: ["move_head(snake, direction) → 新蛇身状态", "draw_snake(screen) → 碰撞结果", "main() → 新坐标参数"] },
      { key: "collision", label: "碰撞判断的合适结果", type: "select", answer: "check_collision(snake) → True/False", choices: ["check_collision(snake) → True/False", "draw_snake(screen) → 新蛇身状态", "main() → 图片文件"] },
      { key: "draw", label: "绘制函数的依赖与副作用", type: "select", answer: "draw_snake(screen, snake)：调用 screen 绘制，不必返回新状态", choices: ["draw_snake(screen, snake)：调用 screen 绘制，不必返回新状态", "draw_snake()：修改蛇头并返回碰撞值", "draw_snake(snake)：自动读取全局 screen 并移动蛇"] },
      { key: "main", label: "主流程的职责", type: "select", answer: "按步骤组织调用，不替代每个步骤的具体职责", choices: ["按步骤组织调用，不替代每个步骤的具体职责", "把所有计算和绘制细节塞进一个函数", "只负责保存图形颜色"] },
    ],
    feedback: {
      move: {
        wrongResult: "若把 draw_snake() 当作移动函数，碰撞检查拿不到可靠的新蛇身；若把 main() 当作移动函数，坐标更新就会和整轮流程耦合，难以单测和复用。",
        why: "move_head 接收蛇身与方向，返回新的蛇身状态；它只负责规则计算。",
        choiceHelp: {
          "move_head(snake, direction) → 新蛇身状态": "自定义函数：读取当前蛇身和方向，计算并返回新状态，不负责画图。",
          "draw_snake(screen) → 碰撞结果": "draw_snake 应绘制；缺少 snake 状态，而且绘制本身不能代替碰撞判断。",
          "main() → 新坐标参数": "main 通常组织程序流程；具体坐标更新应由职责清楚的函数完成。",
        },
      },
      collision: {
        wrongResult: "碰撞判断返回画面或图片，调用者就无法可靠地用真假条件决定继续还是结束。",
        why: "碰撞是一个判断，True/False 可以直接用于 if 分支。",
        choiceHelp: {
          "check_collision(snake) → True/False": "检查蛇身是否碰墙或自身，返回布尔值供 if 判断。",
          "draw_snake(screen) → 新蛇身状态": "绘制函数负责显示；它既不应更新蛇身，也不适合作为碰撞判断结果。",
          "main() → 图片文件": "主流程组织调用；保存图片不是本题的碰撞判断职责。",
        },
      },
      draw: {
        wrongResult: "绘制代码会偷偷修改游戏状态或依赖全局变量，导致画面与逻辑难以分别验证。",
        why: "把 screen 和 snake 明确传入后，函数负责绘制副作用即可；新状态由移动函数返回。",
        choiceHelp: {
          "draw_snake(screen, snake)：调用 screen 绘制，不必返回新状态": "接收屏幕和当前蛇身，只负责画出它；绘制会改变画面，但不改变逻辑状态。",
          "draw_snake()：修改蛇头并返回碰撞值": "把状态更新、碰撞和绘制混在一起，调用者无法清楚区分每个结果。",
          "draw_snake(snake)：自动读取全局 screen 并移动蛇": "隐藏全局依赖并混入移动规则，函数难以复用和单独测试。",
        },
      },
      main: {
        wrongResult: "流程会变得臃肿，单个步骤难以替换或测试；保存颜色也不能组织一轮程序。",
        why: "main 按顺序调用移动、碰撞判断和绘制等函数，让每项职责仍由对应函数完成。",
        choiceHelp: {
          "按步骤组织调用，不替代每个步骤的具体职责": "主流程负责安排先后顺序，并调用有明确职责的辅助函数。",
          "把所有计算和绘制细节塞进一个函数": "短期能运行，但规则、显示和流程耦合，修改时容易互相影响。",
          "只负责保存图形颜色": "颜色配置不是主流程职责，也没有组织本轮游戏步骤。",
        },
      },
    },
  },
  {
    chapter: "03",
    mode: "guided",
    short: "局部变量与返回值",
    title: "追踪局部变量与返回值",
    description: "比较函数内的局部状态和调用者持有的变量。",
    steps: ["运行前填写调用者的 x。", "追踪函数内部的 x 与 next_x。", "区分 return 后的值与原变量。", "核对函数结束后的状态表。"],
    acceptance: "函数返回 3，但调用者的 x 仍为 2，new_x 为 3。",
    prompt: "根据代码填写调用前的 x、函数内的 x 和 next_x、调用后 x 与 new_x。",
    code: "def move_right(x):\n    next_x = x + 1\n    return next_x\n\nx = 2\nnew_x = move_right(x)",
    questions: [
      { key: "local_x", label: "函数内参数 x", type: "number", answer: "2" },
      { key: "next_x", label: "局部变量 next_x", type: "number", answer: "3" },
      { key: "caller_x", label: "调用后调用者的 x", type: "number", answer: "2" },
      { key: "new_x", label: "调用后 new_x", type: "number", answer: "3" },
    ],
    feedback: {
      local_x: { wrongResult: "函数内部会从错误起点计算 next_x，返回结果也随之错误。", why: "调用 move_right(x) 时 x 的实参是 2，函数参数 x 在本次调用中接收 2。" },
      next_x: { wrongResult: "函数会返回错误坐标，后续绘制可能把方块移动过多或不足。", why: "局部变量 next_x = x + 1，因此 2 + 1 = 3。" },
      caller_x: { wrongResult: "把函数内的局部变量误认为会改写调用者 x，会混淆局部作用域与返回值。", why: "整数实参赋给参数后，函数内的 x 是局部名称；函数没有给外层 x 重新赋值。" },
      new_x: { wrongResult: "调用者会使用错误的返回结果来绘制或更新位置。", why: "return next_x 把 3 交还给调用者，再赋给 new_x。" },
    },
  },
  {
    chapter: "03",
    mode: "code",
    short: "定义绘制函数",
    title: "亲自定义绘制函数",
    description: "实现 draw_square(screen, x, y)，再用两个不同位置验证输入参数确实生效。",
    steps: ["先写清三个参数各表示什么。", "自己完成函数体：清屏、绘制 2×2 方块、提交画面。", "依次以 (2, 4) 和 (5, 4) 调用。", "检查两帧的位置与函数调用轨迹。"],
    acceptance: "函数调用产生 x=2、x=5 两帧，顺序均为清屏、绘制、提交。",
    apis: ["clear", "rect", "update"],
    starterCode: 'def draw_square(screen, x, y):\n    # TODO：清屏、绘制 2×2 方块并提交画面\n    pass\n\ndraw_square(screen, 2, 4)\ndraw_square(screen, 5, 4)',
    passes: (run) => run.history.length === 2 && run.history[0].objects.some((item) => item.type === "rect" && item.x === 2 && item.y === 4) && run.history[1].objects.some((item) => item.type === "rect" && item.x === 5 && item.y === 4) && run.trace.filter((step) => step.detail === "清空画面" || step.detail === "绘制方块或矩形" || step.detail === "提交当前画面").length >= 6,
  },
  {
    chapter: "03",
    mode: "code",
    short: "方向更新重构",
    title: "提取方向更新并做回归验证",
    description: "把重复坐标更新提取为自己的函数；用同一组输入回归，并在电子屏逐帧比较起点和结果。",
    steps: ["先记下左移、右移和到边界的基线结果。", "定义一个职责清楚、可重复调用的坐标更新函数。", "运行相同输入并生成 after 列表。", "调用 PyScreen 绘制每组起点和结果，检查重构没有改变边界规则。"],
    supplement: "在 PyCharm 中尝试 add_task(task, tasks=None)：连续省略列表参数调用两次，确认新列表互不累积；再传入已有列表，说明其被修改的副作用。若没有默认值需求，就保留必填参数。多文件项目可用 main() 与 if __name__ == \"__main__\": 保护入口，并验证导入模块不会启动主流程。本项不计入练习台自动验收。",
    acceptance: "重构后结果与基线 [3, 18, 18] 一致；电子屏提交三帧，每帧呈现对应起点和结果。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'inputs = [(4, -1), (17, 1), (18, 1)]\nbefore = [3, 18, 18]\n\ndef move_x(x, step):\n    # TODO：返回边界范围 0–18 内的新坐标\n    pass\n\nafter = [move_x(x, step) for x, step in inputs]\n\n# TODO：逐组绘制起点与结果\nfor (x, step), new_x in zip(inputs, after):\n    screen.clear()\n    # TODO：调用绘制函数显示起点、结果和说明，并提交一帧',
    passes: (run) => run.variables.after === "[3, 18, 18]" && run.variables.after === run.variables.before && hasScreenFrames(run, 3) && run.history.every((frame, index) => {
      const rectangles = frame.objects.filter((item) => item.type === "rect");
      const starts = rectangles.filter((item) => item.x === [4, 17, 18][index]);
      const results = rectangles.filter((item) => item.x === [3, 18, 18][index]);
      return starts.some((start) => results.some((result) => result.y !== start.y));
    }),
  },
  {
    chapter: "03",
    mode: "code",
    short: "AI 函数拆分",
    title: "审阅 AI 的函数拆分建议",
    description: "先独立提出接口，再用 AI 反例审阅；最终由你亲自实现并验证所选方案。",
    steps: ["先在练习单写出自己的函数职责与参数。", "请 AI 提建议但不让它重写整个程序；检查是否混合更新、碰撞和绘制。", "自己实现下面的移动接口。", "用和基线相同的普通/边界输入做回归，并记录采纳理由。"],
    acceptance: "自定义函数返回 [3, 18, 18]，且输入—输出边界清楚。",
    starterCode: 'tests = [(4, -1), (17, 1), (18, 1)]\n\ndef move_x(x, step):\n    # 按你选定的职责与接口实现边界内移动\n    pass\n\nresults = [move_x(x, step) for x, step in tests]',
    passes: (run) => run.variables.results === "[3, 18, 18]" && run.trace.some((step) => step.kind === "语句执行"),
  },
  {
    chapter: "04",
    mode: "guided",
    short: "工单对象职责",
    title: "确定 Ticket 对象的最小职责",
    description: "用对象保存一张工单自己的状态和行为；把队列统计、调度与文件保存留给流程。",
    steps: ["区分工单属性与方法。", "判断哪些状态属于单张工单。", "找出一个应由服务流程负责的行为。", "按练习单提交对象模型及理由。"],
    acceptance: "编号和状态属于工单；开始/完成属于行为；队列调度不属于单张 Ticket。",
    prompt: "为有编号、等待/处理/完成/取消状态的服务工单设计最小对象。",
    code: "Ticket 需求：保存虚构编号与当前状态；能够开始处理和完成。",
    questions: [
      { key: "state", label: "属于单张工单的状态", type: "select", answer: "ticket_id、status", choices: ["ticket_id、status", "整个队列的服务顺序", "所有工单的统计报表"] },
      { key: "behavior", label: "适合由工单对象完成的行为", type: "select", answer: "start()、complete()", choices: ["start()、complete()", "choose_next_ticket()、save_all()", "draw_every_ticket()、load_config()"] },
      { key: "outside", label: "不应默认塞进 Ticket 的职责", type: "select", answer: "选择下一张工单并管理全队列", choices: ["选择下一张工单并管理全队列", "保存当前工单状态", "完成当前工单"] },
    ],
    feedback: {
      state: { wrongResult: "单张工单会携带全队列数据或报表，多个工单之间容易互相污染、难以独立处理。", why: "ticket_id 和 status 描述这一张工单自身；队列顺序和汇总报表属于服务台。" },
      behavior: {
        wrongResult: "把队列调度、保存所有数据或画所有工单塞进 Ticket，会让一个对象承担多个层级的职责。",
        why: "start() 和 complete() 只改变当前工单的状态，和对象自己的数据相对应。",
        choiceHelp: {
          "start()、complete()": "对象方法：开始/完成当前工单，并更新它自己的状态。",
          "choose_next_ticket()、save_all()": "前者调度整个队列，后者保存多张工单；通常属于服务流程或存储模块。",
          "draw_every_ticket()、load_config()": "绘制全部工单和读取全局配置不是单张 Ticket 的状态行为。",
        },
      },
      outside: { wrongResult: "让 Ticket 管理整个队列会产生重复调度状态；不同工单对象也会彼此越权。", why: "单张对象保存自己的编号/状态并执行自己的行为；选择下一张由队列或服务台负责。" },
    },
  },
  {
    chapter: "04",
    mode: "code",
    short: "两个工单对象",
    title: "预测两个工单对象的状态",
    description: "同类工单共享类定义，但每个实例独立保存编号与处理状态；绘制两张工单的状态轨迹。",
    steps: ["定义 Ticket 的编号、初始状态和状态方法。", "创建题目给出的两个实例。", "依次开始/完成 A，再取消 B。", "绘制最终状态并核对中间轨迹。"],
    acceptance: "最终状态为 [('A', 'completed'), ('B', 'cancelled')]；两个实例只被各自的操作改变。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'class Ticket:\n    def __init__(self, ticket_id):\n        self.ticket_id = ticket_id\n        self.status = "waiting"\n\n    def start(self):\n        # TODO：只有 waiting 才能进入 serving\n        pass\n\n    def complete(self):\n        # TODO：只有 serving 才能进入 completed\n        pass\n\n    def cancel(self):\n        # TODO：只有 waiting 才能进入 cancelled\n        pass\n\na = Ticket("A")\nb = Ticket("B")\na.start()\na.complete()\nb.cancel()\nstates = [(a.ticket_id, a.status), (b.ticket_id, b.status)]\n\nscreen.clear()\n# TODO：用两条矩形和文字显示编号、状态，再提交画面',
    passes: (run) => run.variables.states === "[('A', 'completed'), ('B', 'cancelled')]" && hasScreenFrames(run, 1) && run.history[0].objects.filter((item) => item.type === "rect").length === 2,
  },
  {
    chapter: "04",
    mode: "code",
    short: "工单状态重构",
    title: "把工单状态交给 Ticket 对象",
    description: "用实例保存工单状态并调用自己的行为，与原有状态变量实现比较。",
    steps: ["定义 Ticket 的初始状态。", "亲自实现 start() 和 complete()。", "从 waiting 创建实例并调用两次。", "将对象结果与独立变量结果比较。"],
    acceptance: "两种实现最终状态均为 completed，且状态属于对应工单实例。",
    starterCode: 'class Ticket:\n    def __init__(self, ticket_id):\n        self.ticket_id = ticket_id\n        self.status = "waiting"\n\n    def start(self):\n        # TODO：从 waiting 更新为 serving\n        pass\n\n    def complete(self):\n        # TODO：从 serving 更新为 completed\n        pass\n\nticket = Ticket("A-01")\nticket.start()\nticket.complete()\nobject_status = ticket.status\nglobal_status = "waiting"\nif global_status == "waiting":\n    global_status = "serving"\nif global_status == "serving":\n    global_status = "completed"',
    passes: (run) => run.variables.object_status === "'completed'" && run.variables.global_status === "'completed'",
  },
  {
    chapter: "04",
    mode: "code",
    short: "工单初始化与转换",
    title: "核对工单初始化与状态转换",
    description: "检查两个 Ticket 是否使用各自的构造参数；转换第一张工单时，第二张应保持 waiting。",
    steps: ["定义 ticket_id 与 status 两项实例状态。", "实现 start() 和 complete()。", "创建两个不同编号的工单，只更新第一张。", "绘制两张工单并检查状态与编号。"],
    acceptance: "第一张为 completed、第二张仍为 waiting；预览中编号和状态与实例属性对应。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'class Ticket:\n    def __init__(self, ticket_id):\n        self.ticket_id = ticket_id\n        self.status = "waiting"\n\n    def start(self):\n        # TODO：只有 waiting 才进入 serving\n        pass\n\n    def complete(self):\n        # TODO：只有 serving 才进入 completed\n        pass\n\nfirst = Ticket("A-01")\nsecond = Ticket("B-02")\nfirst.start()\nfirst.complete()\nstates = [(first.ticket_id, first.status), (second.ticket_id, second.status)]\n\nscreen.clear()\n# TODO：按状态绘制两张工单卡片并提交画面',
    passes: (run) => run.variables.states === "[('A-01', 'completed'), ('B-02', 'waiting')]" && hasScreenFrames(run, 1) && run.history[0].objects.filter((item) => item.type === "rect").length === 2,
  },
  {
    chapter: "04",
    mode: "code",
    short: "类与继承审阅",
    title: "验证工单继承、重写与多态",
    description: "工单共享编号和摘要行为；设备工单还需要设备名称。先判断继承是否复用真实共同职责，再亲自实现并运行验证。",
    steps: ["先在练习单列出 Ticket、ServiceDesk 的职责，并记录是否需要继承及需求依据；可先让 AI 提建议，再核对它是否把队列或历史塞进单张工单。", "补全 DeviceTicket：用 super().__init__() 保留父类初始化的工单编号，并保存设备名称。", "重写 summary()，在父类摘要上补充设备信息。", "把父类与子类实例放入同一个列表，调用同名方法并核对输出；运行通过只能证明行为符合代码，不能代替设计理由。"],
    acceptance: "子类保留父类初始化的编号并增加设备数据；父类、子类对象都响应 summary()，结果体现方法重写和多态调用。",
    starterCode: 'class Ticket:\n    def __init__(self, ticket_id):\n        # TODO：保存父类工单编号\n        pass\n\n    def summary(self):\n        # TODO：返回工单编号\n        pass\n\nclass DeviceTicket(Ticket):\n    def __init__(self, ticket_id, device):\n        # TODO：调用父类初始化并保存设备名称\n        pass\n\n    def summary(self):\n        # TODO：在 super().summary() 的结果后补充设备名称\n        pass\n\ntickets = [Ticket("WO-1001"), DeviceTicket("WO-2002", "sensor")]\nticket_ids = [ticket.ticket_id for ticket in tickets]\nsummaries = [ticket.summary() for ticket in tickets]\nprint(summaries)',
    passes: (run) => run.variables.ticket_ids === "['WO-1001', 'WO-2002']" && run.variables.summaries === "['WO-1001', 'WO-2002 | sensor']",
  },
  {
    chapter: "05",
    mode: "code",
    short: "站点集合更新",
    title: "追踪站点集合的状态变化",
    description: "借还操作改变对应站点的可用量；用电子屏逐帧呈现更新前后集合和容量。",
    steps: ["先写出站点编号、可用量和容量。", "从 A 借出一辆并记录中间列表。", "向 B 归还一辆，再检查已满的 C 是否保持不变。", "绘制借出后与归还后的站点集合。"],
    acceptance: "借出后为 [('A', 2, 8), ('B', 0, 6), ('C', 5, 5)]；归还后为 [('A', 2, 8), ('B', 1, 6), ('C', 5, 5)]。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'stations = [("A", 3, 8), ("B", 0, 6), ("C", 5, 5)]\n# 每个元组依次表示站点编号、可用量和容量\nafter_borrow = []\nfor name, available, capacity in stations:\n    # TODO：只对 A 借出一辆，其他记录保持不变\n    pass\nafter_return = []\nfor name, available, capacity in after_borrow:\n    # TODO：只对 B 归还一辆\n    pass\n\n# TODO：分别绘制两组记录，显示编号/可用量并提交两帧',
    passes: (run) => run.variables.after_borrow === "[('A', 2, 8), ('B', 0, 6), ('C', 5, 5)]" && run.variables.after_return === "[('A', 2, 8), ('B', 1, 6), ('C', 5, 5)]" && hasScreenFrames(run, 2) && run.history[0].objects.filter((item) => item.type === "rect").length === 3 && run.history[1].objects.filter((item) => item.type === "rect").length === 3,
  },
  {
    chapter: "05",
    mode: "code",
    short: "遍历删除调试",
    title: "复现遍历时删除造成的遗漏",
    description: "先保留服务记录归档的原始反例，再修复遍历删除时跳过相邻记录的问题。",
    steps: ["运行前预测原循环结果。", "复制状态列表并运行遍历删除写法。", "追踪删除后索引与列表长度的变化。", "实现修复并确认 waiting 记录仍保留。"],
    acceptance: "原写法剩下 [4, 7]；修复后只剩 [7]。",
    starterCode: 'targets = (2, 4, 6)\nitems = [2, 4, 6, 7]\nbuggy = items.copy()\nfor item in buggy:\n    # 原有写法：遍历时直接删除\n    if item in targets:\n        buggy.remove(item)\n\n# TODO：用筛选新列表或从副本遍历修复\nfixed = []',
    passes: (run) => run.variables.buggy === "[4, 7]" && run.variables.fixed === "[7]",
  },
  {
    chapter: "05",
    mode: "code",
    short: "提醒阈值配置",
    title: "把提醒阈值集中到配置中",
    description: "把可用量提醒规则放在具名配置中，再让状态判断读取对应阈值。",
    steps: ["建立 normal 与 sensitive 两组具名阈值。", "让状态函数读取 low_stock_threshold。", "分别判断可用量 3 的站点状态。", "检查调整阈值是否只需修改配置。"],
    acceptance: "普通阈值 2 时状态为 available；敏感阈值 4 时为 review。",
    starterCode: 'configs = {\n    # TODO：填写 normal 和 sensitive 的 low_stock_threshold\n}\n\ndef station_status(available, config):\n    # TODO：低于或等于阈值时返回 review，否则返回 available\n    pass\n\nnormal = configs["normal"]\nsensitive = configs["sensitive"]\nnormal_threshold = normal["low_stock_threshold"]\nsensitive_threshold = sensitive["low_stock_threshold"]\nnormal_status = station_status(3, normal)\nsensitive_status = station_status(3, sensitive)',
    passes: (run) => run.variables.normal_status === "'available'" && run.variables.sensitive_status === "'review'" && run.variables.normal_threshold === "2" && run.variables.sensitive_threshold === "4",
  },
  {
    chapter: "05",
    mode: "guided",
    short: "选择数据结构",
    title: "为可调设置选择数据结构",
    description: "考虑按名称查找、增加字段和是否需要附带行为，再选最简单够用的表示。",
    steps: ["判断设置是否需要按名称访问。", "区分配置数据与有独立行为的对象。", "比较列表、字典和类的修改成本。", "将选择依据记录到练习单。"],
    acceptance: "具名参数使用清楚直接的数据结构；类只在状态与行为需要组织时采用。",
    prompt: "为 station_capacity、low_stock_threshold、unit 选择容易按名称查找和扩展的结构。",
    code: "需求：集中保存具名站点/提醒设置，后续方便增加 source_note。",
    questions: [
      { key: "settings", label: "本题最直接的设置结构", type: "select", answer: "字典：用字段名称访问对应值", choices: ["字典：用字段名称访问对应值", "列表：依赖位置记住每个字段", "每个设置值都单独创建一个类"] },
      { key: "class", label: "什么时候配置对象更合适", type: "select", answer: "配置需要与相关行为或约束一起组织时", choices: ["配置需要与相关行为或约束一起组织时", "任何数据都必须写成类", "只为少数数字增加继承关系"] },
      { key: "criterion", label: "判断依据", type: "select", answer: "按名称定位、变化范围和实际职责", choices: ["按名称定位、变化范围和实际职责", "数据结构越复杂越好", "选择代码行数最多的方案"] },
    ],
    feedback: {
      settings: {
        wrongResult: "新增或调整设置时会依赖记忆字段位置，插入一项后容易读错值；为每个数建类则增加无用维护成本。",
        why: "字典用名称访问 station_capacity 等具名设置，新增字段不要求记住位置。",
        choiceHelp: {
          "字典：用字段名称访问对应值": "dict 以键（如 \"unit\"）查值，适合字段有名字、需要灵活增减的配置。",
          "列表：依赖位置记住每个字段": "list 按索引取值；字段顺序一变，配置读取处也容易跟着出错。",
          "每个设置值都单独创建一个类": "简单的若干配置值不需要各自变成对象；只有需要行为/约束时才考虑类。",
        },
      },
      class: { wrongResult: "把所有配置都做成类或继承会增加文件、类型和维护步骤，少量静态值并不会因此更安全。", why: "当配置需要与验证规则、更新行为或其他职责共同组织时，对象才有实际收益。" },
      criterion: { wrongResult: "按复杂度或行数选择可能让团队承担更多修改成本，却没有解决需求。", why: "先看如何查找、哪些值会一起变化、谁负责它们，再选足够简单的数据结构。" },
    },
  },
  {
    chapter: "05",
    mode: "code",
    short: "队列暂停与恢复",
    title: "组织并验证服务队列的暂停与恢复",
    description: "暂停期间不开始新工单；恢复后按原顺序继续，并用队列状态核对没有漏单或重复处理。",
    steps: ["先列出 running 与 paused 各自允许的处理。", "用状态序列模拟暂停和恢复。", "只有 running 时才从队列取出下一项。", "绘制暂停与恢复后的队列，核对原顺序。"],
    acceptance: "暂停后队列仍为 ['A', 'B']；恢复处理 A 后为 ['B']。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'queue = ["A", "B"]\nstates = []\nfor state in ("paused", "running"):\n    # TODO：只有 running 才取出队首工单\n    states.append((state, queue.copy()))\n\n# TODO：绘制暂停和恢复处理后的队列，提交两帧\nfor state_name, remaining in states:\n    screen.clear()\n    # TODO：显示状态和剩余工单编号',
    passes: (run) => run.variables.states === "[('paused', ['A', 'B']), ('running', ['B'])]" && hasScreenFrames(run, 2) && run.history.every((frame) => frame.objects.some((item) => item.type === "text")),
  },
  {
    chapter: "06",
    mode: "code",
    short: "读取项目记录",
    title: "预测项目记录文件的两条路径",
    description: "在隔离临时目录中区分有效 JSON 与文件缺失；只为预期缺失提供默认值。",
    steps: ["用 Path 创建一份虚构服务记录 JSON。", "定义读取函数，只捕获 FileNotFoundError。", "再读取一个不存在的路径。", "分别检查记录列表与用户反馈。"],
    acceptance: "有效文件返回一条记录；缺失文件返回 [] 并有明确提示。",
    starterCode: 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport json\n\nwith TemporaryDirectory() as temp:\n    existing_path = Path(temp) / "records.json"\n    existing_path.write_text(\'{"items": [{"id": "A-01", "status": "completed"}]}\', encoding="utf-8")\n\n    def load_records(path):\n        try:\n            data = json.loads(Path(path).read_text(encoding="utf-8"))\n            # TODO：返回 items 和成功反馈\n            pass\n        except FileNotFoundError:\n            # TODO：返回空列表和“暂无记录”一类提示\n            pass\n\n    existing, existing_message = load_records(existing_path)\n    missing, missing_message = load_records(Path(temp) / "missing.json")',
    passes: (run) => run.variables.existing === "[{'id': 'A-01', 'status': 'completed'}]" && run.variables.missing === "[]" && run.variables.missing_message === "'暂无记录'",
  },
  {
    chapter: "06",
    mode: "code",
    short: "JSON traceback",
    title: "定位损坏 JSON 的 traceback",
    description: "对照有效、损坏、恢复后的文件状态，识别解析错误而不是把它当作空记录。",
    steps: ["在临时目录写入有效 JSON 并读取。", "改写为题目给定的损坏内容，尝试解析。", "只捕获 JSONDecodeError 并记录异常类型。", "恢复有效内容后再次读取。"],
    acceptance: "损坏内容产生 JSONDecodeError；恢复后仍读到一条完整记录。",
    starterCode: 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport json\n\nwith TemporaryDirectory() as temp:\n    path = Path(temp) / "data" / "records.json"\n    path.parent.mkdir(parents=True, exist_ok=True)\n    path.write_text(\'{"items": [{"id": "A-01", "status": "completed"}]}\', encoding="utf-8")\n    valid = json.loads(path.read_text(encoding="utf-8"))["items"]\n    path.write_text(\'{"items": [\', encoding="utf-8")\n    error_type = None\n    try:\n        # TODO：尝试解析损坏内容\n        pass\n    except json.JSONDecodeError as error:\n        error_type = type(error).__name__\n    path.write_text(\'{"items": [{"id": "A-01", "status": "completed"}]}\', encoding="utf-8")\n    recovered = json.loads(path.read_text(encoding="utf-8"))["items"]',
    passes: (run) => run.variables.valid === "[{'id': 'A-01', 'status': 'completed'}]" && run.variables.error_type === "'JSONDecodeError'" && run.variables.recovered === run.variables.valid,
  },
  {
    chapter: "06",
    mode: "code",
    short: "路径调试",
    title: "按证据修复文件路径",
    description: "文件真实名称是 record.json，程序尝试读取 records.json；不要用新建空文件掩盖路径错误。",
    steps: ["在临时目录创建真实文件 data/record.json。", "复现读取 data/records.json 的错误并记录类型。", "检查目录中的真实文件名。", "做最小路径修复并再次读取有效内容。"],
    acceptance: "错误路径触发 FileNotFoundError；修正后读取到一条虚构记录。",
    starterCode: 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport json\n\nwith TemporaryDirectory() as temp:\n    folder = Path(temp) / "data"\n    folder.mkdir()\n    (folder / "record.json").write_text(\'{"items": [{"id": "A-01", "status": "completed"}]}\', encoding="utf-8")\n    error_type = None\n    try:\n        # TODO：先复现读取错误的 records.json\n        pass\n    except FileNotFoundError as error:\n        error_type = type(error).__name__\n    # TODO：根据目录证据修正路径并读取\n    records = []',
    passes: (run) => run.variables.error_type === "'FileNotFoundError'" && run.variables.records === "[{'id': 'A-01', 'status': 'completed'}]",
  },
  {
    chapter: "06",
    mode: "guided",
    short: "异常处理审阅",
    title: "审阅 AI 生成的异常处理",
    description: "检查宽泛捕获是否把 JSON 损坏、编码错误等不同问题都伪装成空记录。",
    steps: ["先独立判断这段 except Exception 的影响。", "比较有效文件、缺失文件和损坏 JSON 三种输入。", "选择只处理已知情况的最小方向。", "把实际测试证据和修订理由记入练习单。"],
    acceptance: "缺失文件可按需求提供默认值，但损坏 JSON 必须保留可诊断错误。",
    prompt: "下面的处理方式是否能区分文件不存在和 JSON 内容损坏？",
    code: 'try:\n    data = json.load(file)\nexcept Exception:\n    data = {"items": []}',
    questions: [
      { key: "valid", label: "有效 JSON 应当", type: "select", answer: "保留文件中的真实记录", choices: ["保留文件中的真实记录", "无条件变成空列表", "被报告为文件不存在"] },
      { key: "missing", label: "缺失文件可以", type: "select", answer: "只按需求捕获 FileNotFoundError 并给默认值", choices: ["只按需求捕获 FileNotFoundError 并给默认值", "捕获所有异常并静默忽略", "自动覆盖为新文件且不记录"] },
      { key: "broken", label: "损坏 JSON 应当", type: "select", answer: "保留 JSONDecodeError 等诊断信息，不伪装成空数据", choices: ["保留 JSONDecodeError 等诊断信息，不伪装成空数据", "一律当作无记录", "删除错误信息后继续"] },
    ],
    feedback: {
      valid: {
        wrongResult: "把有效文件当成空数据会丢失已保存记录，后续分析和处理都基于不完整数据。",
        why: "JSON 内容合法时，程序应读取并保留文件中的真实记录。",
      },
      missing: {
        wrongResult: "捕获所有异常会把数据损坏也隐藏起来；自动覆盖还可能毁掉用户已有文件。",
        why: "只对预期的 FileNotFoundError 提供默认值，其余错误继续暴露，便于修复。",
        choiceHelp: {
          "只按需求捕获 FileNotFoundError 并给默认值": "FileNotFoundError 表示目标路径不存在；只有业务允许首次创建时才提供默认数据。",
          "捕获所有异常并静默忽略": "宽泛捕获会把 JSON 格式错误、权限问题等不同故障伪装成成功。",
          "自动覆盖为新文件且不记录": "覆盖会丢失已有数据；没有诊断记录也无法追查原因。",
        },
      },
      broken: {
        wrongResult: "损坏文件会被误当成正常的空记录，错误被藏起来，重要数据可能一直无法恢复。",
        why: "JSONDecodeError 表示文件内容无法解析，应保留诊断信息而非假装文件为空或不存在。",
        choiceHelp: {
          "保留 JSONDecodeError 等诊断信息，不伪装成空数据": "JSONDecodeError 表示 JSON 语法损坏；保留错误位置有助于修复文件。",
          "一律当作无记录": "空记录是有效数据，不能代替解析失败，否则会掩盖损坏。",
          "删除错误信息后继续": "去掉 traceback 或错误信息会丢失定位线索，后续更难修复。",
        },
      },
    },
  },
  {
    chapter: "07",
    mode: "code",
    short: "站点借还测试",
    title: "为站点借还规则设计测试",
    description: "可用量大于零才可借出、未满才可归还；使用电子屏对照普通值与两侧边界。",
    steps: ["先写出正常借出、空站借出和满站归还的预期。", "实现可单独检查的数量规则。", "运行三组测试并收集结果。", "调用 PyScreen 绘制数量、容量和判断结果。"],
    acceptance: "普通借出为 True、空站借出为 False、满站归还为 False；预览显示三组输入和结果。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'def can_borrow(available):\n    # TODO：只有可用量大于 0 时返回 True\n    pass\n\ndef can_return(available, capacity):\n    # TODO：只有可用量小于容量时返回 True\n    pass\n\ncases = [\n    ("普通借出", can_borrow(3)),\n    ("空站借出", can_borrow(0)),\n    ("满站归还", can_return(5, 5)),\n]\nresults = [answer for _, answer in cases]\n\n# TODO：逐帧显示当前数量、容量和判断结果\nfor index, (label, answer) in enumerate(cases):\n    screen.clear()\n    # TODO：调用绘制函数呈现本组数据和结果，再提交本帧',
    passes: (run) => run.variables.results === "[True, False, False]" && hasScreenFrames(run, 3) && run.history.every((frame) => frame.objects.some((item) => item.type === "rect") && frame.objects.some((item) => item.type === "text")),
  },
  {
    chapter: "07",
    mode: "code",
    short: "断言验证",
    title: "用断言检查站点规则",
    description: "沿用上一题的站点规则：测试断言检查结果，ValueError 拒绝非法数量。",
    steps: ["实现 can_apply(action, available, capacity)，合法输入返回判断结果。", "用普通借出、空站借出和满站归还核对规则表。", "用负数可用量确认函数抛出 ValueError，不用 assert 做输入校验。", "故意让错误实现允许空站借出，确认测试断言能够失败。"],
    acceptance: "普通借出允许；空站借出和满站归还不允许；负数触发 ValueError；错误规则被测试发现。",
    starterCode: 'def can_apply(action, available, capacity):\n    # TODO：非法数量抛出 ValueError；合法数量按操作返回 True/False\n    pass\n\nnormal = can_apply("borrow", 3, 8)\nzero = can_apply("borrow", 0, 8)\nfull = can_apply("return", 8, 8)\ninvalid_detected = False\ntry:\n    can_apply("borrow", -1, 8)\nexcept ValueError:\n    invalid_detected = True\n\ndef wrong_can_apply(action, available, capacity):\n    return True\n\nwrong_detected = False\ntry:\n    assert wrong_can_apply("borrow", 0, 8) is False\nexcept AssertionError:\n    wrong_detected = True',
    passes: (run) => run.variables.normal === "True" && run.variables.zero === "False" && run.variables.full === "False" && run.variables.invalid_detected === "True" && run.variables.wrong_detected === "True",
  },
  {
    chapter: "07",
    mode: "code",
    short: "重构回归",
    title: "只改结构并做回归",
    description: "提取一个站点借还规则函数，但不改变同组输入的状态结果。",
    steps: ["先保存普通借出、空站借出和满站归还的基线。", "只重构判断逻辑，不新增业务规则。", "对相同输入计算重构后的结果。", "逐项比较 before 与 after。"],
    acceptance: "改前、改后均为 [True, False, False]，同一组输入行为不变。",
    starterCode: 'inputs = [("borrow", 3, None), ("borrow", 0, None), ("return", 5, 5)]\nbefore = [True, False, False]\n\ndef can_apply(action, available, capacity=None):\n    # TODO：提取判断并保持空站/满站规则\n    pass\n\nafter = [can_apply(action, available, capacity) for action, available, capacity in inputs]',
    passes: (run) => run.variables.before === "[True, False, False]" && run.variables.after === run.variables.before,
  },
  {
    chapter: "07",
    mode: "code",
    short: "审阅 AI 测试",
    title: "审阅 AI 生成的测试",
    description: "普通样例不足以证明借还规则准确；补上空站、满站边界，再运行所有用例。",
    steps: ["先独立写出至少两个测试。", "让 AI 建议额外测试，并检查是否只覆盖典型情况。", "在 cases 中保留普通操作、空站和满站反例。", "运行测试并记录 AI 建议的采纳或拒绝理由。"],
    acceptance: "普通借出成功，空站借出和满站归还失败且不改变数量。",
    starterCode: 'def can_apply(action, available, capacity=None):\n    # TODO：实现普通借出、空站借出和满站归还规则\n    pass\n\ncases = [\n    ("normal", "borrow", 3, None, True),\n    ("empty", "borrow", 0, None, False),\n    ("full", "return", 5, 5, False),\n]\nresults = [(name, can_apply(action, available, capacity)) for name, action, available, capacity, _ in cases]\nexpected = [(name, answer) for name, _, _, _, answer in cases]',
    passes: (run) => run.variables.results === "[('normal', True), ('empty', False), ('full', False)]" && run.variables.results === run.variables.expected,
  },
  {
    chapter: "08",
    mode: "guided",
    short: "文件分类规则",
    title: "定义文件分类与冲突规则",
    description: "根据扩展名分类；未知类型保持原位；同名目标必须报告冲突、不覆盖。",
    steps: ["逐个判断文件扩展名。", "区分分类、保持原位和冲突三种结果。", "说明判定依据来自文件名的哪一部分。", "将完整分类表带回练习单。"],
    acceptance: "PNG、PDF、CSV 各进入对应目录；README 保持原位；同名冲突被报告。",
    prompt: "为 photo.png、notes.pdf、report.csv、README 选择去向，并判断已有同名目标时如何处理。",
    code: "课程规则：.png → images；.pdf → documents；.csv → data；未知类型不移动。",
    questions: [
      { key: "png", label: "photo.png", type: "select", answer: "images/photo.png", choices: ["images/photo.png", "documents/photo.png", "保持原位"] },
      { key: "pdf", label: "notes.pdf", type: "select", answer: "documents/notes.pdf", choices: ["images/notes.pdf", "documents/notes.pdf", "保持原位"] },
      { key: "csv", label: "report.csv", type: "select", answer: "data/report.csv", choices: ["data/report.csv", "images/report.csv", "保持原位"] },
      { key: "readme", label: "README", type: "select", answer: "保持原位，并说明未知类型", choices: ["保持原位，并说明未知类型", "放入 images", "删除"] },
      { key: "conflict", label: "目标已有同名文件", type: "select", answer: "报告冲突，不覆盖", choices: ["报告冲突，不覆盖", "静默覆盖", "删除已有目标"] },
    ],
    feedback: {
      png: { wrongResult: "图片会被放进错误分类或留在未整理位置，后续图片查找规则无法按预期工作。", why: ".png 按题目规则归入 images/。" },
      pdf: { wrongResult: "PDF 会进入错误目录或未分类，按文件用途查找时会遗漏。", why: ".pdf 按题目规则归入 documents/。" },
      csv: { wrongResult: "数据表会混入图片目录或没有整理，后续数据处理脚本找不到约定路径。", why: ".csv 按题目规则归入 data/。" },
      readme: { wrongResult: "未知类型被乱放或删除，会破坏原有项目说明；不能仅凭未知后缀猜用途。", why: "README 没有题目定义的分类规则，先保持原位并说明待确认。" },
      conflict: { wrongResult: "覆盖或删除同名目标可能造成不可恢复的数据丢失。", why: "dry-run/整理工具应先报告冲突，让用户决定，不擅自改写目标文件。" },
    },
  },
  {
    chapter: "08",
    mode: "code",
    short: "Dry run 计划",
    title: "先实现只报告计划的 dry run",
    description: "仅在练习台隔离的 /workspace 临时文件系统中列出来源和目标；不得移动文件。",
    steps: ["创建课程给定的三个临时样例文件。", "根据后缀生成计划与不处理原因。", "不要调用 rename、replace 或 unlink。", "比较运行前后的文件名和数量。"],
    acceptance: "photo.png 与 notes.pdf 有目标路径，README 标记保持原位，目录未改变。",
    starterCode: 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as temp:\n    root = Path(temp) / "inbox"\n    root.mkdir()\n    for name in ("photo.png", "notes.pdf", "README"):\n        (root / name).write_text("sample", encoding="utf-8")\n    before = sorted(path.name for path in root.iterdir())\n    mapping = {".png": "images", ".pdf": "documents", ".csv": "data"}\n    plan = []\n    for path in sorted(root.iterdir()):\n        # TODO：只生成 (源文件名, 目标路径或保持原位说明)\n        pass\n    after = sorted(path.name for path in root.iterdir())',
    passes: (run) => run.variables.before === "['README', 'notes.pdf', 'photo.png']" && run.variables.after === run.variables.before && run.variables.plan === "[('README', '保持原位'), ('notes.pdf', 'documents/notes.pdf'), ('photo.png', 'images/photo.png')]",
  },
  {
    chapter: "08",
    mode: "code",
    short: "空目录与冲突",
    title: "验证空目录、未知类型和同名冲突",
    description: "用临时数据验证空目录、未知扩展名与已有目标文件；所有测试都必须保持源文件。",
    steps: ["建立一个只生成计划、不执行移动的函数。", "分别处理空输入、未知扩展名和目标同名。", "先写预期再检查输出。", "确认源文件仍在且冲突没有覆盖。"],
    acceptance: "空目录计划为空；archive.xyz 保留；photo.png 冲突明确且未覆盖。",
    starterCode: 'def build_plan(files, existing_targets):\n    # TODO：返回每项文件的分类、保持原位或冲突计划\n    return []\n\nempty_plan = build_plan([], set())\nunknown_plan = build_plan(["archive.xyz"], set())\nconflict_plan = build_plan(["photo.png"], {"images/photo.png"})',
    passes: (run) => run.variables.empty_plan === "[]" && run.variables.unknown_plan?.includes("archive.xyz") && run.variables.conflict_plan?.includes("冲突"),
  },
  {
    chapter: "08",
    mode: "code",
    short: "AI 整理计划审阅",
    title: "审阅 AI 提出的整理计划",
    description: "AI 只能提出计划；你要用分类、未知类型和冲突样例验证它，不对真实目录执行操作。",
    steps: ["先列出 dry run、未知类型和冲突要求。", "请 AI 检查计划，不授予它真实文件操作。", "亲自实现只读计划函数并运行临时样例。", "检查前后文件名不变，记录采纳/拒绝理由。"],
    acceptance: "分类目标正确，未知文件与冲突被报告，测试前后目录内容相同。",
    starterCode: 'from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as temp:\n    root = Path(temp) / "review"\n    root.mkdir()\n    for name in ("photo.png", "archive.xyz"):\n        (root / name).write_text("keep", encoding="utf-8")\n    existing_targets = {"images/photo.png"}\n    before = sorted(path.name for path in root.iterdir())\n    plan = []\n    # TODO：为每个源文件生成 dry run 记录；发现同名目标时报告冲突\n    after = sorted(path.name for path in root.iterdir())',
    passes: (run) => run.variables.before === "['archive.xyz', 'photo.png']" && run.variables.after === run.variables.before && run.variables.plan?.includes("images/photo.png") && run.variables.plan.includes("冲突") && run.variables.plan.includes("保持原位"),
  },
  {
    chapter: "09",
    mode: "guided",
    short: "改写求助请求",
    title: "把模糊求助改写为可复现问题",
    description: "在发送前写出目标、现象、最小代码/错误、尝试过的内容，并检查隐私。",
    steps: ["先独立重写“程序错了，帮我修一下”。", "补充输入 abc、实际 ValueError 和期望反馈。", "检查路径、姓名、密钥等敏感内容是否移除。", "练习台文字仅在当前页面临时保留，不会上传或跨刷新保存；请把最终记录复制到练习单。"],
    acceptance: "请求含目标、输入/现象、错误信息、期望结果和已尝试内容，且不含敏感信息。",
    manualReview: true,
    prompt: "本题场景：输入移动格数更新 x；输入 abc 时产生 ValueError。写出一段可复现的求助请求，随后按左侧清单自行检查。",
    code: "不要粘贴真实姓名、个人路径、密钥或未公开作业。",
    questions: [
      { key: "prompt", label: "我的请求草稿（至少 40 字；此页不会发送）", type: "textarea", minLength: 40, manual: true, wide: true },
      { key: "privacy", label: "提交前是否移除了敏感信息？", type: "select", answer: "已检查并移除", choices: ["已检查并移除", "尚未检查"] },
    ],
    feedback: {
      privacy: { wrongResult: "如果把真实姓名、个人路径、密钥或未公开作业提交给外部 AI，可能造成隐私泄露或凭据被滥用。", why: "先移除与排查无关的敏感信息，再只提供复现问题所需上下文；本页本身不会发送草稿。" },
    },
  },
  {
    chapter: "09",
    mode: "guided",
    short: "比较 AI 方案",
    title: "比较同一需求的两个 AI 方案",
    description: "先写自己的最小方案，再比较 AI 方案的假设、影响范围和未知点。",
    steps: ["在使用 AI 前写出预计修改位置和空站/满站边界行为。", "请 AI 给两个方案而非直接重写项目。", "检查是否有无关依赖、扩大修改或未说明的容量假设。", "按需求与测试证据选择方案，并记录原因。"],
    acceptance: "选择以需求和测试证据为依据，而不是代码长短或 AI 语气。",
    manualReview: true,
    prompt: "为“可用量为 0 时不可借出，达到容量时不可归还”比较两个实现方案，判断哪些证据支持你的选择。",
    code: "不需要在此页面调用 AI；请在自己的 AI 工具中完成比较，再按清单记录。",
    questions: [
      { key: "assumption", label: "方案审阅时优先检查", type: "select", answer: "边界规则、改动范围和未说明假设", choices: ["边界规则、改动范围和未说明假设", "代码行数和术语多少", "回答的语气是否肯定"] },
      { key: "decision", label: "选择方案的可靠依据", type: "select", answer: "需求约束与可复现测试", choices: ["需求约束与可复现测试", "AI 说哪个更好", "看起来更复杂的实现"] },
      { key: "comparison", label: "记录自己的方案、AI 建议与选择理由（至少 40 字；刷新后清除）", type: "textarea", minLength: 40, manual: true, wide: true },
    ],
    feedback: {
      assumption: { wrongResult: "忽略边界或隐藏假设，可能让方案在空站、满站等真实边界上出错，或顺手改动无关模块。", why: "边界规则、影响范围和未说明假设决定方案是否符合需求以及风险有多大。" },
      decision: { wrongResult: "仅凭 AI 说法或实现复杂度无法证明功能正确，可能采纳一个没有通过需求测试的方案。", why: "需求约束说明要达到什么结果，可复现测试说明实际是否达到。" },
    },
  },
  {
    chapter: "09",
    mode: "code",
    short: "反例检查借还边界",
    title: "用反例检查 AI 给出的站点规则",
    description: "审阅一个会让空站数量变成 -1、满站数量超过容量的建议，修正后用同一组输入重测，并在电子屏比较数量变化。",
    steps: ["先预测普通借出、空站借出、满站归还的原代码结果。", "找出哪些结果违反数量范围 0..capacity。", "修正 change_available()，边界操作保持原数量。", "调用 PyScreen 逐帧显示操作前后和结果，再用同一组输入复验。"],
    acceptance: "修复后三种结果依次为 2、0、5；预览提交三帧，空站保持 0，满站保持 5。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'def change_available(available, capacity, action):\n    if action == "borrow" and available >= 0:\n        return available - 1\n    if action == "return" and available <= capacity:\n        return available + 1\n    return available\n\ncases = [("普通借出", 3, 8, "borrow"), ("空站借出", 0, 8, "borrow"), ("满站归还", 5, 5, "return")]\nresults = [change_available(count, capacity, action) for _, count, capacity, action in cases]\n\n# TODO：修正规则后逐帧显示操作前数量、结果与说明\nfor label, count, capacity, action in cases:\n    screen.clear()\n    # TODO：调用绘制函数显示 label、操作前后数量和容量，再提交本帧',
    passes: (run) => run.variables.results === "[2, 0, 5]" && hasScreenFrames(run, 3) && run.history.every((frame) => frame.objects.some((item) => item.type === "rect") && frame.objects.some((item) => item.type === "text")),
  },
  {
    chapter: "09",
    mode: "guided",
    short: "AI 使用记录",
    title: "完成 AI 使用与验证记录",
    description: "让他人能区分自己的判断、AI 建议、采纳理由和真实运行证据。",
    steps: ["按要求记录独立判断与提供给 AI 的必要上下文。", "写下 AI 建议及采纳或拒绝理由。", "列出可重复测试的输入、预期和实际结果。", "检查没有提交密钥、个人信息或多余项目文件。"],
    acceptance: "记录包含独立判断、AI 建议、取舍理由和至少一项实际测试证据。",
    manualReview: true,
    prompt: "写一份可复核的人机协作记录。文字仅暂存在当前页面，不会发给 AI 或跨刷新保存；请在练习单中保留最终记录。",
    code: "记录建议包含：我的判断、提供的上下文、AI 建议、采纳理由、输入、预期、实际结果、最终决定。",
    questions: [
      { key: "record", label: "协作与验证记录（至少 60 字；此页不会发送）", type: "textarea", minLength: 60, manual: true, wide: true },
      { key: "privacy", label: "已检查隐私与上传范围？", type: "select", answer: "已检查并移除无关/敏感内容", choices: ["已检查并移除无关/敏感内容", "尚未检查"] },
    ],
    feedback: {
      privacy: { wrongResult: "不必要的个人信息、密钥或完整项目文件可能被发送到不需要它们的外部服务。", why: "只提供完成任务所需且已脱敏的上下文，并确认实际上传范围。" },
    },
  },
  {
    chapter: "02",
    mode: "code",
    extension: true,
    short: "俄罗斯方块落地",
    title: "让俄罗斯方块方块停在最后合法行",
    description: "把棋盘简化为 20 行、把方块简化为高度 2；用条件与循环实现下落和落地停止。",
    steps: ["先写出行号范围和方块最后合法的 y。", "每一轮先判断下一步能否下移。", "合法时同时更新 y 与 steps；否则标记落地并停止。", "运行后检查 y、移动次数和停止原因。"],
    acceptance: "y=18、steps=18、landed=True；方块不会越过最后一行。",
    starterCode: 'board_height = 20\npiece_height = 2\ny = 0\nsteps = 0\nlanded = False\n\nfor _ in range(25):\n    # TODO：检查下一步是否合法；合法则下移，否则标记落地并停止\n    pass',
    passes: (run) => run.variables.y === "18" && run.variables.steps === "18" && run.variables.landed === "True",
  },
  {
    chapter: "03",
    mode: "code",
    extension: true,
    short: "俄罗斯方块旋转",
    title: "定义俄罗斯方块旋转函数",
    description: "在 3×3 网格中用函数完成顺时针 90° 坐标变换，并在电子屏上并排比较旋转前后的形状。",
    steps: ["先用一个格子检查旋转后的坐标。", "为每个 (x, y) 计算 (size - 1 - y, x)。", "把新坐标加入结果列表并返回。", "调用 PyScreen 并排绘制 before 与 rotated，核对坐标变换且确认原列表不变。"],
    acceptance: "rotated=[(2,0),(2,1),(2,2),(1,1)]；原 piece 不变；预览中旋转前后各显示四个方格。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'def rotate_clockwise(cells, size):\n    rotated = []\n    for x, y in cells:\n        # TODO：按网格规则加入旋转后的坐标\n        pass\n    return rotated\n\npiece = [(0, 0), (1, 0), (2, 0), (1, 1)]\nbefore = piece[:]\nrotated = rotate_clockwise(piece, 3)\n\n# TODO：并排调用绘制函数显示 before 与 rotated\nscreen.clear()\n# TODO：绘制两种形状的标签和格子，再提交画面',
    passes: (run) => run.variables.rotated === "[(2, 0), (2, 1), (2, 2), (1, 1)]" && run.variables.piece === run.variables.before && hasScreenFrames(run, 1) && run.history[0].objects.filter((item) => item.type === "rect").length === 8,
  },
  {
    chapter: "04",
    mode: "code",
    extension: true,
    short: "俄罗斯方块 Piece 对象",
    title: "用 Piece 对象保存方块状态",
    description: "把俄罗斯方块的局部形状和棋盘位置放进同一个实例；移动时只改位置，并把两个实例绘制出来。",
    steps: ["在初始化方法中保存 x、y 和 cells。", "实现 move(dx, dy)，更新实例位置。", "创建两个对象，分别移动。", "调用 PyScreen 按实例属性绘制两个对象，检查一个对象的变化没有串改另一个对象或形状。"],
    acceptance: "第一个对象移动后为 (5,2)，形状不变，第二个对象状态独立；预览中的活动方块由 cells 与实例位置共同决定。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'class Piece:\n    def __init__(self, x, y, cells):\n        # TODO：保存实例位置与形状\n        pass\n\n    def move(self, dx, dy):\n        # TODO：只更新实例位置\n        pass\n\npiece = Piece(3, 1, [(0, 0), (1, 0)])\nother = Piece(8, 4, [(0, 0)])\npiece.move(2, 1)\nstate = (piece.x, piece.y, piece.cells)\nother_state = (other.x, other.y)\n\n# TODO：按两个对象的实例状态调用绘制函数并提交\nscreen.clear()\n# TODO：逐格绘制两个对象的局部形状和位置',
    passes: (run) => run.variables.state === "(5, 2, [(0, 0), (1, 0)])" && run.variables.other_state === "(8, 4)" && hasScreenFrames(run, 1) && run.history[0].objects.filter((item) => item.type === "rect").length === 3,
  },
  {
    chapter: "05",
    mode: "code",
    extension: true,
    short: "俄罗斯方块棋盘碰撞",
    title: "用二维列表检查方块能否放置",
    description: "0 表示空格，1 表示已占用；分别检查空位、右侧越界和与已有格重叠，并把三个测试场景画到电子屏。",
    steps: ["把局部格子坐标换算为棋盘坐标。", "先检查列、行是否越界。", "再检查对应格子是否已占用。", "调用 PyScreen 逐帧显示三种场景，说明候选方块能否放下。"],
    acceptance: "results=[True,False,False]，依次表示空位可放、越界不可放、重叠不可放；预览提交三个对应棋盘帧。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'def can_place(board, cells, x, y):\n    for dx, dy in cells:\n        cell_x = x + dx\n        cell_y = y + dy\n        # TODO：检查边界和棋盘占用\n    return True\n\nboard = [[0 for _ in range(4)] for _ in range(4)]\nboard[2][1] = 1\npiece = [(0, 0), (1, 0)]\nplacements = [(1, 1), (3, 1), (0, 2)]\nresults = [can_place(board, piece, x, y) for x, y in placements]\n\n# TODO：调用绘制函数显示空位、越界、重叠三种测试\nlabels = ["空位", "右侧越界", "与已有格重叠"]\nfor label, (x, y), allowed in zip(labels, placements, results):\n    screen.clear()\n    # TODO：绘制 4×4 棋盘、已有格和候选方块，再提交一帧',
    passes: (run) => run.variables.results === "[True, False, False]" && hasScreenFrames(run, 3) && run.history.every((frame) => frame.objects.filter((item) => item.type === "rect").length >= 19),
  },
  {
    chapter: "06",
    mode: "code",
    extension: true,
    short: "项目记录 JSON 快照",
    title: "保存、读回并解释项目记录",
    description: "在本次运行的隔离临时目录中保存三条虚构项目记录，再读回并绘制完成状态摘要；文件不会跨练习运行保留。",
    steps: ["先确定记录字段和每个字段的含义。", "只在 TemporaryDirectory 中写入 records.json。", "再次打开文件并用 json.load() 读回。", "根据读回的数据统计完成项并用 PyScreen 展示；把字段说明和结果交给同伴复核。"],
    supplement: "在 PyCharm 的临时目录中用 csv.DictWriter 写入两行虚构站点记录，再用 csv.DictReader 读回并检查 available 的字符串类型；用 re.fullmatch(\"WO-[0-9]{4}\", value) 对比 WO-2048 和 WO-2048x。再检查缺列名与非法数字，保留明确错误，不把损坏值默认成 0。本项不计入练习台自动验收。",
    acceptance: "读回 3 条记录，已完成数为 2；预览显示从文件读回的编号/状态与统计；临时目录在本次运行结束后清理。",
    apis: ["clear", "text", "update"],
    starterCode: 'import json\nimport csv\nimport re\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nrecords = {"items": [{"id": "R-01", "status": "completed"}, {"id": "S-02", "status": "waiting"}, {"id": "T-03", "status": "completed"}]}\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / "records.json"\n    # TODO：把 records 写入 UTF-8 JSON 文件\n    with path.open("r", encoding="utf-8") as file:\n        loaded = json.load(file)\ncompleted = sum(item["status"] == "completed" for item in loaded["items"])\n\n# 选做补充（不计入自动验收）：可在新的 TemporaryDirectory 中补做 CSV 往返与编号格式反例。\n# 使用 csv.DictWriter/DictReader 和 re.fullmatch；记录缺列名或非法数字时出现的明确错误。\n\n# TODO：只用读回的 loaded 数据绘制结果\nscreen.clear()\n# TODO：调用 draw_text() 显示标题、三条记录及完成数，再调用 update() 提交',
    passes: (run) => run.variables.loaded === "{'items': [{'id': 'R-01', 'status': 'completed'}, {'id': 'S-02', 'status': 'waiting'}, {'id': 'T-03', 'status': 'completed'}]}" && run.variables.completed === "2" && hasScreenFrames(run, 1) && run.history[0].objects.filter((item) => item.type === "text").length >= 4,
  },
  {
    chapter: "07",
    mode: "code",
    extension: true,
    short: "网格重合短例",
    title: "用网格坐标检查重合规则",
    description: "两个标记仅在网格坐标相同时重合；电子屏显示重合、横向相邻和纵向相邻三个场景。",
    steps: ["实现坐标完全相等时的判断。", "先写出三种输入的预期值。", "运行三个测试并逐帧绘制两个标记。", "确认反例能区分精确重合和近似判断。"],
    acceptance: "results 与 expected 均为 [True,False,False]；预览中只有第一帧两个标记占据相同坐标。",
    apis: ["clear", "rect", "text", "update"],
    starterCode: 'def same_cell(first, second):\n    # TODO：只在两个网格坐标完全相同时返回 True\n    pass\n\ncases = [\n    ((5, 7), (5, 7), True),\n    ((5, 7), (6, 7), False),\n    ((5, 7), (5, 8), False),\n]\nresults = [same_cell(first, second) for first, second, _ in cases]\nexpected = [answer for _, _, answer in cases]\n\n# TODO：逐帧绘制两个标记的位置\nfor index, ((first_x, first_y), (second_x, second_y), _) in enumerate(cases):\n    screen.clear()\n    # TODO：调用绘制函数显示结果和两个标记，再提交本帧',
    passes: (run) => run.variables.results === "[True, False, False]" && run.variables.results === run.variables.expected && hasScreenFrames(run, 3) && run.history.every((frame) => frame.objects.some((item) => item.type === "rect") && frame.objects.some((item) => item.type === "text")),
  },
  {
    chapter: "08",
    mode: "guided",
    extension: true,
    manualReview: true,
    short: "现实微项目计划卡",
    title: "为现实微项目写最小版本计划",
    description: "从配送、出行、服务、个人任务、能源观察、文件工具或自选问题中，写一页范围清楚、可以验收的最小版本计划。",
    steps: ["说明谁遇到什么问题，以及本次输入和限制。", "只挑一个小功能，写清本次不做什么。", "列出可以看到或测量的验收结果。", "写普通用例和适用的边界/反例；此练习台不会自动判断计划质量。"],
    acceptance: "计划有单一增量、可观察验收、至少两个测试及明确的下一步；这只是正文后综合实践的准备材料。",
    prompt: "填写项目计划卡。本练习不要求完成行业系统；正文后的课程综合实践仍独立安排。",
    code: "可选情境：配送路线、共享站点、任务计划、服务工单、楼宇观察或文件整理。用合成数据和本地样例描述需求、约束与验收，不把“做完整个平台”当成单步任务。",
    questions: [
      { key: "project", label: "所选问题、使用者与目标（至少 15 字）", type: "textarea", minLength: 15, manual: true },
      { key: "scope", label: "本次单一功能及明确不做的内容（至少 20 字）", type: "textarea", minLength: 20, manual: true },
      { key: "acceptance", label: "可观察的验收结果（至少 20 字）", type: "textarea", minLength: 20, manual: true },
      { key: "tests", label: "普通用例、边界/反例与下一步（至少 25 字）", type: "textarea", minLength: 25, manual: true },
    ],
  },
  {
    chapter: "09",
    mode: "guided",
    extension: true,
    manualReview: true,
    short: "AI 协作改进小项目",
    title: "用 AI 协助改进一项现实微项目",
    description: "选择一个小改动，保留自己的问题定义、代码理解和测试决定权。",
    steps: ["先独立写出改动目标和预期。", "在你选择的 AI 工具中只请求一个局部方案；本页不会连接或上传给 AI。", "审查假设和影响范围，再决定采纳或拒绝。", "以运行结果验证普通情况和边界/反例，并清除敏感内容。"],
    acceptance: "记录能区分本人判断与 AI 建议，并用真实测试支持最后决定；不让 AI 一次生成完整项目。",
    prompt: "选择一个你理解的配送、出行、服务、任务规划、能源观察、文件整理或小游戏局部规则。不要在此页粘贴项目代码；这里只记录你在外部 AI 工具中进行的受控协作。",
    code: "本练习台不会调用 AI，也不会上传或跨刷新保存所填内容。最终记录请复制到练习单；不得粘贴密钥、个人信息、私人路径或不必要的整份项目。",
    questions: [
      { key: "change", label: "项目情境与本次单一改动（至少 20 字）", type: "textarea", minLength: 20, manual: true },
      { key: "prediction", label: "我原先的判断与预期结果（至少 25 字）", type: "textarea", minLength: 25, manual: true },
      { key: "request", label: "给 AI 的最小任务描述及提供的上下文（至少 30 字）", type: "textarea", minLength: 30, manual: true },
      { key: "evidence", label: "审阅、测试输入/预期/实际、取舍理由与隐私检查（至少 40 字）", type: "textarea", minLength: 40, manual: true, wide: true },
    ],
  },
  {
    chapter: "03",
    mode: "code",
    extension: true,
    short: "递归估算任务",
    title: "递归汇总嵌套任务时长",
    description: "把有限层级的交付任务分解为子任务，先找停止条件，再递归汇总总时长并观察调用轨迹。",
    steps: ["先预测叶节点和整棵任务树的总分钟数。", "实现 total_minutes(task, depth)，记录每次访问。", "叶节点直接返回自身分钟数；其他节点累加各子任务递归结果。", "运行后检查 10 分钟总计、4 个节点访问记录和电子屏轨迹。"],
    acceptance: "total 为 10，trace 按顺序包含交付计划、确认需求、整理数据、字段检查；电子屏显示总数和递归访问顺序。",
    apis: ["clear", "text", "update"],
    starterCode: 'plan = {"name": "交付计划", "minutes": 2, "children": [{"name": "确认需求", "minutes": 3, "children": []}, {"name": "整理数据", "minutes": 1, "children": [{"name": "字段检查", "minutes": 4, "children": []}]}]}\ntrace = []\n\ndef total_minutes(task, depth=0):\n    # TODO：记录当前任务和深度\n    # TODO：没有子任务时返回本节点分钟数\n    total = task["minutes"]\n    for child in task["children"]:\n        # TODO：累加子任务的递归结果\n        pass\n    return total\n\ntotal = total_minutes(plan)\n\nscreen.clear()\nscreen.draw_text("嵌套任务总计：", 1, 1)\nscreen.draw_text(str(total) + " 分钟", 1, 2)\nfor index, (name, depth) in enumerate(trace):\n    screen.draw_text("  " * depth + name, 1, 4 + index)\nscreen.update(note="递归访问顺序")',
    passes: (run) => run.variables.total === "10" && run.variables.trace === "[('交付计划', 0), ('确认需求', 1), ('整理数据', 1), ('字段检查', 2)]" && hasScreenFrames(run, 1),
  },
  {
    chapter: "03",
    mode: "code",
    extension: true,
    short: "闭包与 lambda",
    title: "保存站点阈值并按数量排序",
    description: "闭包保存创建时的提醒阈值；lambda 为 sorted 提供简短排序键。两种写法都服务于明确规则，不是为了压缩代码。",
    steps: ["实现 make_attention_filter(threshold)，返回检查站点数量的函数。", "创建阈值为 3 与 5 的两个筛选函数。", "用 lambda 作为排序键，从少到多排列站点。", "检查两个闭包使用各自阈值，排序结果正确且不改写原列表。"],
    acceptance: "阈值 3 得到 ['B']，阈值 5 得到 ['A', 'B']，排序得到 ['B', 'A', 'C']；屏幕同时显示筛选与排序结果。",
    apis: ["clear", "text", "update"],
    starterCode: 'stations = [{"name": "A", "available": 3}, {"name": "B", "available": 1}, {"name": "C", "available": 5}]\n\ndef make_attention_filter(threshold):\n    # TODO：返回一个使用 threshold 判断站点是否低于阈值的函数\n    pass\n\nneeds_attention_3 = make_attention_filter(3)\nneeds_attention_5 = make_attention_filter(5)\nattention_3 = [station["name"] for station in stations if needs_attention_3(station)]\nattention_5 = [station["name"] for station in stations if needs_attention_5(station)]\nordered_names = [station["name"] for station in sorted(stations, key=lambda station: station["available"])]\n\nscreen.clear()\nscreen.draw_text("阈值 3 需关注：" + str(attention_3), 1, 2)\nscreen.draw_text("阈值 5 需关注：" + str(attention_5), 1, 4)\nscreen.draw_text("可用量升序：" + str(ordered_names), 1, 6)\nscreen.update(note="闭包策略与排序键")',
    passes: (run) => run.variables.attention_3 === "['B']" && run.variables.attention_5 === "['A', 'B']" && run.variables.ordered_names === "['B', 'A', 'C']" && hasScreenFrames(run, 1),
  },
  {
    chapter: "03",
    mode: "code",
    extension: true,
    short: "调用记录装饰器",
    title: "给接单规则增加审计记录",
    description: "用装饰器给原函数增加轻量调用记录，同时保留其参数、返回结果和名称。",
    steps: ["阅读包装函数如何接收原函数。", "在 wrapper 中记录函数名，再把参数转交给原函数。", "返回原函数结果，并使用 functools.wraps 保留元信息。", "以可用量 2 和 0 调用，核对业务结果、调用日志和函数名称。"],
    acceptance: "results 为 [True, False]，日志记录两次 can_accept，函数名仍为 can_accept；电子屏展示结果和调用数。",
    apis: ["clear", "text", "update"],
    starterCode: 'from functools import wraps\n\ndef audit_calls(function):\n    events = []\n    @wraps(function)\n    def wrapper(*args, **kwargs):\n        # TODO：记录原函数名称\n        # TODO：调用原函数并返回其结果\n        pass\n    wrapper.events = events\n    return wrapper\n\n@audit_calls\ndef can_accept(available):\n    return available > 0\n\nresults = [can_accept(2), can_accept(0)]\naudit_names = can_accept.events[:]\nfunction_name = can_accept.__name__\n\nscreen.clear()\nscreen.draw_text("接单判断：" + str(results), 1, 2)\nscreen.draw_text("调用记录：" + str(audit_names), 1, 4)\nscreen.draw_text("函数名：" + function_name, 1, 6)\nscreen.update(note="装饰器保留原行为并记录调用")',
    passes: (run) => run.variables.results === "[True, False]" && run.variables.audit_names === "['can_accept', 'can_accept']" && run.variables.function_name === "'can_accept'" && hasScreenFrames(run, 1),
  },
  {
    chapter: "04",
    mode: "code",
    extension: true,
    short: "工单字符串表示",
    title: "实现工单的 str 与 repr 表示",
    description: "让 str(ticket) 产生给使用者看的简洁状态，让 repr(ticket) 保留便于开发者检查的对象信息。",
    steps: ["在 Ticket 初始化时保存编号和状态。", "实现 __str__ 与 __repr__，两者分别返回适合用途的字符串。", "用 str() 和 repr() 触发对象协议，不直接调用双下划线方法。", "再检查第二个工单，确认文本由各实例属性产生。"],
    acceptance: "str 显示 WO-2048 | waiting，repr 显示 Ticket('WO-2048', 'waiting')；第二张工单显示自己的状态。",
    apis: ["clear", "text", "update"],
    starterCode: 'class Ticket:\n    def __init__(self, ticket_id, status):\n        self.ticket_id = ticket_id\n        self.status = status\n\n    def __str__(self):\n        # TODO：返回供使用者阅读的编号和状态\n        pass\n\n    def __repr__(self):\n        # TODO：返回便于检查对象字段的表示\n        pass\n\nticket = Ticket("WO-2048", "waiting")\nother = Ticket("WO-2049", "serving")\npublic_text = str(ticket)\ndebug_text = repr(ticket)\nother_text = str(other)\n\nscreen.clear()\nscreen.draw_text(public_text, 1, 2)\nscreen.draw_text(debug_text, 1, 4)\nscreen.draw_text(other_text, 1, 6)\nscreen.update(note="对象表示协议")',
    passes: (run) => run.variables.public_text === "'WO-2048 | waiting'" && run.variables.debug_text === String.fromCharCode(34) + "Ticket('WO-2048', 'waiting')" + String.fromCharCode(34) && run.variables.other_text === "'WO-2049 | serving'" && hasScreenFrames(run, 1),
  },
  {
    chapter: "04",
    mode: "code",
    extension: true,
    short: "多继承 MRO",
    title: "观察多继承的方法查找顺序",
    description: "两个 mixin 刻意提供同名方法；调整父类顺序，观察 MRO 如何决定先调用哪个实现。",
    steps: ["先独立预测两个类的 label() 结果。", "分别查看 Ticket.mro() 与 ReverseTicket.mro()。", "运行两个对象并对照第一个命中方法。", "在说明中指出同名冲突只是观察实验，业务数据组合通常有更清楚的选择。"],
    acceptance: "Ticket 先显示“编号信息”，ReverseTicket 先显示“状态信息”；屏幕显示两个解析顺序和返回值。",
    apis: ["clear", "text", "update"],
    starterCode: 'class IdentifierMixin:\n    def label(self):\n        return "编号信息"\n\nclass StatusMixin:\n    def label(self):\n        return "状态信息"\n\nclass Ticket(IdentifierMixin, StatusMixin):\n    pass\n\nclass ReverseTicket(StatusMixin, IdentifierMixin):\n    pass\n\nlabels = [Ticket().label(), ReverseTicket().label()]\nticket_mro = [base.__name__ for base in Ticket.mro()]\nreverse_mro = [base.__name__ for base in ReverseTicket.mro()]\n\nscreen.clear()\nscreen.draw_text("Ticket：" + labels[0], 1, 1)\nscreen.draw_text("ReverseTicket：" + labels[1], 1, 3)\nscreen.draw_text("MRO 1：" + str(ticket_mro[:3]), 1, 5)\nscreen.draw_text("MRO 2：" + str(reverse_mro[:3]), 1, 7)\nscreen.update(note="按 MRO 查找第一个同名方法")',
    passes: (run) => run.variables.labels === "['编号信息', '状态信息']" && run.variables.ticket_mro?.startsWith("['Ticket', 'IdentifierMixin', 'StatusMixin'") && run.variables.reverse_mro?.startsWith("['ReverseTicket', 'StatusMixin', 'IdentifierMixin'") && hasScreenFrames(run, 1),
  },
  {
    chapter: "05",
    mode: "code",
    extension: true,
    short: "生成器筛选工单",
    title: "逐项产出已完成工单编号",
    description: "用 yield 按需交付匹配记录，检查生成器暂停、继续、耗尽和重新创建的行为。",
    steps: ["实现 completed_ticket_ids(records)，只产出已完成编号。", "先预测原有顺序，再用 next() 取第一项并继续消费。", "检查生成器耗尽后不再重放；重新调用函数创建新生成器。", "用电子屏显示第一次和重新运行的结果。"],
    acceptance: "第一次得到 WO-101、WO-103，耗尽后的剩余结果为空；重新创建后再次得到两项，且不产出 waiting 记录。",
    apis: ["clear", "text", "update"],
    starterCode: 'records = [{"id": "WO-101", "status": "completed"}, {"id": "WO-102", "status": "waiting"}, {"id": "WO-103", "status": "completed"}]\n\ndef completed_ticket_ids(records):\n    for record in records:\n        if record["status"] == "completed":\n            # TODO：逐项交出已完成工单编号\n            pass\n\nstream = completed_ticket_ids(records)\nfirst_id = next(stream, None)\nremaining_ids = list(stream)\nexhausted_again = list(stream)\nrerun_ids = list(completed_ticket_ids(records))\n\nscreen.clear()\nscreen.draw_text("第一次取值：" + str(first_id), 1, 1)\nscreen.draw_text("继续消费：" + str(remaining_ids), 1, 3)\nscreen.draw_text("耗尽后：" + str(exhausted_again), 1, 5)\nscreen.draw_text("重新创建：" + str(rerun_ids), 1, 7)\nscreen.update(note="生成器按需交付并在消费后结束")',
    passes: (run) => run.variables.first_id === "'WO-101'" && run.variables.remaining_ids === "['WO-103']" && run.variables.exhausted_again === "[]" && run.variables.rerun_ids === "['WO-101', 'WO-103']" && hasScreenFrames(run, 1),
  },
  {
    chapter: "06",
    mode: "code",
    extension: true,
    short: "正则校验编号",
    title: "用 re.fullmatch 校验完整编号",
    description: "检查编号全文是否符合 WO- 加四个 ASCII 数字；正则只验证格式，不判断编号是否真实存在。",
    steps: ["先写下四个输入的预期匹配结果。", "使用 re.fullmatch(r'WO-[0-9]{4}', value) 判断完整文本。", "检查尾随字符、额外前缀和非数字字符三个反例。", "将四个值和结果逐行显示，解释该格式约定的边界。"],
    acceptance: "WO-2048 为 True，其余三项为 False；预览显示四组编号和匹配结果。",
    apis: ["clear", "text", "update"],
    starterCode: 'import re\n\npattern = r"WO-[0-9]{4}"\nticket_ids = ["WO-2048", "WO-2048x", "XWO-2048", "WO-20A8"]\nresults = [re.fullmatch(pattern, value) is not None for value in ticket_ids]\n\nscreen.clear()\nscreen.draw_text("编号格式检查", 1, 1)\nfor index, (ticket_id, valid) in enumerate(zip(ticket_ids, results)):\n    screen.draw_text(ticket_id + "：" + str(valid), 1, 3 + index)\nscreen.update(note="全文匹配，不代表编号真实存在")',
    passes: (run) => run.variables.results === "[True, False, False, False]" && hasScreenFrames(run, 1) && run.history[0].objects.filter((item) => item.type === "text").length >= 5,
  },
];
let draftStorageAvailable = true;
const draftKey = (index) => `pyscreen-code-draft:${levels[index].chapter}:${levels[index].short}`;
const activityKey = (index) => `${draftKey(index)}:answers-inputs`;

function saveActivity() {
  if (!draftStorageAvailable) return;
  const level = levels[currentLevel];
  try {
    sessionStorage.setItem(activityKey(currentLevel), JSON.stringify({
      responses: level.responses, inputs: level.inputs || "", key: level.key || "ArrowRight",
    }));
  } catch {
    draftStorageAvailable = false;
    setStatus("浏览器暂存不可用；当前内容仍可继续使用，请及时复制保存。", "info");
  }
}

levels.forEach((level, index) => {
  level.chapter = level.chapter || "01";
  if (level.starterCode) {
    level.code = level.starterCode;
    if (draftStorageAvailable && level.mode !== "guided") {
      try {
        const draft = sessionStorage.getItem(draftKey(index));
        if (draft !== null && draft.length <= 8000) {
          level.code = draft;
          level.restored = true;
        }
      } catch {
        draftStorageAvailable = false;
      }
    }
  }
  if (!level.responses) level.responses = {};
  level.inputs = "";
  level.key = "ArrowRight";
  if (draftStorageAvailable) {
    try {
      const saved = sessionStorage.getItem(activityKey(index));
      if (saved && saved.length <= 100_000) {
        const state = JSON.parse(saved);
        if (state && typeof state === "object") {
          for (const question of level.questions || []) {
            const value = state.responses?.[question.key];
            if (typeof value === "string" && value.length <= 8000 &&
                (question.type !== "select" || value === "" || question.choices.includes(value))) {
              level.responses[question.key] = value;
            }
          }
          if (typeof state.inputs === "string" && state.inputs.length <= 2000) level.inputs = state.inputs;
          if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", " ", "Escape"].includes(state.key)) level.key = state.key;
          level.restored = true;
        }
      }
    } catch {
      // Ignore a damaged answer record; it must not prevent the course from opening.
    }
  }
});

const chapterTitles = {
  "01": "Python 程序设计基础",
  "02": "程序控制与组合数据",
  "03": "函数、模块与程序组织",
  "04": "面向对象程序设计",
  "05": "数据组织与程序设计",
  "06": "异常、文件与调试",
  "07": "测试与代码改进",
  "08": "Python 综合应用",
  "09": "AI 辅助 Python 学习与编程",
};

let currentLevel = 0;
let currentChapter = "01";
let completedLevels = new Set();
let renderedTrackChapter = null;
const levelButtons = new Map();
let renderedApiSignature = null;
let editorFocused = false;
let result = null;
let frameIndex = 0;
let playbackTimer = null;
let isPlaying = false;
let activeWorker = null;
let activeRunCancel = null;

const query = new URLSearchParams(window.location.search);
const requestedLevel = Number(query.get("level"));
const requestedChapter = String(Number(query.get("chapter"))).padStart(2, "0");
const requestedExercise = Number(query.get("exercise"));
const projectGuide = document.querySelector("#keyboard-project");
const snakeProjectGuide = document.querySelector("#snake-project");
const squareProjectGuide = document.querySelector("#square-project");
const projectName = query.get("project");
const squareProjectMode = projectName === "move-square";
const keyboardProjectMode = projectName === "keyboard-move";
const snakeProjectMode = projectName === "snake";
const chapterProjectGuides = {
  "tetris-drop": {
    chapter: "第 2 章", title: "俄罗斯方块：下落与边界", badge: "条件 · 循环 · 坐标边界",
    description: "只实现一个两格高方块的下落规则：让重复移动在最后合法位置停止。先验证位置和边界，不一次完成整款俄罗斯方块。",
    steps: [
      ["表示方块", "用 y 保存方块上边缘位置，并明确屏幕高度与方块高度。"],
      ["推导边界", "本项目的棋盘高度为 20 行、方块高度为 2，算出最后合法的左上角行号 y 为 18。"],
      ["实现下落", "用循环逐步更新 y；每次更新后重画并提交画面。"],
      ["停在合法位置", "到达最后合法位置后停止；不要让方块越出屏幕。"],
    ],
    checks: ["从顶部开始，方块逐步向下移动且没有跳帧式越界。", "到达最后合法位置后停止；已在边界时不会再增加 y。", "能解释边界由屏幕尺寸和方块尺寸共同决定。"],
    note: "本项目使用高 20 行的棋盘，因此 y=18 才是两格高方块最后合法的起点。可创建 Screen(width=12, height=20) 显示完整棋盘；不要把 18 映射到默认 12 行屏幕。",
    run: ["打开随包学生项目目录，运行 setup_pyscreen.bat 准备 Python 3.12 环境。", "用 PyCharm 打开该目录，新建 tetris_drop.py；创建 Screen(width=12, height=20) 显示完整棋盘。", "运行并观察每次提交的画面；从顶部、边界前一格和 y=18 分别验证。"],
    next: "第 3 章把边界判断提取为函数；后续再实现旋转、Piece 对象和棋盘占用检查。",
    href: "./playground.html?chapter=2&exercise=7",
  },
  "grid-robot": {
    chapter: "第 2–7 章", title: "末端配送机器人：本地路线模拟", badge: "物流 · 任务拆解 · 状态验证",
    description: "在 20×12 网格中模拟末端配送。地图背景可设为校园、社区或楼宇，但代码只处理固定坐标、障碍、指令和投递状态；本项目不要求自动寻路或真实硬件。",
    steps: [
      ["第 2 章｜画出网格与规则", "定义起点、障碍格、投递点和一组固定方向指令。候选坐标越界或落入障碍时，机器人保持原位。"],
      ["第 3 章｜拆成可读函数", "分别设计 move_one_step、is_blocked、draw_map 等职责，写清参数与返回值，再按固定路线组合调用。"],
      ["第 4 章｜建立 Robot 对象", "用实例保存当前位置和投递状态。创建两个机器人做隔离检查，更新其中一个不能改变另一个。"],
      ["第 5 章｜组合任务状态", "用列表保存待执行指令或多个投递点，明确运行、受阻、已送达状态及每一步的绘制顺序。"],
      ["第 6 章｜记录投递结果", "在项目自己的 data 目录保存一次成功路线摘要；文件缺失时给出提示，不覆盖损坏数据。"],
      ["第 7 章｜补齐边界测试", "用 unittest 覆盖普通移动、屏幕边界、障碍阻挡、到达目标和无效指令，并检查失败时状态未被误改。"],
    ],
    checks: [
      "固定起点和指令每次得到相同路线；越界或撞障碍时坐标保持不变，并显示可理解的反馈。",
      "机器人只在到达投递点后标记送达；状态、路线输出和电子屏画面一致。",
      "至少两个实例的坐标与任务状态互不串改。",
      "测试覆盖普通路径、边界、障碍、目标和无效输入；失败操作不会留下半更新状态。",
      "文件记录只在项目自建目录中读写；本轮项目没有移动、覆盖或删除外部文件。",
    ],
    note: "地图使用 20×12 格；障碍与路线都由学生固定指定。校园、社区或楼宇只是不同的需求语境，不改变坐标与状态建模方法。本项目不引入自动寻路、并发机器人或真实硬件；屏幕展示的是学生编写并验证的状态。",
    run: [
      "用 PyCharm 打开学生包项目根目录，运行 setup_pyscreen.bat 创建 Python 3.12 虚拟环境并离线安装 PyScreen。",
      "新建 delivery_route.py，先用 Screen(width=20, height=12) 绘出网格、起点、障碍和投递点，并在需求卡上说明地图语境。",
      "按章节阶段逐项实现；每次固定起点与指令，只增加一个可验收的规则。不要同时加入随机地图和自动寻路。",
      "运行后填写状态轨迹和测试表，保留一次成功路线及边界失败截图；文件数据只写到项目自建的 data 目录。",
    ],
    next: "可为路线增加第二个投递点，或比较两种人工规划的路线；若要研究自动寻路，应先单独提出算法目标、输入输出和测试，不把它当成本章前置要求。",
    href: "./playground.html?chapter=2&exercise=5",
  },
  "shared-mobility": {
    chapter: "第 2–7 章", title: "共享出行：站点状态与借还规则", badge: "交通 · 数据建模 · 边界验证",
    description: "用固定合成数据模拟若干共享车辆站点。先让规则可解释、结果可复验，再逐章把借还判断组织成函数/对象、管理多站点、保存快照并测试；不接入真实平台或实时 API。",
    steps: [
      ["第 2 章｜表示站点数量", "用站点编号、可用车辆数和容量描述状态；借出要求数量大于 0，归还要求未满。"],
      ["第 3 章｜定义规则函数", "分别设计 can_rent 与 can_return，写清参数和返回值；判断函数不偷偷改动站点数据。"],
      ["第 4 章｜组织站点对象", "可选地用 Station 保存编号、数量与容量；两个实例不能共享意外变化。"],
      ["第 5 章｜管理多站点", "用列表保存固定站点快照，标记空站/满站/可借；只按明确条件提出补给候选，不实现复杂调度。"],
      ["第 6 章｜保存数据快照", "在项目自建 sandbox 中读写合成 JSON；分开处理缺失文件与损坏内容。"],
      ["第 7 章｜验证边界规则", "测试正常借还、数量为零、站点已满和无效数量，检查失败时原状态未被误改。"],
    ],
    checks: [
      "数量为 0 时不能借出；数量等于容量时不能归还，状态变化符合预先写下的规则。",
      "每条记录都注明是合成数据；站点状态、文字输出和电子屏展示一致。",
      "把需求、字段、函数接口、边界测试与运行结果整理成同伴可复核的一页说明。",
      "能指出可迁移到停车位、共享充电桩或周转箱管理的规则，以及迁移前需重查的容量定义。",
    ],
    note: "项目只取共享出行开放数据标准中的站点/可用状态建模思路，使用本地合成样例。GBFS 是只读实时数据规范；本练习不请求网络、不实现付款、定位或真实车辆控制。",
    run: [
      "先写需求卡：谁要查看/借还什么、有哪些约束、这次不做什么；数据全部使用虚构站点。",
      "在 PyCharm 新建 shared_mobility.py，用少量固定字典或列表保存站点编号、车辆数和容量。",
      "自己实现借还判断和一次状态更新；分别运行正常、空站、满站与无效输入。",
      "按章节添加函数、对象、集合、JSON 与测试；提交字段说明、预期/实际表和一张状态画面。",
    ],
    next: "同一可用量规则可迁移到停车位、共享充电设备和周转箱；新场景要重新确认容量口径、状态定义与失败行为。",
    href: "./playground.html?chapter=2&exercise=5",
  },
  "daily-planner": {
    chapter: "第 3–7 章", title: "个人任务计划：把步骤写成函数", badge: "效率工具 · 函数接口 · 本地数据",
    description: "用虚构待办记录练习需求澄清、函数拆分、状态组织和本地保存。它不是日历或云同步产品；目标是让同一套新增/完成/筛选规则易读、可调用、可测试，并能交给同伴复核。",
    steps: [
      ["写清最小需求", "约定任务标题、优先级和待办/完成状态；先说明本次明确不做提醒、账号和联网同步。"],
      ["第 3 章｜定义自己的函数", "设计 add_task、complete_task 或 list_pending 等函数，注明参数、返回值和是否修改原数据。"],
      ["第 5 章｜管理任务集合", "用列表/字典组织多条虚构任务，说明排序与状态变化规则，不引入未教的数据层。"],
      ["第 6 章｜保存本地记录", "把合成任务写入项目 sandbox 的 JSON，读取时检查字段和缺失/损坏情况。"],
      ["第 7 章｜测试与迁移", "检查空标题、重复完成和未知任务编号；说明方法如何迁移到值班表或项目待办。"],
    ],
    checks: [
      "新增、完成、筛选任务的输入和结果可预测；重复完成不会产生未说明的副作用。",
      "能用函数接口表解释任务数据如何进入、改变并返回；同伴可以按说明复现。",
      "测试包含一项边界或反例，实际结果与预期逐项记录。",
      "所有示例都用虚构任务，不粘贴真实日历、私人计划或联系人信息。",
    ],
    note: "只使用标准库、合成记录和项目内临时数据。不实现账户、通知、云端同步或真实个人日历接入。",
    run: [
      "在 PyCharm 新建 daily_planner.py，先写 3 条虚构任务和状态表，不急着创建类。",
      "由自己决定需要哪些函数及其输入/返回值，再逐个实现并用同一组样例调用。",
      "把每条规则写成普通、边界、反例输入；记录预期和实际，必要时调整函数职责。",
      "提交需求卡、接口表、运行输出与一个迁移建议，而不只提交源码。",
    ],
    next: "新增/完成/筛选的分解方法可迁移到服务工单、检查清单和项目协作任务；迁移时重新定义角色、状态和排序规则。",
    href: "./playground.html?chapter=3&exercise=4",
  },
  "service-queue": {
    chapter: "第 4–7 章", title: "服务工单：对象与状态队列", badge: "零售/服务运营 · 对象协作 · 验证",
    description: "以虚构取餐、维修或公共服务号码构造本地队列。学生自己定义 Ticket 对象和状态规则，观察多个实例如何协作；不采集个人资料，不处理付款、预约系统或专业诊断。",
    steps: [
      ["第 4 章｜定义工单对象", "用编号和状态表示一张工单；方法只承担属于该工单的行为，避免对象直接管理所有流程。"],
      ["写出状态转换", "先画 waiting → serving → completed/cancelled 的允许转换，并列出重复完成等无效操作。"],
      ["第 5 章｜组织服务队列", "用列表保存多张工单，安排取出、更新与归档顺序；避免在不清楚的时机删除当前遍历项。"],
      ["第 6 章｜保存服务摘要", "仅将虚构编号和状态写入 sandbox JSON；处理缺失与损坏记录，不覆盖原始样例。"],
      ["第 7 章｜测试流程反例", "验证空队列、重复开始/完成、取消后重开等边界是否符合你写下的需求。"],
    ],
    checks: [
      "对象状态表与代码允许的转换一致；非法操作有明确且可解释的结果。",
      "更新一张工单不会串改另一张；队列顺序、输出和屏幕状态一致。",
      "提交状态图、对象职责说明、测试结果与一次 AI 建议的审阅记录（若使用 AI）。",
      "说明同一方法如何迁移到餐饮取件、维修受理或公共服务，以及迁移前需重新确认的规则。",
    ],
    note: "项目是教学用服务流程仿真，编号为随机/虚构样例。不得录入真实姓名、手机号、医疗资料或支付信息，也不接入真实订单系统。",
    run: [
      "选定一个熟悉的服务语境，写下用户目标、工单状态和不在范围内的功能。",
      "在 PyCharm 新建 service_queue.py，亲自定义 Ticket 类；至少创建两个独立实例。",
      "按你画出的状态图运行正常转换与无效转换，观察属性和电子屏/文本输出。",
      "再添加工单集合、JSON 快照或 unittest；每次只加一项并保留运行证据。",
    ],
    next: "队列与状态转换可迁移到预约、取件、维修与借用设备；先核对状态是否可逆、谁有权改变状态。",
    href: "./playground.html?chapter=4&exercise=4",
  },
  "energy-watch": {
    chapter: "第 5–7 章", title: "楼宇能耗观察：记录、阈值与状态", badge: "设施运营 · 能源观察 · 数据解释",
    description: "用本地合成的时段/区域读数练习管理多条记录、集中配置阈值并输出需复查的状态。它不是能耗预测或节能控制系统，不能据此宣称实际节能效果。",
    steps: [
      ["明确观测字段", "记录虚构区域、时段、数值和单位；写明样例如何构造，不伪装成真实传感器数据。"],
      ["第 5 章｜组织集合与配置", "用列表/字典整理多条读数，把关注阈值放在一处，并明确阈值属于示例设定。"],
      ["解释状态判断", "分别标记低于、等于和高于阈值的结果；电子屏展示区域、数值和状态，不能只显示颜色。"],
      ["第 6–7 章｜保存并测试", "在 sandbox 中保存 JSON；测试阈值两侧、缺失字段与无效负数，解释哪些输入不在当前模型范围内。"],
    ],
    checks: [
      "合成数据来源、计量单位和阈值假设清楚；阈值边界结果可复验。",
      "数值输出和电子屏文本一致，异常样例有说明而非静默忽略。",
      "提交字段表、判断规则、测试输入/预期/实际及一段面向非程序员的结果解释。",
      "能指出该方法可迁移到库存或设备巡检，但不能直接照搬阈值。",
    ],
    note: "不连接智能电表、楼宇控制器或网络服务；不自动调节灯光/HVAC，不做能耗预测或节能成效声明。公开指南仅提供观测问题的现实背景，练习数据是虚构的。",
    run: [
      "在 PyCharm 新建 energy_watch.py，先列出 3–5 条虚构读数和单位。",
      "用普通集合和配置表达规则；自己决定状态命名并写出判断条件。",
      "用低于/等于/高于阈值的固定输入运行，输出表格或电子屏状态。",
      "把数据假设和结果解释写给设施管理者能看懂的说明中，再保存测试证据。",
    ],
    next: "记录—规则—状态—解释的链条可迁移到设备巡检、库存提醒和服务质量观察；每种用途都必须重新确认数据含义与误报后果。",
    href: "./playground.html?chapter=5&exercise=3",
  },
  "service-records": {
    chapter: "第 6 章", title: "服务与任务记录：JSON 持久化", badge: "本地文件 · JSON · 错误恢复",
    description: "选择配送摘要、任务清单、服务工单或站点状态中的一份虚构记录，在项目自己的 sandbox 中保存并读回。重点是明确路径、数据格式和失败反馈，不写入个人目录。",
    steps: [
      ["选定数据并说明字段", "只保留解决当前任务所需的编号、状态、数量或时间标签；不要存真实个人信息。"],
      ["实现本地读写", "自己定义保存/读取函数，让路径由项目明确提供，并用 UTF-8 JSON 交换结构化数据。"],
      ["区分错误情况", "分别测试文件缺失、JSON 损坏、必需字段缺失；只有符合约定时才报告读取成功。"],
      ["交付可复核记录", "保存前后对比数据、异常反馈和路径说明；必要时把读回状态显示到电子屏。"],
    ],
    checks: [
      "有效数据往返后保持一致；缺失和损坏文件得到不同且可解释的处理。",
      "所有读写只发生在项目自带的 sandbox 路径。",
      "提交 JSON 样例、字段说明、预期/实际记录与恢复策略。",
      "能将同一保存/读取方法迁移到另一项目，同时重新检查隐私字段和生命周期。",
    ],
    note: "初学者项目只在 sandbox 中读写；不要直接拿下载目录、私人任务数据或真实服务订单测试。",
    run: [
      "在 PyCharm 项目内建立 sandbox/data 并手工写入一份虚构 JSON 样例。",
      "新建 service_records.py，亲自实现写入与读取；先保存到新文件，不覆盖未知资料。",
      "分别准备有效、缺失、损坏三种情形，逐项记录输出和恢复策略。",
      "请同伴只看字段说明与测试步骤尝试复现，检查你的说明是否足够清楚。",
    ],
    next: "JSON 记录方式可用于机器人路线、站点快照和任务计划；测试由第 7 章进一步保护。",
    href: "./playground.html?chapter=6&exercise=2",
  },
  "domain-tests": {
    chapter: "第 7 章", title: "跨场景规则：测试与回归", badge: "测试设计 · 反例 · 交接证据",
    description: "从机器人、共享出行、任务计划、工单队列或能源观察中选一条纯规则函数，用标准库 unittest 写可复现检查，再做一次小改进并保护旧行为。",
    steps: [
      ["把需求写成可判断句", "例如：满站不能归还、取消的工单不计入完成数。避免只写“系统应正常”。"],
      ["先预测再设计输入", "至少列一个普通输入；规则存在边界时再加边界和能区分错误实现的反例。"],
      ["用 unittest 运行", "写清测试方法名、输入、预期与实际；不依赖实时网络、随机数或个人数据。"],
      ["检查测试区分力", "故意引入一个小的错误条件，确认对应测试会失败，再恢复正确实现并重跑。"],
    ],
    checks: [
      "测试用例能直接追溯到需求规则，输入固定且可以复现。",
      "至少一个反例能揭露具体错误实现；不是把相同情况重复测试。",
      "重构前后旧测试保持通过，新增行为另有测试和运行证据。",
      "提交测试意图说明，让同伴无需先读实现也能理解测试在保护什么。",
    ],
    note: "优先使用 Python 标准库 unittest。测试通过只说明这些输入通过，不证明程序对所有现实情况都正确。",
    run: [
      "在 PyCharm 选一个已经理解的领域规则，先写一句需求和输入/预期表。",
      "新建 test_domain_rules.py，自己编写正常与边界/反例测试。",
      "运行测试，制造一次可控的规则错误确认测试能发现问题，再恢复并重跑。",
      "提交失败与通过证据、覆盖范围和尚未验证的假设。",
    ],
    next: "同一种测试设计可迁移到任何规则型小程序；换领域时要重新发现边界，而不是机械复制测试值。",
    href: "./playground.html?chapter=7&exercise=2",
  },
  "snake-refactor": {
    chapter: "第 3 章", title: "个人任务：函数化重构", badge: "任务拆分 · 函数 · 回归验证",
    description: "为虚构任务列表选择新增、完成或筛选中的一项，亲自定义函数接口并做小步重构；需求规则不变，重点检查调用者能否理解和复用它。",
    steps: [["选定一项职责", "说明当前步骤处理什么输入、改变什么数据或产生什么结果。"], ["设计函数接口", "写明函数名、参数、返回值/副作用，以及由谁调用。"], ["只改这一处", "将选定职责移入自己的函数，其余业务规则保持不变。"], ["同样例回归", "用重构前相同的任务、操作和状态比较结果。"]],
    checks: ["函数完成一项可说明的任务；接口让调用者能正确传值并使用结果。", "普通操作和重复完成等约定行为没有意外变化。", "提交接口卡、改前/改后结果和一次向同伴说明的复现步骤。"],
    note: "使用虚构任务清单；不接入真实日历或联系人。若保留贪吃蛇对照，只挑移动/绘制中的一项职责作为短例。",
    run: ["在 PyCharm 新建 daily_planner.py，写入 3 条虚构任务并运行一组固定操作。", "为新增、完成或筛选中的一项自己定义函数，并把参数、返回值或副作用写清。", "使用同一输入比较重构前后结果，记录一项可迁移的方法和需要重新确认的业务规则。"],
    next: "同样的函数接口和小步回归方法可用于工单或设备检查清单；迁移时重新定义状态与排序规则。",
    href: "./playground.html?chapter=3&exercise=4",
  },
  "tetris-rotation": {
    chapter: "第 3 章", title: "俄罗斯方块：实现旋转函数", badge: "参数 · 返回值 · 不修改原数据",
    description: "为 3×3 网格中的方块形状编写顺时针旋转函数，再把变换前后的格子画出来。旋转函数只计算结果，不直接改写传入的原列表。",
    steps: [["表示形状", "用一组局部坐标记录方块占用的格子。"], ["推导坐标变换", "对 3×3 网格写出顺时针旋转前后的对应关系。"], ["定义纯函数", "让函数接收形状并返回新列表，原列表保持不变。"], ["可视化对照", "分别绘制原形状与旋转结果，并逐格检查。"]],
    checks: ["旋转结果为 [(2, 0), (2, 1), (2, 2), (1, 1)]。", "原始 piece 列表与调用前完全一致。", "能说明参数、返回值和不直接修改原数据的好处。"],
    note: "先用坐标表验证变换，再接入画面；不要把输入、随机生成或棋盘碰撞混入本次函数。",
    run: ["在 PyCharm 新建 tetris_rotation.py，先写旋转前后的坐标预测。", "自己完成 rotate_clockwise(piece)，再用断言检查预期坐标与原数据未改变。", "用 PyScreen 并排绘制旋转前后结果，保存运行截图或测试输出。"],
    next: "第 4 章用 Piece 对象组合形状和位置；第 5 章再检查落点是否与棋盘冲突。",
    href: "./playground.html?chapter=3&exercise=6",
  },
  "aircraft-objects": {
    chapter: "第 4 章", title: "服务工单：对象状态与实例隔离", badge: "类 · 实例 · 独立状态",
    description: "把一张虚构工单的编号和处理状态组织为对象；重点是每个实例拥有自己的状态，并能说明哪些流程由服务台协调。",
    steps: [["确定对象边界", "区分单张工单自己的编号/状态与队列统计、调度等流程工作。"], ["定义最小类", "只保存当前任务确实需要的工单字段，不放真实个人信息。"], ["实现一个行为", "例如开始或完成工单，并由调用者安排允许的顺序。"], ["创建多个实例", "改变一张工单，检查另一张保持原状态。"]],
    checks: ["每张工单编号与状态相互独立，更新结果符合状态约定。", "调用者能根据方法名和参数理解操作，状态变化可从属性/输出观察。", "提交对象职责说明、两实例状态轨迹和他人复现步骤。"],
    note: "本项目只做工单状态与实例隔离；通知、支付、账户和复杂服务系统不在本次范围。",
    run: ["在 PyCharm 新建 ticket_objects.py，自己定义 Ticket 的最小属性与行为。", "创建两个实例并记录调用前后的属性值，再绘制或打印状态。", "交给同伴按你的说明预测第二张工单是否变化，并运行核对。"],
    next: "第 5 章再用集合组织多张工单并验证状态转换；对象状态方法也可迁移到预约或设备借用。",
    href: "./playground.html?chapter=4&exercise=2",
  },
  "tetris-piece": {
    chapter: "第 4 章", title: "俄罗斯方块：Piece 对象", badge: "对象状态 · 组合 · 实例隔离",
    description: "把方块局部形状与屏幕位置组合为一个 Piece 实例。移动实例时只改变它的位置，不改写形状或其他 Piece 的状态。",
    steps: [["保存局部形状", "用 cells 保存方块内部各格相对左上角的坐标。"], ["组合屏幕位置", "用 x、y 保存方块当前锚点，绘制时将局部坐标换算到屏幕坐标。"], ["实现移动行为", "move(dx, dy) 只更新当前实例的位置。"], ["检查实例隔离", "创建第二个 Piece 并移动其中一个，观察另一个保持不变。"]],
    checks: ["起始状态可表示为 (5, 2, [(0, 0), (1, 0)])。", "移动只改变实例的 x、y；cells 内容不变。", "两个 Piece 的位置互不串改，预览与实例属性相符。"],
    note: "本阶段不处理旋转合法性、棋盘边界或碰撞；这些规则由后续章节单独加入。",
    run: ["在 PyCharm 新建 tetris_piece.py，从练习台的状态元组先画出字段草图。", "自己定义 Piece 类和 move 方法，逐个创建两个对象。", "调用一次移动并打印状态；再绘制两个实例检查画面和属性是否一致。"],
    next: "第 5 章将 Piece 放到二维棋盘上，并实现不修改棋盘的合法落点检查。",
    href: "./playground.html?chapter=4&exercise=6",
  },
  "aircraft-state": {
    chapter: "第 5 章", title: "服务队列：集合与状态管理", badge: "集合 · 配置 · 状态转换",
    description: "管理多张虚构工单，集中保存队列规则，并明确暂停与继续时哪些状态可以更新。",
    steps: [["管理对象集合", "把工单放入列表，说明开始、完成和归档分别何时发生。"], ["安全更新集合", "用相邻已完成项构造反例，避免遍历列表时删除导致漏项。"], ["集中管理配置", "把每批处理数量等确实会调整的值放在一处。"], ["表达状态转换", "区分 running 与 paused；暂停时不开始新工单，恢复后保持队列顺序。"]],
    checks: ["暂停期间队列不变；恢复后只处理下一项且不重复/漏掉工单。", "移除相邻完成项时结果完整，配置修改集中且可追踪。", "交付状态转换表、输入/预期/实际和同伴可复现的操作顺序。"],
    note: "一次只实现集合更新、配置或暂停中的一个增量；先写状态转换表，再扩展下一项。",
    run: ["在 PyCharm 新建 service_queue_state.py，先写两张虚构工单与初始队列。", "自己实现一次暂停、恢复和按序处理，观察状态及队列内容。", "用相邻归档项复现删除风险，再用修复后的同一输入验证；记录可迁移的方法。"],
    next: "第 6 章将服务结果保存为项目 JSON 摘要；第 7 章用普通、边界和反例保护状态规则。",
    href: "./playground.html?chapter=5&exercise=5",
  },
  "tetris-board": {
    chapter: "第 5 章", title: "俄罗斯方块：棋盘合法落点", badge: "二维列表 · 边界 · 碰撞",
    description: "用二维列表保存已经占用的格子，实现一个只负责判断、不修改棋盘的合法落点函数。",
    steps: [["表示棋盘", "确定宽高，并让每个格子有明确的空闲或占用状态。"], ["展开方块坐标", "将 Piece 的局部格子坐标换算成棋盘坐标。"], ["逐格检查规则", "任何格子越界或与已占用格重叠时，整个位置都不可放。"], ["保持判断无副作用", "can_place 只返回真假，不提前写入或改变棋盘。"]],
    checks: ["空位结果为 True，右侧越界和已有格重叠均为 False。", "判断前后棋盘内容完全一致。", "能指出哪一个格子触发失败，并解释边界和占用检查。"],
    note: "先用小棋盘和固定 Piece 验证三种情况；成功放置、消行和计分不属于本次范围。",
    run: ["在 PyCharm 新建 tetris_board.py，先手工画出空位、越界、重叠三个棋盘样例。", "自行实现 can_place(board, piece, x, y)，为三类场景写断言。", "运行后检查返回值和棋盘没有被判断函数修改，再用电子屏绘制场景。"],
    next: "第 6 章用 JSON 保存项目状态摘要；第 7 章为边界和重叠规则补充回归测试。",
    href: "./playground.html?chapter=5&exercise=6",
  },
  "game-save": {
    chapter: "第 6 章", title: "项目记录：JSON 本地快照", badge: "文件 · JSON · 异常处理",
    description: "为配送摘要、任务清单、服务工单或站点状态保存虚构记录。区分有效文件、文件缺失和 JSON 损坏，并在专用测试目录操作。",
    steps: [["约定数据格式", "先写一份小 JSON 样例，解释编号、状态、数量等字段含义。"], ["实现读写函数", "分离保存与读取职责，路径由调用者明确提供。"], ["处理不同异常", "文件不存在可按需求给默认值；JSON 损坏应保留诊断，不能伪装成空记录。"], ["验证读回结果", "保存后重新读取，并用文字输出或电子屏呈现实际读回的数据。"]],
    checks: ["保存后读取的数据与原数据一致，字段含义能由同伴理解。", "缺失文件得到明确默认或提示；损坏 JSON 不被报告为读取成功。", "只在项目自带测试目录中读写，未触碰个人目录或真实数据。"],
    note: "第一次在 PyCharm 测试时只使用项目下的 sandbox/data 目录或教师指定的临时目录；检查路径后再运行。",
    run: ["在 PyCharm 项目内建立专用 sandbox 目录和几份虚构 JSON 样例。", "新建 project_records.py，自己实现保存、读取与异常分支，再分别测试有效、缺失、损坏三种情况。", "向同伴说明字段和路径；请对方按你的步骤复现并对照运行结果。"],
    next: "第 7 章用测试保护读写规则；相同本地快照方法可迁移到路线、站点和任务，但需重新确认隐私字段与保存周期。",
    href: "./playground.html?chapter=6&exercise=5",
  },
  "game-tests": {
    chapter: "第 7 章", title: "领域规则：回归测试", badge: "测试用例 · 断言 · 反例",
    description: "从配送、站点、任务计划、工单队列或能源观察中挑选一个纯规则函数，用标准库 unittest 补上可重复的测试；小游戏规则仍可作为一节内短例。",
    steps: [["选一个规则", "把测试对象写成一句可判断的需求，不测试内部实现细节。"], ["列出三类输入", "至少包括普通情况、边界情况和能揭露错误的反例。"], ["写测试并运行", "在 PyCharm 中运行测试，记录通过与失败信息。"], ["验证测试有区分力", "临时引入一个小错误，确认对应测试会失败，再恢复正确实现。"]],
    checks: ["每个用例记录输入、预期和实际结果。", "边界和反例能区分正确规则与至少一种错误实现。", "重构前后旧测试仍通过，新需求有新增测试证据。"],
    note: "使用 Python 标准库 unittest 即可；不需要额外安装测试框架，也不要为让测试变绿而删掉断言。",
    run: ["在 PyCharm 打开所选项目，找出可独立调用的规则函数。", "新建 test_domain_rules.py，用 unittest 写正常、边界和反例；每个测试只说明一个行为。", "运行测试并保存结果；故意制造一次错误验证测试能发现问题，再恢复代码重跑。"],
    next: "第 8 章把本书方法迁移到文件整理助手；第 9 章练习如何审阅并验证 AI 提供的测试建议。",
    href: "./playground.html?chapter=7&exercise=5",
  },
  "file-organizer": {
    chapter: "第 8 章", title: "文件整理助手：安全 dry run", badge: "现实问题 · 路径 · 风险控制",
    description: "把分类规则转成文件整理计划。第一版只报告每个文件的拟移动位置，不执行移动、覆盖或删除；先让结果可检查，再考虑扩展。",
    steps: [["写明分类规则", "明确已知后缀的目标目录，以及未知类型和无后缀文件如何处理。"], ["扫描隔离样例", "只读取项目自己的 sandbox/input 目录。"], ["生成 dry run", "输出源路径、拟定目标和不处理原因，不调用任何移动或删除操作。"], ["标出同名冲突", "目标已存在时记录冲突并跳过，不能覆盖已有文件。"]],
    checks: ["photo.png 与 notes.pdf 进入计划中的分类目录；README 保持原位。", "空目录、未知后缀和同名目标均产生可解释结果。", "dry run 前后样例目录内容、文件名和数量完全不变。"],
    note: "本项目使用 Python 标准库，不需要 PyScreen。仅在项目自带的 sandbox 中验证；不得直接指向个人下载目录。",
    run: ["在 PyCharm 新建纯 Python 项目和 sandbox/input 样例目录，先手工列出预期分类。", "新建 file_organizer.py，实现只生成计划的函数，并打印源、目标和跳过原因。", "用空目录、未知文件和同名冲突测试；本阶段不实现真实移动。"],
    next: "确认需求、dry run 和隔离测试充分后，再由教师决定是否扩展到 sandbox 内的实际移动；绝不直接试运行个人目录。",
    href: "./playground.html?chapter=8&exercise=2",
  },
  "ai-collaboration": {
    chapter: "第 9 章", title: "AI 协作：一次小步改进", badge: "表达任务 · 审阅建议 · 运行验证",
    description: "从配送路线、共享出行、个人任务计划、服务工单、楼宇观察、文件整理或一个小游戏规则中选一项小问题，请 AI 提方案或测试建议；关键判断、实现和验收仍由你完成。",
    steps: [["先写自己的判断", "描述目标、当前行为、预期行为和一个可复现输入。"], ["限定 AI 工作范围", "只请 AI 分析一项改动或补测试，不要求生成整款程序。"], ["审阅假设与影响", "检查它依赖什么前提、会改动哪些代码、是否遗漏边界。"], ["自己实现并验证", "在 PyCharm 应用选定方案，运行旧测试、新测试和一个反例。"]],
    checks: ["保留本人需求、AI 建议、采纳或拒绝理由。", "至少一项测试来自边界或反例；实际运行结果能支持结论。", "不提交密钥、个人信息或无关的整份项目代码。"],
    note: "AI 的解释、代码和测试都只是待检查的建议；不要让 AI 一次生成完整项目，也不要将它的自述当成正确性证据。",
    run: ["在 PyCharm 中打开一个自己理解的已有项目，先运行并记录当前测试结果。", "向自选 AI 工具提供最小必要上下文，只请求一项改动建议或测试建议。", "由自己决定如何改，运行原测试、新测试和边界反例，并整理使用记录。"],
    next: "可以继续把一项需求拆成更小的任务，但每次只实施一个可验证改动；课程综合实践再完成完整闭环。",
    href: "./playground.html?chapter=9&exercise=5",
  },
};
const chapterProject = chapterProjectGuides[projectName];
const chapterProjectMode = Boolean(chapterProject);

function fillProjectList(selector, items, asSteps = false) {
  const list = document.querySelector(selector);
  list.replaceChildren(...items.map((item) => {
    const entry = document.createElement("li");
    if (asSteps) {
      const title = document.createElement("strong");
      title.textContent = item[0];
      const detail = document.createElement("span");
      detail.textContent = item[1];
      entry.append(title, detail);
    } else {
      entry.textContent = item;
    }
    return entry;
  }));
}

function renderChapterProject(guide) {
  document.querySelector("#chapter-project-kicker").textContent = `${guide.chapter} PyCharm 项目实践`;
  document.querySelector("#chapter-project-description").textContent = guide.description;
  document.querySelector("#chapter-project-badge").textContent = guide.badge;
  document.querySelector("#chapter-project-step-count").textContent = `01 → 0${guide.steps.length}`;
  document.querySelector("#chapter-project-note").textContent = guide.note;
  document.querySelector("#chapter-project-next").textContent = guide.next;
  document.querySelector("#chapter-project-related").href = guide.href;
  document.querySelector("#chapter-project-steps").classList.toggle("is-long", guide.steps.length > 4);
  fillProjectList("#chapter-project-steps", guide.steps, true);
  fillProjectList("#chapter-project-checks", guide.checks);
  fillProjectList("#chapter-project-run-steps", guide.run);
}
if (Number.isInteger(requestedLevel) && requestedLevel >= 1 && requestedLevel <= 9) {
  currentLevel = requestedLevel - 1;
} else if (chapterTitles[requestedChapter]) {
  currentChapter = requestedChapter;
  const chapterLevels = levels.map((level, index) => ({ level, index })).filter(({ level }) => level.chapter === currentChapter);
  if (Number.isInteger(requestedExercise) && requestedExercise >= 1 && requestedExercise <= chapterLevels.length) {
    currentLevel = chapterLevels[requestedExercise - 1].index;
  } else {
    currentLevel = chapterLevels[0].index;
  }
}
currentChapter = levels[currentLevel].chapter;

function levelsForChapter(chapter = currentChapter) {
  return levels.map((level, index) => ({ level, index })).filter(({ level }) => level.chapter === chapter);
}

function chapterExerciseNumber(index, chapter = levels[index].chapter) {
  return levelsForChapter(chapter).findIndex((entry) => entry.index === index) + 1;
}

function setStatus(message, state = "info") {
  statusBox.textContent = message;
  statusBox.dataset.state = state;
}

let actionFeedbackTimer = null;
let actionFeedbackButton = null;
function showActionFeedback(button, label, state = "success") {
  if (actionFeedbackTimer !== null) window.clearTimeout(actionFeedbackTimer);
  if (actionFeedbackButton) {
    actionFeedbackButton.textContent = actionFeedbackButton.dataset.originalLabel;
    delete actionFeedbackButton.dataset.feedback;
  }
  button.dataset.originalLabel ||= button.textContent;
  button.textContent = label;
  button.dataset.feedback = state;
  actionFeedbackButton = button;
  actionFeedbackTimer = window.setTimeout(() => {
    button.textContent = button.dataset.originalLabel;
    delete button.dataset.feedback;
    actionFeedbackButton = null;
    actionFeedbackTimer = null;
  }, 1200);
}

function renderPlaybackButton() {
  playButton.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-label", isPlaying ? "暂停画面播放" : "播放所有画面帧");
  playButton.setAttribute("aria-pressed", String(isPlaying));
  playLabel.textContent = isPlaying ? "暂停" : "播放";
}

function stopPlayback() {
  if (playbackTimer !== null) window.clearTimeout(playbackTimer);
  playbackTimer = null;
  isPlaying = false;
  renderPlaybackButton();
}

function clearResult({ preserveRuntimeTools = false } = {}) {
  if (activeRunCancel) activeRunCancel();
  stopPlayback();
  result = null;
  frameIndex = 0;
  variableReadout.textContent = "变量：尚未运行";
  variableInspector.open = false;
  variableValues.replaceChildren();
  frameLabel.textContent = "尚未运行";
  framePosition.textContent = "0 / 0";
  traceCount.textContent = "0 步";
  traceList.replaceChildren();
  emptyState.hidden = false;
  previousButton.disabled = true;
  nextButton.disabled = true;
  playButton.disabled = true;
  programOutput.textContent = "运行后显示 print() 输出。";
  workspaceFiles.replaceChildren();
  const emptyFile = document.createElement("li");
  emptyFile.textContent = "运行后列出 /workspace 中的文件。";
  workspaceFiles.append(emptyFile);
  if (!preserveRuntimeTools) runtimeTools.open = false;
  PyScreenRenderer.drawFrame(canvas, null, null);
}

function renderLevelTrack() {
  const level = levels[currentLevel];
  const chapterLevels = levelsForChapter(level.chapter);
  const localNumber = chapterExerciseNumber(currentLevel, level.chapter);
  const coreCount = chapterLevels.filter(({ level: item }) => !item.extension).length;
  const extensionCount = chapterLevels.filter(({ level: item }) => item.extension).length;
  const current = document.querySelector("#level-directory-current");
  const currentName = level.short.replace(/\s*[（(]选做[）)]$/, "");
  current.textContent = (level.extension ? "EX" : String(localNumber).padStart(2, "0")) + " · " + currentName;
  document.querySelector(".level-directory-meta").textContent = `${coreCount} 项核心${extensionCount ? ` · ${extensionCount} 项选做` : ""} · 可自由进入`;
  levelTrack.setAttribute("aria-label", `选择第 ${Number(level.chapter)} 章练习`);
  if (renderedTrackChapter !== level.chapter) {
    levelTrack.replaceChildren();
    levelButtons.clear();
    const coreTrack = document.createElement("div");
    coreTrack.className = "level-track-core";
    coreTrack.setAttribute("role", "group");
    coreTrack.setAttribute("aria-label", "核心练习");
    const extensionTrack = document.createElement("div");
    extensionTrack.className = "level-track-extension";
    extensionTrack.setAttribute("role", "group");
    extensionTrack.setAttribute("aria-label", "选做拓展");
    const extensionLabel = document.createElement("p");
    extensionLabel.className = "level-track-extension-label";
    extensionLabel.textContent = "选做拓展";
    extensionTrack.append(extensionLabel);
    chapterLevels.forEach(({ level: item, index }, localIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "level-button";
      if (item.extension) button.classList.add("is-extension");
      const number = document.createElement("span");
      number.className = "level-number";
      number.textContent = item.extension ? "EX" : String(localIndex + 1).padStart(2, "0");
      const title = document.createElement("span");
      title.className = "level-name";
      title.textContent = item.short.replace(/\s*[（(]选做[）)]$/, "");
      const state = document.createElement("span");
      state.className = "level-status";
      button.append(number, title, state);
      button.addEventListener("click", () => selectLevel(index));
      levelButtons.set(index, button);
      (item.extension ? extensionTrack : coreTrack).append(button);
    });
    levelTrack.append(coreTrack);
    if (extensionCount) levelTrack.append(extensionTrack);
    renderedTrackChapter = level.chapter;
  }

  chapterLevels.forEach(({ level: item, index }) => {
    const button = levelButtons.get(index);
    const completed = completedLevels.has(index);
    button.setAttribute("aria-current", index === currentLevel ? "step" : "false");
    button.classList.toggle("is-complete", completed);
    button.querySelector(".level-status").textContent = completed ? (item.manualReview ? "已记录" : "已通过") : "";
  });
}

function renderApis() {
  const list = document.querySelector("#api-list");
  const apis = levels[currentLevel].apis || [];
  const signature = apis.join("|");
  if (signature === renderedApiSignature) return;
  renderedApiSignature = signature;
  list.replaceChildren();
  if (!apis.length) {
    document.querySelector("#api-count").textContent = "00";
    return;
  }
  const apiItems = {
    clear: ['screen.clear(color="sand")', "清空画面；color 可省略，默认沙色背景"],
    rect: ['screen.draw_rect(x, y, width=1, height=1, *, color="moss", label=None)', "尺寸默认 1×1；color 和 label 为可选关键字参数"],
    text: ['screen.draw_text(text, x, y, *, color="terracotta")', "color 为可选关键字参数"],
    update: ['screen.update(note="")', "提交当前画面并生成一帧；note 可省略"],
    key: ["key = screen.get_key()", "读取本练习选择器提供的一次模拟按键（每次运行至多一次；实时连续按键请在 PyCharm）"],
    sleep: ["screen.sleep(seconds)", "设置帧间回放间隔（秒）；浏览器里不会真实暂停代码"],
    wait: ['screen.wait(message="...")', "仅在 PyCharm 中有效；message 可自定义结束提示，浏览器练习台不会等待"],
  };
  apis.forEach((name) => {
    const [signature, description] = apiItems[name];
    const item = document.createElement("article");
    item.className = "api-item" + (name === "wait" ? " api-readonly" : "");
    const detail = document.createElement("div");
    const code = document.createElement("code");
    code.textContent = signature;
    const hint = document.createElement("p");
    hint.textContent = description;
    detail.append(code, hint);
    item.append(detail);
    if (insertions[name]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "插入";
      button.setAttribute("aria-label", "插入 " + signature);
      button.addEventListener("click", () => {
        insertCall(name);
        showActionFeedback(button, "已插入");
        setStatus(`已插入 ${insertions[name]}；运行后检查是否满足本练习的验收条件。`);
      });
      item.append(button);
    }
    list.append(item);
  });
  document.querySelector("#api-count").textContent = String(apis.length).padStart(2, "0");
}

function renderGuidedTask(level) {
  const guidedBadge = document.querySelector(".guided-badge");
  guidedBadge.textContent = level.manualReview ? (level.extension ? "拓展记录" : "记录后自查") : (level.extension ? "拓展练习" : "核心练习");
  guidedCheck.textContent = level.manualReview ? (level.extension ? "完成拓展记录" : "完成记录") : "核对答案";
  guidedPrompt.textContent = level.prompt;
  guidedCode.textContent = level.code;
  guidedCode.hidden = !level.code;
  guidedQuestions.replaceChildren();
  guidedFeedback.dataset.checked = "false";
  level.questions.forEach((question) => {
    const wrapper = document.createElement("div");
    wrapper.className = "guided-question";
    if (question.wide) wrapper.dataset.wide = "true";
    const fieldId = "guided-" + (currentLevel + 1) + "-" + question.key;
    const label = document.createElement("label");
    label.htmlFor = fieldId;
    label.textContent = question.label;
    let field;
    if (question.type === "select") {
      field = document.createElement("select");
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "选择一个答案";
      field.append(placeholder);
      question.choices.forEach((choice) => {
        const option = document.createElement("option");
        option.value = choice;
        option.textContent = choice;
        field.append(option);
      });
    } else if (question.type === "textarea") {
      field = document.createElement("textarea");
      field.rows = 4;
      field.maxLength = 8000;
      field.placeholder = "先独立写下预测结果";
    } else {
      field = document.createElement("input");
      field.type = "number";
      field.step = "any";
      field.inputMode = "decimal";
    }
    field.id = fieldId;
    field.className = "guided-input";
    if (question.answer !== undefined) field.dataset.answer = question.answer;
    if (question.minLength) field.dataset.minLength = String(question.minLength);
    if (question.manual) field.dataset.manual = "true";
    field.name = question.key;
    field.value = level.responses[question.key] || "";
    const choiceHelp = document.createElement("p");
    choiceHelp.className = "guided-choice-help";
    choiceHelp.id = fieldId + "-help";
    choiceHelp.hidden = true;
    const answerFeedback = document.createElement("div");
    answerFeedback.className = "guided-answer-feedback";
    answerFeedback.id = fieldId + "-feedback";
    answerFeedback.hidden = true;
    field.setAttribute("aria-describedby", `${choiceHelp.id} ${answerFeedback.id}`);
    const updateChoiceHelp = () => {
      const note = question.type === "select" ? level.feedback?.[question.key]?.choiceHelp?.[field.value] : "";
      choiceHelp.textContent = note || "";
      choiceHelp.hidden = !note;
    };
    updateChoiceHelp();
    field.addEventListener("input", () => {
      level.responses[question.key] = field.value;
      saveActivity();
      updateChoiceHelp();
      delete wrapper.dataset.reviewState;
      answerFeedback.hidden = true;
      answerFeedback.replaceChildren();
      field.removeAttribute("aria-invalid");
      if (completedLevels.delete(currentLevel)) renderLevelTrack();
      if (guidedFeedback.dataset.checked === "true") {
        guidedFeedback.textContent = "答案已更改；再次核对即可刷新逐题说明。";
        guidedFeedback.dataset.state = "info";
        guidedFeedback.dataset.checked = "false";
      }
    });
    wrapper.append(label, field, choiceHelp, answerFeedback);
    guidedQuestions.append(wrapper);
  });
  guidedFeedback.textContent = completedLevels.has(currentLevel)
    ? level.manualReview ? "记录已填写；文字质量需按左侧清单自行复核。" : "本项练习已通过。仍可修改答案并重新核对。"
    : Object.values(level.responses).some(Boolean)
      ? "已保留你的作答；修改或核对即可继续，暂存不代表答案已通过。"
      : "先根据题目独立作答，完成后核对。答案仅在当前标签页暂存。";
  guidedFeedback.dataset.state = completedLevels.has(currentLevel) ? (level.manualReview ? "info" : "success") : "info";
}

function appendGuidedReviewLine(container, labelText, detail, className = "") {
  const line = document.createElement("p");
  line.className = "guided-review-line" + (className ? " " + className : "");
  const label = document.createElement("strong");
  label.textContent = labelText;
  line.append(label, document.createTextNode(" " + detail));
  container.append(line);
}

function checkGuidedAnswers() {
  const level = levels[currentLevel];
  const fields = [...guidedQuestions.querySelectorAll(".guided-input")];
  const questions = new Map(level.questions.map((question) => [question.key, question]));
  const assessments = fields.map((field) => {
    const question = questions.get(field.name);
    const text = field.value.trim();
    const minLength = Number(field.dataset.minLength || 1);
    const missing = field.dataset.manual === "true" ? text.length < minLength : text === "";
    if (missing) return { field, question, state: "missing" };
    if (field.dataset.manual === "true") return { field, question, state: "manual" };
    const actual = field.type === "number" ? Number(field.value) : text.replace(/\r\n/g, "\n");
    const expected = field.type === "number" ? Number(field.dataset.answer) : field.dataset.answer.trim().replace(/\r\n/g, "\n");
    return { field, question, state: actual === expected ? "correct" : "incorrect", actual };
  });
  const missing = assessments.filter((item) => item.state === "missing");
  const incorrect = assessments.filter((item) => item.state === "incorrect");
  const correct = assessments.filter((item) => item.state === "correct");
  const allResolved = missing.length === 0 && incorrect.length === 0;
  assessments.forEach(({ field, question, state, actual }) => {
    field.parentElement.dataset.reviewState = state;
    const feedback = field.parentElement.querySelector(".guided-answer-feedback");
    feedback.replaceChildren();
    feedback.hidden = false;
    field.removeAttribute("aria-invalid");
    const minLength = Number(field.dataset.minLength || 1);
    const review = level.feedback?.[question.key] || {};
    if (state === "missing") {
      feedback.dataset.state = "missing";
      field.setAttribute("aria-invalid", "true");
      appendGuidedReviewLine(
        feedback,
        "还差一点",
        field.dataset.manual === "true"
          ? `还需填写至少 ${Math.max(0, minLength - field.value.trim().length)} 个字，才能记录；页面不会判断文字质量。`
          : "这一项还没有填写或选择。"
      );
      return;
    }
    if (state === "manual") {
      feedback.dataset.state = "manual";
      appendGuidedReviewLine(feedback, "已记录", "本页不自动评价文字内容，请按题目清单自行复核。");
      return;
    }
    if (state === "incorrect") {
      feedback.dataset.state = "incorrect";
      field.setAttribute("aria-invalid", "true");
      const answer = field.dataset.answer;
      const value = field.type === "number" ? String(field.value) : String(actual);
      appendGuidedReviewLine(feedback, "你的答案", `「${value}」；${review.wrongResult || "这会使本题追踪的结果与程序实际执行不符。"}`);
      appendGuidedReviewLine(feedback, "建议答案", `「${answer}」；${review.why || "按题目给出的执行顺序逐步核对即可得到该结果。"}`, "guided-review-reason");
      if (field.tagName === "TEXTAREA") {
        const expected = document.createElement("pre");
        expected.className = "guided-review-expected";
        expected.textContent = answer;
        feedback.append(expected);
      }
      return;
    }
    feedback.dataset.state = "correct";
    appendGuidedReviewLine(feedback, "判断正确", review.why || "该答案与题目要求的程序结果一致。");
  });
  guidedFeedback.dataset.checked = "true";
  if (allResolved) {
    completedLevels.add(currentLevel);
    renderLevelTrack();
    if (level.manualReview) {
      guidedFeedback.textContent = "已记录。文字部分按清单自行复核；自动核对项的结果和依据已显示在对应题目下。";
      guidedFeedback.dataset.state = "info";
      setStatus("记录已完成；文字质量仍需按验收清单复核。", "info");
    } else {
      guidedFeedback.textContent = `核对通过：${correct.length} 项答案正确，判断依据见各题下方。`;
      guidedFeedback.dataset.state = "success";
      setStatus("核对通过；你可以继续修改答案或自由切换练习。", "success");
    }
  } else {
    const summary = [];
    if (incorrect.length) summary.push(`${incorrect.length} 项答案需调整`);
    if (missing.length) summary.push(`${missing.length} 项还未填写`);
    guidedFeedback.textContent = `已标出${summary.join("、")}；不用重做整题，查看对应答案下方的结果和判断依据即可。`;
    guidedFeedback.dataset.state = incorrect.length ? "error" : "info";
    setStatus(`核对完成：${correct.length} 项正确，${incorrect.length} 项需调整，${missing.length} 项待填写。`, incorrect.length ? "error" : "info");
    const firstUnresolved = assessments.find((item) => item.state === "incorrect" || item.state === "missing");
    firstUnresolved.field.focus({ preventScroll: true });
    firstUnresolved.field.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
    });
  }
}

let exerciseTransitions = [];

function animateExerciseChange() {
  const previous = new Map();
  exerciseTransitions.forEach((animation) => {
    if (animation.playState !== "running") return;
    const panel = animation.effect.target;
    const style = window.getComputedStyle(panel);
    previous.set(panel, { opacity: style.opacity, transform: style.transform });
  });
  exerciseTransitions.forEach((animation) => animation.cancel());
  exerciseTransitions = [];
  if (workspace.hidden || !workspace.animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const panels = [taskRail, guidedPanel, editorPanel, previewPanel].filter((panel) => !panel.hidden);
  exerciseTransitions = panels.map((panel, index) => panel.animate([
    previous.get(panel) || { opacity: 0.94, transform: "translateY(4px)" },
    { opacity: 1, transform: "translateY(0)" },
  ], {
    duration: previous.size ? 200 : index === 0 ? 280 : 320,
    delay: previous.size ? 0 : [0, 50, 90][index],
    easing: "cubic-bezier(0.2, 0.65, 0.3, 1)",
    fill: "backwards",
  }));
}

function selectLevel(index) {
  if (index === currentLevel) return;
  currentLevel = index;
  currentChapter = levels[index].chapter;
  editorFocused = false;
  const url = new URL(window.location.href);
  url.searchParams.delete("level");
  url.searchParams.set("chapter", String(Number(currentChapter)));
  url.searchParams.set("exercise", String(chapterExerciseNumber(index)));
  window.history.replaceState(null, "", url);
  renderLevel();
  clearResult();
  setStatus(levels[index].restored ? "已恢复当前标签页的作答与输入；请重新核对或运行验证。" : completedLevels.has(index) ? "本练习已通过；你可以继续修改并再次验证。" : "按任务提示完成本次练习，再核对或运行检查结果。");
  levels[index].restored = false;
  animateExerciseChange();
}

function renderLevel() {
  const level = levels[currentLevel];
  const chapterLevels = levelsForChapter(level.chapter);
  const coreCount = chapterLevels.filter(({ level: item }) => !item.extension).length;
  const localNumber = chapterExerciseNumber(currentLevel, level.chapter);
  const guided = level.mode === "guided";
  const usesScreen = Boolean(level.apis);
  document.querySelector(".playground-title .eyebrow").textContent = `PYSCREEN · 第 ${Number(level.chapter)} 章配套练习`;
  document.title = `${chapterTitles[level.chapter]} · Python 练习台`;
  workspace.classList.toggle("is-guided", guided);
  document.body.classList.toggle("guided-mode", guided);
  taskRail.classList.toggle("is-guided", guided);
  taskRail.classList.toggle("is-task-only", guided || !usesScreen);
  apiCard.hidden = guided || !usesScreen;
  editorPanel.hidden = guided;
  previewPanel.hidden = guided;
  previewPanel.classList.toggle("is-code-only", !usesScreen);
  screenPreview.hidden = !usesScreen;
  document.querySelector(".preview-heading h2").textContent = usesScreen ? "电子屏预览" : "程序状态与轨迹";
  previousButton.hidden = !usesScreen;
  nextButton.hidden = !usesScreen;
  playButton.hidden = !usesScreen;
  framePosition.hidden = !usesScreen;
  guidedPanel.hidden = !guided;
  runButton.hidden = guided;
  resetButton.hidden = guided;
  copyButton.hidden = guided;
  if (!guided) {
    editor.value = level.code;
    document.querySelector("#editor-help").textContent = draftStorageAvailable
      ? "代码在浏览器临时环境运行，不读写电脑文件；草稿仅在当前标签页暂存，长期保存请复制到 PyCharm。"
      : "代码在浏览器临时环境运行，不读写电脑文件；暂存不可用，请复制到 PyCharm 保存。";
  }
  document.querySelector("#task-progress").textContent = level.extension
    ? `选做拓展 · 不计入第 ${Number(level.chapter)} 章 ${coreCount} 项核心练习`
    : `核心练习 ${String(localNumber).padStart(2, "0")} / ${String(coreCount).padStart(2, "0")} · 可自由选择`;
  document.querySelector("#task-eyebrow").textContent = (level.extension ? "选做拓展" : "核心练习 " + String(localNumber).padStart(2, "0")) + " · " + level.short.replace(/\s*[（(]选做[）)]$/, "");
  document.querySelector("#task-title").textContent = level.title;
  document.querySelector("#task-description").textContent = level.description;
  document.querySelector("#acceptance-text").textContent = level.acceptance;
  const steps = document.querySelector("#task-steps");
  steps.replaceChildren(...level.steps.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
  const supplement = document.querySelector("#task-supplement");
  supplement.hidden = !level.supplement;
  supplement.open = false;
  document.querySelector("#task-supplement-text").textContent = level.supplement || "";
  keyControl.hidden = !level.requiresKey;
  inputEditor.value = level.inputs;
  keyInput.value = level.key;
  if (guided) renderGuidedTask(level);
  renderLevelTrack();
  renderApis();
}

function drawSelectedFrame(animateFrame = false, previousFrame = null, syncTrace = true) {
  if (!levels[currentLevel].apis) {
    frameLabel.textContent = result ? "程序运行结果" : "尚未运行";
    return;
  }
  const frame = result && result.history ? result.history[frameIndex] || null : null;
  emptyState.hidden = Boolean(frame);
  frameLabel.textContent = frame ? "第 " + frame.sequence + " 帧 · " + (frame.note || "未命名") : "没有提交画面";
  framePosition.textContent = (frame ? frameIndex + 1 : 0) + " / " + (result ? result.history.length : 0);
  previousButton.disabled = !frame || frameIndex === 0;
  nextButton.disabled = !frame || frameIndex >= result.history.length - 1;
  playButton.disabled = !result || result.history.length < 2;
  renderPlaybackButton();
  if (result && animateFrame && previousFrame && frame) PyScreenRenderer.transitionFrame(canvas, result, previousFrame, frame);
  else if (result) PyScreenRenderer.drawFrame(canvas, result, frame);
  if (syncTrace && frame?.trace_index !== undefined) setActiveTrace(frame.trace_index);
}

function setActiveTrace(index) {
  traceList.querySelectorAll(".trace-entry").forEach((button, itemIndex) => {
    if (itemIndex === index) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
}

function focusEditorLine(line) {
  const lines = editor.value.split("\n");
  const lineIndex = Math.max(0, Math.min(lines.length - 1, line - 1));
  const start = lines.slice(0, lineIndex).reduce((total, line) => total + line.length + 1, 0);
  editor.focus();
  editor.setSelectionRange(start, start + lines[lineIndex].length);
  const lineHeight = Number.parseFloat(getComputedStyle(editor).lineHeight) || 24;
  editor.scrollTop = Math.max(0, lineIndex * lineHeight - lineHeight * 2);
}

function appendStatusAction(label, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "status-action";
  button.textContent = label;
  button.addEventListener("click", action);
  statusBox.append(button);
}

function jumpToTraceStep(index) {
  const step = result?.trace?.[index];
  if (!step) return;
  setActiveTrace(index);
  focusEditorLine(step.line);

  const nextFrame = result.history.findIndex((frame) => frame.trace_index !== undefined && frame.trace_index >= index);
  if (nextFrame >= 0) {
    stopPlayback();
    frameIndex = nextFrame;
    drawSelectedFrame(false, null, false);
    setStatus(`已定位到第 ${step.line} 行；当前显示其后提交的第 ${nextFrame + 1} 帧。`, "info");
  } else {
    setStatus(`已定位到第 ${step.line} 行；这条语句之后没有新提交的画面。`, "info");
  }
}

function renderTrace() {
  traceList.replaceChildren();
  const trace = result ? result.trace : [];
  traceCount.textContent = trace.length + " 步" + (result?.trace_truncated ? "（已截断）" : "");
  trace.forEach((step, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "trace-entry";
    button.addEventListener("click", () => jumpToTraceStep(index));
    const description = document.createElement("span");
    description.className = "trace-description";
    description.textContent = "第 " + step.line + " 行 · " + step.kind + " · " + step.detail;
    const source = document.createElement("code");
    source.textContent = step.source;
    button.append(description, source);
    item.append(button);
    traceList.append(item);
  });
}

function renderResult() {
  const variables = Object.entries(result.variables);
  variableReadout.textContent = variables.length
    ? "变量：" + variables.map(([name, value]) => name + " = " + value).join("，")
    : "变量：无";
  variableValues.replaceChildren();
  for (const [name, value] of variables) {
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = name;
    detail.textContent = value;
    variableValues.append(term, detail);
  }
  frameIndex = Math.max(0, result.history.length - 1);
  renderTrace();
  if (result.history.length) drawSelectedFrame();
  else if (result.trace.length) setActiveTrace(result.trace.length - 1);
}

function playNextFrame() {
  if (!isPlaying || !result) return;
  if (frameIndex >= result.history.length - 1) {
    stopPlayback();
    drawSelectedFrame();
    return;
  }
  const delay = result.history[frameIndex].delay || 0.45;
  playbackTimer = window.setTimeout(() => {
    const previousFrame = result.history[frameIndex];
    frameIndex += 1;
    drawSelectedFrame(true, previousFrame);
    playNextFrame();
  }, Math.max(100, delay * 1000));
}

async function runCode() {
  if (runButton.disabled || levels[currentLevel].mode !== "code") return;
  const runLevel = currentLevel;
  const submittedCode = editor.value;
  const submittedKey = levels[currentLevel].requiresKey ? keyInput.value : null;
  const submittedInput = inputEditor.value;
  if (submittedCode.length > 8_000) {
    setStatus("代码超过 8,000 个字符，请拆成较小的步骤。", "error");
    return;
  }
  if (submittedInput.length > 2_000) {
    setStatus("模拟输入不能超过 2,000 个字符。", "error");
    return;
  }
  runButton.disabled = true;
  stopRunButton.hidden = false;
  runButton.setAttribute("aria-busy", "true");
  runLabel.textContent = "运行中…";
  stopPlayback();
  setStatus("正在本地加载 Python 运行环境……", "running");
  try {
    const payload = await executeInWorker(submittedCode, submittedKey, submittedInput);
    if (runLevel !== currentLevel || submittedCode !== editor.value || submittedInput !== inputEditor.value || (levels[runLevel].requiresKey && submittedKey !== keyInput.value)) return;
    result = payload;
    renderExecutionArtifacts(payload);
    renderResult();
    if (!payload.ok) {
      const location = payload.line ? "第 " + payload.line + " 行：" : "";
      setStatus(location + (payload.error || "程序运行出错。"), "error");
      if (Number.isInteger(payload.line) && payload.line > 0) {
        appendStatusAction(`定位第 ${payload.line} 行`, () => focusEditorLine(payload.line));
      }
      return;
    }
    if (levels[runLevel].passes(result)) {
      completedLevels.add(runLevel);
      renderLevelTrack();
      const chapterLevels = levelsForChapter(levels[runLevel].chapter);
      const coreLevels = chapterLevels.filter(({ level }) => !level.extension);
      const completedCore = coreLevels.filter(({ index }) => completedLevels.has(index)).length;
      setStatus(completedCore === coreLevels.length
        ? `本章 ${coreLevels.length} 项核心练习均已填写或通过。文字记录仍需自行复核；你可以继续修改代码并重复验证。`
        : "本练习通过。继续检查执行轨迹、修改代码再次验证，或自由切换到任一练习。", "success");
    } else {
      const feedback = levels[runLevel].failureFeedback;
      setStatus(typeof feedback === "function" ? feedback(result) : `程序已运行，但尚未满足：${levels[runLevel].acceptance} 当前提交 ${result.history.length} 帧；展开变量或查看输出，与预期逐项比较后再修改。`, "info");
    }
  } catch (error) {
    if (error.name === "AbortError") {
      if (runLevel === currentLevel && submittedCode === editor.value) setStatus(error.message, "info");
    } else {
      setStatus(error.message || "Python 运行环境无法启动。请重新运行或检查浏览器是否支持 WebAssembly。", "error");
    }
  } finally {
    runButton.disabled = false;
    stopRunButton.hidden = true;
    runButton.removeAttribute("aria-busy");
    runLabel.textContent = "运行代码";
  }
}

function executeInWorker(code, key, inputs) {
  return new Promise((resolve, reject) => {
    let worker;
    try {
      worker = new Worker("./playground-worker.mjs", { type: "module" });
    } catch (error) {
      reject(error);
      return;
    }

    activeWorker = worker;
    let executionTimer = null;
    const cleanup = () => {
      window.clearTimeout(loadTimer);
      if (executionTimer !== null) window.clearTimeout(executionTimer);
      if (activeWorker === worker) activeWorker = null;
      if (activeRunCancel === cancel) activeRunCancel = null;
      worker.terminate();
    };
    const finish = (callback, value) => {
      cleanup();
      callback(value);
    };
    const cancel = () => {
      const error = new Error("已停止运行。练习文件只保存在本次运行的临时内存中。");
      error.name = "AbortError";
      finish(reject, error);
    };
    activeRunCancel = cancel;
    const loadTimer = window.setTimeout(() => {
      finish(reject, new Error("Python 运行环境加载超时；请检查浏览器或重新打开页面。"));
    }, 45_000);

    worker.addEventListener("message", (event) => {
      if (activeWorker !== worker) return;
      const message = event.data;
      if (message?.type === "ready") {
        window.clearTimeout(loadTimer);
        setStatus("Python 3.12.7 已就绪，正在执行代码……", "running");
        executionTimer = window.setTimeout(() => {
          finish(reject, new Error("运行超过 8 秒，练习台已自动停止。请检查循环退出条件；需要持续键盘交互时，请在 PyCharm 的 PyScreen 环境运行。"));
        }, 8_000);
      } else if (message?.type === "result" && message.result && typeof message.result === "object") {
        finish(resolve, message.result);
      } else if (message?.type === "error") {
        finish(reject, new Error(message.message || "Python 运行环境出错。"));
      }
    });
    worker.addEventListener("error", (event) => {
      finish(reject, new Error(event.message || "Python Worker 无法启动。"));
    });
    worker.postMessage({ type: "run", code, key, inputs });
  });
}

function renderExecutionArtifacts(run) {
  programOutput.textContent = run.stdout || "程序没有输出。";
  workspaceFiles.replaceChildren();
  const files = Array.isArray(run.files) ? run.files : [];
  if (!files.length) {
    const emptyFile = document.createElement("li");
    emptyFile.textContent = "本次运行没有在 /workspace 中创建文件。";
    workspaceFiles.append(emptyFile);
  } else {
    files.forEach((file) => {
      const item = document.createElement("li");
      const name = document.createElement("span");
      name.className = "workspace-file-name";
      name.textContent = file.path;
      const size = document.createElement("span");
      size.textContent = " · " + file.size + " B";
      const content = document.createElement("pre");
      content.className = "workspace-file-content";
      content.textContent = file.text || "（空文件）";
      item.append(name, size, content);
      workspaceFiles.append(item);
    });
  }
  if (run.stdout || files.length) runtimeTools.open = true;
}

function insertCall(name) {
  let start = editor.selectionStart;
  let end = editor.selectionEnd;
  if (!editorFocused) {
    const placeholder = /^#.*在这里.*$/m.exec(editor.value);
    if (placeholder) start = end = placeholder.index + placeholder[0].length + (editor.value[placeholder.index + placeholder[0].length] === "\n" ? 1 : 0);
    else start = end = editor.value.length;
  }
  const before = editor.value.slice(0, start);
  const prefix = before && !before.endsWith("\n") ? "\n" : "";
  editor.setRangeText(prefix + insertions[name] + "\n", start, end, "end");
  editor.focus();
  saveEditorChange();
}

function saveEditorChange() {
  const level = levels[currentLevel];
  level.code = editor.value;
  if (draftStorageAvailable) {
    try {
      if (level.code === level.starterCode) sessionStorage.removeItem(draftKey(currentLevel));
      else sessionStorage.setItem(draftKey(currentLevel), level.code);
    } catch {
      draftStorageAvailable = false;
      document.querySelector("#editor-help").textContent = "代码在浏览器临时环境运行，不读写电脑文件；暂存不可用，请复制到 PyCharm 保存。";
    }
  }
  if (completedLevels.delete(currentLevel)) renderLevelTrack();
  clearResult({ preserveRuntimeTools: true });
  setStatus("代码已修改；运行后检查是否满足本练习的验收条件。");
}

function wrappedProgram() {
  if (!levels[currentLevel].apis) return editor.value.trimEnd() + "\n";
  const body = editor.value.split("\n").map((line) => (line ? "    " + line : "")).join("\n");
  return [
    "from pyscreen import Screen",
    "",
    'screen = Screen(width=20, height=12, title="函数练习")',
    "try:",
    body,
    "    screen.wait()",
    "finally:",
    "    screen.close()",
    "",
  ].join("\n");
}

async function copyProgram() {
  try {
    await navigator.clipboard.writeText(wrappedProgram());
    showActionFeedback(copyButton, "已复制");
    setStatus(levels[currentLevel].apis
      ? "已复制完整 PyCharm 程序：包含 Screen 初始化、你的代码和 screen.wait() 结束等待。"
      : "已复制为独立 Python 程序；文件练习使用临时目录，不会操作个人文件。", "success");
  } catch {
    showActionFeedback(copyButton, "复制失败", "error");
    setStatus("复制未成功。请确认浏览器允许剪贴板访问，或手动复制编辑区代码。", "error");
  }
}

document.querySelector("#reset-button").addEventListener("click", () => {
  const previousCode = editor.value;
  const resetLevel = currentLevel;
  levels[currentLevel].code = levels[currentLevel].starterCode;
  if (draftStorageAvailable) {
    try { sessionStorage.removeItem(draftKey(currentLevel)); }
    catch { draftStorageAvailable = false; }
  }
  if (completedLevels.delete(currentLevel)) renderLevelTrack();
  editor.value = levels[currentLevel].code;
  clearResult();
  setStatus("已恢复起始代码；模拟输入保留。" + (previousCode !== editor.value ? "误点可撤销，继续编辑前有效。" : ""));
  if (previousCode !== editor.value) {
    appendStatusAction("撤销重置", () => {
      if (currentLevel !== resetLevel) return;
      editor.value = previousCode;
      saveEditorChange();
      setStatus("已恢复重置前的代码；请重新运行验证。");
      editor.focus();
    });
  }
  editor.focus();
});
document.querySelector("#copy-button").addEventListener("click", copyProgram);
runButton.addEventListener("click", runCode);
stopRunButton.addEventListener("click", () => {
  if (activeRunCancel) activeRunCancel();
});
guidedCheck.addEventListener("click", checkGuidedAnswers);
playButton.addEventListener("click", () => {
  if (isPlaying) {
    stopPlayback();
    drawSelectedFrame();
    return;
  }
  if (!result || result.history.length < 2) return;
  if (frameIndex >= result.history.length - 1) frameIndex = 0;
  isPlaying = true;
  drawSelectedFrame(true);
  playNextFrame();
});
previousButton.addEventListener("click", () => {
  stopPlayback();
  const previousFrame = result?.history?.[frameIndex];
  frameIndex -= 1;
  drawSelectedFrame(true, previousFrame);
});
nextButton.addEventListener("click", () => {
  stopPlayback();
  const previousFrame = result?.history?.[frameIndex];
  frameIndex += 1;
  drawSelectedFrame(true, previousFrame);
});
editor.addEventListener("input", saveEditorChange);
keyInput.addEventListener("change", () => {
  if (!levels[currentLevel].requiresKey) return;
  levels[currentLevel].key = keyInput.value;
  saveActivity();
  clearResult({ preserveRuntimeTools: true });
  if (completedLevels.delete(currentLevel)) renderLevelTrack();
  setStatus("模拟按键已更改；请重新运行并核对变量、画面与执行轨迹。", "info");
});
editor.addEventListener("focus", () => { editorFocused = true; });
inputEditor.addEventListener("input", () => {
  levels[currentLevel].inputs = inputEditor.value;
  saveActivity();
  if (completedLevels.delete(currentLevel)) renderLevelTrack();
  clearResult({ preserveRuntimeTools: true });
  setStatus("模拟输入已修改；请重新运行程序并核对输出。", "info");
});
editor.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runCode();
  }
});

renderLevel();
if (squareProjectMode || keyboardProjectMode || snakeProjectMode || chapterProjectMode) {
  document.body.classList.remove("guided-mode");
  if (chapterProjectMode) renderChapterProject(chapterProject);
  document.body.classList.add("project-guide-mode");
  document.querySelector(".playground-shell").classList.add("is-project-guide");
  const projectTitle = squareProjectMode ? "移动方块" : snakeProjectMode ? "贪吃蛇项目" : keyboardProjectMode ? "方向键移动方块" : chapterProject.title;
  document.querySelector(".playground-title .eyebrow").textContent = squareProjectMode
    ? "PYSCREEN · 第 1 章项目实践"
    : chapterProjectMode
      ? `PYSCREEN · ${chapterProject.chapter}项目实践`
      : "PYSCREEN · 跨章项目拓展";
  document.querySelector(".playground-title h1").textContent = projectTitle;
  document.querySelector(".skip-link").href = squareProjectMode ? "#square-project" : snakeProjectMode ? "#snake-project" : keyboardProjectMode ? "#keyboard-project" : "#chapter-project";
  document.title = `${projectTitle} · PyScreen 项目实践`;
  document.querySelector("#task-progress").textContent = squareProjectMode
    ? "PyCharm 项目练习 · 学生自编实现"
    : snakeProjectMode
      ? "PyCharm 完整项目 · 学生起始版与参考完成版"
      : keyboardProjectMode
        ? "PyCharm 完整 Python · 自编实现与示例对照"
        : `${chapterProject.chapter} PyCharm 项目 · 自编实现与验证`;
  document.querySelector("#level-directory").hidden = true;
  document.querySelector("#level-track").hidden = true;
  document.querySelector("#practice-workspace").hidden = true;
  projectGuide.hidden = !keyboardProjectMode;
  snakeProjectGuide.hidden = !snakeProjectMode;
  squareProjectGuide.hidden = !squareProjectMode;
  document.querySelector("#chapter-project").hidden = !chapterProjectMode;
}
clearResult();
setStatus(levels[currentLevel].restored ? "已恢复当前标签页的作答与输入；请重新核对或运行验证。" : completedLevels.has(currentLevel) ? "本练习已通过；你可以继续修改并再次验证。" : "按任务提示完成本次练习，再核对或运行检查结果。");
levels[currentLevel].restored = false;
window.addEventListener("resize", () => {
  PyScreenRenderer.resizeCanvas(canvas);
  if (result) drawSelectedFrame();
});
new ResizeObserver(() => {
  PyScreenRenderer.resizeCanvas(canvas);
  if (result) drawSelectedFrame();
}).observe(screenPreview);
PyScreenRenderer.resizeCanvas(canvas);
animateExerciseChange();

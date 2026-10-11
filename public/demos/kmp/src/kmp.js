(function (root) {
  function buildLps(pattern) { return buildLpsTrace(pattern).lps; }
  function buildLpsTrace(pattern) {
    const lps = Array(pattern.length).fill(0), visible = Array(pattern.length).fill(null);
    if (!pattern) return { lps, steps: [{ mode: 'build', phase: 'lps-intro', lps: visible, scan: 0, length: 0, message: '请输入模式串', detail: 'next 数组会随输入生成。' }] };
    const steps = [
      { mode: 'build', phase: 'lps-base-window', lps: [...visible], scan: 0, length: 0, message: '审视 next[0]：窗口只有 Pattern[0]', detail: '真前缀和真后缀都必须比完整窗口短，先确认它们能取什么。' },
      { mode: 'build', phase: 'lps-base-take-prefix', lps: [...visible], scan: 0, length: 0, message: `第一步：从左端取出 ${pattern[0]}`, detail: '先把这个字符当作“从开头取的一段”，看看它是否合格。' },
      { mode: 'build', phase: 'lps-base-take-suffix', lps: [...visible], scan: 0, length: 0, message: `第二步：从右端取出 ${pattern[0]}`, detail: '再从结尾取同一个字符；现在两次取到的都是完整窗口。' },
      { mode: 'build', phase: 'lps-base-reject', lps: [...visible], scan: 0, length: 0, message: '完整窗口不能作为候选', detail: `前缀和后缀都必须比原窗口短，所以 ${pattern[0]} 不能被保留。` },
      { mode: 'build', phase: 'lps-base-confirm', lps: [...visible], scan: 0, length: 0, message: '真前缀与真后缀只能取空串 ∅', detail: 'P[0] 不能同时作为自己的真前缀和真后缀；唯一共同部分是 ∅，长度为 0。' },
    ];
    steps.push({ mode: 'build', phase: 'lps-result', lps: [...visible], scan: 0, length: 0, nextValue: 0, message: '得到答案：0', detail: '两边共同的空串长度为 0；下一步把这个数送进 next[0]。' });
    visible[0] = 0;
    steps.push({ mode: 'build', phase: 'lps-write', lps: [...visible], scan: 0, length: 0, message: '写入 next[0] = 0', detail: '空串长度已确认，现在才把 0 写入数组。' });
    for (let length = 0, scan = 1; scan < pattern.length;) {
      const equal = pattern[scan] === pattern[length];
      const probeLength = length + 1;
      steps.push({ mode: 'build', phase: 'lps-window', lps: [...visible], scan, length, equal, probeLength, message: `决定 next[${scan}]：窗口 P[0…${scan}] = “${pattern.slice(0, scan + 1)}”`, detail: `当前已保留长度 ${length}；本轮尝试把它扩展为 ${probeLength}。` });
      steps.push({ mode: 'build', phase: 'lps-prefix-rule', lps: [...visible], scan, length, equal, probeLength, message: `前缀候选必须是 “${pattern.slice(0, probeLength)}”`, detail: length ? `此前保留 P[0…${length - 1}]；连续扩展时只能接 Pattern[${length}] = ${pattern[length]}。` : `当前长度为 0；唯一的起点是 Pattern[0] = ${pattern[0]}。` });
      for (let count = 1; count <= probeLength; count++) steps.push({ mode: 'build', phase: 'lps-prefix-traverse', lps: [...visible], scan, length, equal, probeLength, traverseCount: count, traverseIndex: count - 1, message: `绿色走到 P[${count - 1}] = “${pattern[count - 1]}”`, detail: `已从 P[0] 连续取出 P[0…${count - 1}] = “${pattern.slice(0, count)}”。` });
      steps.push({ mode: 'build', phase: 'lps-take-prefix', lps: [...visible], scan, length, equal, probeLength, message: `绿色取 P[0…${probeLength - 1}] = “${pattern.slice(0, probeLength)}”`, detail: `从 P[0] 连续取 ${probeLength} 格，尚未比较是否相等。` });
      steps.push({ mode: 'build', phase: 'lps-suffix-rule', lps: [...visible], scan, length, equal, probeLength, message: `后缀候选必须是 “${pattern.slice(scan - probeLength + 1, scan + 1)}”`, detail: `为了和绿色同长 ${probeLength} 格，只能在 Pattern[${scan}] = ${pattern[scan]} 结束。` });
      for (let count = 1; count <= probeLength; count++) { const index = scan - count + 1; steps.push({ mode: 'build', phase: 'lps-suffix-traverse', lps: [...visible], scan, length, equal, probeLength, traverseCount: count, traverseIndex: index, message: `蓝色走到 P[${index}] = “${pattern[index]}”`, detail: `已从 P[${scan}] 连续向左取出 P[${index}…${scan}] = “${pattern.slice(index, scan + 1)}”。` }); }
      steps.push({ mode: 'build', phase: 'lps-take-suffix', lps: [...visible], scan, length, equal, probeLength, message: `蓝色取 P[${scan - probeLength + 1}…${scan}] = “${pattern.slice(scan - probeLength + 1, scan + 1)}”`, detail: `在 P[${scan}] 结束并连续向左取 ${probeLength} 格。` });
      steps.push({ mode: 'build', phase: 'lps-compare', lps: [...visible], scan, length, equal, message: `比较 Pattern[${scan}] 与 Pattern[${length}]`, detail: `${pattern[scan]} ${equal ? '=' : '≠'} ${pattern[length]}：先比较，再决定是否写入。` });
      if (equal) {
        const nextLength = length + 1;
        steps.push({ mode: 'build', phase: 'lps-confirm', lps: [...visible], scan, length, nextLength, equal, message: `相等：候选前缀可扩展到长度 ${nextLength}`, detail: `“${pattern.slice(0, nextLength)}” 同时是当前位置的前缀和后缀。` });
        steps.push({ mode: 'build', phase: 'lps-result', lps: [...visible], scan, length: nextLength, nextValue: nextLength, equal, message: `得到答案：${nextLength}`, detail: `相同前后缀长度为 ${nextLength}；下一步把这个数送进 next[${scan}]。` });
        length = nextLength; visible[scan] = lps[scan] = length;
        steps.push({ mode: 'build', phase: 'lps-write', lps: [...visible], scan, length, equal, message: `写入 next[${scan}] = ${length}`, detail: `“${pattern.slice(0, length)}” 已确认可复用；下一格将计算 next[${scan + 1}]。` }); scan++;
      } else if (length) {
        const from = length; length = lps[length - 1];
        steps.push({ mode: 'build', phase: 'lps-fallback', lps: [...visible], scan, length, from, equal, message: `“${pattern[scan]}” ≠ “${pattern[from]}”：候选 ${from} → ${length}`, detail: `next[${from - 1}] = ${length}，因此保持 scan = ${scan}，改试前缀 “${pattern.slice(0, length)}”。` });
      } else {
        steps.push({ mode: 'build', phase: 'lps-confirm-zero', lps: [...visible], scan, length: 0, equal, message: `“${pattern[scan]}” ≠ “${pattern[0]}”，且候选长度已为 0`, detail: `P[0…${scan}] = “${pattern.slice(0, scan + 1)}” 没有非空共同前后缀。` });
        steps.push({ mode: 'build', phase: 'lps-result', lps: [...visible], scan, length: 0, nextValue: 0, equal, message: '得到答案：0', detail: `没有共同前后缀；下一步把 0 送进 next[${scan}]。` });
        visible[scan] = lps[scan] = 0;
        steps.push({ mode: 'build', phase: 'lps-write', lps: [...visible], scan, length: 0, equal, message: `写入 next[${scan}] = 0`, detail: `P[0…${scan}] 没有可复用部分；下一格将计算 next[${scan + 1}]。` }); scan++;
      }
    }
    steps.push({ mode: 'build', phase: 'lps-done', lps: [...lps], scan: pattern.length - 1, length: lps.at(-1), message: 'next 数组构建完成', detail: `得到 [${lps.join(', ')}]，接着进入主串匹配。` });
    return { lps, steps };
  }
  function buildTrace(text, pattern) {
    const { lps, steps } = buildLpsTrace(pattern);
    if (!pattern) return { lps, steps, matches: [] };
    const matches = [];
    steps.push({ mode: 'search', phase: 'search-intro', i: 0, j: 0, lps, message: `开始在 Text 中找 Pattern “${pattern}”`, detail: `先比较 Text[0] = ${text[0] ?? '∅'} 与 Pattern[0] = ${pattern[0]}。` });
    for (let i = 0, j = 0; i < text.length;) {
      const equal = text[i] === pattern[j];
      steps.push({ mode: 'search', phase: equal ? 'match' : 'compare', i, j, lps, equal, message: equal ? `Text[${i}] = Pattern[${j}] = “${text[i]}”` : `Text[${i}] = “${text[i]}” ≠ Pattern[${j}] = “${pattern[j]}”`, detail: `当前对齐起点为 ${i - j}；已连续匹配 Pattern[0…${Math.max(-1, j - 1)}]。` });
      if (equal) {
        const fromI = i, fromJ = j; i++; j++;
        steps.push({ mode: 'search', phase: 'advance', i, j, fromI, fromJ, lps, equal, message: `“${text[fromI]}” 相等：i ${fromI} → ${i}，j ${fromJ} → ${j}`, detail: `已匹配 Pattern[0…${j - 1}] = “${pattern.slice(0, j)}”。` });
      } else if (j) {
        const from = j; j = lps[j - 1];
        steps.push({ mode: 'search', phase: 'fallback', i, j, from, lps, equal, message: `读取 next[${from - 1}] = ${j}：j ${from} → ${j}`, detail: `Text[${i}] = “${text[i]}” 保持不动；Pattern 保留 “${pattern.slice(0, j)}”。` });
      } else {
        const fromI = i; i++;
        steps.push({ mode: 'search', phase: 'advance-text', i, j, fromI, lps, equal, message: `Pattern[0] = “${pattern[0]}” 未匹配：i ${fromI} → ${i}`, detail: `Text[${fromI}] = “${text[fromI]}” 不能复用，Pattern 仍停在 j = 0。` });
      }
      if (j === pattern.length) { matches.push(i - j); steps.push({ mode: 'search', phase: 'found', i, j, lps, found: i - j, message: `找到匹配，起始位置 ${i - j}`, detail: '完整模式串已对齐；下一步可继续寻找重叠匹配。' }); j = lps[j - 1]; }
    }
    steps.push({ mode: 'search', phase: 'done', i: text.length, j: 0, lps, message: matches.length ? `扫描完成：找到 ${matches.length} 个匹配` : '扫描完成：未找到匹配', detail: matches.length ? `位置：${matches.join('、')}` : '试试修改主串或模式串。' });
    return { lps, steps, matches };
  }
  root.KMP = { buildLps, buildLpsTrace, buildTrace };
}(globalThis));

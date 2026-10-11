const { buildTrace } = window.KMP;

const ids = ['app','textInput','patternInput','textTrack','patternTrack','alignment','lpsTable','eventList','statusTitle','statusDetail','stepBadge','progressText','progressBar','textPointer','patternPointer','lpsHint','foundCount','footerState','randomBtn','resetBtn','prevBtn','playBtn','nextBtn','speedSelect','phaseLabel','stageTitle','buildStage','matchStage','buildPatternTrack','buildScanPointer','decisionTarget','prefixLabel','ruleIcon','ruleText','prefixPreview','suffixPreview','comparisonOperator','proofBoard','prefixCells','suffixCells','proofArrow','processRail','focusAnchor','focusTarget','focusReason','originMap','windowLabel','windowCells','prefixCue','suffixCue','sourceHint','whyStrip','prefixWhy','suffixWhy','valueWhy','guideTargetBuild','guideTargetMatch','moveExplanation','openingLesson','openingPattern','openingChar','openingStart','visualPanel'];
const el = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
let trace, step = 0, timer = null, sceneTimer = null, transferTimer = null, extractionTimer = null, fallbackTimer = null;

function cells(value, index, pointer, phase, found) {
  return [...value].map((char, position) => `<span class="cell ${position < index ? 'passed' : ''} ${position === pointer ? `current ${phase}` : ''} ${found !== undefined && position >= found && position < found + el.patternInput.value.length ? 'found' : ''}"><b>${char}</b><small>${position}</small></span>`).join('');
}
function renderLps(current) {
  const values = current.lps || trace.lps, pattern = el.patternInput.value;
  const lookup = current.phase === 'lps-fallback' || current.phase === 'fallback' ? current.from - 1 : -1;
  el.lpsTable.innerHTML = [...pattern].map((char, index) => `<div class="lps-cell ${current.phase} ${index === (current.mode === 'build' ? current.scan : lookup) ? 'active' : ''} ${index === lookup ? 'lookup' : ''} ${current.phase === 'lps-write' && index === current.scan ? 'incoming' : ''} ${values[index] === null ? 'pending' : ''}"><small>${index}</small><b>${char}</b><span>${values[index] ?? '·'}</span></div>`).join('') || '<p class="empty">请输入模式串</p>';
}
function stop() { clearInterval(timer); clearTimeout(sceneTimer); clearTimeout(transferTimer); clearTimeout(extractionTimer); clearTimeout(fallbackTimer); document.querySelectorAll('.value-transfer,.extraction-token,.fallback-token').forEach((token) => token.remove()); document.querySelectorAll('.proof-cell.arriving').forEach((cell) => cell.classList.remove('arriving')); timer = null; sceneTimer = null; transferTimer = null; extractionTimer = null; fallbackTimer = null; el.visualPanel?.classList.remove('scene-leave', 'scene-enter'); el.playBtn.textContent = '▶ 演示'; }
function proofCells(chars, matched, phase, side) {
  return chars.map((char, index) => `<span class="proof-cell ${index < matched ? 'known' : 'probe'} ${phase} ${side}" style="--delay:${index * 70}ms">${char}</span>`).join('');
}
function sourceCells(chars, prefixLength, suffixLength, traverseIndex) {
  return chars.map((char, index) => `<span class="origin-cell ${index < prefixLength ? 'from-prefix' : ''} ${index >= chars.length - suffixLength ? 'from-suffix' : ''} ${index === traverseIndex ? 'traverse-current' : ''}" style="--delay:${index * 55}ms">${char}<small>${index}</small></span>`).join('');
}
function animateWrite(current) {
  transferTimer = setTimeout(() => {
    const source = el.focusAnchor.getBoundingClientRect(), target = el.lpsTable.querySelector('.lps-cell.active')?.getBoundingClientRect();
    if (!target) return;
    const token = document.createElement('div');
    token.className = 'value-transfer'; token.textContent = current.lps[current.scan];
    token.style.left = `${source.left + source.width / 2 - 18}px`; token.style.top = `${source.top + source.height / 2 - 18}px`;
    token.style.setProperty('--dx', `${target.left + target.width / 2 - source.left - source.width / 2}px`);
    token.style.setProperty('--dy', `${target.top + target.height / 2 - source.top - source.height / 2}px`);
    token.addEventListener('animationend', () => { el.lpsTable.querySelector('.lps-cell.active')?.classList.add('settled'); token.remove(); }); document.body.append(token);
  }, 360);
}
function animateExtraction(current) {
  if (!['lps-compare','lps-confirm','lps-result'].includes(current.phase)) return;
  extractionTimer = setTimeout(() => {
    [['from-prefix', el.prefixCells, 'prefix'], ['from-suffix', el.suffixCells, 'suffix']].forEach(([sourceClass, target, side]) => {
      const sources = [...el.windowCells.querySelectorAll(`.${sourceClass}`)], targets = [...target.querySelectorAll('.proof-cell')];
      sources.forEach((source, index) => {
        const destination = targets[index]; if (!destination) return;
        destination.classList.add('arriving');
        setTimeout(() => {
          const from = source.getBoundingClientRect(), to = destination.getBoundingClientRect(), token = document.createElement('div');
          token.className = `extraction-token ${side}`; token.textContent = source.firstChild.textContent;
          token.style.left = `${from.left + from.width / 2 - 16}px`; token.style.top = `${from.top + from.height / 2 - 16}px`;
          token.style.setProperty('--dx', `${to.left + to.width / 2 - from.left - from.width / 2}px`); token.style.setProperty('--dy', `${to.top + to.height / 2 - from.top - from.height / 2}px`);
          token.addEventListener('animationend', () => { destination.classList.remove('arriving'); token.remove(); }); document.body.append(token);
        }, index * 130 + (side === 'suffix' ? 100 : 0));
      });
    });
  }, 260);
}
function animateFallbackLookup(current) {
  if (current.phase !== 'lps-fallback' && current.phase !== 'fallback') return;
  fallbackTimer = setTimeout(() => {
    const source = el.lpsTable.querySelector('.lps-cell.lookup')?.getBoundingClientRect();
    const targetNode = current.mode === 'build' ? el.windowCells.children[current.length] || el.windowCells.firstElementChild : el.patternTrack.querySelector('.cell.current');
    const target = targetNode?.getBoundingClientRect();
    if (!source || !target) return;
    const token = document.createElement('div');
    token.className = 'fallback-token'; token.textContent = current.mode === 'build' ? `候选 = ${current.length}` : `j = ${current.j}`;
    token.style.left = `${source.left + source.width / 2 - 30}px`; token.style.top = `${source.top + source.height / 2 - 15}px`;
    token.style.setProperty('--dx', `${target.left + target.width / 2 - source.left - source.width / 2}px`); token.style.setProperty('--dy', `${target.top + target.height / 2 - source.top - source.height / 2}px`);
    token.addEventListener('animationend', () => token.remove()); document.body.append(token);
  }, 300);
}
function lessonFor(current) {
  if (current.mode === 'search') {
    const text = el.textInput.value, pattern = el.patternInput.value;
    if (current.phase === 'search-intro') return [`从 Text[0] = “${text[0] ?? '∅'}” 开始找 “${pattern}”`, `第一对是 Text[0] 与 Pattern[0] = “${pattern[0] ?? '∅'}”。`];
    if (current.phase === 'match' || current.phase === 'compare') return [`此刻比较 Text[${current.i}] = “${text[current.i]}” 和 Pattern[${current.j}] = “${pattern[current.j]}”`, `当前对齐从 Text[${current.i - current.j}] 开始，已匹配长度为 ${current.j}。`];
    if (current.phase === 'advance') return [`“${text[current.fromI]}” 相同：i ${current.fromI} → ${current.i}，j ${current.fromJ} → ${current.j}`, `现在已连续匹配 “${pattern.slice(0, current.j)}”。`];
    if (current.phase === 'advance-text') return [`Text[${current.fromI}] = “${text[current.fromI]}” 与 Pattern[0] = “${pattern[0]}” 不同`, `j = 0 无可复用部分，因此只有 i 从 ${current.fromI} 移到 ${current.i}。`];
    if (current.phase === 'fallback') return [`Text[${current.i}] = “${text[current.i]}” 保持不动`, `next[${current.from - 1}] = ${current.j}，Pattern 保留 “${pattern.slice(0, current.j)}”。`];
    if (current.phase === 'found') return [`“${pattern}” 对齐在 Text[${current.found}…${current.found + pattern.length - 1}]`, `已完成 ${pattern.length} 个字符的连续匹配。`];
    return [`Text 已扫描到末尾 i = ${current.i}`, current.message];
  }
  const pattern = el.patternInput.value, scan = current.scan ?? 0, kept = current.length ?? 0, probe = Math.min(pattern.length, current.probeLength ?? kept + 1), prefix = pattern.slice(0, probe), suffix = pattern.slice(scan - probe + 1, scan + 1);
  if (current.phase === 'lps-base-window') return [`next[0] 只看 P[0] = “${pattern[0]}”`, '窗口长度为 1，任何非空真前缀/后缀都不能等于整个窗口。'];
  if (current.phase === 'lps-base-take-prefix') return [`从左端取到 “${pattern[0]}”`, '这正是完整窗口 P[0…0]，暂时还不能作为真前缀。'];
  if (current.phase === 'lps-base-take-suffix') return [`从右端也取到 “${pattern[0]}”`, '两次取到的都是完整窗口 P[0…0]。'];
  if (current.phase === 'lps-base-reject') return [`“${pattern[0]}” 等于完整窗口，不能保留`, '真前缀和真后缀必须比 P[0…0] 短。'];
  if (current.phase === 'lps-base-confirm') return ['P[0…0] 只能共同保留 ∅', '∅ 的长度为 0，因此下一步写入 next[0] = 0。'];
  if (current.phase === 'lps-result') return [`P[0…${current.scan}] 的共同长度 = ${current.nextValue}`, `共同部分是 “${pattern.slice(0, current.nextValue)}”；下一步写入 next[${current.scan}]。`];
  if (current.phase === 'lps-write') return [`next[${current.scan}] = ${current.lps[current.scan]} 已确定`, `该值代表可复用 “${pattern.slice(0, current.lps[current.scan])}”。`];
  if (current.phase === 'lps-window') return [`计算 next[${current.scan}]：窗口为 “${pattern.slice(0, current.scan + 1)}”`, `当前候选长度 ${kept}，本轮准备测试长度 ${probe}。`];
  if (current.phase === 'lps-prefix-rule') return [`已保留 ${kept} 格；下一格只能接 Pattern[${kept}] = “${pattern[kept]}”`, kept ? `此前已确认 P[0…${kept - 1}]；要连续扩展为 ${probe} 格，绿色候选只能是 P[0…${probe - 1}] = “${prefix}”。` : `还没有可复用部分，所以候选只能从 P[0] = “${pattern[0]}” 开始。`];
  if (current.phase === 'lps-prefix-traverse') return [`绿色已走过 P[0…${current.traverseIndex}] = “${pattern.slice(0, current.traverseCount)}”`, `正在遍历第 ${current.traverseCount} / ${probe} 格：下一格必须紧接 P[${current.traverseIndex}]。`];
  if (current.phase === 'lps-take-prefix') return [`绿色实际取出 P[0…${probe - 1}] = “${prefix}”`, `它从 P[0] 起连续经过 ${probe} 格；没有跳过字符，因此正好是本次的候选前缀。`];
  if (current.phase === 'lps-suffix-rule') return [`同样取 ${probe} 格，蓝色只能在 P[${scan}] 结束`, `当前窗口结尾是 P[${scan}] = “${pattern[scan]}”；因此同长后缀唯一是 P[${scan - probe + 1}…${scan}] = “${suffix}”。`];
  if (current.phase === 'lps-suffix-traverse') return [`蓝色已走过 P[${current.traverseIndex}…${scan}] = “${pattern.slice(current.traverseIndex, scan + 1)}”`, `正在从右向左遍历第 ${current.traverseCount} / ${probe} 格；下一格必须紧邻 P[${current.traverseIndex}] 左侧。`];
  if (current.phase === 'lps-take-suffix') return [`蓝色实际取出 P[${scan - probe + 1}…${scan}] = “${suffix}”`, `它在 P[${scan}] 结束并连续向左经过 ${probe} 格；因此正好与绿色候选等长。`];
  if (current.phase === 'lps-compare') return ['让两段从模式串中飞来，再逐个对比', '现在看蓝绿字符是否相同；这决定 next 能否变长。'];
  if (current.phase === 'lps-confirm') return [`“${pattern.slice(0, current.nextLength)}” 在开头和结尾都出现`, `长度由 ${current.length} 扩展为 ${current.nextLength}，所以 next[${scan}] 将写 ${current.nextLength}。`];
  if (current.phase === 'lps-fallback') return [`“${pattern[scan]}” 与 Pattern[${current.from}] 不同`, `读取 next[${current.from - 1}] = ${current.length} 后，仍计算 next[${scan}]，改试 “${pattern.slice(0, current.length)}”。`];
  if (current.phase === 'lps-confirm-zero') return [`“${pattern[scan]}” 与 Pattern[0] = “${pattern[0]}” 不同`, `没有更短候选，故 next[${scan}] = 0。`];
  return [`next = [${(current.lps || []).join(', ')}]`, `模式串 “${pattern}” 接下来将在主串中查找。`];
}
function renderBuild(current) {
  const pattern = el.patternInput.value, phase = current.phase, isBase = phase.startsWith('lps-base') || phase === 'lps-result' && current.scan === 0, baseTake = ['lps-base-take-prefix','lps-base-take-suffix','lps-base-reject'].includes(phase), previewLength = Math.max(0, phase === 'lps-confirm' ? current.nextLength : current.length), matched = Math.max(0, current.length || 0), probeLength = Math.min(pattern.length, current.probeLength ?? matched + 1), scan = current.scan ?? 0, source = [...pattern.slice(0, scan + 1)], prefixTraverse = phase === 'lps-prefix-traverse', suffixTraverse = phase === 'lps-suffix-traverse', extractionPhase = ['lps-take-prefix','lps-take-suffix','lps-compare'].includes(phase), rulePhase = ['lps-prefix-rule','lps-suffix-rule'].includes(phase), selectionLength = baseTake ? 1 : isBase ? 0 : prefixTraverse || suffixTraverse ? current.traverseCount : rulePhase ? 1 : extractionPhase ? probeLength : phase === 'lps-confirm-zero' ? 1 : phase === 'lps-fallback' ? Math.max(1, current.from ?? current.length) : previewLength, takeLength = Math.min(source.length, selectionLength), prefixTake = ['lps-base-take-suffix','lps-suffix-rule','lps-suffix-traverse','lps-take-suffix'].includes(phase) ? 0 : takeLength, suffixTake = ['lps-base-take-prefix','lps-prefix-rule','lps-prefix-traverse','lps-take-prefix'].includes(phase) ? 0 : takeLength;
  el.buildPatternTrack.innerHTML = cells(pattern, current.scan, current.scan, current.phase);
  el.buildScanPointer.textContent = `扫描位置 = ${current.scan ?? 0}`;
  el.decisionTarget.textContent = `next[${current.scan}] ${current.phase === 'lps-write' ? `= ${current.lps[current.scan]}` : '？'}`;
  el.prefixLabel.textContent = `候选前缀长度：${current.length ?? 0}`;
  el.prefixPreview.textContent = previewLength ? `P[0…${previewLength - 1}] = “${pattern.slice(0, previewLength)}”` : '∅';
  el.suffixPreview.textContent = previewLength ? `P[${current.scan - previewLength + 1}…${current.scan}] = “${pattern.slice(current.scan - previewLength + 1, current.scan + 1)}”` : `P[${current.scan}] = “${pattern[current.scan] ?? ''}”`;
  el.comparisonOperator.textContent = current.phase === 'lps-fallback' ? '↶' : current.phase === 'lps-write' ? '✓' : current.equal === true ? '=' : current.equal === false ? '≠' : '→';
  el.ruleIcon.textContent = current.phase === 'lps-fallback' ? '↶' : current.phase === 'lps-write' ? '✓' : current.phase === 'lps-confirm' ? '＝' : '①';
  el.ruleText.textContent = current.phase === 'lps-fallback' ? '当前位置不动，缩短候选前缀后再次比较。' : current.phase === 'lps-write' ? '把确定值落入数组；该格从待定变为已知。' : current.phase === 'lps-confirm' ? '相等成立，先确认新长度，再写入 next。' : current.phase === 'lps-confirm-zero' ? '没有任何可复用前缀，下一帧写入 0。' : '先把候选前缀和当前位置后缀放在一起比较。';
  el.proofBoard.dataset.phase = current.phase;
  el.proofBoard.dataset.frame = step;
  el.originMap.dataset.phase = current.phase;
  el.windowLabel.textContent = `P[0…${scan}]`;
  el.windowCells.innerHTML = sourceCells(source, prefixTake, suffixTake, prefixTraverse || suffixTraverse ? current.traverseIndex : -1);
  const suffixFrom = scan - takeLength + 1;
  const sourcePitch = 37;
  el.prefixCue.textContent = phase === 'lps-prefix-rule' ? '↑ 必须从 P[0] 开始' : ['lps-base-take-prefix','lps-take-prefix'].includes(phase) ? '↑ 正从开头取' : '↑ 前缀';
  el.suffixCue.textContent = phase === 'lps-suffix-rule' ? `↑ 必须在 P[${scan}] 结束` : ['lps-base-take-suffix','lps-take-suffix'].includes(phase) ? '↑ 正从结尾取' : '↑ 后缀';
  el.prefixCue.style.setProperty('--anchor', `${(takeLength - 1) * sourcePitch / 2 + 16}px`);
  el.suffixCue.style.setProperty('--anchor', `${(source.length - (takeLength + 1) / 2) * sourcePitch + 16}px`);
  el.originMap.dataset.empty = String(!takeLength);
  el.originMap.dataset.take = ['lps-base-take-prefix','lps-prefix-rule','lps-prefix-traverse','lps-take-prefix'].includes(phase) ? 'prefix' : ['lps-base-take-suffix','lps-suffix-rule','lps-suffix-traverse','lps-take-suffix'].includes(phase) ? 'suffix' : 'both';
  el.sourceHint.textContent = phase === 'lps-window' ? `这就是本次生成 next[${scan}] 的完整子串 P[0…${scan}]。` : phase === 'lps-prefix-rule' ? current.length ? `已保留 P[0…${current.length - 1}]；为了连续扩展到 ${probeLength} 格，下一格只能接 P[${current.length}]，得到 P[0…${probeLength - 1}]。` : `当前没有可保留部分；候选只能从 P[0] = “${pattern[0]}” 起步，不能从 P[1] 开始。` : prefixTraverse ? `绿色正在遍历 P[${current.traverseIndex}]：已连续取 P[0…${current.traverseIndex}] = “${pattern.slice(0, current.traverseCount)}”。` : phase === 'lps-take-prefix' ? `绿色实际取 P[0…${takeLength - 1}] = “${pattern.slice(0, takeLength)}”：从 P[0] 起连续 ${takeLength} 格。` : phase === 'lps-suffix-rule' ? `为了与绿色同长 ${probeLength} 格，蓝色必须取窗口最后 ${probeLength} 格：P[${scan - probeLength + 1}…${scan}]。` : suffixTraverse ? `蓝色正在遍历 P[${current.traverseIndex}]：已连续取 P[${current.traverseIndex}…${scan}] = “${pattern.slice(current.traverseIndex, scan + 1)}”。` : phase === 'lps-take-suffix' ? `蓝色实际取 P[${suffixFrom}…${scan}] = “${pattern.slice(suffixFrom, scan + 1)}”：在 P[${scan}] 结束，连续 ${takeLength} 格。` : phase === 'lps-base-take-prefix' ? `先从左端连续取 P[0] = “${pattern[0]}”。` : phase === 'lps-base-take-suffix' ? `再从右端连续取 P[0] = “${pattern[0]}”。` : phase === 'lps-base-reject' ? `两个动作都取到了完整窗口 P[0] = “${pattern[0]}”，所以不合格。` : takeLength ? `从左端取 P[0…${takeLength - 1}] = “${pattern.slice(0, takeLength)}”；从右端取 P[${suffixFrom}…${scan}] = “${pattern.slice(suffixFrom, scan + 1)}”。` : `完整 P[0…${scan}] 不能作为真前缀或真后缀，所以两边都取空串 ∅。`;
  el.whyStrip.dataset.phase = current.phase;
  el.prefixWhy.textContent = prefixTraverse ? `绿色已连续走过 ${current.traverseCount} 格` : suffixTraverse ? '绿色遍历已完成，等待蓝色' : ['lps-base-take-prefix','lps-prefix-rule','lps-take-prefix'].includes(phase) ? `从左端取出 “${pattern.slice(0, takeLength)}”` : ['lps-base-take-suffix','lps-suffix-rule','lps-take-suffix'].includes(phase) ? '左端已取，等待右端' : isBase ? '先看从开头怎样取' : takeLength ? `左端连续取 ${takeLength} 格` : '左端暂不取字符';
  el.suffixWhy.textContent = suffixTraverse ? `蓝色已连续走过 ${current.traverseCount} 格` : prefixTraverse ? '蓝色尚未遍历，下一步再取' : ['lps-base-take-suffix','lps-suffix-rule','lps-take-suffix'].includes(phase) ? `从右端取出 “${pattern.slice(suffixFrom, scan + 1)}”` : ['lps-base-take-prefix','lps-prefix-rule','lps-take-prefix'].includes(phase) ? '右端还没取，下一步再取' : isBase ? '再看从结尾怎样取' : takeLength ? `右端连续取 ${takeLength} 格` : '右端暂不取字符';
  el.valueWhy.textContent = phase === 'lps-window' ? '先定范围：后面取出的每一段都来自这个子串。' : phase === 'lps-prefix-rule' ? current.length ? `已保留 ${current.length} 格；连续规则迫使第 ${current.length + 1} 格选 P[${current.length}]。` : `已保留 0 格；所以唯一的起点是 P[0]。` : prefixTraverse ? `绿色正遍历第 ${current.traverseCount} / ${probeLength} 格：已得到 “${pattern.slice(0, current.traverseCount)}”。` : phase === 'lps-take-prefix' ? `实际候选为 “${pattern.slice(0, takeLength)}”，因为它从 P[0] 连续取到 P[${takeLength - 1}]。` : phase === 'lps-suffix-rule' ? `要与绿色同长 ${probeLength} 格，就只能取窗口最后 ${probeLength} 格。` : suffixTraverse ? `蓝色正遍历第 ${current.traverseCount} / ${probeLength} 格：已得到 “${pattern.slice(current.traverseIndex, scan + 1)}”。` : phase === 'lps-take-suffix' ? `实际候选为 “${pattern.slice(suffixFrom, scan + 1)}”，因为它连续并且在 P[${scan}] 结束。` : phase === 'lps-base-take-prefix' ? '这只是第一次取法，先不下结论。' : phase === 'lps-base-take-suffix' ? '这只是第二次取法，先不下结论。' : phase === 'lps-base-reject' ? '两次都取到了完整窗口，所以这种取法不能用。' : phase === 'lps-result' ? `两段重合 ${takeLength} 格 → next[${scan}] = ${current.nextValue}` : isBase ? (phase === 'lps-base-confirm' ? '两边只能取 ∅ → 长度为 0' : 'P[0] 不能把完整自己作为真前缀/后缀') : phase === 'lps-write' ? `两端依据已确认 → next[${scan}] = ${current.lps[scan]}` : phase === 'lps-confirm' ? `两段完全相同 → 长度可写为 ${current.nextLength}` : phase === 'lps-fallback' ? '两段不相同 → 缩短候选再试' : phase === 'lps-confirm-zero' ? `没有相同前后缀 → next[${scan}] = 0` : '从原数组取出两段，再逐字符比对';
  const stage = phase === 'lps-write' || phase === 'lps-done' ? 'commit' : phase === 'lps-result' ? 'answer' : phase.startsWith('lps-base') && phase !== 'lps-base-confirm' || ['lps-window','lps-prefix-rule','lps-prefix-traverse','lps-take-prefix','lps-suffix-rule','lps-suffix-traverse','lps-take-suffix'].includes(phase) ? 'align' : 'compare';
  el.buildStage.dataset.stage = stage;
  const focus = stage === 'align' ? 'window' : stage === 'compare' ? 'compare' : stage === 'answer' ? 'answer' : 'result';
  el.proofBoard.dataset.focus = focus;
  el.guideTargetBuild.textContent = step === 0 ? '先只看这个问题' : phase === 'lps-prefix-rule' ? '绿色起点只能是 P[0]' : prefixTraverse ? `绿色正走到 P[${current.traverseIndex}]` : ['lps-base-take-prefix','lps-take-prefix'].includes(phase) ? '绿色遍历完成：得到候选前缀' : phase === 'lps-suffix-rule' ? `蓝色终点只能是 P[${scan}]` : suffixTraverse ? `蓝色正走到 P[${current.traverseIndex}]` : ['lps-base-take-suffix','lps-take-suffix'].includes(phase) ? '蓝色遍历完成：得到同长后缀' : phase === 'lps-window' ? '蓝色窗口：本次只研究这个子串' : phase === 'lps-base-reject' ? '两边都取完整窗口，不能用' : focus === 'window' ? '跟着蓝色聚光框，看这个窗口' : focus === 'compare' ? '跟着蓝色聚光框，比这两个字符' : focus === 'answer' ? `两段比较得到 ${current.nextValue}，先看答案卡` : `跟着蓝色聚光框，写入 next[${scan}]`;
  el.lpsTable.closest('.table-panel').dataset.focus = stage;
  el.processRail.dataset.stage = stage;
  el.focusAnchor.dataset.phase = current.phase;
  el.focusTarget.textContent = current.phase === 'lps-result' ? `答案 = ${current.nextValue}` : `next[${current.scan}] ${current.phase === 'lps-write' ? `= ${current.lps[current.scan]}` : '=?'}`;
  el.focusReason.textContent = current.phase === 'lps-result' ? `来自两段比较，下一步送入 next[${scan}]` : current.phase === 'lps-write' ? '数值正在飞入数组格' : current.phase === 'lps-fallback' ? '缩短候选前缀后重试' : current.phase === 'lps-confirm' ? '前后缀相等，准备落格' : isBase ? '先排除完整字符串，再确定空串' : '把这一个位置推导清楚';
  const operandLength = ['lps-result','lps-write'].includes(current.phase) ? takeLength : probeLength;
  const confirmedLength = current.phase === 'lps-result' ? operandLength : matched;
  el.prefixCells.innerHTML = proofCells(isBase ? ['∅'] : [...pattern.slice(0, operandLength)], confirmedLength, current.phase, 'prefix');
  el.suffixCells.innerHTML = proofCells(isBase ? ['∅'] : [...pattern.slice(scan - operandLength + 1, scan + 1)], confirmedLength, current.phase, 'suffix');
  el.proofArrow.textContent = current.phase === 'lps-result' ? `重合 ${takeLength} 格 → next[${scan}] = ${current.nextValue}` : isBase ? (current.phase === 'lps-base-confirm' ? '∅ = ∅ → 长度 0' : '真前缀 / 真后缀') : current.phase === 'lps-confirm' ? '相等 → 候选长度 +1' : current.phase === 'lps-write' ? `落入 next[${scan}]` : current.phase === 'lps-fallback' ? `不相等 → 候选缩短到 ${current.length}` : current.phase === 'lps-confirm-zero' ? '没有候选 → 写入 0' : '从原数组飞入后逐字符比较';
}
function render() {
  const current = trace.steps[step], pattern = el.patternInput.value, building = current.mode === 'build';
  const nextPanel = el.lpsTable.closest('.next-stage');
  if (building) {
    if (nextPanel.parentElement !== el.buildStage) el.buildStage.append(nextPanel);
    nextPanel.querySelector('.eyebrow').textContent = '第三步 · 落入数组';
  } else {
    if (nextPanel.parentElement !== el.matchStage) el.matchStage.insertBefore(nextPanel, el.textTrack.previousElementSibling);
    nextPanel.querySelector('.eyebrow').textContent = '移动依据 · 读取已完成的数组';
  }
  const opening = building && step === 0;
  el.app.dataset.opening = String(opening); el.openingLesson.hidden = !opening; el.openingChar.textContent = pattern[0] || '？'; el.openingPattern.innerHTML = [...pattern].map((char, index) => `<b class="${index === 0 ? 'active' : ''}">${char}</b>`).join('');
  el.buildStage.hidden = !building; el.matchStage.hidden = building;
  el.phaseLabel.textContent = opening ? 'KMP · 从一个小问题开始' : building ? '第一关 · 先填 next 数组' : '第二关 · 用 next 数组找词';
  el.stageTitle.textContent = opening ? '先找开头和结尾的相同部分' : building ? '一次只弄懂一格' : '一次只比较一对字符';
  if (building) renderBuild(current);
  else { const focus = current.phase === 'fallback' ? 'fallback' : current.phase === 'found' ? 'found' : 'pair'; el.matchStage.dataset.phase = current.phase; el.matchStage.dataset.focus = focus; el.guideTargetMatch.textContent = focus === 'fallback' ? '跟着橙色聚光框：保留尾巴，Pattern 左移' : focus === 'found' ? '跟着绿色聚光框：已经找到' : '跟着蓝色聚光框，看这一对字符'; el.lpsTable.closest('.table-panel').dataset.focus = focus === 'fallback' ? 'commit' : 'compare'; el.textTrack.innerHTML = cells(el.textInput.value, current.i, current.i, current.phase, current.found); el.patternTrack.innerHTML = cells(pattern, current.j, current.j, current.phase); el.alignment.style.setProperty('--shift', `${Math.max(0, current.i - current.j) * 46}px`); el.textPointer.textContent = `i = ${current.i}`; el.patternPointer.textContent = `j = ${current.j}`; el.moveExplanation.hidden = current.phase !== 'fallback'; if (current.phase === 'fallback') { const reused = pattern.slice(current.from - current.j, current.from), moved = current.from - current.j; el.moveExplanation.innerHTML = `<span>已匹配尾巴 “${reused}” = 模式串前缀</span><b>next[${current.from - 1}] = ${current.j}</b><strong>保留 ${current.j} 格，Pattern 左移 ${moved} 格</strong>`; void el.alignment.offsetWidth; el.alignment.classList.add('fallback-move'); } else el.alignment.classList.remove('fallback-move'); }
  const lesson = lessonFor(current);
  el.statusTitle.textContent = lesson[0]; el.statusDetail.textContent = lesson[1];
  el.stepBadge.textContent = `STEP ${step}`; el.progressText.textContent = `${step + 1} / ${trace.steps.length}`;
  el.progressBar.style.width = `${step / Math.max(1, trace.steps.length - 1) * 100}%`;
  el.lpsHint.textContent = current.phase === 'lps-fallback' || current.phase === 'fallback' ? `读取 next[${current.from - 1}] = ${current.length ?? current.j}` : current.phase === 'lps-result' ? `比较结果 = ${current.nextValue}` : current.phase === 'lps-write' ? `写入 next[${current.scan}]` : building ? '正在推导' : trace.lps.join(' · ');
  el.foundCount.textContent = `${trace.steps.slice(0, step + 1).filter((item) => item.phase === 'found').length} 个结果`;
  el.footerState.textContent = current.phase === 'done' ? '演示完成' : `正在执行 ${current.phase}`;
  renderLps(current);
  if (building) animateExtraction(current);
  animateFallbackLookup(current);
  if (current.phase === 'lps-write') animateWrite(current);
  const events = trace.steps.slice(0, step + 1).filter((item) => !['lps-intro', 'match'].includes(item.phase)).slice(-6).reverse();
  el.eventList.innerHTML = events.map((item) => `<li class="${item.phase}"><span>${item.phase === 'found' || item.phase === 'lps-write' ? '✓' : item.phase.includes('fallback') ? '↶' : '•'}</span><p>${item.message}<small>${item.detail}</small></p></li>`).join('') || '<li class="empty">从 next 数组开始理解 KMP。</li>';
  el.prevBtn.disabled = step === 0; el.nextBtn.disabled = step === trace.steps.length - 1;
}
function reset() { stop(); trace = buildTrace(el.textInput.value, el.patternInput.value); step = 0; render(); }
function showStep(next) { clearTimeout(sceneTimer); el.visualPanel.classList.remove('scene-enter'); el.visualPanel.classList.add('scene-leave'); sceneTimer = setTimeout(() => { step = next; render(); el.visualPanel.classList.remove('scene-leave'); void el.visualPanel.offsetWidth; el.visualPanel.classList.add('scene-enter'); }, 340); }
function move(delta) { stop(); showStep(Math.min(trace.steps.length - 1, Math.max(0, step + delta))); }
function play() { if (timer) return stop(); if (step === trace.steps.length - 1) { step = 0; render(); } timer = setInterval(() => { if (step === trace.steps.length - 1) return stop(); showStep(step + 1); }, Number(el.speedSelect.value)); el.playBtn.textContent = '❚❚ 暂停'; }
function randomExample() { const alphabet = 'ABCD', patternLength = 3 + Math.floor(Math.random() * 4), textLength = patternLength + 10 + Math.floor(Math.random() * 7), pattern = Array.from({ length: patternLength }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(''), text = Array.from({ length: textLength }, () => alphabet[Math.floor(Math.random() * alphabet.length)]); const at = Math.floor(Math.random() * (textLength - patternLength + 1)); text.splice(at, patternLength, ...pattern); el.textInput.value = text.join(''); el.patternInput.value = pattern; document.querySelector('.sample.active')?.classList.remove('active'); reset(); }
el.randomBtn.addEventListener('click', randomExample); el.resetBtn.addEventListener('click', reset); el.prevBtn.addEventListener('click', () => move(-1)); el.nextBtn.addEventListener('click', () => move(1)); el.playBtn.addEventListener('click', play);
el.openingStart.addEventListener('click', () => move(1));
[el.textInput, el.patternInput].forEach((input) => input.addEventListener('input', reset));
document.querySelectorAll('.sample').forEach((button) => button.addEventListener('click', () => { el.textInput.value = button.dataset.text; el.patternInput.value = button.dataset.pattern; document.querySelector('.sample.active')?.classList.remove('active'); button.classList.add('active'); reset(); }));
reset();

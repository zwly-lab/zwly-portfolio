import { loadPyodide } from "./pyodide/pyodide.mjs";

const MAX_OUTPUT = 12_000;
const MAX_FILES = 24;
const MAX_FILE_BYTES = 8_192;
const MAX_TOTAL_FILE_BYTES = 24_000;

const bootstrap = String.raw`
import inspect as __practice_inspect
import json as __practice_json
import math as __practice_math
import os as __practice_os
import re as __practice_re
import sys as __practice_sys
import traceback as __practice_traceback
import types as __practice_types

__practice_colors = {
    "moss": "#414C29", "sage": "#8B9D83", "clay": "#51493F",
    "terracotta": "#713C20", "ochre": "#5F4618", "sand": "#E8DCC7", "oat": "#D4B895",
}
__practice_source_lines = __practice_source__.splitlines()
__practice_trace = []
__practice_trace_truncated = False
__practice_frames = []
__practice_sleep_total = 0.0

def __practice_color(value):
    if type(value) is not str:
        raise TypeError("颜色必须是文字。")
    if value in __practice_colors:
        return __practice_colors[value]
    if __practice_re.fullmatch(r"#[0-9a-fA-F]{6}", value):
        return value.upper()
    raise ValueError("颜色请使用教材颜色名或 #RRGGBB。")

def __practice_record(kind, detail, line=None, source=None):
    global __practice_trace_truncated
    if len(__practice_trace) >= 250:
        __practice_trace_truncated = True
        return None
    if line is None:
        frame = __practice_inspect.currentframe().f_back
        while frame is not None and frame.f_code.co_filename != "<practice>":
            frame = frame.f_back
        line = frame.f_lineno if frame is not None else 1
    if source is None:
        source = __practice_source_lines[line - 1] if 0 < line <= len(__practice_source_lines) else ""
    __practice_trace.append({"line": line, "source": source.strip(), "kind": kind, "detail": detail})
    return len(__practice_trace) - 1

class PracticeScreen:
    def __init__(self):
        self.background = globals()["__practice_colors"]["sand"]
        self.objects = []
        self.history = []
        self.keys = [__practice_key__] if __practice_key__ is not None else []

    def clear(self, color="sand"):
        self.background = globals()["__practice_color"](color)
        self.objects.clear()
        globals()["__practice_record"]("函数调用", "清空画面")

    def draw_rect(self, x, y, width=1, height=1, *, color="moss", label=None):
        coordinates = (x, y, width, height)
        if any(type(value) not in (int, float) or not globals()["__practice_math"].isfinite(value) or abs(value) > 1_000_000 for value in coordinates):
            raise ValueError("位置和尺寸必须是范围内的数字。")
        width, height = int(width), int(height)
        if width <= 0 or height <= 0:
            raise ValueError("矩形的宽和高必须大于 0。")
        self.objects.append({"type": "rect", "x": int(x), "y": int(y), "width": width, "height": height, "color": globals()["__practice_color"](color), "label": None if label is None else str(label)[:200]})
        globals()["__practice_record"]("函数调用", "绘制方块或矩形")

    def draw_text(self, text, x, y, *, color="terracotta"):
        if type(x) not in (int, float) or type(y) not in (int, float) or not globals()["__practice_math"].isfinite(x) or not globals()["__practice_math"].isfinite(y):
            raise ValueError("文字位置必须是有限数字。")
        self.objects.append({"type": "text", "text": str(text)[:200], "x": int(x), "y": int(y), "color": globals()["__practice_color"](color)})
        globals()["__practice_record"]("函数调用", "绘制文字")

    def update(self, note=""):
        if len(globals()["__practice_frames"]) >= 12:
            raise RuntimeError("浏览器练习台一次运行最多演示 12 帧，适合观察有限步骤；持续交互或键盘控制程序请在 PyCharm 的 PyScreen 环境运行。")
        frames = globals()["__practice_frames"]
        frames.append({"sequence": len(frames) + 1, "note": str(note)[:200], "objects": [dict(item) for item in self.objects], "background": self.background})
        trace_index = globals()["__practice_record"]("函数调用", "提交当前画面")
        if trace_index is not None:
            frames[-1]["trace_index"] = trace_index

    def get_key(self):
        globals()["__practice_record"]("函数调用", "读取一个按键")
        return self.keys.pop(0) if self.keys else None

    def sleep(self, seconds):
        global __practice_sleep_total
        if type(seconds) not in (int, float) or not globals()["__practice_math"].isfinite(seconds) or not 0.1 <= seconds <= 2:
            raise ValueError("练习台的 sleep() 范围是 0.1–2 秒。")
        frames = globals()["__practice_frames"]
        if not frames:
            raise RuntimeError("请先用 screen.update() 提交一帧，再设置帧间等待。")
        sleep_total = globals()["__practice_sleep_total"]
        if sleep_total + seconds > 8:
            raise RuntimeError("一次运行的帧间等待总时长不能超过 8 秒。")
        frames[-1]["delay"] = frames[-1].get("delay", 0.0) + seconds
        globals()["__practice_sleep_total"] = sleep_total + seconds
        globals()["__practice_record"]("函数调用", "设置帧间等待")

    def wait(self, message=""):
        globals()["__practice_record"]("函数调用", "练习台中无需等待回车")

screen = PracticeScreen()
__practice_inputs = __practice_input_text__.splitlines()

def __practice_input(prompt=""):
    if prompt:
        print(str(prompt), end="")
    if not __practice_inputs:
        raise EOFError("练习台没有更多模拟输入；请在“模拟输入”中每行填写一个值。")
    value = __practice_inputs.pop(0)
    print(value)
    return value

input = __practice_input

def __practice_safe_value(value, depth=0):
    value_type = type(value)
    if value_type is str:
        text = value[:120]
        return repr(text) + ("…" if len(value) > 120 else "")
    if value_type in (int, float, bool, type(None)):
        return repr(value)
    if depth >= 3:
        return "…"
    if value_type in (list, tuple):
        items = [__practice_safe_value(item, depth + 1) for item in value[:12]]
        suffix = ", …" if len(value) > 12 else ""
        left, right = ("[", "]") if value_type is list else ("(", ")")
        return left + ", ".join(items) + suffix + right
    if value_type is dict:
        items = list(value.items())[:12]
        parts = [__practice_safe_value(key, depth + 1) + ": " + __practice_safe_value(item, depth + 1) for key, item in items]
        return "{" + ", ".join(parts) + (", …" if len(value) > 12 else "") + "}"
    if value_type is type:
        return "<类 " + value.__name__ + ">"
    if __practice_inspect.isfunction(value):
        return "<函数 " + value.__name__ + ">"
    if value_type is __practice_types.ModuleType:
        return "<模块 " + getattr(value, "__name__", "") + ">"
    try:
        attributes = object.__getattribute__(value, "__dict__")
    except (AttributeError, TypeError):
        attributes = None
    if type(attributes) is dict:
        return "<" + value_type.__name__ + " 对象> " + __practice_safe_value(attributes, depth + 1)
    return "<" + value_type.__name__ + " 对象>"

def __practice_trace_function(frame, event, argument):
    if event == "line" and frame.f_code.co_filename == "<practice>":
        __practice_record("语句执行", "按顺序执行", frame.f_lineno)
    return __practice_trace_function

def __practice_execute__():
    error = None
    error_line = None
    __practice_os.makedirs("/workspace", exist_ok=True)
    __practice_os.chdir("/workspace")
    __practice_os.environ["TMPDIR"] = "/workspace"
    __practice_sys.settrace(__practice_trace_function)
    try:
        exec(compile(__practice_source__, "<practice>", "exec"), globals(), globals())
    except BaseException as exception:
        error = type(exception).__name__ + ": " + str(exception)
        error_line = getattr(exception, "lineno", None)
        if error_line is None:
            for frame in reversed(__practice_traceback.extract_tb(exception.__traceback__)):
                if frame.filename == "<practice>":
                    error_line = frame.lineno
                    break
    finally:
        __practice_sys.settrace(None)

    variables = {}
    for name, value in list(globals().items()):
        if name.startswith("_") or name in {"screen", "input", "PracticeScreen"}:
            continue
        if len(variables) >= 40:
            break
        variables[name] = __practice_safe_value(value)
    result = {
        "ok": error is None,
        "error": error,
        "line": error_line,
        "width": 20,
        "height": 12,
        "history": __practice_frames,
        "trace": __practice_trace,
        "trace_truncated": __practice_trace_truncated,
        "variables": variables,
        "sleep_total": __practice_sleep_total,
    }
    return __practice_json.dumps(result, ensure_ascii=False, allow_nan=False)
`;

function collectWorkspaceFiles(FS) {
  const files = [];
  const pending = [{ path: "/workspace", depth: 0 }];
  let totalBytes = 0;
  while (pending.length && files.length < MAX_FILES) {
    const current = pending.pop();
    let entries;
    try {
      entries = FS.readdir(current.path).filter((name) => name !== "." && name !== "..").sort();
    } catch {
      continue;
    }
    for (const name of entries) {
      const path = `${current.path}/${name}`;
      let stat;
      try {
        stat = FS.lstat(path);
      } catch {
        continue;
      }
      const type = stat.mode & 0o170000;
      if (type === 0o040000 && current.depth < 3) {
        pending.push({ path, depth: current.depth + 1 });
        continue;
      }
      if (type !== 0o100000) continue;
      const relativePath = path.slice("/workspace/".length);
      if (stat.size > MAX_FILE_BYTES || totalBytes + stat.size > MAX_TOTAL_FILE_BYTES) {
        files.push({ path: relativePath, size: stat.size, text: "文件较大，未在页面中展开。", truncated: true });
        continue;
      }
      try {
        const bytes = FS.readFile(path);
        totalBytes += bytes.length;
        const binary = bytes.includes(0);
        const text = binary ? "二进制文件未展开。" : new TextDecoder("utf-8").decode(bytes).slice(0, 4_000);
        files.push({ path: relativePath, size: bytes.length, text, binary, truncated: !binary && text.length < new TextDecoder("utf-8").decode(bytes).length });
      } catch {
        files.push({ path: relativePath, size: stat.size, text: "文件无法读取。" });
      }
      if (files.length >= MAX_FILES) break;
    }
  }
  return files;
}

self.addEventListener("message", async (event) => {
  if (event.data?.type !== "run") return;
  const { code, key, inputs } = event.data;
  let output = "";
  let outputTruncated = false;
  const appendOutput = (line) => {
    const text = `${String(line)}\n`;
    if (output.length >= MAX_OUTPUT) {
      outputTruncated = true;
      return;
    }
    output += text.slice(0, MAX_OUTPUT - output.length);
    if (output.length >= MAX_OUTPUT) outputTruncated = true;
  };

  try {
    const pyodide = await loadPyodide({ indexURL: new URL("./pyodide/", self.location.href).href });
    self.postMessage({ type: "ready" });
    pyodide.setStdout({ batched: appendOutput });
    pyodide.setStderr({ batched: appendOutput });
    pyodide.globals.set("__practice_source__", code);
    pyodide.globals.set("__practice_key__", key ?? null);
    pyodide.globals.set("__practice_input_text__", inputs ?? "");
    await pyodide.runPythonAsync(bootstrap);
    const encoded = pyodide.runPython("__practice_execute__()");
    const result = JSON.parse(encoded);
    result.stdout = output + (outputTruncated ? "\n[输出过长，已截断]" : "");
    result.files = collectWorkspaceFiles(pyodide.FS);
    self.postMessage({ type: "result", result });
  } catch (error) {
    const details = String(error?.message || error).split(/\r?\n/).filter(Boolean);
    self.postMessage({ type: "error", message: details.at(-1) || "运行环境初始化失败。" });
  }
});

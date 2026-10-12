export function motionTiming(phase: "enter" | "change" | "exit") {
  const style = getComputedStyle(document.documentElement);
  const duration = style.getPropertyValue(`--motion-${phase}`).trim();
  return {
    duration: parseFloat(duration) * (duration.endsWith("ms") ? 1 : 1000),
    easing: style.getPropertyValue(phase === "exit" ? "--motion-depart" : "--motion-arrive").trim(),
  };
}

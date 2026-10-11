(function (global) {
  "use strict";

  let transitionRequest = 0;

  function cancelTransition() {
    if (!transitionRequest) return;
    cancelAnimationFrame(transitionRequest);
    transitionRequest = 0;
  }

  function resizeCanvas(canvas) {
    const scale = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.floor(canvas.clientHeight * scale));
    canvas.getContext("2d").setTransform(scale, 0, 0, scale, 0, 0);
  }

  function drawFrame(canvas, state, frame) {
    cancelTransition();
    paintFrame(canvas, state, frame);
  }

  function paintFrame(canvas, state, frame) {
    const context = canvas.getContext("2d");
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    // Hidden or transitioning panels do not yet have room for the board's 48px padding.
    if (!state || !frame || width <= 48 || height <= 48) return;

    const cell = Math.min((width - 48) / state.width, (height - 48) / state.height);
    const boardWidth = cell * state.width;
    const boardHeight = cell * state.height;
    const offsetX = (width - boardWidth) / 2;
    const offsetY = (height - boardHeight) / 2;

    context.fillStyle = frame.background;
    context.beginPath();
    context.roundRect(offsetX, offsetY, boardWidth, boardHeight, 18);
    context.fill();

    context.strokeStyle = "rgba(65, 76, 41, 0.2)";
    context.lineWidth = 1;
    for (let x = 0; x <= state.width; x += 1) {
      context.beginPath();
      context.moveTo(offsetX + x * cell, offsetY);
      context.lineTo(offsetX + x * cell, offsetY + boardHeight);
      context.stroke();
    }
    for (let y = 0; y <= state.height; y += 1) {
      context.beginPath();
      context.moveTo(offsetX, offsetY + y * cell);
      context.lineTo(offsetX + boardWidth, offsetY + y * cell);
      context.stroke();
    }

    frame.objects.forEach((object) => {
      if (object.type === "rect") drawRect(context, object, cell, offsetX, offsetY);
      if (object.type === "text") drawText(context, object, cell, offsetX, offsetY);
    });
  }

  function canInterpolate(from, to) {
    if (!from || !to || from.objects.length !== to.objects.length || !to.objects.length) return false;
    return to.objects.every((object, index) => {
      const previous = from.objects[index];
      if (object.type !== previous.type || object.color !== previous.color) return false;
      if (object.type === "rect") {
        return object.label === previous.label && object.width === previous.width && object.height === previous.height;
      }
      return object.type === "text" && object.text === previous.text;
    });
  }

  function transitionFrame(canvas, state, from, to, duration = 260) {
    cancelTransition();
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !canInterpolate(from, to)) {
      paintFrame(canvas, state, to);
      return false;
    }

    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const frame = {
        ...to,
        objects: to.objects.map((object, index) => {
          const previous = from.objects[index];
          return {
            ...object,
            x: previous.x + (object.x - previous.x) * eased,
            y: previous.y + (object.y - previous.y) * eased,
          };
        }),
      };
      paintFrame(canvas, state, frame);
      if (progress < 1) transitionRequest = requestAnimationFrame(animate);
      else transitionRequest = 0;
    };
    transitionRequest = requestAnimationFrame(animate);
    return true;
  }

  function pulseFrame(canvas) {
    const target = canvas.parentElement;
    if (!target || typeof target.animate !== "function" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const accent = getComputedStyle(target).getPropertyValue("--terracotta").trim() || "#713C20";
    target.animate(
      [
        { boxShadow: "inset 0 0 0 0 transparent" },
        { boxShadow: `inset 0 0 0 4px ${accent}`, offset: 0.28 },
        { boxShadow: "inset 0 0 0 0 transparent" },
      ],
      { duration: 360, easing: "ease-out" },
    );
  }

  function drawRect(context, object, cell, offsetX, offsetY) {
    const x = offsetX + object.x * cell;
    const y = offsetY + object.y * cell;
    const width = object.width * cell;
    const height = object.height * cell;
    context.fillStyle = object.color;
    context.beginPath();
    context.roundRect(x + 2, y + 2, Math.max(1, width - 4), Math.max(1, height - 4), Math.min(10, cell / 3));
    context.fill();
    if (object.label && cell >= 18) {
      context.fillStyle = "#E8DCC7";
      context.font = `700 ${Math.max(10, Math.min(14, cell * 0.36))}px ${getComputedStyle(document.documentElement).fontFamily}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(object.label, x + width / 2, y + height / 2, Math.max(0, width - 8));
    }
  }

  function drawText(context, object, cell, offsetX, offsetY) {
    context.fillStyle = object.color;
    context.font = `700 ${Math.max(12, cell * 0.48)}px ${getComputedStyle(document.documentElement).fontFamily}`;
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillText(object.text, offsetX + object.x * cell, offsetY + (object.y + 0.5) * cell);
  }

  global.PyScreenRenderer = Object.freeze({ resizeCanvas, drawFrame, transitionFrame, pulseFrame });
})(window);

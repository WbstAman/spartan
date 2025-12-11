import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import explosion1 from "../../../../../../assets/images/explosion1.webp";
import fire3 from "../../../../../../assets/images/fire3.png";
import rocket from "../../../../../../assets/images/rocket.png";
import { addScore, setCurrentScore } from "../../../../../../slice/crashSlice";
import { drawPlus } from "../../../../../../utils/drawPlus";
import "./crashGraph.css";

const circlePath = (ctx, x, y, radius) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
};

const CrashGraph = ({
  multiplier = 1.0,
  gameState = "loading",
  windowLength = 8,
}) => {
  const dispatch = useDispatch();

  const [crashData, setCrashData] = useState("")

  useEffect(() => {
    if (crashData !== "") {
      dispatch(
        addScore({
          point: crashData,
          isWin: Number(autoCashout) < Number(crashData),
        })
      );
    }
  }, [crashData])

  const canvasRef = useRef(null);
  const rocketRef = useRef(null);
  const rafRef = useRef(null);
  const maxSeenRef = useRef(Math.max(3, multiplier));
  const displayMultiplierRef = useRef(multiplier);
  const pointsRef = useRef({ points: [], w: 0, h: 0 });
  const prevNormalizedRef = useRef(0);
  const startTimestampRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const smoothNormalizedRef = useRef(0);

  const betAmount = useSelector((state) => state.crash)
  const { autoCashout } = useSelector((state) => state.crash); 

  const [pageSize, setPageSize] = useState(null);

  useEffect(() => {
    const handleResize = () => setPageSize(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const lastSentRef = useRef(null);

  // axis / labels config
  const labelsCount = 7;
  const slotCount = labelsCount;
  const axisGap = 50;
  const BOTTOM_PADDING = pageSize <= 640 ? 55 : 60;
  const TOP_PADDING = pageSize <= 640 ? 50 : 100;
  const LEFT_PADDING = 10;
  const RIGHT_PADDING = 40;

  const AXIS_STEP_SECONDS = 5;
  const AXIS_STEP_UNITS = 5;

  const yDisplayMaxRef = useRef(
    Math.max(2, Math.ceil(maxSeenRef.current * 5) / 5)
  );
  const lastDrawTsRef = useRef(performance.now());

  const [axisBase, setAxisBase] = useState(1);
  const shiftCountRef = useRef(0);
  const curveOffset = 20;

  const buildPoints = (startX, startY, endX, endY, totalPoints = 900) => {
    const arr = new Array(totalPoints + 1);
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const curveProgress = Math.pow(t, 2.2);
      const x = startX + (endX - startX) * t;
      const y = startY - (startY - endY) * curveProgress;
      arr[i] = { x, y, t, curveProgress };
    }
    pointsRef.current = { points: arr, w: endX - startX, h: startY - endY };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const rocketEl = rocketRef.current;
    if (!canvas || !rocketEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssW = canvas.offsetWidth;
    const cssH = canvas.offsetHeight;
    const DPR = window.devicePixelRatio || 1;
    const pixelW = Math.max(1, Math.floor(cssW * DPR));
    const pixelH = Math.max(1, Math.floor(cssH * DPR));
    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW;
      canvas.height = pixelH;
      canvas.style.width = "100%";
      canvas.style.height = `${cssH}px`;
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, cssW, cssH);

    const shadowGrad = ctx.createRadialGradient(
      cssW * 0.18,
      cssH * 0.85,
      0,
      cssW * 0.6,
      cssH * 0.95,
      Math.max(cssW, cssH) * 0.6
    );
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.45)");
    shadowGrad.addColorStop(0.55, "rgba(0,0,0,0.18)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, 0, cssW, cssH);

    const vignette = ctx.createRadialGradient(
      cssW / 2,
      cssH / 2,
      Math.min(cssW, cssH) * 0.3,
      cssW / 2,
      cssH / 2,
      Math.max(cssW, cssH)
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.7, "rgba(0,0,0,0.12)");
    vignette.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, cssW, cssH);

    const leftPadding = LEFT_PADDING;
    const rightPadding = RIGHT_PADDING;
    const topPadding = TOP_PADDING; 
    const bottomPadding = BOTTOM_PADDING;

    const axisStartX = leftPadding + axisGap;
    const startY = cssH - bottomPadding;
    const endX = cssW - rightPadding;
    const endY = topPadding;
    const curveStartX = axisStartX + curveOffset;

    ctx.save();
    const cols = slotCount - 1;
    const rows = 5;
    const chartLeft = axisStartX;
    const chartW = endX - chartLeft;
    const chartH = startY - endY;
    const gapX = chartW / cols;
    const gapY = chartH / rows;

    ctx.lineWidth = 1;
    ctx.setLineDash([6, 10]);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i <= rows; i++) {
      const y = endY + i * gapY;
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
    for (let i = 0; i <= cols; i++) {
      const x = chartLeft + i * gapX;
      ctx.beginPath();
      ctx.moveTo(x, endY);
      ctx.lineTo(x, startY);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = Math.round(chartLeft + i * gapX);
        const y = Math.round(endY + j * gapY);
        const plusSize = Math.max(6, Math.min(12, (cssW + cssH) / 700));
        const plusLineW = Math.max(1, Math.round(plusSize / 4));
        drawPlus(ctx, x, y, plusSize, plusLineW);
      }
    }
    ctx.restore();

    const spineX = axisStartX;
    const panelTop = endY - 8;
    const bottomSpineY = startY + 34;

    if (gameState === "loading") {
      rocketEl.style.opacity = "0";
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = "#282A2F";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(spineX, panelTop + 12);
      ctx.lineTo(spineX, bottomSpineY);
      ctx.lineTo(endX, bottomSpineY);
      ctx.stroke();
      ctx.restore();

      ctx.font = "14px Inter, sans-serif";
      const dotRadius = 4;
      const labelOffsetX = dotRadius + 10;
      const ySteps = 6;
      const yMax = Math.max(2, Math.ceil(maxSeenRef.current * 5) / 5);
      for (let i = 0; i < ySteps; i++) {
        const t = i / (ySteps - 1);
        const y = startY - t * (startY - endY);
        const value = 1 + i * ((yMax - 1) / (ySteps - 1));
        const labelText = `${value.toFixed(2)}x`;
        ctx.save();
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#767b86";
        ctx.font = "600 13px Inter, sans-serif";
        ctx.fillText(labelText, spineX + labelOffsetX, y + dotRadius + 6);
        ctx.restore();
      }
      return;
    }

    if (
      !pointsRef.current.points.length ||
      pointsRef.current.w !== endX - curveStartX ||
      pointsRef.current.h !== startY - endY
    ) {
      buildPoints(curveStartX, startY, endX, endY, 900);
    }
    const points = pointsRef.current.points;

    if (multiplier > maxSeenRef.current) maxSeenRef.current = multiplier * 1.25;
    const maxMultiplier = Math.max(2, maxSeenRef.current);

    const now = performance.now();
    const dt = Math.min(0.06, (now - lastDrawTsRef.current) / 1000);
    lastDrawTsRef.current = now;

    const smoothing = 12.0;
    const targetRoundedMax = Math.max(2, Math.ceil(maxMultiplier * 5) / 5);
    yDisplayMaxRef.current +=
      (targetRoundedMax - yDisplayMaxRef.current) *
      (1 - Math.exp(-smoothing * dt));
    const yRange = yDisplayMaxRef.current - 1;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#282A2F";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(spineX, panelTop + 12);
    ctx.lineTo(spineX, bottomSpineY);
    ctx.lineTo(endX, bottomSpineY);
    ctx.stroke();
    ctx.restore();

    const yDotRadius = 4;
    const labelOffsetX = yDotRadius + 10;
    const ySteps = 6;
    for (let i = 0; i < ySteps; i++) {
      const t = i / (ySteps - 1);
      const y = startY - t * (startY - endY);
      const value = 1 + i * (yRange / (ySteps - 1));
      const labelText = `${value.toFixed(2)}x`;

      if (i !== 0) {
        ctx.save();
        const g = ctx.createRadialGradient(
          spineX - yDotRadius * 0.3,
          y - yDotRadius * 0.3,
          2,
          spineX,
          y,
          yDotRadius
        );
        g.addColorStop(1, "#282a2f");
        circlePath(ctx, spineX, y, yDotRadius);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#282a2f";
        ctx.stroke();
        ctx.restore();
      }

      ctx.save();
      ctx.textAlign = "right";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#767b86";
      ctx.font = "600 13px Inter, sans-serif";
      ctx.fillText(
        labelText,
        spineX - labelOffsetX,
        i === 0 ? y + 6 : y + yDotRadius + 6
      );
      ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "13px Inter, sans-serif";
    for (let i = 0; i < slotCount; i++) {
      const posRatio = i / (slotCount - 1);
      const x = spineX + posRatio * (endX - spineX);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, startY - 6);
      ctx.lineTo(x, startY + 6);
      ctx.stroke();
    }

    const xDotRadius = 4;
    for (let i = 0; i < slotCount; i++) {
      const posRatio = i / (slotCount - 1);
      const x = spineX + posRatio * (endX - spineX);
      const visualY = bottomSpineY;
      if (i === 0 || i === slotCount - 1) continue;
      ctx.save();
      const gX = ctx.createRadialGradient(
        x - xDotRadius * 0.3,
        visualY - xDotRadius * 0.3,
        2,
        x,
        visualY,
        xDotRadius
      );
      gX.addColorStop(1, "#282a2f");
      circlePath(ctx, x, visualY, xDotRadius);
      ctx.fillStyle = gX;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#282a2f";
      ctx.stroke();
      ctx.restore();
    }

    let targetNormalized = 0;
    if (gameState === "flying" || gameState === "crashed") {
      const progress = (multiplier - 1) / yRange;
      targetNormalized = Math.pow(Math.max(0, Math.min(1, progress)), 1 / 2.2);
    }

    const smoothFactor = 1 - Math.exp(-14 * dt);
    smoothNormalizedRef.current +=
      (targetNormalized - smoothNormalizedRef.current) * smoothFactor;

    const normalized = Math.max(
      prevNormalizedRef.current,
      smoothNormalizedRef.current
    );
    prevNormalizedRef.current = normalized;

    const totalPoints = points.length - 1;
    const floatIndex = normalized * totalPoints;
    const fi = Math.max(0, Math.min(totalPoints, floatIndex));
    const idx0 = Math.floor(fi);
    const idx1 = Math.min(totalPoints, idx0 + 1);
    const frac = fi - idx0;
    const p0 = points[idx0];
    const p1 = points[idx1];
    const rocketX = p0.x + (p1.x - p0.x) * frac;
    const rocketY = p0.y + (p1.y - p0.y) * frac;

    if (gameState !== "crashed") {
      ctx.save();
      const areaGrad = ctx.createLinearGradient(0, endY, 0, startY);
      areaGrad.addColorStop(0, "rgba(255,220,120,0.0)");
      areaGrad.addColorStop(0.6, "rgba(255,160,40,0.06)");
      areaGrad.addColorStop(1, "rgba(255,130,20,0.12)");
      ctx.fillStyle = areaGrad;
      ctx.shadowColor = "rgba(255,140,20,0.12)";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(curveStartX, startY);
      for (let i = 0; i <= idx0; i++) ctx.lineTo(points[i].x, points[i].y);
      if (frac > 0) ctx.lineTo(rocketX, rocketY);
      ctx.lineTo(rocketX, startY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const strokeGrad = ctx.createLinearGradient(curveStartX, 0, endX, 0);
    if (gameState === "crashed") {
      strokeGrad.addColorStop(0, "#FFE1E1");
      strokeGrad.addColorStop(0.35, "#FF9A9A");
      strokeGrad.addColorStop(0.65, "#FF6B6B");
      strokeGrad.addColorStop(1, "#FF3D3D");
    } else {
      strokeGrad.addColorStop(0, "#E3E3DC");
      strokeGrad.addColorStop(0.4, "#625817");
      strokeGrad.addColorStop(0.65, "#ffb24a");
      strokeGrad.addColorStop(1, "#827522");
    }

    ctx.save();
    ctx.lineWidth = 8;
    ctx.lineCap = "butt";
    ctx.lineJoin = "butt";
    ctx.strokeStyle = strokeGrad;
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 28;
    ctx.beginPath();
    for (let i = 0; i <= idx0; i++) {
      const p = points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    if (frac > 0) ctx.lineTo(rocketX, rocketY);
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = strokeGrad;
    for (let i = 0; i <= idx0; i++) {
      const p = points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    if (frac > 0) ctx.lineTo(rocketX, rocketY);
    ctx.stroke();

    const trailLen = 28;
    const startTrailIdx = Math.max(0, idx0 - trailLen);
    for (let i = startTrailIdx; i <= idx0; i++) {
      const p = points[i];
      const age = idx0 - i;
      const alpha = Math.max(0, 1 - age / (trailLen + 2));
      const r = Math.max(2, 12 * (1 - age / (trailLen + 1)));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
      g.addColorStop(0, `rgba(255,230,160,${0.95 * alpha})`);
      g.addColorStop(0.5, `rgba(255,150,40,${0.35 * alpha})`);
      g.addColorStop(1, "rgba(255,120,30,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.arc(rocketX, rocketY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "#ff9900";
    ctx.arc(rocketX, rocketY, 3, 0, Math.PI * 2);
    ctx.fill();

    const lookaheadIndex = Math.min(totalPoints, Math.floor(fi + 3));
    let rocketAngle = 0;
    if (lookaheadIndex > idx0) {
      const lookahead = points[lookaheadIndex];
      const dx = lookahead.x - rocketX;
      const dy = lookahead.y - rocketY;
      rocketAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    } else {
      const prevIndex = Math.max(0, idx0 - 1);
      const prevPoint = points[prevIndex];
      const dx = rocketX - prevPoint.x;
      const dy = rocketY - prevPoint.y;
      rocketAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    }

    ctx.save();
    const glowRadius = 60;
    const rg = ctx.createRadialGradient(
      rocketX,
      rocketY,
      0,
      rocketX,
      rocketY,
      glowRadius
    );
    rg.addColorStop(0, "rgba(255,220,120,0.95)");
    rg.addColorStop(0.2, "rgba(255,170,60,0.5)");
    rg.addColorStop(1, "rgba(255,120,20,0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(rocketX, rocketY, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    rocketEl.style.opacity = "1";
    rocketEl.style.left = `${rocketX}px`;
    rocketEl.style.top = `${rocketY}px`;
    rocketEl.style.transform = `translate(-50%, -50%) rotate(${rocketAngle}deg) scale(${gameState === "crashed" ? 1.05 : 1
      })`;
    rocketEl.style.filter = "drop-shadow(0 0 14px rgba(255, 240, 100, 0.95))";

    const textColor = gameState === "crashed" ? "#FF6B6B" : "#FFC645";
    const textGlow =
      gameState === "crashed"
        ? "rgba(255,140,140,0.55)"
        : "rgba(255,200,60,0.45)";
    const payoutFontSize = window.innerWidth < 640 ? 40 : 64;

    ctx.shadowBlur = 28;
    ctx.shadowColor = textGlow;
    ctx.fillStyle = textColor;
    ctx.font = `bold ${payoutFontSize}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${multiplier.toFixed(2)}x`, cssW / 2, cssH / 2 - 10);

    ctx.shadowBlur = 0;
    ctx.font = "bold 16px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText("Current payout", cssW / 2, cssH / 2 + 30);
  };

  useEffect(() => {
    let lastTs = performance.now();

    const stepFn = (ts) => {
      const dt = Math.min(0.06, (ts - lastTs) / 1000);
      lastTs = ts;

      if (multiplier > maxSeenRef.current)
        maxSeenRef.current = multiplier * 1.25;

      if (gameState === "flying" || gameState === "crashed") {
        displayMultiplierRef.current = multiplier;
      } else {
        displayMultiplierRef.current = 1.0;
      }

      if (gameState === "crashed") {
        const final = multiplier;
                setCrashData(multiplier)

        const diff = final - displayMultiplierRef.current;
        if (Math.abs(diff) > 0.01) displayMultiplierRef.current += diff * 0.15;
      }

      try {
        draw();
      } catch (e) {}

      const current = Number(displayMultiplierRef.current.toFixed(2));
      if (current !== lastSentRef.current) {
        lastSentRef.current = current;
        dispatch(setCurrentScore(current));
      }

      rafRef.current = requestAnimationFrame(stepFn);
    };

    rafRef.current = requestAnimationFrame(stepFn);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [multiplier, gameState, windowLength, dispatch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      pointsRef.current = { points: [], w: 0, h: 0 };
      draw();
    };

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onResize)
        : null;
    if (ro) ro.observe(canvas);
    else window.addEventListener("resize", onResize);
    onResize();

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", onResize);
    };
  }, [windowLength, slotCount]);

  useEffect(() => {
    let tickId = null;

    if (gameState === "flying") {
      if (!startTimestampRef.current)
        startTimestampRef.current = performance.now();

      tickId = setInterval(() => {
        const now = performance.now();
        const elapsedSec = Math.max(
          0,
          (now - startTimestampRef.current) / 1000
        );

        setElapsed(elapsedSec);
        elapsedRef.current = elapsedSec;

        const newShiftCount = Math.floor(elapsedSec / AXIS_STEP_SECONDS);
        if (newShiftCount > shiftCountRef.current) {
          shiftCountRef.current = newShiftCount;
          setAxisBase((prev) => prev + AXIS_STEP_UNITS);
        }
      }, 100);
    } else if (gameState === "loading") {
      startTimestampRef.current = null;
      setElapsed(0);
      elapsedRef.current = 0;
      shiftCountRef.current = 0;
      setAxisBase(0);
      prevNormalizedRef.current = 0;
      smoothNormalizedRef.current = 0;
      displayMultiplierRef.current = 1.0;
    }

    return () => {
      if (tickId) clearInterval(tickId);
    };
  }, [gameState]);

  // X-axis label values (1..7, then scrolling)
  const renderSlots = useMemo(
    () => Array.from({ length: labelsCount }, (_, i) => axisBase + i),
    [axisBase, labelsCount]
  );

  const [labelRects, setLabelRects] = useState(null);
  const labelContainerRef = useRef(null);

  useEffect(() => {
    const container = labelContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const startX = 10 + axisGap;
    const endX = rect.width - 36;
    const cols = slotCount - 1;
    const chartW = endX - startX;
    const arr = [];
    for (let i = 0; i < slotCount; i++) {
      const posRatio = i / (slotCount - 1);
      const x = Math.round(startX + posRatio * chartW);
      arr.push(x);
    }
    setLabelRects({ rect, xs: arr, y: rect.height - 56 + 12 });
  }, [windowLength, slotCount, multiplier, axisGap, axisBase]);

  const style = (
    <style>{`
      .x-labels { position: absolute; left: 0; top: 0; pointer-events: none; width: 100%; height: 100%; }
      .x-label { position: absolute; transform: translate(-50%, 0); color: #fff; font-weight: 700; opacity: 1; }
    `}</style>
  );

  return (
    <div className="w-full h-full crash-graph-root">
      <div className="relative w-full h-full rounded-lg overflow-hidden crash-graph-bg">
        {style}
        <div ref={labelContainerRef} className="x-labels" aria-hidden>
          {labelRects &&
            renderSlots.map((value, index) => {
              const left = labelRects.xs[index] + 2;
              const isLast = index === renderSlots.length - 1;
              const label = isLast ? `Total ${value}s` : `${value}s`;
              return (
                <div
                  key={index}
                  className="x-label"
                  style={{
                    left,
                    bottom: pageSize < 640 ? "-5px" : "0px",
                    color: "#767b86",
                    fontSize: 13,
                    textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                    width: 100, // number is fine; React adds "px"
                  }}
                >
                  {label}
                </div>
              );
            })}
        </div>
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div
          ref={rocketRef}
          className="absolute pointer-events-none transition-opacity duration-200 left-0 top-0"
          style={{ opacity: 0, filter: "drop-shadow(0 0 5px red)" }}
        >
          {gameState === "crashed" ? (
            <div className="relative explosion-container">
              <div className="w-[400px] h-[400px] relative">
                <img src={explosion1} alt="explosion" className="w-full" />
              </div>
            </div>
          ) : (
            <div className="relative rocket-img">
              <img src={fire3} alt="flame" className="flame" />
              <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rotate-75 relative">
                <img src={rocket} alt="rocket" className="w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrashGraph;

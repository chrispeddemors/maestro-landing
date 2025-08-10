"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

export type SchematicProps = {
  composeProgress: MotionValue<number>;
  orchestrateProgress: MotionValue<number>;
  automateProgress: MotionValue<number>;
  globalOpacity?: MotionValue<number>;
};

// Coords are in viewBox (0..100) for responsiveness
const nodes = [
  { id: "A", x: 18, y: 28 },
  { id: "B", x: 36, y: 18 },
  { id: "C", x: 56, y: 26 },
  { id: "D", x: 74, y: 18 },
  { id: "E", x: 24, y: 56 },
  { id: "F", x: 48, y: 48 },
  { id: "G", x: 72, y: 56 },
  { id: "H", x: 36, y: 78 },
  { id: "I", x: 64, y: 78 },
] as const;

type NodeId = typeof nodes[number]["id"];

const connections: Array<[NodeId, NodeId]> = [
  ["A", "B"],
  ["B", "C"],
  ["C", "D"],
  ["A", "E"],
  ["B", "F"],
  ["C", "F"],
  ["D", "G"],
  ["E", "F"],
  ["F", "G"],
  ["E", "H"],
  ["G", "I"],
  ["H", "F"],
  ["I", "F"],
];

function findNode(id: NodeId) {
  const n = nodes.find((n) => n.id === id);
  if (!n) throw new Error("node not found: " + id);
  return n;
}

function linePath(a: { x: number; y: number }, b: { x: number; y: number }) {
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

function GlowEdge({ s, t, automateProgress, persistent }: { s: NodeId; t: NodeId; automateProgress: MotionValue<number>; persistent: boolean }) {
  const a = findNode(s);
  const b = findNode(t);
  const fadeOut = useTransform(automateProgress, [0, 1], [0.12, persistent ? 0.14 : 0.05]);
  return (
    <motion.path d={linePath(a, b)} stroke="#38f29a" strokeWidth={1.2} strokeLinecap="round" style={{ opacity: fadeOut }} />
  );
}

function Edge({ s, t, composeProgress, automateProgress, persistent }: { s: NodeId; t: NodeId; composeProgress: MotionValue<number>; automateProgress: MotionValue<number>; persistent: boolean }) {
  const a = findNode(s);
  const b = findNode(t);
  const simplifyOpacity = useTransform(automateProgress, [0, 1], [0.9, persistent ? 0.9 : 0.08]);
  return (
    <motion.path
      d={linePath(a, b)}
      stroke="#2bd485"
      strokeWidth={0.9}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0 }}
      style={{ pathLength: composeProgress, opacity: simplifyOpacity, mixBlendMode: "screen" }}
    />
  );
}

function SweepEdge({ s, t, sweepOpacity, delay }: { s: NodeId; t: NodeId; sweepOpacity: MotionValue<number>; delay: number }) {
  const a = findNode(s);
  const b = findNode(t);
  return (
    <motion.path
      d={linePath(a, b)}
      className="stroke-shimmer"
      style={{ opacity: sweepOpacity }}
      strokeWidth={1}
      strokeDasharray="4 12"
      transition={{ delay, repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
    />
  );
}

function NodeDot({ id, nodeScale, nodeOpacity, delay }: { id: NodeId; nodeScale: MotionValue<number>; nodeOpacity: MotionValue<number>; delay: number }) {
  const n = findNode(id);
  return (
    <motion.circle
      cx={n.x}
      cy={n.y}
      r={1.4}
      fill="#d7ffe9"
      initial={false}
      style={{ opacity: nodeOpacity, scale: nodeScale, transformOrigin: `${n.x}% ${n.y}%` }}
      transition={{ delay, type: "spring", stiffness: 120, damping: 18 }}
    />
  );
}

function CheckMark({ id, automateProgress }: { id: NodeId; automateProgress: MotionValue<number> }) {
  const n = findNode(id);
  const appear = useTransform(automateProgress, [0, 0.4, 1], [0, 0, 1]);
  const scale = useTransform(automateProgress, [0, 1], [0.85, 1]);
  return (
    <motion.path
      d={`M ${n.x - 1} ${n.y} l 0.8 1.1 l 1.8 -2.1`}
      stroke="#b9ffd9"
      strokeWidth={0.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: appear, scale, transformOrigin: `${n.x}% ${n.y}%` }}
    />
  );
}

export default function Schematic({ composeProgress, orchestrateProgress, automateProgress, globalOpacity }: SchematicProps) {
  const sweepOpacity = useTransform(orchestrateProgress, [0, 0.25, 0.8, 1], [0, 0.35, 0.22, 0]);
  const nodeScale = useTransform(composeProgress, [0, 1], [0.85, 1]);
  const nodeOpacity = useTransform(composeProgress, [0, 1], [0, 1]);

  const persistentEdges = new Set(["A-B", "B-C", "C-D", "E-F", "F-G", "H-F", "I-F"]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-5" aria-hidden>
      <motion.svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="w-full h-full" style={{ opacity: globalOpacity }}>
        {/* subtle green glow layer underneath */}
        <g className="green-glow">
          {connections.map(([s, t], idx) => {
            const key = `${s}-${t}`;
            const persistent = persistentEdges.has(key) || persistentEdges.has(`${t}-${s}`);
            return <GlowEdge key={`glow-${idx}`} s={s} t={t} automateProgress={automateProgress} persistent={persistent} />;
          })}
        </g>

        {/* main network lines */}
        <g>
          {connections.map(([s, t], idx) => {
            const key = `${s}-${t}`;
            const persistent = persistentEdges.has(key) || persistentEdges.has(`${t}-${s}`);
            return (
              <Edge key={`edge-${idx}`} s={s} t={t} composeProgress={composeProgress} automateProgress={automateProgress} persistent={persistent} />
            );
          })}
        </g>

        {/* shimmer baton sweep overlay during orchestrate */}
        <g>
          {connections.map(([s, t], idx) => (
            <SweepEdge key={`sweep-${idx}`} s={s} t={t} sweepOpacity={sweepOpacity} delay={(idx % 5) * 0.06} />
          ))}
        </g>

        {/* nodes */}
        <g>
          {nodes.map((n, idx) => (
            <NodeDot key={n.id} id={n.id} nodeScale={nodeScale} nodeOpacity={nodeOpacity} delay={idx * 0.12} />
          ))}
        </g>

        {/* automate checkmarks on endpoints */}
        <g>
          {["A", "D", "H", "I"].map((id) => (
            <CheckMark key={`ok-${id}`} id={id as NodeId} automateProgress={automateProgress} />
          ))}
        </g>
      </motion.svg>
    </div>
  );
} 
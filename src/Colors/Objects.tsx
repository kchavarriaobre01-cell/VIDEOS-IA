import type React from "react";
import { OL } from "./Pip";

// 24 ilustraciones sencillas (viewBox 200x200), con contorno y brillo.
const S = { stroke: OL, strokeWidth: 6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const Shine = ({ x, y, rx = 14, ry = 8, r = -30 }: { x: number; y: number; rx?: number; ry?: number; r?: number }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" opacity={0.55} transform={`rotate(${r} ${x} ${y})`} />
);
const Face = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-14} cy={0} r={6} fill={OL} />
    <circle cx={14} cy={0} r={6} fill={OL} />
    <path d="M-10 12 Q0 22 10 12" fill="none" stroke={OL} strokeWidth={5} strokeLinecap="round" />
  </g>
);

const icons: Record<string, React.ReactNode> = {
  apple: (
    <>
      <path d="M100 58 C60 38 22 70 32 122 C42 172 82 186 100 170 C118 186 158 172 168 122 C178 70 140 38 100 58Z" fill="#E53935" {...S} />
      <path d="M100 58 Q98 36 108 22" fill="none" {...S} stroke="#6D4C41" strokeWidth={8} />
      <ellipse cx={128} cy={34} rx={22} ry={11} fill="#66BB6A" {...S} transform="rotate(-25 128 34)" />
      <Shine x={62} y={92} rx={16} ry={10} />
    </>
  ),
  strawberry: (
    <>
      <path d="M36 72 Q100 40 164 72 Q166 140 100 186 Q34 140 36 72Z" fill="#E53935" {...S} />
      {[[70, 90], [100, 85], [130, 90], [80, 120], [120, 120], [100, 150], [60, 110], [140, 110]].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx={4} ry={6} fill="#FFE082" />
      ))}
      <path d="M60 62 L80 46 L92 62 L100 40 L108 62 L120 46 L140 62 Q100 78 60 62Z" fill="#43A047" {...S} />
    </>
  ),
  firetruck: (
    <>
      <rect x={14} y={82} width={140} height={70} rx={10} fill="#E53935" {...S} />
      <path d="M140 152 L140 70 Q140 62 148 62 L172 62 Q184 62 188 80 L190 152 Z" fill="#E53935" {...S} />
      <rect x={150} y={72} width={30} height={26} rx={5} fill="#90CAF9" {...S} strokeWidth={5} />
      <g stroke={OL} strokeWidth={5} strokeLinecap="round">
        <line x1={24} y1={66} x2={130} y2={66} />
        <line x1={24} y1={78} x2={130} y2={78} />
        {[34, 54, 74, 94, 114].map((x) => <line key={x} x1={x} y1={66} x2={x} y2={78} />)}
      </g>
      <rect x={156} y={50} width={16} height={12} rx={4} fill="#FFD54F" {...S} strokeWidth={4} />
      <rect x={28} y={100} width={96} height={12} rx={6} fill="#fff" opacity={0.8} />
      {[52, 158].map((x) => (
        <g key={x}>
          <circle cx={x} cy={156} r={22} fill="#37474F" {...S} />
          <circle cx={x} cy={156} r={8} fill="#B0BEC5" />
        </g>
      ))}
    </>
  ),
  orange: (
    <>
      <circle cx={100} cy={112} r={70} fill="#FB8C00" {...S} />
      {[[70, 100], [90, 140], [130, 120], [120, 80], [80, 130], [140, 150]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={3} fill="#E65100" opacity={0.6} />)}
      <path d="M100 44 Q98 34 104 26" fill="none" {...S} stroke="#6D4C41" strokeWidth={7} />
      <ellipse cx={124} cy={36} rx={20} ry={10} fill="#66BB6A" {...S} transform="rotate(-20 124 36)" />
      <Shine x={70} y={82} />
    </>
  ),
  carrot: (
    <>
      <path d="M100 188 L56 74 Q100 52 144 74 Z" fill="#FB8C00" {...S} />
      <g stroke="#E65100" strokeWidth={5} strokeLinecap="round">
        <line x1={78} y1={100} x2={96} y2={102} />
        <line x1={104} y1={124} x2={120} y2={122} />
        <line x1={86} y1={146} x2={100} y2={148} />
      </g>
      <ellipse cx={84} cy={42} rx={12} ry={30} fill="#43A047" {...S} transform="rotate(-25 84 42)" />
      <ellipse cx={116} cy={42} rx={12} ry={30} fill="#43A047" {...S} transform="rotate(25 116 42)" />
      <ellipse cx={100} cy={36} rx={12} ry={32} fill="#66BB6A" {...S} />
    </>
  ),
  pumpkin: (
    <>
      <ellipse cx={58} cy={118} rx={44} ry={58} fill="#EF6C00" {...S} />
      <ellipse cx={142} cy={118} rx={44} ry={58} fill="#EF6C00" {...S} />
      <ellipse cx={100} cy={118} rx={48} ry={64} fill="#FB8C00" {...S} />
      <path d="M100 56 Q96 36 108 28" fill="none" {...S} stroke="#558B2F" strokeWidth={12} />
      <Shine x={82} y={88} />
    </>
  ),
  banana: (
    <>
      <path d="M36 52 Q44 166 172 148 Q178 140 166 134 Q78 136 58 46 Q46 40 36 52Z" fill="#FDD835" {...S} />
      <path d="M60 70 Q80 128 150 138" fill="none" stroke="#F9A825" strokeWidth={5} strokeLinecap="round" />
      <path d="M36 52 L32 40 L46 38 Z" fill="#6D4C41" {...S} strokeWidth={4} />
    </>
  ),
  sun: (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={93} y={4} width={14} height={34} rx={7} fill="#FFB300" {...S} strokeWidth={5} transform={`rotate(${i * 36} 100 100)`} />
      ))}
      <circle cx={100} cy={100} r={56} fill="#FDD835" {...S} />
      <Face x={100} y={96} s={1.3} />
      <ellipse cx={66} cy={116} rx={9} ry={6} fill="#FF8A65" opacity={0.6} />
      <ellipse cx={134} cy={116} rx={9} ry={6} fill="#FF8A65" opacity={0.6} />
    </>
  ),
  duck: (
    <>
      <ellipse cx={110} cy={138} rx={72} ry={46} fill="#FDD835" {...S} />
      <path d="M150 112 Q186 96 182 130" fill="#FDD835" {...S} />
      <circle cx={72} cy={82} r={38} fill="#FDD835" {...S} />
      <path d="M36 86 Q18 90 22 100 Q34 106 46 98 Z" fill="#FB8C00" {...S} />
      <circle cx={70} cy={74} r={7} fill={OL} />
      <circle cx={72} cy={72} r={2.5} fill="#fff" />
      <path d="M96 140 Q120 160 146 138" fill="none" stroke="#F9A825" strokeWidth={6} strokeLinecap="round" />
    </>
  ),
  leaf: (
    <>
      <path d="M34 168 Q14 60 172 30 Q186 152 34 168Z" fill="#43A047" {...S} />
      <path d="M34 168 Q100 110 160 44" fill="none" stroke="#2E7D32" strokeWidth={6} strokeLinecap="round" />
      <path d="M80 128 L70 90 M108 100 L104 66 M96 112 L130 112 M120 86 L150 92" stroke="#2E7D32" strokeWidth={4} strokeLinecap="round" />
    </>
  ),
  frog: (
    <>
      <ellipse cx={100} cy={132} rx={76} ry={52} fill="#43A047" {...S} />
      {[64, 136].map((x) => (
        <g key={x}>
          <circle cx={x} cy={76} r={28} fill="#43A047" {...S} />
          <circle cx={x} cy={76} r={16} fill="#fff" />
          <circle cx={x + 3} cy={78} r={8} fill={OL} />
        </g>
      ))}
      <path d="M60 128 Q100 158 140 128" fill="none" stroke={OL} strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={52} cy={140} rx={10} ry={6} fill="#FF8A80" opacity={0.6} />
      <ellipse cx={148} cy={140} rx={10} ry={6} fill="#FF8A80" opacity={0.6} />
    </>
  ),
  tree: (
    <>
      <rect x={84} y={110} width={32} height={78} rx={8} fill="#8D6E63" {...S} />
      <circle cx={100} cy={70} r={46} fill="#43A047" {...S} />
      <circle cx={60} cy={100} r={36} fill="#43A047" {...S} />
      <circle cx={140} cy={100} r={36} fill="#43A047" {...S} />
      <circle cx={100} cy={106} r={34} fill="#4CAF50" />
      <Shine x={82} y={50} />
    </>
  ),
  whale: (
    <>
      <path d="M20 112 Q26 52 108 56 Q162 60 166 104 L186 78 Q192 112 178 128 Q186 146 174 150 L160 132 Q140 160 96 158 Q30 156 20 112Z" fill="#1E88E5" {...S} />
      <path d="M36 128 Q90 152 150 128" fill="none" stroke="#90CAF9" strokeWidth={10} strokeLinecap="round" />
      <circle cx={66} cy={98} r={7} fill={OL} />
      <circle cx={68} cy={96} r={2.5} fill="#fff" />
      <path d="M96 44 Q90 22 76 18 M96 44 Q100 20 112 14" fill="none" stroke="#64B5F6" strokeWidth={6} strokeLinecap="round" />
    </>
  ),
  blueberry: (
    <>
      <circle cx={100} cy={108} r={68} fill="#3949AB" {...S} />
      <path d="M86 50 L100 62 L114 50 L112 68 L126 74 L110 80 L100 92 L90 80 L74 74 L88 68 Z" fill="#283593" {...S} strokeWidth={4} />
      <Shine x={66} y={92} rx={18} ry={10} />
    </>
  ),
  raindrop: (
    <>
      <path d="M100 18 Q164 104 154 140 A54 54 0 0 1 46 140 Q36 104 100 18Z" fill="#1E88E5" {...S} />
      <Shine x={74} y={110} rx={10} ry={18} r={20} />
      <Face x={104} y={136} />
    </>
  ),
  grapes: (
    <>
      <path d="M100 30 Q104 18 116 12" fill="none" {...S} stroke="#6D4C41" strokeWidth={7} />
      <ellipse cx={130} cy={30} rx={24} ry={12} fill="#66BB6A" {...S} transform="rotate(-15 130 30)" />
      {[[70, 60], [100, 56], [130, 60], [56, 92], [86, 90], [116, 90], [146, 92], [72, 122], [102, 122], [132, 122], [86, 152], [116, 152], [100, 180]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={18} fill="#8E24AA" {...S} strokeWidth={5} />
          <circle cx={x - 6} cy={y - 6} r={4} fill="#fff" opacity={0.6} />
        </g>
      ))}
    </>
  ),
  eggplant: (
    <>
      <path d="M58 64 Q30 120 60 166 Q100 200 150 158 Q176 120 130 92 Q104 76 98 56 Z" fill="#8E24AA" {...S} />
      <path d="M70 40 Q88 70 122 62 Q118 84 98 76 Q86 98 70 80 Q52 76 58 60 Z" fill="#43A047" {...S} />
      <path d="M80 44 Q80 28 92 20" fill="none" {...S} stroke="#2E7D32" strokeWidth={9} />
      <Shine x={68} y={124} rx={10} ry={22} r={10} />
    </>
  ),
  plum: (
    <>
      <path d="M100 52 C50 46 30 96 44 136 C58 176 142 176 156 136 C170 96 150 46 100 52Z" fill="#7B1FA2" {...S} />
      <path d="M100 56 Q88 110 104 166" fill="none" stroke="#4A148C" strokeWidth={5} strokeLinecap="round" />
      <path d="M100 54 Q100 36 110 26" fill="none" {...S} stroke="#6D4C41" strokeWidth={7} />
      <ellipse cx={130} cy={36} rx={20} ry={10} fill="#66BB6A" {...S} transform="rotate(-20 130 36)" />
      <Shine x={70} y={90} />
    </>
  ),
  pig: (
    <>
      <path d="M40 60 L44 18 L80 46 Z" fill="#F48FB1" {...S} />
      <path d="M160 60 L156 18 L120 46 Z" fill="#F48FB1" {...S} />
      <circle cx={100} cy={104} r={72} fill="#F48FB1" {...S} />
      <ellipse cx={100} cy={122} rx={34} ry={24} fill="#F06292" {...S} />
      <ellipse cx={88} cy={122} rx={6} ry={9} fill={OL} />
      <ellipse cx={112} cy={122} rx={6} ry={9} fill={OL} />
      <circle cx={70} cy={84} r={8} fill={OL} />
      <circle cx={130} cy={84} r={8} fill={OL} />
      <ellipse cx={56} cy={116} rx={10} ry={6} fill="#EC407A" opacity={0.5} />
      <ellipse cx={144} cy={116} rx={10} ry={6} fill="#EC407A" opacity={0.5} />
    </>
  ),
  icecream: (
    <>
      <path d="M58 96 L100 192 L142 96 Z" fill="#E8B57A" {...S} />
      <path d="M72 112 L118 160 M88 104 L130 140 M128 112 L84 160 M114 104 L74 140" stroke="#C58B4C" strokeWidth={4} />
      <path d="M46 100 Q40 46 100 38 Q160 46 154 100 Q150 116 136 106 Q126 124 114 108 Q100 124 88 108 Q74 124 64 106 Q50 116 46 100Z" fill="#F06292" {...S} />
      <circle cx={100} cy={26} r={14} fill="#E53935" {...S} strokeWidth={5} />
      <Shine x={72} y={66} />
    </>
  ),
  flower: (
    <>
      <path d="M100 120 Q96 160 100 194" fill="none" stroke="#43A047" strokeWidth={10} strokeLinecap="round" />
      <ellipse cx={124} cy={166} rx={22} ry={10} fill="#66BB6A" {...S} transform="rotate(-30 124 166)" />
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse key={i} cx={100} cy={46} rx={24} ry={34} fill="#F06292" {...S} transform={`rotate(${i * 60} 100 86)`} />
      ))}
      <circle cx={100} cy={86} r={24} fill="#FDD835" {...S} />
    </>
  ),
  teddy: (
    <>
      <ellipse cx={100} cy={154} rx={52} ry={40} fill="#8D6E63" {...S} />
      <ellipse cx={100} cy={160} rx={28} ry={22} fill="#BCAAA4" />
      <circle cx={52} cy={44} r={22} fill="#8D6E63" {...S} />
      <circle cx={148} cy={44} r={22} fill="#8D6E63" {...S} />
      <circle cx={100} cy={84} r={56} fill="#8D6E63" {...S} />
      <ellipse cx={100} cy={102} rx={26} ry={20} fill="#BCAAA4" />
      <ellipse cx={100} cy={94} rx={10} ry={7} fill={OL} />
      <path d="M100 100 L100 110 M90 112 Q100 120 110 112" fill="none" stroke={OL} strokeWidth={4} strokeLinecap="round" />
      <circle cx={78} cy={74} r={7} fill={OL} />
      <circle cx={122} cy={74} r={7} fill={OL} />
    </>
  ),
  cookie: (
    <>
      <path d="M100 30 Q140 28 162 62 Q178 96 164 130 Q148 168 104 172 Q58 174 38 138 Q22 100 40 64 Q60 32 100 30Z" fill="#C68B59" {...S} />
      {[[70, 70], [120, 60], [140, 104], [96, 106], [64, 124], [112, 146], [148, 140], [84, 82]].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx={9} ry={7} fill="#5D4037" transform={`rotate(${x} ${x} ${y})`} />
      ))}
    </>
  ),
  acorn: (
    <>
      <path d="M52 92 Q48 160 100 188 Q152 160 148 92 Z" fill="#A1887F" {...S} />
      <path d="M38 92 Q40 46 100 44 Q160 46 162 92 Q100 108 38 92Z" fill="#6D4C41" {...S} />
      <path d="M60 60 L80 98 M84 50 L104 100 M110 48 L128 98 M136 58 L146 92 M52 80 L150 74" stroke="#4E342E" strokeWidth={4} />
      <path d="M100 44 Q100 26 112 18" fill="none" {...S} stroke="#4E342E" strokeWidth={8} />
      <Shine x={78} y={130} rx={8} ry={16} r={10} />
    </>
  ),
};

export const ObjectIcon = ({ name, size }: { readonly name: string; readonly size: number }) => (
  <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: "visible" }}>
    {icons[name] ?? null}
  </svg>
);

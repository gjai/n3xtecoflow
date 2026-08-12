"use client";

export function HeroVisual() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-[-8%] hidden w-[55%] lg:block"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 640 720"
        className="h-full w-full hero-float"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a2f26" />
            <stop offset="100%" stopColor="#0d1a14" />
          </linearGradient>
          <linearGradient id="glowLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c8f04d" stopOpacity="0" />
            <stop offset="50%" stopColor="#c8f04d" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f0a202" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect
          x="170"
          y="180"
          width="280"
          height="360"
          rx="28"
          fill="url(#panel)"
          stroke="#c8f04d"
          strokeOpacity="0.35"
          strokeWidth="2"
          className="hero-pulse"
        />
        <rect
          x="200"
          y="220"
          width="220"
          height="120"
          rx="16"
          fill="#102018"
          stroke="#c8f04d"
          strokeOpacity="0.25"
        />
        {/* Battery bars */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={220 + i * 36}
            y="250"
            width="24"
            height="60"
            rx="4"
            fill={i < 4 ? "#c8f04d" : "#31463c"}
            className="hero-bar"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        <circle cx="310" cy="400" r="46" stroke="#f0a202" strokeWidth="3" fill="#14241c" />
        <path
          d="M298 400 L308 388 L308 404 L322 404 L312 420 L312 404 L298 404 Z"
          fill="#c8f04d"
          className="hero-bolt"
        />
        {/* Solar rays */}
        <path
          d="M80 120 C180 80, 260 100, 320 160"
          stroke="url(#glowLine)"
          strokeWidth="3"
          className="hero-ray"
        />
        <path
          d="M120 80 C220 60, 300 90, 360 150"
          stroke="url(#glowLine)"
          strokeWidth="2"
          className="hero-ray"
          style={{ animationDelay: "0.6s" }}
        />
        <rect
          x="420"
          y="120"
          width="140"
          height="90"
          rx="8"
          fill="#13231b"
          stroke="#c8f04d"
          strokeOpacity="0.4"
          transform="rotate(12 490 165)"
          className="hero-panel"
        />
        <path
          d="M430 145 H550 M430 165 H550 M430 185 H550"
          stroke="#c8f04d"
          strokeOpacity="0.25"
          transform="rotate(12 490 165)"
        />
      </svg>
    </div>
  );
}

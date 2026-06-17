import { useEffect, useState } from "react";

const REDDIT_URL = "https://www.reddit.com/r/BGMIcards/comments/1u4d8lr/bgmicards_exchange_app/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button";
const EMBED_URL_BASE = "https://www.redditmedia.com/r/BGMIcards/comments/1u4d8lr/bgmicards_exchange_app/?ref_source=embed&ref=share&embed=true";

const ORANGE = "#ff4500";
const ORANGE_DARK = "#cc3700";

const LIGHT = {
  bg: "#f0f2f5",
  surface: "#ffffff",
  surfaceAlt: "#f6f7f8",
  border: "#e2e5e9",
  textPrimary: "#0f1419",
  textSecondary: "#5b6472",
  textMuted: "#9ba3ad",
  navBg: "#ffffff",
  pill: "#fff1ee",
  pillText: "#cc3700",
  cardShadow: "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
  heroBorder: "rgba(255,69,0,0.15)",
};

const DARK = {
  bg: "#0d0d0e",
  surface: "#1a1a1b",
  surfaceAlt: "#222224",
  border: "#2d2d2f",
  textPrimary: "#e8eaed",
  textSecondary: "#9aa0a6",
  textMuted: "#5f6368",
  navBg: "#141415",
  pill: "#2a1810",
  pillText: "#ff6b35",
  cardShadow: "0 2px 16px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
  heroBorder: "rgba(255,69,0,0.2)",
};

const FEATURES = [
  { icon: "🔔", label: "Reddit notifications", sub: "Never miss a trade." },
  { icon: "⚡", label: "Native & fast", sub: "No extra app needed." },
  { icon: "🔒", label: "No new account", sub: "Use your Reddit login." },
];

function SnooSVG({ size = 32 }) {
  return (
    <div style={{
      width: size, height: size, background: ORANGE,
      borderRadius: "50%", display: "flex",
      alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="#FF4500" />
        <ellipse cx="10" cy="11.5" rx="6" ry="4" fill="white" />
        <circle cx="7.5" cy="10.5" r="1" fill="#FF4500" />
        <circle cx="12.5" cy="10.5" r="1" fill="#FF4500" />
        <path d="M8 13.5 Q10 14.5 12 13.5" stroke="#FF4500" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        <circle cx="15.5" cy="7" r="1.5" fill="white" />
        <path d="M13 8.5 Q13.5 6 15.5 5.5" stroke="white" strokeWidth="1" fill="none" />
        <circle cx="10" cy="4" r="2" fill="white" />
      </svg>
    </div>
  );
}

function PulsingDot() {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "#22c55e", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
        opacity: 0.6,
      }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
    </span>
  );
}

export default function App() {
  var isMobile = window.innerWidth < 700;

  var [count, setCount] = useState(10);
  var [onlineCount] = useState(function() { return Math.floor(Math.random() * 21) + 15; });
  var isDark = true;
  var [hovered, setHovered] = useState(false);

  var t = isDark ? DARK : LIGHT;
  var embedUrl = EMBED_URL_BASE + (isDark ? "&theme=dark" : "");

  useEffect(function () {
    var iv = setInterval(function () {
      setCount(function (c) {
        if (c <= 1) {
          clearInterval(iv);
          window.location.href = REDDIT_URL;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return function () { clearInterval(iv); };
  }, []);

  var mins = Math.floor(count / 60);
  var secs = count % 60;
  var timerText = count > 0 ? mins + ":" + String(secs).padStart(2, "0") : "…";
  var progress = ((3000 - count) / 3000) * 100;

  /* ── shared card: hero content ── */
  function HeroCard({ compact }) {
    return (
      <div style={{
        background: t.surface,
        border: "1px solid " + t.heroBorder,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: t.cardShadow,
      }}>
        {/* gradient banner */}
        <div style={{
          height: compact ? 50 : 90,
          background: "linear-gradient(135deg, #ff4500 0%, #ff6b35 40%, #ff8c42 70%, #ffb347 100%)",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)",
          }} />
          <div style={{
            position: "absolute", bottom: compact ? -16 : -24, left: 20,
            width: compact ? 40 : 54, height: compact ? 40 : 54,
            background: t.surface,
            borderRadius: compact ? 10 : 14,
            border: "3px solid " + t.surface,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 2,
          }}>
            <SnooSVG size={compact ? 28 : 40} />
          </div>
        </div>

        <div style={{ padding: compact ? "22px 16px 14px" : "32px 20px 20px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: t.pill, color: t.pillText,
            borderRadius: 20, padding: "3px 10px",
            fontSize: 11, fontWeight: 700,
            letterSpacing: 0.5, textTransform: "uppercase",
            marginBottom: compact ? 5 : 10,
          }}>
            <span style={{ fontSize: 9 }}>●</span> We've moved
          </div>

          <div style={{ fontSize: compact ? 17 : 22, fontWeight: 800, color: t.textPrimary, lineHeight: 1.2, letterSpacing: "-0.5px", marginBottom: compact ? 10 : 8 }}>
            BGMIcards Exchange<br />is now on Reddit
          </div>
          {!compact && (
            <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.65, marginBottom: 16 }}>
              The standalone site is shutting down. We've built a native Reddit app — trade cards, exchange with the community, no extra login needed.
            </div>
          )}

          {/* members row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: compact ? "8px 12px" : "10px 14px",
            background: t.surfaceAlt,
            borderRadius: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <PulsingDot />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#22c55e" }}>{onlineCount} online</span>
            </div>
            <div style={{ width: 1, height: 14, background: t.border }} />
            <span style={{ fontSize: 12, color: t.textSecondary }}>400+ members</span>
            <div style={{ width: 1, height: 14, background: t.border }} />
            <span style={{ fontSize: 12, color: t.textSecondary, fontWeight: 600 }}>r/BGMIcards</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── shared card: features ── */
  function FeaturesCard() {
    return (
      <div style={{
        background: t.surface,
        border: "1px solid " + t.border,
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: t.cardShadow,
      }}>
        {FEATURES.map(function (f, i) {
          return (
            <div key={f.label}>
              <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 0" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: isDark ? "#2a1810" : "#fff1ee",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1 }}>{f.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "#22c55e", fontSize: 15, fontWeight: 700 }}>✓</div>
              </div>
              {i < FEATURES.length - 1 && <div style={{ height: 1, background: t.border }} />}
            </div>
          );
        })}
      </div>
    );
  }

  /* ── shared card: CTA ── */
  function CTACard() {
    return (
      <div style={{
        background: t.surface,
        border: "1px solid " + t.border,
        borderRadius: 16,
        padding: "12px",
        boxShadow: t.cardShadow,
      }}>
        <a
          href={REDDIT_URL}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
            background: hovered
              ? "linear-gradient(135deg, " + ORANGE_DARK + ", " + ORANGE + ")"
              : "linear-gradient(135deg, " + ORANGE + ", #ff6b35)",
            color: "#fff",
            borderRadius: 12,
            padding: "11px 20px",
            fontSize: 14, fontWeight: 700,
            textDecoration: "none",
            transition: "all 0.2s ease",
            letterSpacing: "-0.2px",
            boxShadow: hovered ? "0 6px 20px rgba(255,69,0,0.4)" : "0 3px 10px rgba(255,69,0,0.25)",
            transform: hovered ? "translateY(-1px)" : "none",
          }}
        >
          <SnooSVG size={20} />
          Open BGMIcards on Reddit
        </a>

        <div style={{ marginTop: 8 }}>
          <div style={{ height: 4, background: t.border, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
            <div style={{
              height: "100%",
              width: progress + "%",
              background: "linear-gradient(90deg, " + ORANGE + ", #ff6b35)",
              borderRadius: 4,
              transition: "width 1s linear",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: t.textMuted }}>Auto-redirecting in</span>
            <span style={{
              fontSize: 12, fontWeight: 700, color: ORANGE,
              background: isDark ? "#2a1810" : "#fff1ee",
              borderRadius: 6, padding: "2px 8px",
            }}>
              {timerText}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      background: t.bg,
      color: t.textPrimary,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeSlideUp 0.5s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.20s; }
        .fade-up-4 { animation-delay: 0.28s; }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: isDark ? "#161b22" : t.navBg,
        borderBottom: "1px solid " + (isDark ? "#21262d" : t.border),
        padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        {/* Left: logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #ff4500, #ff6534)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
          }}>
            🃏
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: isDark ? "#fff" : t.textPrimary, letterSpacing: "-0.3px" }}>
              BGMIcards <span style={{ color: ORANGE }}>Portal</span>
            </div>
            <div style={{ fontSize: 11, color: isDark ? "#8b949e" : t.textMuted, marginTop: 1 }}>
              r/BGMIcards • Card Exchange
            </div>
          </div>
        </div>


      </nav>

      {/* ── MOBILE LAYOUT ── */}
      {isMobile && (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          gap: 10, padding: "12px 14px 12px",
          overflow: "hidden",
        }}>
          <div className="fade-up fade-up-1" style={{ flex: "0 0 auto" }}><HeroCard compact /></div>
          <div className="fade-up fade-up-2" style={{ flex: "0 0 auto" }}><FeaturesCard /></div>
          <div className="fade-up fade-up-3"><CTACard /></div>
        </div>
      )}

      {/* ── DESKTOP LAYOUT ── */}
      {!isMobile && (
        <div style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "12px 12px 12px",
          gap: 10,
        }}>

          {/* TOP ROW — hero card full width */}
          <div className="fade-up fade-up-1" style={{
            background: t.surface,
            border: "1px solid " + t.heroBorder,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: t.cardShadow,
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}>
            {/* left half: 2/3 "we've moved" + 1/3 "why reddit" */}
            <div style={{
              flex: "0 0 50%",
              display: "flex",
              borderRight: "1px solid " + t.border,
              overflow: "hidden",
            }}>
              {/* left 2/3: headline + meta */}
              <div style={{
                flex: "0 0 66.666%", padding: "20px 24px",
                display: "flex", flexDirection: "column", justifyContent: "center",
                gap: 10,
                borderRight: "1px solid " + t.border,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
                  <SnooSVG size={44} />
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: t.pill, color: t.pillText,
                    borderRadius: 20, padding: "3px 12px",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: 0.5, textTransform: "uppercase",
                  }}>
                    <span style={{ fontSize: 9 }}>●</span> We've moved
                  </div>
                </div>

                <div style={{ fontSize: 22, fontWeight: 900, color: t.textPrimary, lineHeight: 1.15, letterSpacing: "-0.8px" }}>
                  BGMIcards Exchange<br />is now on Reddit
                </div>
                <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7, maxWidth: 380 }}>
                  The standalone site is shutting down. Our new home is a native Reddit app — trade cards, browse listings, no extra login needed.
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
                  <span style={{ fontSize: 13, color: t.textSecondary }}>
                    <span style={{ fontWeight: 700, color: t.textPrimary }}>400+</span> members
                  </span>
                  <div style={{ width: 1, height: 14, background: t.border }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <PulsingDot />
                    <span style={{ fontSize: 13, color: t.textSecondary }}>
                      <span style={{ fontWeight: 700, color: "#22c55e" }}>{onlineCount}</span> online
                    </span>
                  </div>
                </div>
              </div>

              {/* right 1/3: features list */}
              <div style={{
                flex: "0 0 42%",
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "16px 24px", gap: 0,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>
                  Why Reddit?
                </div>
                {FEATURES.map(function (f, i) {
                  return (
                    <div key={f.label}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 0" }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 9,
                          background: isDark ? "#2a1810" : "#fff1ee",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16, flexShrink: 0,
                        }}>
                          {f.icon}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap" }}>{f.label}</div>
                          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 1, whiteSpace: "nowrap" }}>{f.sub}</div>
                        </div>
                      </div>
                      {i < FEATURES.length - 1 && <div style={{ height: 1, background: t.border }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* right half: live reddit post embed */}
            <div style={{
              flex: 1,
              display: "flex", flexDirection: "column",
              padding: "14px 16px",
              gap: 8,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                fontSize: 11, fontWeight: 700, color: t.textMuted,
                textTransform: "uppercase", letterSpacing: 1,
              }}>
                <PulsingDot />
                Live Reddit Post
              </div>
              <div style={{
                flex: 1,
                border: "1px solid " + t.border,
                borderRadius: 12,
                overflow: "hidden",
                background: isDark ? "#161617" : "#f8f9fa",
              }}>
                <iframe
                  src={embedUrl}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  style={{ width: "100%", height: "100%", minHeight: 200, border: "none", display: "block" }}
                  scrolling="no"
                  title="BGMIcards Exchange Reddit Post"
                />
              </div>
            </div>
          </div>

          {/* BOTTOM ROW — CTA full width */}
          <div style={{ display: "flex", gap: 10, alignItems: "stretch", flexShrink: 0 }}>
            <div style={{ flex: 1 }}>
              <div className="fade-up fade-up-3"><CTACard /></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qdbzzbrusmjyqflotbfv.supabase.co"; // e.g. https://xyzabcdef.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkYnp6YnJ1c21qeXFmbG90YmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTE3OTIsImV4cCI6MjA5NDIyNzc5Mn0.P7ycuWMpez18pB0amWVZfrRqDuFaqp8V3ZkO_V-3i4s";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = [
  "Evolving Universe",
  "Jujutsu Kaisen",
  "8th Anniversary",
  "2025 PMGC",
  "Playful Battleground",
  "Glacier Series",
];

const CARDS = {
  "Evolving Universe": ["EU-M416","EU-AKM","EU-AWM","EU-Kar98","EU-UMP","EU-M762","EU-DP28","EU-Groza","EU-MK14","EU-VSS"],
  "Jujutsu Kaisen": ["JJK-M416","JJK-AKM","JJK-AWM","JJK-Kar98","JJK-UMP","JJK-M762","JJK-DP28","JJK-Groza","JJK-MK14","JJK-VSS"],
  "8th Anniversary": ["8A-M416","8A-AKM","8A-AWM","8A-Kar98","8A-UMP","8A-M762","8A-DP28","8A-Groza","8A-MK14","8A-VSS"],
  "2025 PMGC": ["PMGC-M416","PMGC-AKM","PMGC-AWM","PMGC-Kar98","PMGC-UMP","PMGC-M762","PMGC-DP28","PMGC-Groza","PMGC-MK14","PMGC-VSS"],
  "Playful Battleground": ["PB-M416","PB-AKM","PB-AWM","PB-Kar98","PB-UMP","PB-M762","PB-DP28","PB-Groza","PB-MK14","PB-VSS"],
  "Glacier Series": ["GL-M416","GL-AKM","GL-AWM","GL-Kar98","GL-UMP","GL-M762","GL-DP28","GL-Groza","GL-MK14","GL-VSS"],
};

// Mock database
const MOCK_DB = {
  "EU-M416": { available: true, code: "EU4829X1" },
  "JJK-AWM": { available: true, code: "JK991234" },
  "8A-UMP": { available: false, code: null },
  "PMGC-AKM": { available: true, code: "PM738291" },
  "GL-Kar98": { available: false, code: null },
};

const SEARCHERS = ["EU-AKM","JJK-M416","GL-AWM","8A-Groza","PB-UMP"];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [tradeSubTab, setTradeSubTab] = useState("exchange");

  // Exchange state
  const [exStep, setExStep] = useState(1);
  // Step 1 - Give Card
  const [giveCategory, setGiveCategory] = useState(null);
  const [giveCard, setGiveCard] = useState(null);
  const [giveSubStep, setGiveSubStep] = useState(1); // 1=category, 2=card
  // Step 2 - Want Card
  const [wantCategory, setWantCategory] = useState(null);
  const [wantCard, setWantCard] = useState(null);
  const [wantSubStep, setWantSubStep] = useState(1);
  // Step 3 - Code
  const [exCode, setExCode] = useState("");
  const [exDone, setExDone] = useState(false);

  // Find state
  const [findMode, setFindMode] = useState(null); // "need" | "have"
  const [findStep, setFindStep] = useState(1);
  const [findCategory, setFindCategory] = useState(null);
  const [findCard, setFindCard] = useState(null);
  const [findResult, setFindResult] = useState(null);

  const resetExchange = () => {
    setExStep(1);
    setGiveCategory(null); setGiveCard(null); setGiveSubStep(1);
    setWantCategory(null); setWantCard(null); setWantSubStep(1);
    setExCode(""); setExDone(false);
  };
  const resetFind = () => { setFindMode(null); setFindStep(1); setFindCategory(null); setFindCard(null); setFindResult(null); };

  const handleExSubmit = async () => {
    if (exCode.length === 0) return;
    const { error } = await supabase.from("listings").insert([{
      give_card: giveCard,
      want_card: wantCard,
      code: exCode,
      status: "available",
    }]);
    if (!error) setExDone(true);
    else alert("Error saving listing. Try again.");
  };

  const handleFindCardSelect = async (card) => {
    setFindCard(card);
    setFindStep(3);
    if (findMode === "need") {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("give_card", card)
        .eq("status", "available")
        .limit(1);
      setFindResult(data && data.length > 0 ? { available: true, code: data[0].code } : { available: false });
    } else {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("want_card", card)
        .eq("status", "available")
        .limit(1);
      setFindResult({ searching: data && data.length > 0 });
    }
  };

  const styles = {
    app: {
      background: "#0d1117",
      minHeight: "100vh",
      color: "#e6e6e6",
      fontFamily: "'Sora', 'Segoe UI', sans-serif",
      maxWidth: 430,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      background: "#161b22",
      borderBottom: "1px solid #21262d",
      padding: "14px 20px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    logo: {
      width: 32,
      height: 32,
      background: "linear-gradient(135deg, #ff4500, #ff6534)",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: 700,
      color: "#fff",
      letterSpacing: "-0.3px",
    },
    headerSub: {
      fontSize: 11,
      color: "#8b949e",
      marginTop: 1,
    },
    content: {
      flex: 1,
      padding: "20px 16px",
      paddingBottom: 90,
    },
    bottomNav: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      background: "#161b22",
      borderTop: "1px solid #21262d",
      display: "flex",
      padding: "8px 0 12px",
    },
    navItem: (active) => ({
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      cursor: "pointer",
      padding: "6px 0",
      color: active ? "#ff4500" : "#8b949e",
      fontSize: 10,
      fontWeight: active ? 700 : 400,
      transition: "color 0.15s",
      border: "none",
      background: "none",
    }),
    navIcon: { fontSize: 20 },
    card: {
      background: "#161b22",
      border: "1px solid #21262d",
      borderRadius: 12,
      padding: "16px",
      marginBottom: 10,
      cursor: "pointer",
      transition: "border-color 0.15s, background 0.15s",
    },
    cardHover: {
      background: "#1c2128",
      borderColor: "#ff4500",
    },
    quickActionCard: (color) => ({
      background: "#161b22",
      border: `1px solid #21262d`,
      borderRadius: 14,
      padding: "20px 16px",
      cursor: "pointer",
      flex: 1,
      transition: "all 0.15s",
    }),
    actionIcon: (color) => ({
      width: 44,
      height: 44,
      background: color,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      marginBottom: 10,
    }),
    statCard: {
      background: "#161b22",
      border: "1px solid #21262d",
      borderRadius: 12,
      padding: "16px 12px",
      textAlign: "center",
      flex: 1,
    },
    statNum: (color) => ({
      fontSize: 26,
      fontWeight: 800,
      color: color,
      lineHeight: 1,
    }),
    statLabel: {
      fontSize: 10,
      color: "#8b949e",
      marginTop: 6,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    subTabRow: {
      display: "flex",
      background: "#21262d",
      borderRadius: 10,
      padding: 3,
      marginBottom: 20,
    },
    subTab: (active) => ({
      flex: 1,
      padding: "9px 0",
      textAlign: "center",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      background: active ? "#ff4500" : "transparent",
      color: active ? "#fff" : "#8b949e",
      border: "none",
      transition: "all 0.15s",
    }),
    stepLabel: {
      fontSize: 11,
      color: "#8b949e",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      marginBottom: 6,
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: 700,
      color: "#fff",
      marginBottom: 16,
    },
    progressBar: {
      height: 3,
      background: "#21262d",
      borderRadius: 2,
      marginBottom: 20,
      overflow: "hidden",
    },
    progressFill: (pct) => ({
      height: "100%",
      width: `${pct}%`,
      background: "linear-gradient(90deg, #ff4500, #ff6534)",
      borderRadius: 2,
      transition: "width 0.3s ease",
    }),
    input: {
      width: "100%",
      background: "#21262d",
      border: "1px solid #30363d",
      borderRadius: 10,
      padding: "14px 16px",
      color: "#fff",
      fontSize: 15,
      outline: "none",
      boxSizing: "border-box",
      letterSpacing: 2,
    },
    btn: (disabled) => ({
      width: "100%",
      padding: "15px",
      background: disabled ? "#21262d" : "linear-gradient(135deg, #ff4500, #ff6534)",
      color: disabled ? "#555" : "#fff",
      border: "none",
      borderRadius: 12,
      fontSize: 15,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      marginTop: 16,
      transition: "all 0.15s",
    }),
    backBtn: {
      background: "none",
      border: "none",
      color: "#8b949e",
      fontSize: 13,
      cursor: "pointer",
      padding: "0 0 16px",
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    resultBox: (success) => ({
      background: success ? "rgba(35,134,54,0.15)" : "rgba(139,148,158,0.1)",
      border: `1px solid ${success ? "#238636" : "#30363d"}`,
      borderRadius: 12,
      padding: 20,
      textAlign: "center",
      marginTop: 10,
    }),
    findModeCard: {
      background: "#161b22",
      border: "1px solid #21262d",
      borderRadius: 14,
      padding: "20px 16px",
      marginBottom: 12,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 14,
      transition: "all 0.15s",
    },
    findModeIcon: (bg) => ({
      width: 46,
      height: 46,
      background: bg,
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      flexShrink: 0,
    }),
    sectionTitle: {
      fontSize: 11,
      color: "#8b949e",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      marginBottom: 12,
      marginTop: 4,
    },
    badge: (color) => ({
      display: "inline-block",
      background: color,
      color: "#fff",
      fontSize: 10,
      fontWeight: 700,
      padding: "3px 8px",
      borderRadius: 20,
      marginLeft: 8,
      verticalAlign: "middle",
    }),
  };

  // ─── HOME ───
  const HomeScreen = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 2 }}>Welcome to</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          r/BGMIcards <span style={{ color: "#ff4500" }}>Portal</span>
        </div>
        <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>BGMI Card Exchange Community</div>
      </div>

      <div style={styles.sectionTitle}>Quick Actions</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <div style={styles.quickActionCard()} onClick={() => { setActiveTab("trade"); setTradeSubTab("exchange"); }}>
          <div style={styles.actionIcon("rgba(255,69,0,0.2)")}>⇅</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Exchange</div>
          <div style={{ fontSize: 11, color: "#8b949e", marginTop: 3 }}>List your card</div>
        </div>
        <div style={styles.quickActionCard()} onClick={() => { setActiveTab("trade"); setTradeSubTab("find"); }}>
          <div style={styles.actionIcon("rgba(88,166,255,0.15)")}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Find Code</div>
          <div style={{ fontSize: 11, color: "#8b949e", marginTop: 3 }}>Browse offers</div>
        </div>
      </div>

      <div style={styles.sectionTitle}>Stats</div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={styles.statCard}>
          <div style={styles.statNum("#e6e6e6")}>24</div>
          <div style={styles.statLabel}>Total</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum("#f0883e")}>11</div>
          <div style={styles.statLabel}>Active</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNum("#3fb950")}>13</div>
          <div style={styles.statLabel}>Done</div>
        </div>
      </div>

      <div style={{ marginTop: 24, background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 6 }}>📌 Subreddit</div>
        <div style={{ fontSize: 13, color: "#58a6ff", fontWeight: 600 }}>r/BGMIcards</div>
        <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>Join the community for trades & discussions</div>
      </div>
    </div>
  );

  // ─── EXCHANGE TAB ───
  const ExchangeScreen = () => {
    const [hovered, setHovered] = useState(null);

    const progressPct = exStep === 1 ? 33 : exStep === 2 ? 66 : 100;

    if (exDone) return (
      <div style={{ textAlign: "center", paddingTop: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Listing Submitted!</div>
        <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "left" }}>
          <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Summary</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#8b949e" }}>Giving</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3fb950" }}>{giveCard}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#8b949e" }}>Wanting</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#58a6ff" }}>{wantCard}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#8b949e" }}>Code</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: 2 }}>{exCode}</span>
          </div>
        </div>
        <button style={styles.btn(false)} onClick={resetExchange}>Submit Another</button>
      </div>
    );

    const CardList = ({ cards, onSelect }) => (
      <>
        {cards.map(item => (
          <div key={item}
            style={{ ...styles.card, ...(hovered === item ? styles.cardHover : {}) }}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(item)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item}</span>
              <span style={{ color: "#8b949e", fontSize: 18 }}>›</span>
            </div>
          </div>
        ))}
      </>
    );

    return (
      <div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill(progressPct)} />
        </div>

        {/* ── STEP 1: GIVE CARD ── */}
        {exStep === 1 && (
          <>
            <div style={styles.stepLabel}>Step 1 of 3</div>
            <div style={styles.stepTitle}>
              Give Card <span style={{ fontSize: 12, color: "#8b949e", fontWeight: 400 }}>— which card are you offering?</span>
            </div>
            {giveSubStep === 1 && (
              <>
                <div style={styles.sectionTitle}>Select Category</div>
                <CardList cards={CATEGORIES} onSelect={cat => { setGiveCategory(cat); setGiveSubStep(2); }} />
              </>
            )}
            {giveSubStep === 2 && (
              <>
                <button style={styles.backBtn} onClick={() => setGiveSubStep(1)}>‹ Back</button>
                <div style={styles.sectionTitle}>Select Card — <span style={{ color: "#ff4500" }}>{giveCategory}</span></div>
                <CardList cards={CARDS[giveCategory] || []} onSelect={card => { setGiveCard(card); setExStep(2); setWantSubStep(1); }} />
              </>
            )}
          </>
        )}

        {/* ── STEP 2: WANT CARD ── */}
        {exStep === 2 && (
          <>
            <button style={styles.backBtn} onClick={() => { setExStep(1); setGiveSubStep(2); }}>‹ Back</button>
            <div style={styles.stepLabel}>Step 2 of 3</div>
            <div style={styles.stepTitle}>
              Want Card <span style={{ fontSize: 12, color: "#8b949e", fontWeight: 400 }}>— which card do you need?</span>
            </div>
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#8b949e" }}>Giving</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#3fb950" }}>{giveCard}</span>
            </div>
            {wantSubStep === 1 && (
              <>
                <div style={styles.sectionTitle}>Select Category</div>
                <CardList cards={CATEGORIES} onSelect={cat => { setWantCategory(cat); setWantSubStep(2); }} />
              </>
            )}
            {wantSubStep === 2 && (
              <>
                <button style={styles.backBtn} onClick={() => setWantSubStep(1)}>‹ Back</button>
                <div style={styles.sectionTitle}>Select Card — <span style={{ color: "#58a6ff" }}>{wantCategory}</span></div>
                <CardList cards={CARDS[wantCategory] || []} onSelect={card => { setWantCard(card); setExStep(3); }} />
              </>
            )}
          </>
        )}

        {/* ── STEP 3: CODE ── */}
        {exStep === 3 && (
          <>
            <button style={styles.backBtn} onClick={() => { setExStep(2); setWantSubStep(2); }}>‹ Back</button>
            <div style={styles.stepLabel}>Step 3 of 3</div>
            <div style={styles.stepTitle}>Enter Exchange Code</div>
            <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#8b949e" }}>Giving</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#3fb950" }}>{giveCard}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#8b949e" }}>Wanting</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#58a6ff" }}>{wantCard}</span>
              </div>
            </div>
            <input
              style={styles.input}
              placeholder="Enter up to 10-digit code"
              maxLength={10}
              inputMode="numeric"
              value={exCode}
              onChange={e => setExCode(e.target.value.replace(/\D/g, ""))}
            />
            <div style={{ fontSize: 11, color: "#8b949e", marginTop: 8 }}>Numbers only • Max 10 digits • Required</div>
            <button style={styles.btn(exCode.length === 0)} onClick={handleExSubmit}>
              Submit Listing
            </button>
          </>
        )}
      </div>
    );
  };

  // ─── FIND TAB ───
  const FindScreen = () => {
    const [hovered, setHovered] = useState(null);

    if (!findMode) return (
      <>
        <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 16 }}>How would you like to search?</div>
        <div style={{ ...styles.findModeCard, ...(hovered === "need" ? { borderColor: "#ff4500", background: "#1c2128" } : {}) }}
          onMouseEnter={() => setHovered("need")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => { setFindMode("need"); setFindStep(1); }}>
          <div style={styles.findModeIcon("rgba(255,69,0,0.2)")}>🔍</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>I need a specific card</div>
            <div style={{ fontSize: 12, color: "#8b949e", marginTop: 3 }}>Find players offering the card you want</div>
          </div>
          <span style={{ color: "#8b949e", fontSize: 18, marginLeft: "auto" }}>›</span>
        </div>
        <div style={{ ...styles.findModeCard, ...(hovered === "have" ? { borderColor: "#58a6ff", background: "#1c2128" } : {}) }}
          onMouseEnter={() => setHovered("have")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => { setFindMode("have"); setFindStep(1); }}>
          <div style={styles.findModeIcon("rgba(88,166,255,0.15)")}>💎</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>I have a card to give</div>
            <div style={{ fontSize: 12, color: "#8b949e", marginTop: 3 }}>Find players looking for your card</div>
          </div>
          <span style={{ color: "#8b949e", fontSize: 18, marginLeft: "auto" }}>›</span>
        </div>
      </>
    );

    if (findStep === 3 && findResult !== null) return (
      <>
        <button style={styles.backBtn} onClick={resetFind}>‹ Back to Search</button>
        <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 4 }}>Result for</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#ff4500", marginBottom: 16 }}>{findCard}</div>

        {findMode === "need" ? (
          findResult.available ? (
            <div style={styles.resultBox(true)}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#3fb950", marginBottom: 8 }}>Card Available!</div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 14 }}>Use this code to exchange on Reddit</div>
              <div style={{ background: "#0d1117", borderRadius: 8, padding: "12px 20px", display: "inline-block" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: 3 }}>{findResult.code}</span>
              </div>
              <div style={{ marginTop: 14 }}>
                <a href="https://reddit.com/r/BGMIcards" style={{ fontSize: 13, color: "#58a6ff", textDecoration: "none" }}>
                  → Go to r/BGMIcards to complete trade
                </a>
              </div>
            </div>
          ) : (
            <div style={styles.resultBox(false)}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>😔</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#8b949e" }}>Not Available</div>
              <div style={{ fontSize: 12, color: "#8b949e", marginTop: 8 }}>No one is currently offering this card</div>
            </div>
          )
        ) : (
          findResult.searching ? (
            <div style={styles.resultBox(true)}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#3fb950", marginBottom: 8 }}>Someone needs this!</div>
              <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 14 }}>A player is looking for this card</div>
              <a href="https://reddit.com/r/BGMIcards" style={{ fontSize: 13, color: "#58a6ff", textDecoration: "none" }}>
                → Go to r/BGMIcards to connect
              </a>
            </div>
          ) : (
            <div style={styles.resultBox(false)}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🤷</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#8b949e" }}>No one searching</div>
              <div style={{ fontSize: 12, color: "#8b949e", marginTop: 8 }}>No active requests for this card right now</div>
            </div>
          )
        )}
      </>
    );

    return (
      <>
        <button style={styles.backBtn} onClick={findStep === 1 ? resetFind : () => setFindStep(1)}>‹ Back</button>
        <div style={styles.progressBar}>
          <div style={styles.progressFill(findStep === 1 ? 50 : 100)} />
        </div>

        {findStep === 1 && (
          <>
            <div style={styles.stepLabel}>Step 1 of 2</div>
            <div style={styles.stepTitle}>Select Category</div>
            {CATEGORIES.map(cat => (
              <div key={cat}
                style={{ ...styles.card, ...(hovered === cat ? styles.cardHover : {}) }}
                onMouseEnter={() => setHovered(cat)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { setFindCategory(cat); setFindStep(2); }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{cat}</span>
                  <span style={{ color: "#8b949e", fontSize: 18 }}>›</span>
                </div>
              </div>
            ))}
          </>
        )}

        {findStep === 2 && (
          <>
            <div style={styles.stepLabel}>Step 2 of 2</div>
            <div style={styles.stepTitle}>Select Card — <span style={{ color: "#ff4500" }}>{findCategory}</span></div>
            {(CARDS[findCategory] || []).map(card => {
              const entry = MOCK_DB[card];
              const isAvail = entry?.available;
              return (
                <div key={card}
                  style={{ ...styles.card, ...(hovered === card ? styles.cardHover : {}) }}
                  onMouseEnter={() => setHovered(card)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleFindCardSelect(card)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{card}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {findMode === "need" && entry && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                          background: isAvail ? "rgba(35,134,54,0.2)" : "rgba(139,148,158,0.1)",
                          color: isAvail ? "#3fb950" : "#8b949e",
                          border: `1px solid ${isAvail ? "#238636" : "#30363d"}` }}>
                          {isAvail ? "Available" : "Unavailable"}
                        </span>
                      )}
                      <span style={{ color: "#8b949e", fontSize: 18 }}>›</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </>
    );
  };

  // ─── OFFERS ───
  const OffersScreen = () => (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Active Offers</div>
      {Object.entries(MOCK_DB).filter(([,v]) => v.available).map(([card, data]) => (
        <div key={card} style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{card}</div>
              <div style={{ fontSize: 11, color: "#8b949e", marginTop: 3 }}>Code: {data.code}</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              background: "rgba(35,134,54,0.2)", color: "#3fb950", border: "1px solid #238636" }}>
              Available
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={styles.header}>
        <div style={styles.logo}>🃏</div>
        <div>
          <div style={styles.headerTitle}>BGMIcards Portal</div>
          <div style={styles.headerSub}>r/BGMIcards • Card Exchange</div>
        </div>
      </div>

      <div style={styles.content}>
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "trade" && (
          <>
            <div style={styles.subTabRow}>
              <button style={styles.subTab(tradeSubTab === "exchange")} onClick={() => { setTradeSubTab("exchange"); resetExchange(); }}>Exchange</button>
              <button style={styles.subTab(tradeSubTab === "find")} onClick={() => { setTradeSubTab("find"); resetFind(); }}>Find Code</button>
            </div>
            {tradeSubTab === "exchange" ? <ExchangeScreen /> : <FindScreen />}
          </>
        )}
        {activeTab === "offers" && <OffersScreen />}
        {activeTab === "profile" && (
          <div style={{ textAlign: "center", paddingTop: 40, color: "#8b949e" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
            <div style={{ fontSize: 14 }}>Profile coming soon</div>
          </div>
        )}
      </div>

      <div style={styles.bottomNav}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "trade", icon: "⇅", label: "Trade" },
          { id: "offers", icon: "📋", label: "Offers" },
          { id: "profile", icon: "👤", label: "Profile" },
        ].map(({ id, icon, label }) => (
          <button key={id} style={styles.navItem(activeTab === id)} onClick={() => setActiveTab(id)}>
            <span style={styles.navIcon}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

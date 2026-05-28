import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

const SUPABASE_URL = "https://qdbzzbrusmjyqflotbfv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkYnp6YnJ1c21qeXFmbG90YmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NTE3OTIsImV4cCI6MjA5NDIyNzc5Mn0.P7ycuWMpez18pB0amWVZfrRqDuFaqp8V3ZkO_V-3i4s";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const NavButtons = ({ onBack, onNext, nextLabel = "NEXT", nextDisabled = false }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, }}>
    {onBack ? (
      <button style={{ background: "none", border: "none", color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer", padding: "4px 0" }} onClick={onBack}>BACK</button>
    ) : <div />}
    {onNext ? (
      <button style={{ background: "none", border: "none", color: nextDisabled ? "#555" : "#fff", fontSize: 18, fontWeight: 800, cursor: nextDisabled ? "not-allowed" : "pointer", padding: "4px 0" }} onClick={onNext} disabled={nextDisabled}>{nextLabel}</button>
    ) : <div />}
  </div>
);
const CATEGORIES = [
  "Hero's Crown", "BLUE LOCK", "Gourmet Tour - Middle East", "Playful Battleground 2.0", "Evolving Universe", "Jujutsu Kaisen", "Special", "Playful Battleground",
];
const NEW_CATEGORIES = ["Hero's Crown", "BLUE LOCK", "Gourmet Tour - Middle East", "Playful Battleground 2.0"];
const CARDS = {
  "Hero's Crown": [
    { name: "Achilles' Phantom", rarity: "Golden" },
    { name: "Battle Flag - Activate", rarity: "Golden" },
    { name: "Icarus Pickup", rarity: "Golden" },
    { name: "Helion", rarity: "Blue" },
    { name: "Laurel", rarity: "Blue" },
    { name: "Training Ground", rarity: "Blue" },
    { name: "Sun Chariot", rarity: "Blue" },
    { name: "Golden Ball", rarity: "Blue" },
    { name: "Sacred Fire", rarity: "Blue" },
    { name: "Centaur Warrior", rarity: "Blue" },
    { name: "Elite Heroic Spirit", rarity: "Blue" },
    { name: "Wax Wings", rarity: "Grey" },
    { name: "Heart of Fury", rarity: "Grey" },
    { name: "Spartan Infantry", rarity: "Grey" },
    { name: "Battle Flag", rarity: "Grey" },
    { name: "Trial Point", rarity: "Grey" },
    { name: "Pandora's Crate", rarity: "Grey" },
    { name: "Floating Door", rarity: "Grey" },
    { name: "Crown's Abode", rarity: "Grey" },
    { name: "Prometheus' Trial", rarity: "Grey" },
    { name: "Spartan's Trial", rarity: "Grey" },
    { name: "Spartan Shieldbearer", rarity: "Grey" },
  ],
  "BLUE LOCK": [
    { name: "BLUE LOCK", rarity: "Golden" },
    { name: "Nagi Seishiro", rarity: "Golden" },
    { name: "Isagi Yoichi", rarity: "Golden" },
    { name: "Bachira Meguru", rarity: "Blue" },
    { name: "Chigiri Hyoma Vehicle", rarity: "Blue" },
    { name: "Itoshi Rin", rarity: "Blue" },
    { name: "BLUE LOCK Backpack", rarity: "Grey" },
    { name: "Prison Shackles", rarity: "Grey" },
    { name: "Soccer Ball Ornament", rarity: "Grey" },
  ],
  "Gourmet Tour - Middle East": [
    { name: "Kabsa", rarity: "Golden" },
    { name: "Dolma", rarity: "Golden" },
    { name: "Kharouf Mashwi", rarity: "Golden" },
    { name: "Kebdah", rarity: "Blue" },
    { name: "Ra's kharoof", rarity: "Blue" },
    { name: "Mashawi Mshakal", rarity: "Blue" },
    { name: "Malfouf", rarity: "Blue" },
    { name: "Hummus with Spiced Meat", rarity: "Blue" },
    { name: "Mandi", rarity: "Blue" },
    { name: "Fattah", rarity: "Grey" },
    { name: "Shish Kebab", rarity: "Grey" },
    { name: "Kofta", rarity: "Grey" },
    { name: "Mansaf", rarity: "Grey" },
    { name: "Couscous", rarity: "Grey" },
    { name: "Kibbeh", rarity: "Grey" },
    { name: "Ma'amul", rarity: "Grey" },
    { name: "Kunafa", rarity: "Grey" },
    { name: "Baklava", rarity: "Grey" },
    { name: "Tabbouleh", rarity: "Grey" },
    { name: "Rish Kharouf", rarity: "Grey" },
  ],
  "Playful Battleground 2.0": [
    { name: "Coming Soon", rarity: "Golden" },
    { name: "Ford Mustang GTD", rarity: "Golden" },
    { name: "Ford F-150 Raptor", rarity: "Golden" },
    { name: "Harley-Davidson", rarity: "Golden" },
    { name: "Coming Soon", rarity: "Blue" },
    { name: "TRIAL OF FIRE REALITY SHOW CARD", rarity: "Blue" },
    { name: "Coming Soon", rarity: "Blue" },
    { name: "Coming Soon", rarity: "Blue" },
    { name: "Roadster", rarity: "Grey" },
    { name: "Celebrate Together", rarity: "Grey" },
    { name: "Coming Soon", rarity: "Grey" },
  ],
  "Evolving Universe": [
    { name: "Evacuation Master", rarity: "Golden" },
    { name: "Melody Strongest Team", rarity: "Golden" },
    { name: "Raging Rush Strongest Team", rarity: "Golden" },
    { name: "Music Hall", rarity: "Blue" },
    { name: "Racing Hall", rarity: "Blue" },
    { name: "Dynamic Slide Rail", rarity: "Blue" },
    { name: "Parachute Challenge", rarity: "Blue" },
    { name: "Racing Challenge", rarity: "Blue" },
    { name: "S-Rank Vault", rarity: "Blue" },
    { name: "A-Rank Vault", rarity: "Grey" },
    { name: "B-Rank Vault", rarity: "Grey" },
    { name: "Special Lucky Spin", rarity: "Grey" },
    { name: "Energy Shield", rarity: "Grey" },
    { name: "Spatial Distortion Zone 1", rarity: "Grey" },
    { name: "Spatial Distortion Zone 2", rarity: "Grey" },
    { name: "Floating Thruster", rarity: "Grey" },
  ],
  "Jujutsu Kaisen": [
    { name: "Jujutsu Kaisen", rarity: "Golden" },
    { name: "Ryomen Sukuna", rarity: "Golden" },
    { name: "Suguru Geto", rarity: "Golden" },
    { name: "Satoru Gojo", rarity: "Blue" },
    { name: "Yuji Itadori", rarity: "Blue" },
    { name: "Megumi Fushiguro", rarity: "Blue" },
    { name: "Nue", rarity: "Blue" },
    { name: "Nobara Kugisaki", rarity: "Blue" },
    { name: "Cathy", rarity: "Grey" },
    { name: "Cursed Corpse Bear", rarity: "Grey" },
    { name: "Inverted Spear of Heaven", rarity: "Grey" },
  ],
  "Special": [
    { name: "Golden Age", rarity: "Blue" },
    { name: "Arcade Time", rarity: "Blue" },
    { name: "Rhythm Hero", rarity: "Blue" },
    { name: "Vibrant World", rarity: "Blue" },
    { name: "Dinoground", rarity: "Blue" },
    { name: "Ocean Odyssey", rarity: "Blue" },
    { name: "Golden Dynasty", rarity: "Blue" },
    { name: "Temporal Vault", rarity: "Blue" },
  ],
  "Playful Battleground": [
    { name: "Ray", rarity: "Blue" },
    { name: "Garand", rarity: "Grey" },
    { name: "Tracked Amphicarrier", rarity: "Grey" },
    { name: "Jester of Fate", rarity: "Golden" },
    { name: "Ancient Secret : Arise", rarity: "Golden" },
    { name: "Your Old Friends", rarity: "Blue" },
    { name: "Fool Juggling", rarity: "Blue" },
    { name: "Sacred Fire Trial", rarity: "Blue" },
    { name: "Scorpion Crate", rarity: "Blue" },
    { name: "Ancient Secret Battle", rarity: "Blue" },
  ],
};

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const getCutoff = () => new Date(Date.now() - THREE_DAYS_MS).toISOString();

const getCardName = (card) => (typeof card === "object" ? card.name : card);

const getRarityByName = (cardName) => {
  for (const cards of Object.values(CARDS)) {
    for (const card of cards) {
      if (typeof card === "object" && card.name === cardName) return card.rarity;
    }
  }
  return null;
};

const sanitizeUsername = (raw) => (raw || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 20);
const isValidUsername = (u) => {
  if (!u) return false;
  const s = u.trim();
  return /^[A-Za-z0-9_-]{3,20}$/.test(s);
};
const normalizeUsername = (u) => (u || "").trim().toLowerCase();

const s = {
  app: { background: "#0d1117", height: "100vh", color: "#e6e6e6", fontFamily: "'Sora', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column", overflowX: "hidden" },
  header: { background: "#161b22", borderBottom: "1px solid #21262d", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 10 },
  logo: { width: 32, height: 32, background: "linear-gradient(135deg, #ff4500, #ff6534)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  content: { flex: 1, padding: "20px 24px 90px 24px", width: "100%", boxSizing: "border-box", overflowY: "auto" },
  bottomNav: { position: "fixed", bottom: 0, left: 0, width: "100%", background: "#161b22", borderTop: "1px solid #21262d", display: "flex", padding: "8px 0 12px" },
  navItem: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "6px 0", color: active ? "#ff4500" : "#8b949e", fontSize: 10, fontWeight: active ? 700 : 400, border: "none", background: "none" }),
  card: { background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "16px", marginBottom: 10, cursor: "pointer", transition: "border-color 0.15s, background 0.15s" },
  cardHover: { background: "#1c2128", borderColor: "#58a6ff" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, position: "relative" },
  subTabRow: { display: "flex", background: "#21262d", borderRadius: 10, padding: 3, marginBottom: 20 },
  subTab: (active) => ({ flex: 1, padding: "9px 0", textAlign: "center", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: active ? "#ff4500" : "transparent", color: active ? "#fff" : "#8b949e", border: "none" }),
  stepLabel: { fontSize: 11, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 },
  stepTitle: { fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16 },
  progressBar: { height: 3, background: "#21262d", borderRadius: 2, marginBottom: 20, overflow: "hidden" },
  progressFill: (pct) => ({ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #ff4500, #ff6534)", borderRadius: 2, transition: "width 0.3s ease" }),
  input: { width: "100%", background: "#21262d", border: "1px solid #30363d", borderRadius: 10, padding: "14px 16px", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box" },
  btn: (disabled) => ({ width: "100%", padding: "15px", background: disabled ? "#21262d" : "linear-gradient(135deg, #ff4500, #ff6534)", color: disabled ? "#555" : "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", marginTop: 16 }),
  btnSecondary: { width: "100%", padding: "13px", background: "transparent", color: "#ff4500", border: "1px solid #ff4500", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 10 },
  backBtn: { background: "none", border: "none", color: "#8b949e", fontSize: 13, cursor: "pointer", padding: "6px 8px", display: "inline-flex", alignItems: "center", gap: 8 },
  topRightBackBtn: { background: "#0f1720", border: "1px solid #21262d", color: "#8b949e", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 13 },
  resultBox: (success) => ({ background: success ? "rgba(35,134,54,0.15)" : "rgba(139,148,158,0.1)", border: `1px solid ${success ? "#238636" : "#30363d"}`, borderRadius: 12, padding: 20, textAlign: "center", marginTop: 10 }),
  findModeCard: { background: "#161b22", border: "1px solid #21262d", borderRadius: 14, padding: "20px 16px", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 14 },
  findModeIcon: (bg) => ({ width: 46, height: 46, background: bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }),
  sectionTitle: { fontSize: 11, color: "#8b949e", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12, marginTop: 4 },
  listingCard: { background: "#0d1117", borderRadius: 10, padding: "14px 16px", marginBottom: 10, textAlign: "left", border: "1px solid #30363d" },
  donationCard: { background: "rgba(88,166,255,0.08)", borderRadius: 10, padding: "14px 16px", marginBottom: 10, textAlign: "left", border: "1px solid #1f6feb" },
  sectionDivider: { fontSize: 12, fontWeight: 700, color: "#8b949e", margin: "16px 0 8px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #21262d", paddingBottom: 6 },
};

const CardList = ({ items, onSelect, hovered, setHovered }) => (
  <>
    {items.map((item) => {
      const key = typeof item === "object" ? item.name : item;
      return (
        <div
          key={key}
          style={{ ...s.card, ...(hovered === key ? s.cardHover : {}), ...(getCardName(item) === "Coming Soon" ? { opacity: 0.35, cursor: "not-allowed" } : {}) }}
          onMouseEnter={() => setHovered(key)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => { if (getCardName(item) !== "Coming Soon") onSelect(item); }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {typeof item === "object" ? item.name : item}
                {typeof item === "string" && NEW_CATEGORIES.includes(item) && (
                  <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, color: "#fff", background: "#ff4500", borderRadius: 4, padding: "2px 6px" }}>NEW</span>
                )}
              </span>
              {typeof item === "object" && item.rarity && (
                <span style={{
                  fontSize: 10, fontWeight: 700, marginLeft: 8,
                  color: { Colourful: "#ff4500", Golden: "#f0883e", Blue: "#58a6ff", Grey: "#8b949e" }[item.rarity],
                }}>
                  {item.rarity}
                </span>
              )}
            </div>
            <span style={{ color: "#8b949e", fontSize: 18 }}>›</span>
          </div>
        </div>
      );
    })}
  </>
);

// ─── HomeScreen ───────────────────────────────────────────────────────────────
const HomeScreen = ({
  checkUsername, setCheckUsername,
  checkLoading, checkResults,
  handleCheckDonations, handleMarkDone,
}) => {
  const navigate = useNavigate();
  const [dealsTab, setDealsTab] = useState("exchange");
const [liveExchange, setLiveExchange] = useState([]);
const [liveDonations, setLiveDonations] = useState([]);
const [dealsLoading, setDealsLoading] = useState(true);

const fetchDeals = useCallback(async () => {
  setDealsLoading(true);
  const cutoff = getCutoff();
  const { data: ex } = await supabase.from("listings").select("*")
    .eq("type", "exchange").eq("status", "available")
    .gte("created_at", cutoff).order("created_at", { ascending: false }).limit(6);
  const { data: don } = await supabase.from("listings").select("*")
    .eq("type", "donation").eq("status", "available")
    .is("claim_code", null).gte("created_at", cutoff)
    .order("created_at", { ascending: false }).limit(6);
  setLiveExchange(ex || []);
  setLiveDonations(don || []);
  setDealsLoading(false);
}, []);

useEffect(() => { fetchDeals(); }, [fetchDeals]);

const rarityColor = { Colourful: "#ff4500", Golden: "#f0883e", Blue: "#58a6ff", Grey: "#8b949e" };
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 2 }}>Welcome to</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          r/BGMIcards <span style={{ color: "#ff4500" }}>Portal</span>
        </div>
        <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>BGMI Card Exchange Community</div>
      </div>

      <div style={s.sectionTitle}>Quick Access</div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 14, padding: "20px 16px", cursor: "pointer", flex: 1 }}
            onClick={() => navigate("/exchange")}>
            <div style={{ width: 44, height: 44, background: "rgba(255,69,0,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>⇅</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Exchange Cards</div>
            <div style={{ fontSize: 11, color: "#8b949e", marginTop: 3 }}>List your card for exchange</div>
          </div>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 14, padding: "20px 16px", cursor: "pointer", flex: 1 }}
            onClick={() => navigate("/find")}>
            <div style={{ width: 44, height: 44, background: "rgba(88,166,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Find Cards</div>
            <div style={{ fontSize: 11, color: "#8b949e", marginTop: 3 }}>Find players offering your card</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 14, padding: "20px 16px", cursor: "pointer", flex: 1 }}
            onClick={() => navigate("/donate")}>
            <div style={{ width: 44, height: 44, background: "rgba(35,134,54,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>🎁</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Donate Cards</div>
            <div style={{ fontSize: 11, color: "#8b949e", marginTop: 3 }}>List your extra cards</div>
          </div>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 14, padding: "20px 16px", cursor: "pointer", flex: 1 }}
            onClick={() => navigate("/check")}>
            <div style={{ width: 44, height: 44, background: "rgba(240,136,62,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>My Donations</div>
            <div style={{ fontSize: 11, color: "#8b949e", marginTop: 3 }}>Check your donations</div>
          </div>
        </div>
      </div>
      
      {false && (
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 4 }}>🎁 Check My Donations</div>
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 12 }}>Enter your Reddit Username / Custom Username to see if someone needs your donated card.</div>
        <input style={{ ...s.input, fontSize: 13, padding: "10px 14px" }} placeholder="Enter your Reddit Username / Custom Username here."
          value={checkUsername} onChange={e => setCheckUsername(sanitizeUsername(e.target.value))} />
        <button style={{ ...s.btn(checkLoading || !checkUsername.trim()), marginTop: 10, padding: "11px" }}
          onClick={handleCheckDonations}>
          {checkLoading ? "Checking..." : "Check"}
        </button>
        {checkResults !== null && (
          <div style={{ marginTop: 12 }}>
            {checkResults.length === 0 ? (
              <div style={{ fontSize: 12, color: "#8b949e", textAlign: "center" }}>No donations found for this username</div>
            ) : (
              checkResults.map((item, i) => (
                <div key={i} style={{ ...s.listingCard, marginTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{item.give_card}{item.quantity > 1 && <span style={{ color: "#ff4500", marginLeft: 6 }}>{item.quantity}x</span>}</div>
                  {item.claim_code ? (
                    <>
                      <div style={{ fontSize: 11, color: "#3fb950" }}>✅ Someone needs this card!</div>
                      <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>Their exchange code:</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 3, marginTop: 4 }}>{item.claim_code}</div>
                      <div style={{ fontSize: 11, color: "#8b949e", marginTop: 6 }}>Enter this code in BGMI to complete the trade</div>
                      {item.status !== "done" ? (
                        <button type="button" style={{ width: "100%", padding: "8px", background: "transparent", color: "#3fb950", border: "1px solid #3fb950", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 10 }}
                          onClick={(e) => { e.preventDefault(); handleMarkDone(item.id); }}>
                          ✅ Mark as Done
                        </button>
                      ) : (
                        <div style={{ fontSize: 11, color: "#3fb950", marginTop: 8, opacity: 0.6 }}>✅ Trade Completed</div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: 11, color: "#8b949e" }}>⏳ Nobody needs this card yet</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      )}

      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 16 }}>

  {/* Header row */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
      🔥 Live Deals
      <span style={{ fontSize: 11, color: "#8b949e", fontWeight: 400, marginLeft: 6 }}>
        ({liveExchange.length + liveDonations.length} active)
      </span>
    </div>
    <button onClick={fetchDeals}
      style={{ background: "none", border: "1px solid #30363d", borderRadius: 6, color: "#8b949e", cursor: "pointer", fontSize: 11, padding: "3px 8px" }}>
      ↻ Refresh
    </button>
  </div>

  {/* Sub-tabs */}
  <div style={s.subTabRow}>
    <button style={s.subTab(dealsTab === "exchange")} onClick={() => setDealsTab("exchange")}>🟠 Exchange</button>
    <button style={s.subTab(dealsTab === "donations")} onClick={() => setDealsTab("donations")}>🎁 Donations</button>
  </div>

  {/* Content */}
  {dealsLoading ? (
    <div style={{ fontSize: 12, color: "#8b949e", textAlign: "center", padding: "16px 0" }}>Loading deals...</div>
  ) : (
    <>
      {/* Horizontal scroll strip */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
        {(dealsTab === "exchange" ? liveExchange : liveDonations).length === 0 ? (
          <div style={{ fontSize: 12, color: "#8b949e", padding: "8px 0" }}>
            No active {dealsTab} deals right now 🤷
          </div>
        ) : (
          (dealsTab === "exchange" ? liveExchange : liveDonations).map((item, i) => {
            const firstCard = item.give_card ? item.give_card.split(" | ")[0] : "";
            const rarity = getRarityByName(firstCard);
            const strip = rarityColor[rarity] || "#30363d";
            return (
              <div key={i} style={{
                minWidth: 148, maxWidth: 148, flexShrink: 0,
                height: 130,
                background: "#0d1117", borderRadius: 12,
                border: `1px solid ${strip}44`,
                boxShadow: `0 0 10px ${strip}18`,
                padding: "12px 10px 0 10px", overflow: "hidden",
                display: "flex", flexDirection: "column",
              }}>
                {/* Badge */}
                <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 8,
                  color: dealsTab === "exchange" ? "#ff6534" : "#3fb950" }}>
                  {dealsTab === "exchange" ? "🟠 EXCHANGE" : "🎁 FREE"}
                </div>

                {/* Give card */}
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff",
                  lineHeight: 1.3, marginBottom: 4,
                  overflow: "hidden", display: "-webkit-box",
                  WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {item.give_card}
                </div>

                {dealsTab === "exchange" ? (
                  <>
                    <div style={{ fontSize: 10, color: "#8b949e", margin: "4px 0" }}>↕ wants</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#58a6ff",
                      lineHeight: 1.3, marginBottom: 10,
                      overflow: "hidden", display: "-webkit-box",
                      WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                      {item.want_card}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 10 }}>
                    by {item.donor_username}
                  </div>
                )}

                {/* Rarity color strip at bottom */}
                {/* Rarity color strip at bottom */}
<div style={{ height: 4, background: strip, margin: "0 -10px", marginTop: "auto" }} />
              </div>
            );
          })
        )}
      </div>

      {/* Community link */}
      <a href="https://reddit.com/r/BGMIcards"
        style={{ fontSize: 11, color: "#58a6ff", textDecoration: "none",
          display: "block", textAlign: "right", marginTop: 10 }}>
        r/BGMIcards →
      </a>
    </>
  )}
</div>
      </div>
);
};

// ─── GiveCardStep ─────────────────────────────────────────────────────────────
const GiveCardStep = ({
  giveCards, setGiveCards,
  giveView, setGiveView,
  giveCategory, setGiveCategory,
  onProceed,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const lockedRarity = giveCards.length > 0 ? getRarityByName(giveCards[0]) : null;

  const toggleCard = (item) => {
    const cardName = getCardName(item);
    const cardRarity = getRarityByName(cardName);
    if (giveCards.includes(cardName)) {
      setGiveCards(prev => prev.filter(c => c !== cardName));
    } else {
      if (giveCards.length >= 3) return;
      if (lockedRarity && cardRarity !== lockedRarity) return;
      setGiveCards(prev => [...prev, cardName]);
    }
  };

  return (
    <div>
      <div style={s.stepLabel}>Step 1 of 3</div>
      <div style={s.stepTitle}>
        Give Card(s)
        <span style={{ fontSize: 12, color: "#8b949e", fontWeight: 400 }}> — select up to 3 same-rarity cards</span>
      </div>

      {giveCards.length > 0 && (
        <div style={{ background: "#0f2318", border: "1px solid #238636", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 8 }}>
            Selected ({giveCards.length}/3){lockedRarity ? "  —  " + lockedRarity + " rarity locked" : ""}
          </div>
          {giveCards.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#3fb950" }}>{c}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setGiveCards(prev => prev.filter(x => x !== c)); }}
                style={{ background: "none", border: "none", color: "#8b949e", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      

      {giveView === "category" && (
        <div style={{ marginTop: giveCards.length > 0 ? 20 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#ffffff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }} onClick={() => navigate("/home")}>BACK</button>
            <div style={s.sectionTitle}>{giveCards.length > 0 ? "Or add from another category:" : "Select Category"}</div>
            {giveCards.length > 0 ? (
              <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }} onClick={onProceed}>NEXT</button>
            ) : (
              <button style={{ background: "transparent", border: "1px solid #555", color: "#555", fontSize: 14, fontWeight: 800, cursor: "not-allowed", padding: "6px 14px", borderRadius: 8 }} disabled>NEXT</button>
            )}
          </div>
        </div>
      )}

      {giveView === "category" && (
        <div style={{ marginTop: 12 }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat}
              style={{ ...s.card, ...(hovered === cat ? s.cardHover : {}) }}
              onMouseEnter={() => setHovered(cat)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => { e.stopPropagation(); setGiveCategory(cat); setGiveView("cards"); }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {cat}
                  {NEW_CATEGORIES.includes(cat) && (
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, color: "#fff", background: "#ff4500", borderRadius: 4, padding: "2px 6px" }}>NEW</span>
                  )}
                </span>
                <span style={{ color: "#8b949e", fontSize: 18 }}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {giveView === "cards" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }} onClick={(e) => { e.stopPropagation(); setGiveView("category"); }}>BACK</button>
            <div style={s.sectionTitle}>{giveCategory}{lockedRarity ? "  —  " + lockedRarity + " only" : "  —  tap to select"}</div>
            <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }} onClick={(e) => { e.stopPropagation(); setGiveView("category"); }}>DONE</button>
          </div>
          {(CARDS[giveCategory] || []).map((item) => {
            const cardName = getCardName(item);
            const cardRarity = getRarityByName(cardName);
            const isSelected = giveCards.includes(cardName);
            const isDisabled = !isSelected && (
              cardName === "Coming Soon" ||
              (lockedRarity && cardRarity !== lockedRarity) ||
              giveCards.length >= 3
            );
            return (
              <div
                key={cardName}
                style={{
                  ...s.card,
                  ...(hovered === cardName && !isDisabled ? s.cardHover : {}),
                  ...(isSelected ? { borderColor: "#3fb950", background: "#0f2318" } : {}),
                  ...(isDisabled ? { opacity: 0.35, cursor: "not-allowed" } : {}),
                }}
                onMouseEnter={() => !isDisabled && setHovered(cardName)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => { e.stopPropagation(); if (!isDisabled) toggleCard(item); }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{cardName}</span>
                    {item.rarity && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, marginLeft: 8,
                        color: { Colourful: "#ff4500", Golden: "#f0883e", Blue: "#58a6ff", Grey: "#8b949e" }[item.rarity],
                      }}>{item.rarity}</span>
                    )}
                  </div>
                  <span style={{ fontSize: 18, color: isSelected ? "#3fb950" : "#8b949e" }}>
                    {isSelected ? "✓" : "›"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── ExchangeScreen ───────────────────────────────────────────────────────────
const ExchangeScreen = ({
  exStep, setExStep,
  giveCards, setGiveCards,
  giveView, setGiveView,
  giveCategory, setGiveCategory,
  wantCategory, setWantCategory,
  wantCard, setWantCard,
  wantSubStep, setWantSubStep,
  exCode, setExCode,
  exDone,
  resetExchange, handleExSubmit,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const progressPct = exStep === 1 ? 33 : exStep === 2 ? 66 : 100;
  const lockedRarity = giveCards.length > 0 ? getRarityByName(giveCards[0]) : null;

  if (exDone) return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Listing Submitted!</div>
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "left" }}>
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 10, textTransform: "uppercase" }}>Summary</div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "#8b949e" }}>Giving</span>
          <div style={{ marginTop: 4 }}>
            {giveCards.map((c, i) => (
              <div key={i} style={{ fontSize: 13, fontWeight: 700, color: "#3fb950" }}>{c}</div>
            ))}
          </div>
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
      <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 16 }}>⏳ Listing expires in 3 days</div>
      <button style={s.btn(false)} onClick={resetExchange}>Submit Another</button>
    </div>
  );

  return (
    <div>
      <div style={s.progressBar}><div style={s.progressFill(progressPct)} /></div>

      {exStep === 1 && (
        <GiveCardStep
          giveCards={giveCards}
          setGiveCards={setGiveCards}
          giveView={giveView}
          setGiveView={setGiveView}
          giveCategory={giveCategory}
          setGiveCategory={setGiveCategory}
          onProceed={() => { setExStep(2); setWantSubStep(1); }}
        />
      )}

      {exStep === 2 && (
        <>
          <div style={s.stepLabel}>Step 2 of 3</div>
          <div style={s.stepTitle}>Want Card <span style={{ fontSize: 12, color: "#8b949e", fontWeight: 400 }}>— which card do you need?</span></div>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: "#8b949e" }}>Giving</span>
            {giveCards.map((c, i) => (
              <div key={i} style={{ fontSize: 12, fontWeight: 700, color: "#3fb950", marginTop: 2 }}>{c}</div>
            ))}
          </div>
          {wantSubStep === 1 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }} onClick={() => { setExStep(1); setGiveView("category"); }}>BACK</button>
                <div style={s.sectionTitle}>Select Category</div>
                <button style={{ background: "transparent", border: `1px solid ${wantCard ? "#ffffff" : "#555"}`, color: wantCard ? "#fff" : "#555", fontSize: 14, fontWeight: 800, cursor: wantCard ? "pointer" : "not-allowed", padding: "6px 14px", borderRadius: 8 }} onClick={() => { if (wantCard) setExStep(3);}}disabled={!wantCard}>NEXT</button>
              </div>
              <CardList items={CATEGORIES} onSelect={cat => { setWantCategory(cat); setWantSubStep(2); }} hovered={hovered} setHovered={setHovered} />
            </>
          )}
          {wantSubStep === 2 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }} onClick={() => setWantSubStep(1)}>BACK</button>
                <div style={s.sectionTitle}>Select Card — <span style={{ color: "#58a6ff" }}>{wantCategory}</span></div>
                <div />
              </div>
              <CardList
                items={(CARDS[wantCategory] || []).filter(c => !lockedRarity || c.rarity === lockedRarity).filter(c => !giveCards.includes(getCardName(c)))}
  onSelect={card => { setWantCard(getCardName(card)); setExStep(3); }}
  hovered={hovered} setHovered={setHovered}
/>
            </>
          )}
        </>
      )}

      {exStep === 3 && (
        <>
          <div style={s.stepLabel}>Step 3 of 3</div>
<div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
  <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }} onClick={() => { setExStep(2); setWantSubStep(2); }}>BACK</button>
  <div style={{ ...s.stepTitle, marginBottom: 0, flex: 1, textAlign: "center", paddingRight: 60 }}>Enter Exchange Code</div>
</div>
          <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", }}>
              <span style={{ fontSize: 11, color: "#8b949e" }}>Giving</span>
              {giveCards.map((c, i) => (
                <div key={i} style={{ fontSize: 13, fontWeight: 700, color: "#3fb950", marginTop: 1 }}>{c}</div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: "#8b949e" }}>Wanting</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#58a6ff" }}>{wantCard}</span>
            </div>
          </div>
          <input style={{ ...s.input, letterSpacing: 2 }} placeholder="Enter exchange code" maxLength={10}
            inputMode="numeric" autoComplete="off" autoFocus
            value={exCode} onChange={e => setExCode(e.target.value.replace(/\D/g, ""))} />
          <div style={{ fontSize: 11, color: "#8b949e", marginTop: 8 }}>Numbers only • Max 10 digits • Required</div>
          <button style={s.btn(exCode.length < 7)} onClick={handleExSubmit}>Submit Listing</button>
        </>
      )}
    </div>
  );
};

// ─── FindScreen ───────────────────────────────────────────────────────────────
const FindScreen = ({
  defaultMode = null,
  findMode, setFindMode,
  findStep, setFindStep,
  findCategory, setFindCategory,
  findCard, setFindCard,
  findResult, setFindResult,
  findLoading, setFindLoading,
  donateStep, setDonateStep,
  donorUsername, setDonorUsername,
  donateCard, setDonateCard,
  donateQuantity, setDonateQuantity,
  donateListedCount,
  donateLoading,
  claimStep, setClaimStep,
  claimCode, setClaimCode,
  claimListingId, setClaimListingId,
  claimLoading,
  resetFind,
  handleDonateList,
  handleClaimDonation,
  handleFindCardSelect,
  handleMarkDone,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const groupedDonations = (findResult && findResult.donations) ? Object.values(
    (findResult.donations || []).reduce((acc, d) => {
      const key = d.donor_username || "unknown";
      if (!acc[key]) acc[key] = { donor_username: key, ids: [], count: 0 };
      acc[key].ids.push(d.id);
      acc[key].count += 1;
      return acc;
    }, {})
  ) : [];

  
      {false && (
      <div style={{ ...s.findModeCard, ...(hovered === "have" ? { borderColor: "#58a6ff", background: "#1c2128" } : {}) }}
        onMouseEnter={() => setHovered("have")} onMouseLeave={() => setHovered(null)}
        onClick={() => { setFindMode("have"); setFindStep(1); navigate("/donate"); }}>
        <div style={s.findModeIcon("rgba(88,166,255,0.15)")}>💎</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Donate Cards</div>
          <div style={{ fontSize: 12, color: "#8b949e", marginTop: 3 }}>Find players looking for your card</div>
        </div>
        <span style={{ color: "#8b949e", fontSize: 18, marginLeft: "auto" }}>›</span>
      </div>
    )}

  if (donateStep === "username") return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }}
          onClick={() => setDonateStep("idle")}>BACK</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>List as Donation</div>
        <div style={{ width: 74 }} />
      </div>
      <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 16 }}>Card: <span style={{ color: "#58a6ff", fontWeight: 600 }}>{donateCard}</span></div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: "#8b949e", textAlign: "center", marginBottom: 10 }}>How many copies do you want to donate?</div>
        <select
          style={{ ...s.input, padding: "12px 10px", textAlign: "center" }}
          value={donateQuantity}
          onChange={e => setDonateQuantity(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(q => (
            <option key={q} value={q}>{q} card{q > 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>
      <div style={{ fontSize: 13, color: "#e6e6e6", marginBottom: 12 }}>Enter your Reddit Username or a Custom Username of your choice below :</div>
      <input style={s.input} placeholder="Enter your Reddit Username / Custom Username here."
        value={donorUsername} onChange={e => setDonorUsername(sanitizeUsername(e.target.value))} />
      <div style={{ fontSize: 11, color: "#8b949e", marginTop: 8 }}>NOTE : This will be your permanent login Username. Please save it somewhere.</div>
      <button type="button" style={s.btn(donateLoading || !isValidUsername(donorUsername))} onClick={handleDonateList}>
        {donateLoading ? "Listing..." : `List ${donateQuantity} card${donateQuantity > 1 ? "s" : ""}`}
      </button>
    </div>
  );

  if (donateStep === "done") return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎁</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Card Listed!</div>
      <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 16 }}>
        <span style={{ color: "#58a6ff", fontWeight: 600 }}>{donateCard}</span> {donateListedCount > 1 ? `(${donateListedCount} copies) are` : "is"} now listed as available for donation.
      </div>
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 14, marginBottom: 16, textAlign: "left" }}>
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 6 }}>To check if someone needs your card:</div>
        <div style={{ fontSize: 12, color: "#e6e6e6" }}>Go to <span style={{ color: "#ff4500", fontWeight: 600 }}>Home → Check My Donations</span> and enter your Reddit Username.</div>
      </div>
      <button style={s.btn(false)} onClick={resetFind}>Done</button>
    </div>
  );

  if (claimStep === "input") return (
    <div>
      <button style={s.backBtn} onClick={() => setClaimStep("idle")}>‹ Back</button>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Claim Donation</div>
      <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 16 }}>Card: <span style={{ color: "#58a6ff", fontWeight: 600 }}>{findCard}</span></div>
      <div style={{ fontSize: 13, color: "#e6e6e6", marginBottom: 12 }}>Enter your exchange code — the donor will see this and complete the trade in BGMI soon :</div>
      <input style={{ ...s.input, letterSpacing: 2 }} placeholder="Enter exchange code" maxLength={10}
        inputMode="numeric" autoComplete="off" autoFocus
        value={claimCode} onChange={e => setClaimCode(e.target.value.replace(/\D/g, ""))} />
      <button style={s.btn(claimCode.length < 7 || claimLoading)} onClick={handleClaimDonation}>
        {claimLoading ? "Submitting..." : "Submit Code"}
      </button>
    </div>
  );

  if (claimStep === "done") return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Code Submitted!</div>
      <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 16 }}>The donor will see your code and complete the trade in BGMI soon.</div>
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 14, marginBottom: 16, textAlign: "left" }}>
        <div style={{ fontSize: 11, color: "#8b949e" }}>Your exchange code</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: 3, marginTop: 4 }}>{claimCode}</div>
      </div>
      <button style={s.btn(false)} onClick={resetFind}>Done</button>
    </div>
  );

  const findStepContent = (
    <>
      {findLoading && <div style={{ textAlign: "center", color: "#8b949e", padding: 20 }}>Searching...</div>}
      {!findLoading && findResult && findMode === "need" && (
        findResult.available ? (
          <div style={s.resultBox(true)}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
            {findResult.listings.length > 0 && (
              <>
                <div style={s.sectionDivider}>Exchange Listings ({findResult.listings.length})</div>
                {findResult.listings.map((item, i) => (
                  <div key={i} style={s.listingCard}>
                    <div style={{ fontSize: 11, color: "#8b949e" }}>Offering: <span style={{ color: "#3fb950", fontWeight: 700 }}>{item.give_card}</span></div>
                    <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>Wants: <span style={{ color: "#58a6ff", fontWeight: 700 }}>{item.want_card}</span></div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: 3, marginTop: 8 }}>{item.code}</div>
                    <div style={{ fontSize: 11, color: "#8b949e", marginTop: 10 }}>If this code has already been used, mark it so other searchers won't see it again.</div>
                    <button type="button" style={{ ...s.btnSecondary, marginTop: 10, padding: "9px", fontSize: 13 }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleMarkDone(item.id);
                        setFindResult(prev => prev ? { ...prev, listings: (prev.listings || []).filter(listing => listing.id !== item.id) } : prev);
                      }}>
                      Mark as used / Remove listing
                    </button>
                  </div>
                ))}
              </>
            )}
            {findResult.donations.length > 0 && (
              <>
                <div style={s.sectionDivider}>🎁 Free Donations ({findResult.donations.length})</div>
                {groupedDonations.map((g, i) => (
                  <div key={i} style={s.donationCard}>
                    <div style={{ fontSize: 11, color: "#8b949e" }}>Donor: <span style={{ color: "#58a6ff", fontWeight: 700 }}>{g.donor_username}</span> <span style={{ color: "#8b949e", marginLeft: 8 }}>({g.count}x)</span></div>
                    <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>Enter your exchange code & get this card !</div>
                    <button type="button" style={{ ...s.btnSecondary, marginTop: 10, padding: "9px", fontSize: 13 }}
                      onClick={() => { setClaimListingId(g.ids[0]); setClaimStep("input"); }}>
                      Claim this card — Enter your Exchange Code
                    </button>
                  </div>
                ))}
              </>
            )}
            <a href="https://reddit.com/r/BGMIcards" style={{ fontSize: 13, color: "#58a6ff", textDecoration: "none", display: "block", marginTop: 12 }}>→ Go to r/BGMIcards</a>
          </div>
        ) : (
          <div style={s.resultBox(false)}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>😔</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#8b949e" }}>Not Available</div>
            <div style={{ fontSize: 12, color: "#8b949e", marginTop: 8 }}>No one is currently offering this card</div>
          </div>
        )
      )}
      {!findLoading && findResult && findMode === "have" && (
        findResult.searching ? (
          <div style={s.resultBox(true)}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3fb950", marginBottom: 8 }}>{findResult.listings.length} player{findResult.listings.length > 1 ? "s need" : " needs"} this!</div>
            <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 14 }}>Give them your card and use their exchange code</div>
            {findResult.listings.map((item, i) => (
              <div key={i} style={s.listingCard}>
                <div style={{ fontSize: 11, color: "#8b949e" }}>They are offering: <span style={{ color: "#ff4500", fontWeight: 700 }}>{item.give_card}</span></div>
                <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>They want: <span style={{ color: "#58a6ff", fontWeight: 700 }}>{item.want_card}</span></div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: 3, marginTop: 8 }}>{item.code}</div>
                <div style={{ marginTop: 10 }}>
                  <button type="button" style={{ ...s.btnSecondary, padding: "8px", fontSize: 13, marginRight: 8 }}
                    onClick={(e) => { e.preventDefault(); handleMarkDone(item.id); setFindResult(prev => prev ? { ...prev, listings: (prev.listings || []).filter(listing => listing.id !== item.id) } : prev); }}>
                    Mark as used
                  </button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <button type="button" style={s.btnSecondary} onClick={(e) => { e.preventDefault(); setDonateCard(findResult.cardToList || findCard); setDonateStep("username"); }}>
                🎁 List as Donation
              </button>
            </div>
            <a href="https://reddit.com/r/BGMIcards" style={{ fontSize: 13, color: "#58a6ff", textDecoration: "none" }}>→ Go to r/BGMIcards to connect</a>
          </div>
        ) : (
          <div style={s.resultBox(false)}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🤷</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#8b949e", marginBottom: 8 }}>No one needs this card right now</div>
            <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 16 }}>But you can list it as a donation — someone may need it later!</div>
            <button type="button" style={s.btnSecondary} onClick={(e) => { e.preventDefault(); setDonateCard(findResult.cardToList || findCard); setDonateStep("username"); }}>
              🎁 List as Donation
            </button>
          </div>
        )
      )}
    </>
  );

  return (
    <>
      {findStep === 1 && (
  <>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }}
        onClick={() => { resetFind(); navigate("/home"); }}>BACK</button>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Select Category</div>
      <button style={{ background: "transparent", border: `1px solid ${findCategory ? "#ffffff" : "#555"}`, color: findCategory ? "#fff" : "#555", fontSize: 14, fontWeight: 800, cursor: findCategory ? "pointer" : "not-allowed", padding: "6px 14px", borderRadius: 8 }}
        onClick={() => { if (findCategory) setFindStep(2); }} disabled={!findCategory}>NEXT</button>
    </div>
    <CardList items={CATEGORIES} onSelect={cat => { setFindCategory(cat); setFindStep(2); }} hovered={hovered} setHovered={setHovered} />
  </>
)}
      {findStep === 2 && (
  <>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }}
        onClick={() => setFindStep(1)}>BACK</button>
      <div style={s.stepLabel}>Step 2 of 2</div>
      <div style={{ width: 74 }} />
    </div>
    <div style={s.stepTitle}>Select Card — <span style={{ color: "#ff4500" }}>{findCategory}</span></div>
    <CardList items={CARDS[findCategory] || []} onSelect={card => handleFindCardSelect(card, findMode)} hovered={hovered} setHovered={setHovered} />
  </>
)}
      {findStep === 3 && (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }}
        onClick={() => setFindStep(2)}>BACK</button>
      <div style={{ flex: 1, textAlign: "center", fontSize: 13, color: "#8b949e" }}>
    Result for <span style={{ color: "#ff4500", fontWeight: 800 }}>{findCard}</span></div>
    <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }}
    onClick={() => { resetFind(); navigate("/find"); }}>HOME</button>
    </div>
    {findStepContent}
  </>
)}
    </>
  );
};

// ─── RulesPage ────────────────────────────────────────────────────────────────
const RulesPage = () => (
  <div>
    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 4 }}>📋 Trade <span style={{ color: "#ff4500" }}>Rules</span></div>
    <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 20 }}>r/BGMIcards community guidelines</div>

    {[
      { title: "1. Use the Portal, Not the Subreddit", desc: "Do not post card requests in subreddit comments or posts. Use the portal exclusively for all trade-related activity." },
      { title: "2. Stick to Your Username", desc: "Always use the same username when listing donations. Changing your username will result in losing access to your donation history and pending claims." },
      { title: "3. Keep it Organised", desc: "After completing a trade, try to mark your listing as done within 24 hours. Outdated listings clutter the portal and waste other users' time on used codes." },
      { title: "4. Don't Mark Others' Listings as Used", desc: "Only mark a listing as 'used' if you personally completed that trade. Falsely marking active listings removes valid offers for other users and may result in a ban." },
      { title: "5. Found a Bug? Let Us Know", desc: <span>If you encounter any issue or unexpected behavior on the portal, DM <a href="https://www.reddit.com/message/compose/?to=AryanV4" style={{ color: "#58a6ff", textDecoration: "none" }}>u/AryanV4</a> on Reddit. Direct messages ensure faster resolution.</span> },
    ].map((rule, i) => (
      <div key={i} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 16, marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{rule.title}</div>
        <div style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.6 }}>{rule.desc}</div>
      </div>
    ))}
  </div>
);

// ─── StockScreen ──────────────────────────────────────────────────────────────
const StockScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(null);

  const fetchStock = async (category) => {
    setSelectedCategory(category); setLoading(true);
    const cutoff = getCutoff();
    const counts = {};
    for (const card of (CARDS[category] || [])) {
      const cardName = getCardName(card);
      const { count } = await supabase.from("listings").select("*", { count: "exact", head: true })
        .ilike("give_card", `%${cardName}%`).eq("status", "available").gte("created_at", cutoff);
      counts[cardName] = count || 0;
    }
    setStockData(counts); setLoading(false);
  };

  const cs = {
    card: { background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "16px", marginBottom: 10, cursor: "pointer" },
    backBtn: { background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8, marginBottom: 16 },
  };

  if (!selectedCategory) return (
      <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }}
          onClick={() => window.history.back()}>BACK</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Stock</div>
        <div style={{ width: 74 }} />
      </div>
      {CATEGORIES.map(cat => (
        <div key={cat} style={{ ...cs.card, ...(hovered === cat ? { background: "#1c2128", borderColor: "#ff4500" } : {}) }}
          onMouseEnter={() => setHovered(cat)} onMouseLeave={() => setHovered(null)}
          onClick={() => fetchStock(cat)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {cat}
              {NEW_CATEGORIES.includes(cat) && (
                <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 800, color: "#fff", background: "#ff4500", borderRadius: 4, padding: "2px 6px" }}>NEW</span>
              )}
            </span>
            <span style={{ color: "#8b949e", fontSize: 18 }}>›</span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }}
          onClick={() => { setSelectedCategory(null); setStockData({}); }}>BACK</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{selectedCategory}</div>
        <div style={{ width: 74 }} />
      </div>
      <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 20 }}>Available listings (last 3 days)</div>
      {loading ? (
        <div style={{ textAlign: "center", color: "#8b949e", padding: 20 }}>Loading...</div>
      ) : (
        (CARDS[selectedCategory] || []).map(card => {
          const cardName = getCardName(card);
          return (
            <div key={cardName} style={{ ...cs.card, cursor: "default" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{cardName}</span>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: stockData[cardName] > 0 ? "#3fb950" : "#8b949e",
                  background: stockData[cardName] > 0 ? "rgba(35,134,54,0.15)" : "rgba(139,148,158,0.1)",
                  border: `1px solid ${stockData[cardName] > 0 ? "#238636" : "#30363d"}`,
                  padding: "3px 10px", borderRadius: 20
                }}>
                  {stockData[cardName] !== undefined ? `${stockData[cardName]}x` : "..."}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// ─── CheckDonationsPage ───────────────────────────────────────────────────────
const CheckDonationsPage = () => {
  const [checkUsername, setCheckUsername] = useState("");
  const [checkResults, setCheckResults] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [adjustLoading, setAdjustLoading] = useState(null); // card name jo adjust ho raha hai

  const handleCheckDonations = async () => {
    if (!isValidUsername(checkUsername)) return alert('Enter a valid username (3-20 chars: letters, numbers, _ or -)');
    setCheckLoading(true);
    const { data } = await supabase.from("listings").select("*")
      .eq("donor_username", normalizeUsername(checkUsername)).eq("type", "donation").eq("status", "available");
    const grouped = Object.values(
      (data || []).reduce((acc, item) => {
        const key = item.give_card;
        if (!acc[key]) acc[key] = { ...item, quantity: 0, ids: [] };
        acc[key].quantity += 1;
        acc[key].ids.push(item.id); // saare ids store karo
        if (item.claim_code) {
      acc[key].claim_code = item.claim_code;
      acc[key].id = item.id; // Mark as Done sahi row pe chale
    }
        return acc;
      }, {})
    );
    setCheckResults(grouped.sort((a, b) => {
  if (a.claim_code && !b.claim_code) return -1;
  if (!a.claim_code && b.claim_code) return 1;
  return 0;
}));
    setCheckLoading(false);
  };

  const handleMarkDone = async (id) => {
    await supabase.from("listings").update({ status: "done" }).eq("id", id);
    setCheckResults(prev => prev ? prev.map(item => item.id === id ? { ...item, status: "done", claim_code: null } : item) : prev);
  };

  const handleIncrease = async (item) => {
    if (item.quantity >= 5) return;
    setAdjustLoading(item.give_card);
    const { error } = await supabase.from("listings").insert([{
      give_card: item.give_card, want_card: null,
      code: null, status: "available",
      type: "donation", donor_username: normalizeUsername(checkUsername),
    }]);
    if (!error) {
      setCheckResults(prev => prev.map(r =>
        r.give_card === item.give_card ? { ...r, quantity: r.quantity + 1 } : r
      ));
    }
    setAdjustLoading(null);
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 0) return;
    setAdjustLoading(item.give_card);
    const idToRemove = item.ids[item.ids.length - 1]; // last id remove karo
    if (item.quantity === 1) {
      // 0 pe aa gaya — saari rows mark as done
      await supabase.from("listings").update({ status: "done" })
        .eq("give_card", item.give_card)
        .eq("donor_username", normalizeUsername(checkUsername))
        .eq("type", "donation")
        .eq("status", "available");
      setCheckResults(prev => prev.filter(r => r.give_card !== item.give_card));
    } else {
      await supabase.from("listings").update({ status: "done" }).eq("id", idToRemove);
      setCheckResults(prev => prev.map(r =>
        r.give_card === item.give_card
          ? { ...r, quantity: r.quantity - 1, ids: r.ids.slice(0, -1) }
          : r
      ));
    }
    setAdjustLoading(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <button style={{ background: "transparent", border: "1px solid #ffffff", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", padding: "6px 14px", borderRadius: 8 }}
          onClick={() => window.history.back()}>BACK</button>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>📋 My Donations</div>
        <div style={{ width: 74 }} />
      </div>
      <div style={{ fontSize: 12, color: "#8b949e", marginBottom: 20 }}>See if someone need your donated card</div>
      <input style={{ ...s.input, fontSize: 13, padding: "10px 14px" }} placeholder="Enter your Reddit Username / Custom Username here."
        value={checkUsername} onChange={e => setCheckUsername(sanitizeUsername(e.target.value))} />
      <button style={{ ...s.btn(checkLoading || !checkUsername.trim()), marginTop: 10, padding: "11px" }}
        onClick={handleCheckDonations}>
        {checkLoading ? "Checking..." : "Check"}
      </button>
      {checkResults !== null && (
        <div style={{ marginTop: 12 }}>
          {checkResults.length === 0 ? (
            <div style={{ fontSize: 12, color: "#8b949e", textAlign: "center" }}>No donations found for this username</div>
          ) : (
            checkResults.map((item, i) => (
              <div key={i} style={{ ...s.listingCard, marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{item.give_card}</div>
                  {/* Quantity adjuster */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      onClick={() => handleDecrease(item)}
                      disabled={adjustLoading === item.give_card}
                      style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #ff4500", background: "transparent", color: "#ff4500", fontSize: 18, fontWeight: 800, cursor: "pointer", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      −
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", minWidth: 20, textAlign: "center" }}>
                      {adjustLoading === item.give_card ? "..." : item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item)}
                      disabled={adjustLoading === item.give_card || item.quantity >= 5}
                      style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${item.quantity >= 5 ? "#555" : "#3fb950"}`, background: "transparent", color: item.quantity >= 5 ? "#555" : "#3fb950", fontSize: 18, fontWeight: 800, cursor: item.quantity >= 5 ? "not-allowed" : "pointer", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      +
                    </button>
                  </div>
                </div>
                {item.claim_code ? (
                  <>
                    <div style={{ fontSize: 11, color: "#3fb950" }}>✅ Someone needs this card!</div>
                    <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>Their exchange code:</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 3, marginTop: 4 }}>{item.claim_code}</div>
                    <div style={{ fontSize: 11, color: "#8b949e", marginTop: 6 }}>Enter this code in BGMI to complete the trade</div>
                    {item.status !== "done" ? (
                      <button type="button" style={{ width: "100%", padding: "8px", background: "transparent", color: "#3fb950", border: "1px solid #3fb950", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", marginTop: 10 }}
                        onClick={(e) => { e.preventDefault(); handleMarkDone(item.id); }}>
                        ✅ Mark as Done
                      </button>
                    ) : (
                      <div style={{ fontSize: 11, color: "#3fb950", marginTop: 8, opacity: 0.6 }}>✅ Trade Completed</div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: 11, color: "#8b949e" }}>⏳ Nobody needs this card yet</div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main App (with Router) ───────────────────────────────────────────────────
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Exchange state
  const [exStep, setExStep] = useState(1);
  const [giveCards, setGiveCards] = useState([]);
  const [giveView, setGiveView] = useState("category");
  const [giveCategory, setGiveCategory] = useState(null);
  const [wantCategory, setWantCategory] = useState(null);
  const [wantCard, setWantCard] = useState(null);
  const [wantSubStep, setWantSubStep] = useState(1);
  const [exCode, setExCode] = useState("");
  const [exDone, setExDone] = useState(false);

  // Find state
  const [findMode, setFindMode] = useState(null);
  const [findModeForFind, setFindModeForFind] = useState("need");
  const [findModeForDonate, setFindModeForDonate] = useState("have");
  const [findStep, setFindStep] = useState(1);
  const [findCategory, setFindCategory] = useState(null);
  const [findCard, setFindCard] = useState(null);
  const [findResult, setFindResult] = useState(null);
  const [findLoading, setFindLoading] = useState(false);

  // Donation listing state
  const [donateStep, setDonateStep] = useState("idle");
  const [donorUsername, setDonorUsername] = useState("");
  const [donateCard, setDonateCard] = useState(null);
  const [donateQuantity, setDonateQuantity] = useState(1);
  const [donateListedCount, setDonateListedCount] = useState(0);
  const [donateLoading, setDonateLoading] = useState(false);

  // Claim code state
  const [claimStep, setClaimStep] = useState("idle");
  const [claimCode, setClaimCode] = useState("");
  const [claimListingId, setClaimListingId] = useState(null);
  const [claimLoading, setClaimLoading] = useState(false);

  // Home check donations state
  const [checkUsername, setCheckUsername] = useState("");
  const [checkResults, setCheckResults] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);

  const resetExchange = () => {
    setExStep(1); setGiveCards([]); setGiveView("category"); setGiveCategory(null);
    setWantCategory(null); setWantCard(null); setWantSubStep(1);
    setExCode(""); setExDone(false);
  };

  const resetFind = () => {
    setFindMode(null); setFindStep(1);
    setFindCategory(null); setFindCard(null);
    setFindResult(null); setFindLoading(false);
    setDonateStep("idle"); setDonorUsername(""); setDonateCard(null); setDonateQuantity(1); setDonateListedCount(0);
    setClaimStep("idle"); setClaimCode(""); setClaimListingId(null);
  };

  const handleExSubmit = async () => {
    if (exCode.length < 7) return;
    const { error } = await supabase.from("listings").insert([{
      give_card: giveCards.join(" | "), want_card: wantCard,
      code: exCode, status: "available", type: "exchange",
    }]);
    if (!error) setExDone(true);
    else alert("Error saving listing. Try again.");
  };

  const handleFindCardSelect = async (card, mode) => {
    const cardName = getCardName(card);
    setFindCard(cardName); setFindStep(3);
    setFindLoading(true); setFindResult(null);
    const cutoff = getCutoff();
    if (mode === "need") {
      const { data: exchangeData } = await supabase.from("listings").select("*")
        .ilike("give_card", `%${cardName}%`).eq("status", "available").eq("type", "exchange").gte("created_at", cutoff);
      const { data: donationData } = await supabase.from("listings").select("*")
  .ilike("give_card", `%${cardName}%`).eq("status", "available").eq("type", "donation")
  .is("claim_code", null);
      setFindResult({
        available: (exchangeData && exchangeData.length > 0) || (donationData && donationData.length > 0),
        listings: exchangeData || [],
        donations: donationData || [],
      });
    } else {
      const { data } = await supabase.from("listings").select("*")
        .eq("want_card", cardName).eq("status", "available").eq("type", "exchange").gte("created_at", cutoff);
      if (data && data.length > 0) {
        setFindResult({ searching: true, listings: data, cardToList: cardName });
      } else {
        setFindResult({ searching: false, cardToList: cardName });
      }
    }
    setFindLoading(false);
  };

  const handleDonateList = async () => {
    if (!isValidUsername(donorUsername)) return alert('Invalid username. Use 3-20 characters: letters, numbers, _ or -');
    if (!donateCard) return alert('No card selected');
    setDonateLoading(true);
    try {
      const rows = Array.from({ length: donateQuantity }, () => ({
        give_card: donateCard, want_card: null,
        code: null, status: "available",
        type: "donation", donor_username: normalizeUsername(donorUsername),
      }));
      const { error } = await supabase.from("listings").insert(rows);
      setDonateLoading(false);
      if (!error) {
        setDonateListedCount(donateQuantity);
        setDonateStep("done");
      } else {
        alert("Error listing donation. Try again.");
      }
    } catch (err) {
      setDonateLoading(false);
      alert('Unexpected error while listing donation');
    }
  };

  const handleClaimDonation = async () => {
    if (claimCode.length < 7) return;
    setClaimLoading(true);
    const { error } = await supabase.from("listings")
      .update({ claim_code: claimCode })
      .eq("id", claimListingId);
    setClaimLoading(false);
    if (!error) setClaimStep("done");
    else alert("Error. Try again.");
  };

  const handleMarkDone = async (id) => {
    await supabase.from("listings").update({ status: "done" }).eq("id", id);
    setCheckResults(prev => prev ? prev.map(item => item.id === id ? { ...item, status: "done" } : item) : prev);
  };

  const handleCheckDonations = async () => {
    if (!isValidUsername(checkUsername)) return alert('Enter a valid username (3-20 chars: letters, numbers, _ or -)');
    setCheckLoading(true);
    const { data } = await supabase.from("listings").select("*")
      .eq("donor_username", normalizeUsername(checkUsername)).eq("type", "donation").eq("status", "available");
    const grouped = Object.values(
      (data || []).reduce((acc, item) => {
        const key = item.give_card + "_" + (item.claim_code || "none");
        if (!acc[key]) acc[key] = { ...item, quantity: 0 };
        acc[key].quantity += 1;
        return acc;
      }, {})
    );
    setCheckResults(grouped);
    setCheckLoading(false);
  };

  const path = location.pathname;
  const getNavActive = (id) => {
    if (id === "home") return path === "/" || path === "/check";
    if (id === "trade") return path === "/exchange" || path === "/find" || path === "/donate" || path === "/check";
    if (id === "stock") return path === "/stock";
    return false;
  };

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <div style={s.header}>
        <div style={{ ...s.logo, cursor: "pointer" }} onClick={() => navigate("/home")}>🃏</div>
        <div>
          <div style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>BGMIcards <span style={{ color: "#ff4500" }}>Portal</span></div>
            <div style={{ fontSize: 11, color: "#8b949e", marginTop: 1 }}>r/BGMIcards • Card Exchange</div>
          </div>
        </div>
      </div>

      <div style={s.content}>
        
        <Routes>
          <Route path="/home" element={
            <HomeScreen
              checkUsername={checkUsername}
              setCheckUsername={setCheckUsername}
              checkLoading={checkLoading}
              checkResults={checkResults}
              handleCheckDonations={handleCheckDonations}
              handleMarkDone={handleMarkDone}
            />
          } />
          <Route path="/check" element={<CheckDonationsPage />} />
          
          <Route path="/exchange" element={
            <ExchangeScreen
              exStep={exStep} setExStep={setExStep}
              giveCards={giveCards} setGiveCards={setGiveCards}
              giveView={giveView} setGiveView={setGiveView}
              giveCategory={giveCategory} setGiveCategory={setGiveCategory}
              wantCategory={wantCategory} setWantCategory={setWantCategory}
              wantCard={wantCard} setWantCard={setWantCard}
              wantSubStep={wantSubStep} setWantSubStep={setWantSubStep}
              exCode={exCode} setExCode={setExCode}
              exDone={exDone}
              resetExchange={resetExchange}
              handleExSubmit={handleExSubmit}
            />
          } />
          <Route path="/find" element={
            <FindScreen
              defaultMode="need"
              findMode={findModeForFind} setFindMode={setFindModeForFind}
              findStep={findStep} setFindStep={setFindStep}
              findCategory={findCategory} setFindCategory={setFindCategory}
              findCard={findCard} setFindCard={setFindCard}
              findResult={findResult} setFindResult={setFindResult}
              findLoading={findLoading} setFindLoading={setFindLoading}
              donateStep={donateStep} setDonateStep={setDonateStep}
              donorUsername={donorUsername} setDonorUsername={setDonorUsername}
              donateCard={donateCard} setDonateCard={setDonateCard}
              donateQuantity={donateQuantity} setDonateQuantity={setDonateQuantity}
              donateListedCount={donateListedCount}
              donateLoading={donateLoading}
              claimStep={claimStep} setClaimStep={setClaimStep}
              claimCode={claimCode} setClaimCode={setClaimCode}
              claimListingId={claimListingId} setClaimListingId={setClaimListingId}
              claimLoading={claimLoading}
              resetFind={resetFind}
              handleDonateList={handleDonateList}
              handleClaimDonation={handleClaimDonation}
              handleFindCardSelect={handleFindCardSelect}
              handleMarkDone={handleMarkDone}
            />
          } />
          <Route path="/donate" element={
            <FindScreen
              defaultMode="have"
              findMode={findModeForDonate} setFindMode={setFindModeForDonate}
              findStep={findStep} setFindStep={setFindStep}
              findCategory={findCategory} setFindCategory={setFindCategory}
              findCard={findCard} setFindCard={setFindCard}
              findResult={findResult} setFindResult={setFindResult}
              findLoading={findLoading} setFindLoading={setFindLoading}
              donateStep={donateStep} setDonateStep={setDonateStep}
              donorUsername={donorUsername} setDonorUsername={setDonorUsername}
              donateCard={donateCard} setDonateCard={setDonateCard}
              donateQuantity={donateQuantity} setDonateQuantity={setDonateQuantity}
              donateListedCount={donateListedCount}
              donateLoading={donateLoading}
              claimStep={claimStep} setClaimStep={setClaimStep}
              claimCode={claimCode} setClaimCode={setClaimCode}
              claimListingId={claimListingId} setClaimListingId={setClaimListingId}
              claimLoading={claimLoading}
              resetFind={resetFind}
              handleDonateList={handleDonateList}
              handleClaimDonation={handleClaimDonation}
              handleFindCardSelect={handleFindCardSelect}
              handleMarkDone={handleMarkDone}
            />
          } />
          <Route path="/stock" element={<StockScreen />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>

      <div style={s.bottomNav}>
        {[
          { id: "home", icon: "🏠", label: "Home", path: "/home" },
          { id: "trade", icon: "⇅", label: "Trade", path: "/exchange" },
          { id: "stock", icon: "📦", label: "Stock", path: "/stock" },
        ].map(({ id, icon, label, path: navPath }) => (
          <button key={id} style={s.navItem(getNavActive(id))} onClick={() => navigate(navPath)}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

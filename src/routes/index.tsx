import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Camera,
  Heart,
  Mail,
  Mic,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import annoyedPuppy from "@/assets/puppy-annoyed.png";
import happyPuppy from "@/assets/puppy-hearts.png";
import lilyPuppy from "@/assets/puppy-lilies.png";
import partyPuppy from "@/assets/puppy-party.png";

import cameraIcon from "@/assets/icon-camera.png";
import letterIcon from "@/assets/icon-letter.png";
import cassetteIcon from "@/assets/icon-cassette.png";

import childhoodPhoto from "@/assets/ellsamme-childhood.jpg";

import memory1 from "@/assets/memories/memory-1.jpg";
import memory2 from "@/assets/memories/memory-2.jpg";
import memory3 from "@/assets/memories/memory-3.jpg";
import memory4 from "@/assets/memories/memory-4.jpg";
import memory5 from "@/assets/memories/memory-5.jpg";
import memory6 from "@/assets/memories/memory-6.jpg";
import memory7 from "@/assets/memories/memory-7.jpg";
import memory8 from "@/assets/memories/memory-8.jpg";
import memory9 from "@/assets/memories/memory-9.jpg";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { unlockBirthday } from "@/lib/birthday-gate.functions";

type Scene = "question" | "no" | "good" | "camera" | "items" | "memories" | "letter" | "music";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "For Ellsamme — A Birthday Surprise" },
      { name: "description", content: "A private birthday scrapbook made especially for Ellsamme." },
      { property: "og:title", content: "A Tiny Birthday Surprise" },
      { property: "og:description", content: "A private birthday scrapbook, made with love." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BirthdayPage,
});

function BirthdayPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [scene, setScene] = useState<Scene>("question");

  if (!unlocked) return <PasscodeScreen onUnlock={() => setUnlocked(true)} />;

  return (
    <main className="birthday-shell">
      <CornerDrapes />
      <StarBackdrop />

      {/* Confetti cannons from both sides + background fireworks ONLY on Happy Birthday scene for 5 seconds */}
      {scene === "camera" && <CelebrationOverlay durationMs={5000} />}

      {scene === "question" && (
        <QuestionScene onYes={() => setScene("good")} onNo={() => setScene("no")} />
      )}
      {scene === "no" && <NoScene onBack={() => setScene("question")} />}
      {scene === "good" && <GoodScene onContinue={() => setScene("camera")} />}
      {scene === "camera" && (
        <CameraScene onNext={() => setScene("items")} />
      )}
      {scene === "items" && (
        <ItemsHubScene
          onSelect={(selected) => setScene(selected)}
          onBack={() => setScene("camera")}
        />
      )}
      {scene === "memories" && <MemoriesScene onBack={() => setScene("items")} />}
      {scene === "letter" && <LetterScene onBack={() => setScene("items")} />}
      {scene === "music" && <MusicScene onBack={() => setScene("items")} />}
    </main>
  );
}

/* =========================================================================
   DECORATIVE BACKGROUND ELEMENTS (Lilac Drapes & Pastel Stars)
   ========================================================================= */

function CornerDrapes() {
  return (
    <div className="corner-drapes" aria-hidden="true">
      <svg className="drape-tl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 0 H200 C170 50 145 95 125 120 C100 150 50 175 0 200 Z"
          fill="#C4B5FD"
          opacity="0.85"
        />
        <path
          d="M0 0 H160 C135 40 115 80 95 110 C70 145 35 170 0 185 Z"
          fill="#DDD6FE"
          opacity="0.9"
        />
        <path
          d="M0 0 H110 C90 35 75 75 55 105 C35 140 15 160 0 170 Z"
          fill="#EDE9FE"
          opacity="0.95"
        />
        <path
          d="M0 0 H60 C45 30 30 65 15 95 C5 125 0 140 0 150 Z"
          fill="#F5F3FF"
          opacity="0.95"
        />
      </svg>

      <svg className="drape-br" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 0 H200 C170 50 145 95 125 120 C100 150 50 175 0 200 Z"
          fill="#C4B5FD"
          opacity="0.85"
        />
        <path
          d="M0 0 H160 C135 40 115 80 95 110 C70 145 35 170 0 185 Z"
          fill="#DDD6FE"
          opacity="0.9"
        />
        <path
          d="M0 0 H110 C90 35 75 75 55 105 C35 140 15 160 0 170 Z"
          fill="#EDE9FE"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

function StarBackdrop() {
  return (
    <div className="star-backdrop" aria-hidden="true">
      <span className="star star-purple" style={{ top: "8%", left: "10%", animationDelay: "0s" }}>★</span>
      <span className="star star-yellow" style={{ top: "14%", left: "84%", animationDelay: "1.2s" }}>★</span>
      <span className="star star-pink" style={{ top: "42%", left: "5%", animationDelay: "0.6s" }}>✦</span>
      <span className="star star-purple" style={{ top: "68%", left: "12%", animationDelay: "1.8s" }}>★</span>
      <span className="star star-yellow" style={{ top: "78%", left: "88%", animationDelay: "2.4s" }}>★</span>
      <span className="star star-pink" style={{ top: "35%", left: "93%", animationDelay: "0.9s" }}>✦</span>
      <span className="star star-yellow" style={{ top: "88%", left: "36%", animationDelay: "1.5s" }}>★</span>
      <span className="star star-blue" style={{ top: "10%", left: "48%", animationDelay: "2.1s" }}>★</span>
    </div>
  );
}

/* =========================================================================
   PASSCODE SCREEN
   ========================================================================= */

function PasscodeScreen({ onUnlock }: { onUnlock: () => void }) {
  const unlock = useServerFn(unlockBirthday);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleVerify = async (inputCode: string) => {
    if (inputCode.length !== 4 || busy) return;
    setBusy(true);
    setError(false);
    try {
      if (inputCode === "1810") {
        unlock({ data: { code: inputCode } }).catch(() => {});
        onUnlock();
      } else {
        const result = await unlock({ data: { code: inputCode } });
        if (result.ok) {
          onUnlock();
        } else {
          setError(true);
          setCode("");
        }
      }
    } catch {
      setError(true);
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleVerify(code);
  }

  return (
    <main className="birthday-shell">
      <CornerDrapes />
      <StarBackdrop />
      <section className="scene-card lock-card">
        <div className="text-6xl mb-3 animate-bounce">💌</div>
        <span className="eyebrow-badge">Psst... this one’s just for you</span>
        <h1 className="canva-title" style={{ margin: "0.25rem 0 1rem" }}>
          Enter our secret code
        </h1>
        <p className="text-muted-foreground font-semibold text-lg mb-6">
          Four tiny numbers stand between you and your birthday surprise.
        </p>
        <form onSubmit={submit} className="flex flex-col items-center gap-6">
          <InputOTP
            autoFocus
            maxLength={4}
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChange={(value) => {
              setCode(value);
              setError(false);
              if (value.length === 4) {
                handleVerify(value);
              }
            }}
            aria-label="Four digit passcode"
          >
            <InputOTPGroup className="gap-3 sm:gap-4">
              {[0, 1, 2, 3].map((index) => (
                <InputOTPSlot key={index} index={index} className="passcode-slot" />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <p className="h-6 font-bold text-base text-[#7C68B0]" role="alert">
            {error ? "Nope, silly goose — try again! (Hint: RIT)" : "♡ ♡ ♡ ♡"}
          </p>

          <button
            type="submit"
            disabled={code.length !== 4 || busy}
            className="btn-canva-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart className="w-6 h-6 fill-current" />
            {busy ? "Opening..." : "Open my surprise"}
          </button>
        </form>
      </section>
    </main>
  );
}

/* =========================================================================
   SCENE 1: QUESTION SCENE (Image 1)
   ========================================================================= */

function QuestionScene({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  const [noHovered, setNoHovered] = useState(false);

  return (
    <section className="scene-card">
      <h1 className="canva-title">
        Hey ! I made something for you<br />do you wanna see it?
      </h1>
      <img
        src={lilyPuppy}
        alt="Cute puppy holding bouquet of flowers"
        className="puppy-stage"
      />
      <div className="btn-pill-group">
        <button className="btn-canva-primary" onClick={onYes}>
          Yes <Heart className="w-6 h-6 fill-current" />
        </button>
        <button
          className="btn-canva-secondary"
          onClick={onNo}
          onMouseEnter={() => setNoHovered(true)}
          style={noHovered ? { transform: "translateX(12px)" } : {}}
        >
          No
        </button>
      </div>
    </section>
  );
}

/* =========================================================================
   SCENE 2: NO SCENE
   ========================================================================= */

function NoScene({ onBack }: { onBack: () => void }) {
  return (
    <section className="scene-card">
      <span className="eyebrow-badge">Excuse me?!</span>
      <h1 className="canva-title">How dare you?!</h1>
      <img
        src={annoyedPuppy}
        alt="Tiny annoyed puppy with crossed paws"
        className="puppy-stage"
      />
      <p className="text-2xl font-bold text-[#604A8F] mb-6" style={{ fontFamily: "var(--font-hand)" }}>
        Wrong answer! I’ll pretend I didn’t see that.
      </p>
      <button className="btn-canva-primary" onClick={onBack}>
        <RotateCcw className="w-6 h-6" /> Go back and rethink
      </button>
    </section>
  );
}

/* =========================================================================
   SCENE 3: GOOD GIRL SCENE
   ========================================================================= */

function GoodScene({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="scene-card">
      <div className="text-4xl text-[#F472B6] mb-2 animate-pulse">♥︎ ♡ ♥︎</div>
      <h1 className="canva-title" style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)" }}>
        GOOD GIRL<br />ELLSAMME!
      </h1>
      <img
        src={happyPuppy}
        alt="Very happy puppy holding hearts"
        className="puppy-stage"
      />
      <button className="btn-canva-primary" onClick={onContinue}>
        Click for your present <Sparkles className="w-6 h-6" />
      </button>
    </section>
  );
}

/* =========================================================================
   SCENE 4: HAPPY BIRTHDAY CAMERA SCENE (Dramatic, Glowing & Funky)
   ========================================================================= */

function CameraScene({ onNext }: { onNext: () => void }) {
  return (
    <section className="scene-card camera-scene-layout">
      {/* Dramatic Flash Burst on Entrance */}
      <div className="flash-reveal-overlay" aria-hidden="true" />

      {/* Top Banner: H a P P Y Scrapbook Tiles */}
      <div className="scrapbook-row" aria-label="HAPPY">
        <span className="scrapbook-tile tile-yellow-purple" style={{ transform: "rotate(-4deg)", animationDelay: "0s" }}>H</span>
        <span className="scrapbook-tile tile-mint-green" style={{ transform: "rotate(3deg)", animationDelay: "0.1s" }}>a</span>
        <span className="scrapbook-tile tile-pink-magenta" style={{ transform: "rotate(-2deg)", animationDelay: "0.2s" }}>P</span>
        <span className="scrapbook-tile tile-lilac-violet" style={{ transform: "rotate(4deg)", animationDelay: "0.3s" }}>P</span>
        <span className="scrapbook-tile tile-orange-peach" style={{ transform: "rotate(-3deg)", animationDelay: "0.4s" }}>Y</span>
      </div>

      {/* Retro Digicam with Ellsamme's Baby Photo */}
      <div className="digicam-container">
        {/* Animated Doggy Blowing Out Cake Candle in a continuous loop */}
        <div className="pup-blow-stage" aria-label="Puppy blowing birthday candle">
          <img
            src={partyPuppy}
            alt="Puppy blowing out birthday cake candle"
            className="bday-peeking-pup"
          />
          {/* Animated Flame on the Candle */}
          <div className="pup-candle-flame" aria-hidden="true" />

          {/* Animated Breath Wind Gust Puff */}
          <svg className="pup-breath-gust" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M2 10 Q12 6 22 10 T36 8" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <path d="M6 15 Q15 12 25 15 T38 13" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M4 5 Q12 2 20 5 T32 4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
          </svg>

          {/* Animated Smoke Wisp after Candle Blowout */}
          <svg className="pup-smoke-wisp" viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 28 C7 22 13 18 10 12 C7 7 12 3 10 0" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" opacity="0.85" />
          </svg>

          {/* Joyful Heart and Sparkle Emojis Floating Up on Success */}
          <span className="pup-happy-sparks" aria-hidden="true">💖✨</span>
        </div>

        <div className="digicam-body">
          <div className="digicam-top-shutter" />
          <div className="digicam-top-dial" />

          {/* Left: LCD Display Screen with Childhood Baby Photo */}
          <div className="digicam-screen-bezel">
            <div className="digicam-screen-header">
              <span><i className="digicam-rec-dot" />REC</span>
              <span>HD 1080</span>
              <span>🔋 100%</span>
            </div>
            <div className="digicam-photo-frame">
              <img
                src={childhoodPhoto}
                alt="Ellsamme childhood memory"
              />
              <div className="digicam-screen-glare" />
            </div>
          </div>

          {/* Right: Camera Lens & Tactile Controls */}
          <div className="digicam-lens-panel">
            <div className="digicam-flash-window" />
            <div className="digicam-lens-unit">
              <div className="digicam-lens-glass" />
            </div>
            <div className="digicam-button-cluster">
              <div className="digicam-round-btn" />
              <div className="digicam-round-btn" />
              <div className="digicam-round-btn" />
            </div>
            <span className="digicam-sticker-star">✨</span>
          </div>
        </div>
      </div>

      {/* Bottom Banner: B i r t h D A y Scrapbook Tiles */}
      <div className="scrapbook-row" aria-label="Birthday">
        <span className="scrapbook-tile tile-lilac-violet" style={{ transform: "rotate(-3deg)", animationDelay: "0.5s" }}>B</span>
        <span className="scrapbook-tile tile-rose-red" style={{ transform: "rotate(2deg)", animationDelay: "0.6s" }}>i</span>
        <span className="scrapbook-tile tile-yellow-purple" style={{ transform: "rotate(-4deg)", animationDelay: "0.7s" }}>r</span>
        <span className="scrapbook-tile tile-lilac-violet" style={{ transform: "rotate(3deg)", animationDelay: "0.8s" }}>t</span>
        <span className="scrapbook-tile tile-blue-cyan" style={{ transform: "rotate(-2deg)", animationDelay: "0.9s" }}>h</span>
        <span className="scrapbook-tile tile-orange-peach" style={{ transform: "rotate(4deg)", animationDelay: "1s" }}>D</span>
        <span className="scrapbook-tile tile-mint-green" style={{ transform: "rotate(-3deg)", animationDelay: "1.1s" }}>A</span>
        <span className="scrapbook-tile tile-yellow-purple" style={{ transform: "rotate(2deg)", animationDelay: "1.2s" }}>y</span>
      </div>

      <div style={{ marginTop: "0.85rem" }}>
        <button className="btn-canva-primary" onClick={onNext}>
          Open your surprises 🎁
        </button>
      </div>
    </section>
  );
}

/* =========================================================================
   SCENE 5: 3-ITEMS SELECTION HUB (Large Scale)
   ========================================================================= */

function ItemsHubScene({
  onSelect,
  onBack,
}: {
  onSelect: (scene: Scene) => void;
  onBack: () => void;
}) {
  return (
    <section className="scene-card items-hub-container">
      <h1 className="canva-title">
        click on each item to open
      </h1>

      <div className="items-hub-grid">
        {/* Item 1: Camera -> Memories */}
        <div
          className="item-interactive-card"
          onClick={() => onSelect("memories")}
          role="button"
          tabIndex={0}
          aria-label="Open Memories"
        >
          <img src={cameraIcon} alt="Vintage Camera Icon" />
          <span>Memories</span>
        </div>

        {/* Item 2: Letter -> Letter to Bestie */}
        <div
          className="item-interactive-card"
          onClick={() => onSelect("letter")}
          role="button"
          tabIndex={0}
          aria-label="Open Letter"
        >
          <img src={letterIcon} alt="Envelope Letter Icon" />
          <span>Letter</span>
        </div>

        {/* Item 3: Cassette -> Hear this */}
        <div
          className="item-interactive-card"
          onClick={() => onSelect("music")}
          role="button"
          tabIndex={0}
          aria-label="Open Hear this"
        >
          <img src={cassetteIcon} alt="Cassette Tape Icon" />
          <span>Hear this</span>
        </div>
      </div>

      <div>
        <button className="btn-back-hub" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" /> Back to Birthday Camera
        </button>
      </div>
    </section>
  );
}

/* =========================================================================
   SCENE 6: MEMORIES SCENE (6 Real Photos with Proper Alignment & Clean View)
   ========================================================================= */

function MemoriesScene({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("Memories");
  const tabs = ["All", "Images", "Videos", "News", "Maps", "Memories"];

  // 9 user uploaded memory photos
  const memoryPhotos = [
    { src: memory1, alt: "Car bouquet sweet moments" },
    { src: memory2, alt: "Traditional dress happy celebration" },
    { src: memory3, alt: "Sunny day outdoor adventure selfie" },
    { src: memory4, alt: "Golden hour glowing moments together" },
    { src: memory5, alt: "Cozy café smiles and happy talks" },
    { src: memory6, alt: "Daylight scooter selfie adventure" },
    { src: memory7, alt: "Night scooter ride with helmets" },
    { src: memory8, alt: "Night outing smiles in striped shirt" },
    { src: memory9, alt: "Pure laughter and happy smiles together" },
  ];

  return (
    <section className="scene-card wide-card memories-container">
      <img
        src={partyPuppy}
        alt="Puppy with birthday party hat"
        className="party-pup-decor"
      />

      <h1 className="google-memories-logo">
        <span className="google-blue">M</span>
        <span className="google-red">e</span>
        <span className="google-yellow">m</span>
        <span className="google-blue">o</span>
        <span className="google-green">r</span>
        <span className="google-red">i</span>
        <span className="google-yellow">e</span>
        <span className="google-blue">s</span>
      </h1>

      <div className="google-search-bar">
        <div className="search-text">
          <Search className="w-6 h-6 text-gray-400" />
          <span>Moments of us ❤️</span>
        </div>
        <div className="search-icons">
          <Mic className="w-5 h-5 cursor-pointer" />
          <Camera className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <div className="search-tabs-row">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`search-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* 6 Real Photos Grid with Pure Image Display & Alignment */}
      <div className="memories-photo-grid">
        {memoryPhotos.map((item, index) => (
          <div className="memory-photo-card" key={index}>
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <button className="btn-back-hub" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" /> Back to Gifts
      </button>
    </section>
  );
}

/* =========================================================================
   SCENE 7: LETTER SCENE (Girly Pink Lilies, Coquette Bows & User's Heartfelt Letter)
   ========================================================================= */

function PinkLilyVector({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lilyPinkGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF1F2" />
          <stop offset="45%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </radialGradient>
        <linearGradient id="lilyLeafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>
      {/* Green stems and leaves */}
      <path d="M60 60 C35 85 10 80 0 95 C20 105 45 90 60 60 Z" fill="url(#lilyLeafGrad)" />
      <path d="M60 60 C85 85 110 80 120 95 C100 105 75 90 60 60 Z" fill="url(#lilyLeafGrad)" />
      {/* Lily Petals with graceful curves */}
      <path d="M60 60 C50 28 38 0 60 0 C82 0 70 28 60 60 Z" fill="url(#lilyPinkGrad)" />
      <path d="M60 60 C28 50 0 38 0 60 C0 82 28 70 60 60 Z" fill="url(#lilyPinkGrad)" />
      <path d="M60 60 C70 92 82 120 60 120 C38 120 50 92 60 60 Z" fill="url(#lilyPinkGrad)" />
      <path d="M60 60 C92 70 120 82 120 60 C120 38 92 50 60 60 Z" fill="url(#lilyPinkGrad)" />
      <path d="M60 60 C32 32 10 10 32 5 C50 10 55 35 60 60 Z" fill="url(#lilyPinkGrad)" opacity="0.95" />
      <path d="M60 60 C88 32 110 10 88 5 C70 10 65 35 60 60 Z" fill="url(#lilyPinkGrad)" opacity="0.95" />
      {/* Yellow/orange stamens */}
      <circle cx="60" cy="60" r="8" fill="#FDE047" />
      <circle cx="60" cy="60" r="3.5" fill="#EA580C" />
      <path d="M60 60 L42 40 M60 60 L78 40 M60 60 L42 80 M60 60 L78 80 M60 60 L60 36" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="40" r="3" fill="#DC2626" />
      <circle cx="78" cy="40" r="3" fill="#DC2626" />
      <circle cx="42" cy="80" r="3" fill="#DC2626" />
      <circle cx="78" cy="80" r="3" fill="#DC2626" />
      <circle cx="60" cy="36" r="3" fill="#DC2626" />
    </svg>
  );
}

function LetterScene({ onBack }: { onBack: () => void }) {
  return (
    <section className="scene-card letter-wide-card letter-screen-card">
      {/* Top Washi Tape with cute girly floral text */}
      <div className="washi-tape-fancy" aria-hidden="true">
        <span>🌸</span>
        <span style={{ fontFamily: "var(--font-bubble)", fontWeight: "bold", color: "#831843", letterSpacing: "1px" }}>
          For Ellsamma
        </span>
        <span>💖</span>
      </div>

      {/* Girly Lilies & Bows in Corners and Margins */}
      <PinkLilyVector className="girly-sticker-tl" />
      <PinkLilyVector className="girly-sticker-br" />
      <span className="girly-side-bow-left" aria-hidden="true">🎀</span>
      <span className="girly-side-bow-right" aria-hidden="true">🎀</span>

      <div className="letter-lined-paper">
        <div className="letter-header-salutation">
          My dear Ellsammeee!, 🌸
        </div>

        <p className="letter-body-paragraph">
          I’ve been trying to find the right words to write this, but somehow, nothing ever feels enough when it comes to you.
        </p>

        <p className="letter-body-paragraph">
          I just want you to know how deeply grateful I am that life brought you into mine. Somewhere between all our random conversations, stupid jokes, little moments, and the days when we didn’t even need words, you became someone incredibly special to me — someone I can’t imagine my life without.
        </p>

        <p className="letter-body-paragraph">
          Thank you for being there for me in ways you probably don’t even realise. For believing in me, standing beside me, making me laugh when I need it most, and simply being <em>you</em>. You’ve seen different sides of me, stayed through the messy moments, and somehow made even ordinary days feel like something worth remembering.
        </p>

        <p className="letter-body-paragraph">
          I hope when you look back at this year, you realise just how much you’ve grown, how much you’ve accomplished, and how loved you truly are. I hope life gives you the kind of happiness that stays, the peace you deserve, and countless little moments that make you stop and smile for no reason.
        </p>

        <p className="letter-body-paragraph">
          And selfishly, I hope I get to be there for many of them — watching you grow, celebrating you, annoying you, laughing with you, and making a thousand more memories together.
        </p>

        <div className="letter-birthday-highlight">
          🎂 Happy Birthday, Ells. ✨<br />
          <span style={{ fontSize: "0.85em", fontWeight: 600, color: "#831843" }}>
            Thank you for being one of the most beautiful parts of my life.
          </span>
        </div>

        <div className="letter-signature-block">
          With all the love I have,<br />
          <span style={{ color: "#BE185D", fontSize: "1.25em" }}>D ♥</span>
        </div>
      </div>

      <button className="btn-back-hub" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" /> Back to Gifts
      </button>
    </section>
  );
}

/* =========================================================================
   SCENE 8: MUSIC SCENE (Image 2: Retro Song Player)
   ========================================================================= */

function MusicScene({ onBack }: { onBack: () => void }) {
  const totalDuration = 215; // 3:35 in seconds
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalDuration) return 0;
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = (currentTime / totalDuration) * 100;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(Math.floor(newPercent * totalDuration));
  };

  return (
    <section className="scene-card wide-card music-screen-card">
      <h1 className="canva-title" style={{ fontSize: "clamp(1.35rem, 3.2vw, 2.1rem)", margin: "0.25rem 0 1rem" }}>
        Ninte all time favourite ith aan enn alle paranje? 🌸
      </h1>

      <div className="youtube-player-frame">
        <iframe
          src="https://www.youtube-nocookie.com/embed/p7eLHs4AS9U?autoplay=1&rel=0"
          title="Alliyambal Kadavil Song"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="song-meta-bar">
        <div className="song-title-text" style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.55rem)" }}>
          Alliyambal Kadavil Song
        </div>
        <div className="text-base font-bold text-[#DB2777] flex items-center justify-center gap-1.5" style={{ fontFamily: "var(--font-bubble)" }}>
          <span>Enjoy baby</span>
          <span className="text-[#EC4899]">♥</span>
        </div>

        {/* Girly Animated Progress Bar with Pink Lilies */}
        <div className="girly-song-progress-container">
          <div className="timeline-controls-row">
            <button
              className="btn-play-pause"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
          </div>

          <div className="timeline-bar-wrapper">
            <span className="timeline-lily-icon" aria-hidden="true">🌸</span>
            <span>{formatTime(currentTime)}</span>

            <div
              className="girly-progress-track"
              onClick={handleSeek}
              role="slider"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={totalDuration}
              tabIndex={0}
            >
              <div
                className="girly-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              <span
                className="girly-progress-thumb"
                style={{ left: `${progressPercent}%` }}
                aria-hidden="true"
              >
                🌸
              </span>
            </div>

            <span>{formatTime(totalDuration)}</span>
            <span className="timeline-lily-icon" aria-hidden="true">🌺</span>
          </div>
        </div>
      </div>

      <button className="btn-back-hub" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" /> Back to Gifts
      </button>
    </section>
  );
}
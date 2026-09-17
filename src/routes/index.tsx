import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Camera, ChevronLeft, Heart, Mail, Music2, Sparkles } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import annoyedPuppy from "@/assets/puppy-annoyed.png";
import happyPuppy from "@/assets/puppy-hearts.png";
import lilyPuppy from "@/assets/puppy-lilies.png";
import childhoodPhoto from "@/assets/childhood-photo.jpeg.asset.json";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { getBirthdayAccess, unlockBirthday } from "@/lib/birthday-gate.functions";

type Scene = "question" | "no" | "good" | "camera" | "memories" | "letter" | "music";

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
  const checkAccess = useServerFn(getBirthdayAccess);
  const [unlocked, setUnlocked] = useState(false);
  const [scene, setScene] = useState<Scene>("question");

  useEffect(() => {
    let active = true;
    checkAccess()
      .then((result) => { if (active && result?.unlocked) setUnlocked(true); })
      .catch(() => {});
    return () => { active = false; };
  }, [checkAccess]);

  if (!unlocked) return <PasscodeScreen onUnlock={() => setUnlocked(true)} />;


  return (
    <main className="birthday-shell">
      <FloatingDoodles />
      {scene === "question" && <QuestionScene onYes={() => setScene("good")} onNo={() => setScene("no")} />}
      {scene === "no" && <NoScene onBack={() => setScene("question")} />}
      {scene === "good" && <GoodScene onContinue={() => setScene("camera")} />}
      {scene === "camera" && <CameraScene onChoose={setScene} />}
      {scene === "memories" && <MemoriesScene onBack={() => setScene("camera")} />}
      {scene === "letter" && <LetterScene onBack={() => setScene("camera")} />}
      {scene === "music" && <MusicScene onBack={() => setScene("camera")} />}
    </main>
  );
}

function PasscodeScreen({ onUnlock }: { onUnlock: () => void }) {
  const unlock = useServerFn(unlockBirthday);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.length !== 4 || busy) return;
    setBusy(true);
    setError(false);
    try {
      const result = await unlock({ data: { code } });
      if (result.ok) onUnlock();
      else {
        setError(true);
        setCode("");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="birthday-shell lock-screen">
      <FloatingDoodles />
      <form className="lock-note" onSubmit={submit}>
        <span className="lock-sticker" aria-hidden="true">💌</span>
        <p className="eyebrow">Psst... this one’s just for you</p>
        <h1>Enter our little secret</h1>
        <p className="lock-copy">Four tiny numbers stand between you and a very cheesy surprise.</p>
        <InputOTP
          autoFocus
          maxLength={4}
          inputMode="numeric"
          pattern="[0-9]*"
          value={code}
          onChange={(value) => { setCode(value); setError(false); }}
          aria-label="Four digit passcode"
          containerClassName="justify-center"
        >
          <InputOTPGroup className="gap-2 sm:gap-3">
            {[0, 1, 2, 3].map((index) => (
              <InputOTPSlot key={index} index={index} className="passcode-slot" />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <p className="error-line" role="alert">{error ? "Nope, silly goose — try again!" : "♡ ♡ ♡ ♡"}</p>
        <Button variant="birthday" size="lg" disabled={code.length !== 4 || busy} type="submit">
          <Heart className="fill-current" /> {busy ? "Checking..." : "Open my surprise"}
        </Button>
      </form>
    </main>
  );
}

function SceneCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`scene-card ${className}`}>{children}</section>;
}

function QuestionScene({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <SceneCard>
      <p className="eyebrow">Special delivery!</p>
      <h1>Hey! I made something for you...</h1>
      <img className="puppy puppy-lily" src={lilyPuppy} alt="A fluffy puppy holding pink lilies" width={768} height={768} />
      <h2>Do you wanna see it?</h2>
      <div className="button-row">
        <Button variant="birthday" size="lg" onClick={onYes}>Yes, obviously! <Heart className="fill-current" /></Button>
        <Button variant="sweet" size="lg" onClick={onNo}>Nope</Button>
      </div>
    </SceneCard>
  );
}

function NoScene({ onBack }: { onBack: () => void }) {
  return (
    <SceneCard className="angry-card">
      <p className="eyebrow">Excuse me?!</p>
      <h1>How dare you?!</h1>
      <img className="puppy" src={annoyedPuppy} alt="A tiny annoyed puppy with crossed paws" width={768} height={768} />
      <p className="scribble">Wrong answer. I’ll pretend I didn’t see that.</p>
      <Button variant="birthday" size="lg" onClick={onBack}><ChevronLeft /> Go back and rethink</Button>
    </SceneCard>
  );
}

function GoodScene({ onContinue }: { onContinue: () => void }) {
  return (
    <SceneCard className="good-card">
      <div className="mini-hearts" aria-hidden="true">♥︎ ♡ ♥︎</div>
      <h1>GOOD GIRL<br />ELLSAMME!</h1>
      <img className="puppy" src={happyPuppy} alt="A very happy puppy holding hearts" width={768} height={768} />
      <Button variant="birthday" size="lg" onClick={onContinue}>Click for your present <Sparkles /></Button>
    </SceneCard>
  );
}

function CameraScene({ onChoose }: { onChoose: (scene: Scene) => void }) {
  return (
    <SceneCard className="camera-scene">
      <p className="party-script">hip hip hooray!</p>
      <h1 className="rainbow-title"><span>H</span><span>A</span><span>P</span><span>P</span><span>Y</span><br /><span>B</span><span>I</span><span>R</span><span>T</span><span>H</span><span>D</span><span>A</span><span>Y</span></h1>
      <div className="camera-body" aria-label="A birthday camera holding a childhood photo">
        <div className="camera-flash" />
        <div className="camera-lens">
          <img src={childhoodPhoto.url} alt="Ellsamme as a little child" width={1201} height={1600} />
        </div>
        <div className="camera-dot" />
      </div>
      <p className="scribble">Pick a tiny piece of your surprise</p>
      <div className="keepsake-row">
        <Button variant="keepsake" onClick={() => onChoose("memories")} aria-label="Open memories"><Camera /><span>Memories</span></Button>
        <Button variant="keepsake" onClick={() => onChoose("letter")} aria-label="Open letter"><Mail /><span>Letter</span></Button>
        <Button variant="keepsake" onClick={() => onChoose("music")} aria-label="Open song"><Music2 /><span>Our song</span></Button>
      </div>
    </SceneCard>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return <Button variant="sweet" onClick={onBack}><ChevronLeft /> Back to the camera</Button>;
}

function MemoriesScene({ onBack }: { onBack: () => void }) {
  return (
    <SceneCard className="wide-card memories-card">
      <p className="eyebrow">a little archive of us</p>
      <h1 className="google-title"><span>Me</span><span>mo</span><span>ri</span><span>es</span></h1>
      <div className="search-bar"><span>Us, in Every Little Moment</span><Heart className="fill-current" /></div>
      <div className="photo-grid">
        {Array.from({ length: 12 }, (_, index) => (
          <div className="photo-placeholder" key={index}>
            <span>{index % 3 === 0 ? "♡" : index % 3 === 1 ? "✿" : "★"}</span>
            <small>your photo here</small>
          </div>
        ))}
      </div>
      <BackButton onBack={onBack} />
    </SceneCard>
  );
}

function LetterScene({ onBack }: { onBack: () => void }) {
  return (
    <SceneCard className="wide-card letter-card">
      <div className="tape" aria-hidden="true" />
      <p className="eyebrow">to my favourite human</p>
      <h1>A little letter for you ♡</h1>
      <div className="letter-paper">
        <p>Dear Ellsamme,</p>
        <div className="letter-placeholder">
          Your words will live right here...<br />ready for every laugh, memory, and mushy little thing you want to say.
        </div>
        <p>With all my heart,</p>
        <p className="signature">your favourite person ♡</p>
      </div>
      <BackButton onBack={onBack} />
    </SceneCard>
  );
}

function MusicScene({ onBack }: { onBack: () => void }) {
  return (
    <SceneCard className="wide-card music-card">
      <p className="eyebrow">press play, pretty girl</p>
      <h1>Our little soundtrack</h1>
      <div className="video-wrap">
        <iframe
          src="https://www.youtube-nocookie.com/embed/p7eLHs4AS9U?rel=0"
          title="Alliyambal Kadavil"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <div className="cassette">
        <div className="cassette-label">ALLIYAMBAL KADAVIL <span>♥</span></div>
        <div className="cassette-window"><i /><b /><i /></div>
      </div>
      <BackButton onBack={onBack} />
    </SceneCard>
  );
}

function FloatingDoodles() {
  return (
    <div className="floating-doodles" aria-hidden="true">
      <span>★</span><span>♡</span><span>✿</span><span>♥</span><span>✦</span><span>♡</span>
    </div>
  );
}
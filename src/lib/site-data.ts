import piano from "@/assets/inst-piano.jpg";
import guitar from "@/assets/inst-guitar.jpg";
import violin from "@/assets/inst-violin.jpg";
import drums from "@/assets/inst-drums.jpg";
import keyboard from "@/assets/inst-keyboard.jpg";
import bass from "@/assets/inst-bass.jpg";
import sax from "@/assets/inst-sax.jpg";
import trumpet from "@/assets/inst-trumpet.jpg";

export type Level = "beginner" | "intermediate" | "advanced";

export type Instrument = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export const instruments: Instrument[] = [
  { slug: "piano", name: "Piano", description: "Master melody and harmony on the classical foundation of every musician.", image: piano },
  { slug: "guitar", name: "Guitar", description: "Chords, riffs and fingerstyle — the most versatile instrument on the planet.", image: guitar },
  { slug: "violin", name: "Violin", description: "Develop bowing, intonation and expression through a proven classical path.", image: violin },
  { slug: "drums", name: "Drums", description: "Build rock-solid timing, groove and coordination behind the kit.", image: drums },
  { slug: "keyboard", name: "Keyboard", description: "Sounds, synths and modern production techniques for stage and studio.", image: keyboard },
  { slug: "bass-guitar", name: "Bass Guitar", description: "Lock in with the drums and become the backbone of any band.", image: bass },
  { slug: "saxophone", name: "Saxophone", description: "Embouchure, tone and improvisation across jazz, funk and classical.", image: sax },
  { slug: "trumpet", name: "Trumpet", description: "Powerful brass playing from first notes to soloing with confidence.", image: trumpet },
];

export const levels: { key: Level; label: string; blurb: string }[] = [
  { key: "beginner", label: "Beginner", blurb: "First notes, posture and reading music with confidence." },
  { key: "intermediate", label: "Intermediate", blurb: "Scales, chords, timing and playing full pieces." },
  { key: "advanced", label: "Advanced", blurb: "Improvisation, performance and studio-ready technique." },
];

export function getInstrument(slug: string) {
  return instruments.find((i) => i.slug === slug);
}

export function lessonContent(instrument: string, level: Level) {
  const notes: Record<Level, string[]> = {
    beginner: [
      `Get comfortable holding the ${instrument} and finding a relaxed posture.`,
      "Learn the names of notes and how to read basic rhythms.",
      "Play your first simple melody using slow, even tempo.",
    ],
    intermediate: [
      "Practice major and minor scales in two octaves.",
      "Play through a short piece using dynamics and phrasing.",
      "Record yourself and identify one area to improve.",
    ],
    advanced: [
      "Work on advanced technique: articulation, speed and control.",
      "Improvise over a chord progression in two different keys.",
      "Prepare a full piece to performance standard.",
    ],
  };
  const exercises: Record<Level, string[]> = {
    beginner: ["10 minutes daily technique warm-up", "Play 5 notes clearly and evenly", "Clap the rhythm before playing"],
    intermediate: ["Metronome practice at 60, 80, 100 BPM", "Learn one new scale this week", "Transcribe a short melody by ear"],
    advanced: ["Practice sight-reading for 15 minutes", "Improvise over a jazz standard", "Record and self-critique a full take"],
  };
  return { notes: notes[level], exercises: exercises[level] };
}

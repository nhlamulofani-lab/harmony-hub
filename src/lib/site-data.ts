import piano from "@/assets/inst-piano.jpg";
import guitar from "@/assets/inst-guitar.jpg";
import violin from "@/assets/inst-violin.jpg";
import drums from "@/assets/inst-drums.jpg";
import keyboard from "@/assets/inst-keyboard.jpg";
import bass from "@/assets/inst-bass.jpg";
import sax from "@/assets/inst-sax.jpg";
import trumpet from "@/assets/inst-trumpet.jpg";

export type Level = "beginner" | "intermediate" | "advanced";

export type Module = {
  id: string;
  title: string;
  theory: string;
  keyPoints: string[];
  exercise: string;
  visual: string; // short visual/theory diagram label (rendered as decorative block)
};

export type Instrument = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  history: string;
  whatYouLearn: string[];
  image: string;
};

export const instruments: Instrument[] = [
  {
    slug: "piano",
    name: "Piano",
    description: "Master melody and harmony on the classical foundation of every musician.",
    longDescription:
      "The piano is the most complete instrument you can learn. With 88 keys spanning the full musical range, it gives you an unmatched view of harmony, melody and rhythm all at once. Whether you dream of playing classical, jazz, gospel, pop or film scores, the piano is where every great musician begins.",
    history:
      "Invented by Bartolomeo Cristofori around 1700, the piano replaced the harpsichord because it could play both softly (piano) and loudly (forte). Since then it has shaped every major style — from Mozart and Chopin to Duke Ellington, Bill Evans, Alicia Keys and beyond.",
    whatYouLearn: ["Correct posture & hand shape", "Reading treble & bass clef", "Major & minor scales", "Chord voicings & inversions", "Pedaling technique", "Simple improvisation"],
    image: piano,
  },
  {
    slug: "guitar",
    name: "Guitar",
    description: "Chords, riffs and fingerstyle — the most versatile instrument on the planet.",
    longDescription:
      "The guitar is loved worldwide because it's portable, expressive and works in every style — from acoustic ballads to blues, rock, gospel and afro-pop. In just a few weeks you can strum full songs; with time you'll play riffs, solos and fingerstyle arrangements.",
    history:
      "The modern guitar evolved in 16th-century Spain and exploded globally in the 20th century with players like Django Reinhardt, Jimi Hendrix, BB King and Philip Tabane. Today it's the #1 instrument students choose to learn.",
    whatYouLearn: ["Tuning by ear & with a tuner", "Open chords & barre chords", "Strumming & picking patterns", "Reading tabs & chord charts", "Fingerstyle basics", "Playing full songs"],
    image: guitar,
  },
  {
    slug: "violin",
    name: "Violin",
    description: "Develop bowing, intonation and expression through a proven classical path.",
    longDescription:
      "The violin is the voice of the orchestra — expressive, singing, capable of the softest whisper and the loudest cry. Learning violin trains your ear, your intonation and your musical sensitivity like no other instrument.",
    history:
      "Perfected in 16th-century Italy by makers like Stradivari and Guarneri, the violin dominates classical music and has crossed into folk, jazz, gospel and Afro-fusion.",
    whatYouLearn: ["Bow hold & posture", "Left-hand finger placement", "First position notes", "Simple bowing patterns", "Playing in tune (intonation)", "Reading treble clef"],
    image: violin,
  },
  {
    slug: "drums",
    name: "Drums",
    description: "Build rock-solid timing, groove and coordination behind the kit.",
    longDescription:
      "Drums are the heartbeat of every band. A good drummer keeps everything together. You'll learn independence, timing and how to make people move.",
    history:
      "Drum kits as we know them were assembled in the early 1900s. Legends like Buddy Rich, Tony Allen and Questlove shaped how modern grooves are played across jazz, afrobeat, rock and gospel.",
    whatYouLearn: ["Kit setup & stick grip", "Reading drum notation", "Basic rock & pop beats", "Fills & transitions", "Timing with a metronome", "Playing to real songs"],
    image: drums,
  },
  {
    slug: "keyboard",
    name: "Keyboard",
    description: "Sounds, synths and modern production techniques for stage and studio.",
    longDescription:
      "The keyboard is the modern piano's stage-ready cousin — lighter, packed with sounds, and central to gospel, worship, pop and electronic music. Perfect if you want to play in a band or produce your own tracks.",
    history:
      "Digital keyboards emerged in the 1970s with pioneers like Yamaha, Roland and Korg. They powered disco, gospel, hip-hop and modern worship.",
    whatYouLearn: ["Selecting sounds & splits", "Chord shapes for songs", "Left-hand bass patterns", "Playing with a drummer", "Modern gospel voicings", "Basic MIDI recording"],
    image: keyboard,
  },
  {
    slug: "bass-guitar",
    name: "Bass Guitar",
    description: "Lock in with the drums and become the backbone of any band.",
    longDescription:
      "The bass is the glue between the drums and the melody. Bass players are always in demand because they make everything else sound better.",
    history:
      "The electric bass replaced the double bass in the 1950s. James Jamerson, Jaco Pastorius and Marcus Miller turned it into a lead voice.",
    whatYouLearn: ["Fretboard notes", "Finger & pick technique", "Reading bass tabs", "Locking in with drums", "Simple grooves", "Walking bass lines"],
    image: bass,
  },
  {
    slug: "saxophone",
    name: "Saxophone",
    description: "Embouchure, tone and improvisation across jazz, funk and classical.",
    longDescription:
      "The saxophone is smooth, powerful and unmistakably human. From smooth jazz to church, from Kirk Whalum to Kenny G, the sax is a lifelong companion.",
    history:
      "Invented by Adolphe Sax in 1846, the saxophone became the voice of jazz through Charlie Parker, John Coltrane and Sonny Rollins.",
    whatYouLearn: ["Assembly & care", "Embouchure & breath support", "First notes on the sax", "Major scales", "Simple melodies", "First improv over a blues"],
    image: sax,
  },
  {
    slug: "trumpet",
    name: "Trumpet",
    description: "Powerful brass playing from first notes to soloing with confidence.",
    longDescription:
      "The trumpet is bold, bright and unforgettable. It leads brass sections in jazz, gospel, orchestras and marching bands.",
    history:
      "One of the oldest instruments in existence, the modern valved trumpet appeared in the 1810s and was made iconic by Louis Armstrong, Miles Davis and Hugh Masekela.",
    whatYouLearn: ["Buzzing & embouchure", "Fingering the valves", "First 5 notes", "Long tones for a beautiful sound", "Simple songs", "Playing in tune with others"],
    image: trumpet,
  },
];

export const levels: { key: Level; label: string; blurb: string }[] = [
  { key: "beginner", label: "Beginner", blurb: "First notes, posture and reading music with confidence." },
  { key: "intermediate", label: "Intermediate", blurb: "Scales, chords, timing and playing full pieces." },
  { key: "advanced", label: "Advanced", blurb: "Improvisation, performance and studio-ready technique." },
];

export function getInstrument(slug: string) {
  return instruments.find((i) => i.slug === slug);
}

/** 5 ordered modules per level. Structure is universal; instrument name is injected. */
function buildModules(instrumentName: string, level: Level): Module[] {
  const templates: Record<Level, Omit<Module, "theory" | "exercise">[]> = {
    beginner: [
      {
        id: "m1",
        title: "Meet your instrument",
        keyPoints: ["Names of the main parts", "How sound is produced", "Care & storage"],
        visual: "Anatomy diagram",
      },
      {
        id: "m2",
        title: "Posture & hand position",
        keyPoints: ["Sit / stand relaxed", "Shoulders down", "Wrists straight"],
        visual: "Posture reference",
      },
      {
        id: "m3",
        title: "Reading music basics",
        keyPoints: ["Staff, clefs & notes", "Note values (whole, half, quarter)", "Time signatures 4/4 & 3/4"],
        visual: "Staff notation chart",
      },
      {
        id: "m4",
        title: "Your first 5 notes",
        keyPoints: ["Play cleanly and evenly", "Count out loud", "Start slow, stay steady"],
        visual: "5-note fingering chart",
      },
      {
        id: "m5",
        title: "Play a simple song",
        keyPoints: ["Combine everything so far", "Play with a metronome at 60 BPM", "Record yourself"],
        visual: "Simple melody score",
      },
    ],
    intermediate: [
      {
        id: "m1",
        title: "Major scales in two octaves",
        keyPoints: ["C, G, D & F major", "Even tone across the range", "Alternate practice patterns"],
        visual: "Scale fingering chart",
      },
      {
        id: "m2",
        title: "Chords & harmony",
        keyPoints: ["I – IV – V progression", "Major vs minor sound", "Basic chord voicings"],
        visual: "Chord progression wheel",
      },
      {
        id: "m3",
        title: "Rhythm & timing",
        keyPoints: ["Subdividing beats", "Playing with a metronome at 60/80/100 BPM", "Syncopation intro"],
        visual: "Rhythm grid",
      },
      {
        id: "m4",
        title: "Dynamics & phrasing",
        keyPoints: ["Loud & soft (f / p)", "Shaping a musical phrase", "Adding expression"],
        visual: "Dynamics markings",
      },
      {
        id: "m5",
        title: "Perform a full piece",
        keyPoints: ["Choose a piece at your level", "Practice hands / parts separately", "Record a full take"],
        visual: "Full piece score",
      },
    ],
    advanced: [
      {
        id: "m1",
        title: "Advanced technique",
        keyPoints: ["Speed & control", "Articulation nuances", "Extended range"],
        visual: "Technique routine",
      },
      {
        id: "m2",
        title: "Ear training & transcription",
        keyPoints: ["Recognise intervals", "Transcribe a short solo", "Sing what you play"],
        visual: "Interval reference",
      },
      {
        id: "m3",
        title: "Improvisation",
        keyPoints: ["Blues scale", "Call & response phrases", "Improvise over a chord loop"],
        visual: "Blues scale diagram",
      },
      {
        id: "m4",
        title: "Studio & performance",
        keyPoints: ["Mic / recording basics", "Stage presence", "Playing with in-ear monitors"],
        visual: "Studio signal path",
      },
      {
        id: "m5",
        title: "Final recital piece",
        keyPoints: ["Choose a challenging piece", "Rehearse under performance pressure", "Record and self-critique"],
        visual: "Recital program",
      },
    ],
  };

  const theories: Record<Level, string[]> = {
    beginner: [
      `Every ${instrumentName.toLowerCase()} has a small number of essential parts. Learning their names first makes every future lesson easier — teachers give instructions using those exact words.`,
      `Good posture protects your body and lets you play longer without pain. On the ${instrumentName.toLowerCase()}, the way you sit or stand changes the sound before you even play a note.`,
      `Music is a written language. Once you can read the staff, the notes and the rhythms, any ${instrumentName.toLowerCase()} song in the world becomes learnable.`,
      `Your first five notes are the foundation for hundreds of songs. Focus on clean, even sound — speed comes later.`,
      `Playing a real song is where it all comes together. Even a short simple melody, played well, is a huge milestone.`,
    ],
    intermediate: [
      `Scales are the alphabet of music. Practising them on the ${instrumentName.toLowerCase()} builds finger strength, ear training and technique all at once.`,
      `Harmony is what makes music emotional. The I–IV–V progression is behind thousands of songs across gospel, pop, blues and afro-pop.`,
      `Great musicians are separated from good ones by their sense of time. A metronome is your best friend at this stage.`,
      `Dynamics turn notes into music. Playing loud and soft in the right places is what makes an audience feel something.`,
      `A full performance piece brings together technique, reading, timing and expression. This is where you start to sound like a real musician.`,
    ],
    advanced: [
      `At the advanced level, technique is a tool — not the goal. You'll refine speed, articulation and control so your ideas come out cleanly.`,
      `Ear training frees you from the page. Once you can hear intervals and transcribe by ear, you can learn any song without sheet music.`,
      `Improvisation is spontaneous composition. On the ${instrumentName.toLowerCase()}, it's how you develop your own voice.`,
      `Modern musicians perform in studios, on stages and in worship services. Understanding mics, monitors and signal flow is now essential.`,
      `Your recital piece is a portrait of who you are as a musician right now. Prepare it like a professional.`,
    ],
  };

  const exercises: Record<Level, string[]> = {
    beginner: [
      "Point to and name every part of your instrument out loud.",
      "Set a 5-minute timer and hold correct posture while playing one long note.",
      "Clap and count a 4/4 rhythm for 2 minutes, then play it on your instrument.",
      "Play your first 5 notes up and down 10 times slowly and evenly.",
      "Play a simple song all the way through with a metronome at 60 BPM.",
    ],
    intermediate: [
      "Play C major scale up and down, two octaves, three times perfectly at 80 BPM.",
      "Play a I–IV–V progression in C, G and D — 4 beats each chord.",
      "Play a groove or melody at 60, 80 and 100 BPM with a metronome.",
      "Play the same phrase four times: soft, loud, crescendo, decrescendo.",
      "Record yourself playing a full piece and note one thing to improve.",
    ],
    advanced: [
      "Play a fast technical exercise cleanly at your top comfortable tempo.",
      "Transcribe a 4-bar solo by ear and play it back from memory.",
      "Improvise for 2 minutes over a simple chord loop using the blues scale.",
      "Record yourself with a mic, listen back and adjust one thing.",
      "Play your recital piece top to bottom without stopping — twice.",
    ],
  };

  return templates[level].map((t, i) => ({
    ...t,
    theory: theories[level][i],
    exercise: exercises[level][i],
  }));
}

export function getModules(instrumentName: string, level: Level) {
  return buildModules(instrumentName, level);
}

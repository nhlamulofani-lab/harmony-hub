import type { Level } from "@/lib/site-data";

export type MultipleChoiceQuestion = { type: "multiple-choice"; prompt: string; options: string[]; answer: string; explanation: string };
export type TrueFalseQuestion = { type: "true-false"; prompt: string; answer: boolean; explanation: string };
export type MatchingQuestion = { type: "matching"; prompt: string; pairs: { left: string; right: string }[]; explanation: string };
export type QuizQuestion = MultipleChoiceQuestion | TrueFalseQuestion | MatchingQuestion;

export type Lesson = {
  id: string;
  title: string;
  theory: string;
  objectives: string[];
  keyPoints: string[];
  steps: string[];
  exercises: string[];
  homework: string;
  visual: string;
  duration: number;
  difficulty: string;
  quiz: QuizQuestion[];
};

const roadmaps: Record<string, Record<Level, string[]>> = {
  piano: {
    beginner: ["Keyboard geography and posture", "Finger numbers and five-note patterns", "Reading treble clef", "Reading bass clef", "Quarter, half and whole notes", "C major scale", "First major chords", "Hands together coordination", "Pedal and musical phrasing", "Beginner performance piece"],
    intermediate: ["Major scales and fingering", "Natural and harmonic minor", "Triads and inversions", "I–IV–V–vi progressions", "Syncopation and accompaniment", "Arpeggios across two octaves", "Sight-reading strategies", "Melody harmonisation", "Improvising with chord tones", "Intermediate recital"],
    advanced: ["Four-octave scale fluency", "Seventh and extended chords", "Advanced voicing and voice leading", "Polyrhythm and rhythmic independence", "Modal improvisation", "Reharmonisation techniques", "Transcription and ear-led playing", "Tone, touch and pedalling", "Studio and ensemble performance", "Advanced recital portfolio"],
  },
  guitar: {
    beginner: ["Guitar anatomy and tuning", "Posture, fretting and picking", "Reading chord boxes and tab", "Open chords G, C and D", "E, A and minor chords", "Steady eighth-note strumming", "Clean chord changes", "First pentatonic pattern", "Fingerstyle foundations", "Complete acoustic song"],
    intermediate: ["Movable barre chords", "Major scale positions", "Minor pentatonic across the neck", "Triads on string sets", "Rhythm accents and muting", "Hammer-ons, pull-offs and slides", "Blues phrasing and bends", "Fingerstyle independence", "Building a guitar arrangement", "Intermediate performance set"],
    advanced: ["CAGED fretboard mastery", "Modes and modal harmony", "Extended chord voicings", "Hybrid picking and economy", "Advanced rhythm and odd meters", "Chord-melody arranging", "Target-note improvisation", "Transcribing a complete solo", "Tone, effects and recording", "Advanced performance portfolio"],
  },
  drums: {
    beginner: ["Kit anatomy and setup", "Matched grip and rebound", "Quarter notes on the kit", "Eighth-note rock groove", "Bass and snare coordination", "Hi-hat control", "First one-bar fills", "Reading drum notation", "Playing with a metronome", "Complete song groove"],
    intermediate: ["Sixteenth-note subdivisions", "Ghost notes and dynamics", "Open hi-hat grooves", "Linear coordination", "Shuffle and triplet feel", "Tom orchestration", "Syncopated bass drum", "Fills across bar lines", "Playing to a click track", "Intermediate song performance"],
    advanced: ["Four-limb independence", "Polyrhythms and metric layers", "Odd-time grooves", "Advanced rudiment orchestration", "Afrobeat coordination", "Jazz ride independence", "Metric modulation", "Improvised solo construction", "Studio consistency", "Advanced live performance"],
  },
  "music-theory": {
    beginner: ["Pitch, staff and clefs", "Note values and rests", "Time signatures and bar lines", "The major scale formula", "Intervals by number", "Major and minor triads", "Key signatures", "Common chord progressions", "Melody and phrase structure", "Beginner theory review"],
    intermediate: ["Circle of fifths", "Natural, harmonic and melodic minor", "Diatonic harmony", "Seventh chords", "Inversions and voice leading", "Compound meter and syncopation", "Cadences and harmonic function", "Transposition", "Ear training and dictation", "Analyse a complete song"],
    advanced: ["Modes and modal interchange", "Secondary dominants", "Borrowed chords", "Altered and extended harmony", "Counterpoint and independent lines", "Odd meters and polyrhythm", "Advanced ear training", "Reharmonisation", "Composition and form", "Advanced analysis portfolio"],
  },
};

const genericRoadmaps: Record<Level, string[]> = {
  beginner: ["Instrument setup and care", "Healthy posture and sound", "First notes and fingerings", "Reading notation", "Pulse and basic rhythm", "Major scale foundations", "Articulation and control", "Dynamics and phrasing", "Playing with accompaniment", "Beginner performance piece"],
  intermediate: ["Range and tone development", "Major scales in common keys", "Minor scales and patterns", "Intervals and arpeggios", "Syncopation and groove", "Expression and articulation", "Sight-reading fluency", "Ear training and transcription", "Improvisation foundations", "Intermediate recital"],
  advanced: ["Extended range and technique", "Advanced scale fluency", "Modes and harmonic language", "Complex rhythm and odd meter", "Advanced articulation", "Improvisation and vocabulary", "Arranging for ensemble", "Studio and stage craft", "Personal style development", "Advanced performance portfolio"],
};

const focusByInstrument: Record<string, string> = {
  "bass-guitar": "locking with the kick drum, fretboard knowledge and supportive bass lines",
  keyboard: "sound selection, splits, accompaniment and modern keyboard voicings",
  violin: "bow control, accurate intonation and expressive classical phrasing",
  ukulele: "relaxed chord changes, bright strumming and melody playing",
  recorder: "breath control, precise fingering and clean tonguing",
  flute: "supported air, focused tone and agile fingering",
  saxophone: "embouchure, breath support, tone and improvisation",
  trumpet: "buzzing, breath support, valve fluency and brass articulation",
  cello: "bow weight, first-position intonation and resonant phrasing",
  singing: "breath support, pitch accuracy, healthy registration and communication",
  "music-production": "critical listening, DAW workflow, arrangement, mixing and release preparation",
};

function makeQuiz(title: string, focus: string): QuizQuestion[] {
  return [
    { type: "multiple-choice", prompt: `What is the best way to begin practising ${title.toLowerCase()}?`, options: ["Slowly with a steady pulse", "At maximum speed", "Without listening", "Only once"], answer: "Slowly with a steady pulse", explanation: "Slow, attentive repetition builds accurate movement and reliable timing." },
    { type: "true-false", prompt: `Good ${focus} improves when you listen, adjust and repeat deliberately.`, answer: true, explanation: "Deliberate feedback turns repetition into measurable learning." },
    { type: "matching", prompt: "Match each practice habit with its purpose.", pairs: [{ left: "Metronome", right: "Steady timing" }, { left: "Recording", right: "Self-review" }, { left: "Slow practice", right: "Accuracy" }], explanation: "These three tools help you measure timing, awareness and accuracy." },
  ];
}

export function getLessons(slug: string, instrumentName: string, level: Level): Lesson[] {
  const titles = roadmaps[slug]?.[level] ?? genericRoadmaps[level];
  const focus = focusByInstrument[slug] ?? `${instrumentName.toLowerCase()} technique, musicianship and expression`;
  return titles.map((title, index) => ({
    id: `${level}-l${index + 1}`,
    title,
    duration: 20 + (index % 3) * 10,
    difficulty: level === "beginner" ? "Foundation" : level === "intermediate" ? "Developing" : "Mastery",
    theory: `${title} is an essential part of ${focus}. In this lesson you will connect the musical idea to a repeatable physical and listening process. Accuracy comes before speed: hear the goal, practise in short sections, and use a steady pulse before combining the complete skill.`,
    objectives: [`Explain the purpose of ${title.toLowerCase()}`, `Demonstrate the skill with controlled ${instrumentName.toLowerCase()} technique`, "Evaluate your timing and tone through a short recording"],
    keyPoints: ["Start slowly and stay relaxed", "Use a metronome or steady backing track", "Listen for one improvement at a time"],
    steps: [`Review your setup and warm up for 3 minutes`, `Study the ${title.toLowerCase()} reference and say the pattern aloud`, "Practise one small section five accurate times", "Add the next section and connect both without stopping", "Record one complete attempt and write down one improvement"],
    exercises: [`Play the core pattern at 60 BPM for two minutes`, "Repeat at three dynamic levels", "Use the idea in a four-bar musical phrase"],
    homework: `Complete three focused 10-minute sessions on ${title.toLowerCase()}. Record the final session and note what became easier.`,
    visual: `${instrumentName}: ${title} reference`,
    quiz: makeQuiz(title, focus),
  }));
}

export function buildSearchIndex(courses: { slug: string; name: string; description: string }[]) {
  return courses.flatMap((course) => (["beginner", "intermediate", "advanced"] as Level[]).flatMap((level) =>
    getLessons(course.slug, course.name, level).map((lesson, index) => ({ course, level, lesson, index, search: `${course.name} ${course.description} ${level} ${lesson.title} ${lesson.theory} ${lesson.keyPoints.join(" ")}`.toLowerCase() })),
  ));
}

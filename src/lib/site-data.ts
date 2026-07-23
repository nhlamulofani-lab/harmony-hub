import piano from "@/assets/inst-piano.jpg";
import guitar from "@/assets/inst-guitar.jpg";
import violin from "@/assets/inst-violin.jpg";
import drums from "@/assets/inst-drums.jpg";
import keyboard from "@/assets/inst-keyboard.jpg";
import bass from "@/assets/inst-bass.jpg";
import ukulele from "@/assets/inst-ukulele.jpg";
import recorder from "@/assets/inst-recorder.jpg";
import sax from "@/assets/inst-sax.jpg";
import trumpet from "@/assets/inst-trumpet.jpg";
import flute from "@/assets/inst-flute.jpg";
import cello from "@/assets/inst-cello.jpg";
import singing from "@/assets/inst-singing.jpg";
import production from "@/assets/inst-production.jpg";




export type Level = "beginner" | "intermediate" | "advanced";

export type Lesson = {
  id: string;             // stable, e.g. "l1"
  number: number;         // 1..10
  title: string;
  objectives: string[];
  theory: string;
  steps: string[];
  techniqueExercises: string[];
  practiceRoutine: string;
  homework: string;
  tips: string[];
  mistakes: string[];
  durationMin: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  visual: string;
  theoryTopic: string;
};

export type Instrument = {
  slug: string;
  name: string;
  family: "keys" | "strings" | "woodwind" | "brass" | "percussion" | "voice" | "production" | "theory";
  description: string;
  longDescription: string;
  history: string;
  whatYouLearn: string[];
  image: string;
  // Instrument-specific vocabulary used to author lessons
  firstNotes: string;            // e.g. "C D E F G"
  primaryScale: string;          // e.g. "C major"
  soloFriendly: string;          // e.g. "blues scale"
  keyTechnique: string;          // e.g. "hand independence"
  articulationTerm: string;      // e.g. "staccato & legato"
  ensembleContext: string;       // e.g. "in a full band"
  practiceSong: string;          // e.g. "'Ode to Joy'"
  intermediateSong: string;
  advancedSong: string;
};

export const instruments: Instrument[] = [
  {
    slug: "piano",
    name: "Piano",
    family: "keys",
    description: "Master melody and harmony on the classical foundation of every musician.",
    longDescription:
      "The piano is the most complete instrument you can learn. With 88 keys spanning the full musical range, it gives you an unmatched view of harmony, melody and rhythm all at once.",
    history:
      "Invented by Bartolomeo Cristofori around 1700, the piano replaced the harpsichord because it could play both softly (piano) and loudly (forte). It has shaped every major style — from Mozart and Chopin to Duke Ellington and Alicia Keys.",
    whatYouLearn: ["Correct posture & hand shape", "Reading treble & bass clef", "Major & minor scales", "Chord voicings & inversions", "Pedaling technique", "Simple improvisation"],
    image: piano,
    firstNotes: "C D E F G (middle C position)",
    primaryScale: "C major scale (both hands)",
    soloFriendly: "C blues scale",
    keyTechnique: "hand independence",
    articulationTerm: "legato and staccato touch",
    ensembleContext: "as an accompanist and a soloist",
    practiceSong: "'Ode to Joy'",
    intermediateSong: "'Für Elise' (opening section)",
    advancedSong: "a full jazz standard like 'Autumn Leaves'",
  },
  {
    slug: "keyboard",
    name: "Keyboard",
    family: "keys",
    description: "Sounds, splits and modern production techniques for stage and studio.",
    longDescription:
      "The keyboard is the modern piano's stage-ready cousin — lighter, packed with sounds, and central to gospel, worship, pop and electronic music.",
    history:
      "Digital keyboards emerged in the 1970s with pioneers like Yamaha, Roland and Korg. They powered disco, gospel, hip-hop and modern worship.",
    whatYouLearn: ["Selecting sounds & splits", "Chord shapes for songs", "Left-hand bass patterns", "Playing with a drummer", "Modern gospel voicings", "Basic MIDI recording"],
    image: keyboard,
    firstNotes: "C D E F G",
    primaryScale: "C major and A minor",
    soloFriendly: "minor pentatonic",
    keyTechnique: "sound selection and layering",
    articulationTerm: "sustained pads vs. staccato leads",
    ensembleContext: "with a band and drummer",
    practiceSong: "'Amazing Grace'",
    intermediateSong: "a modern worship song in C or G",
    advancedSong: "a gospel arrangement with reharmonisation",
  },
  {
    slug: "guitar",
    name: "Guitar",
    family: "strings",
    description: "Chords, riffs and fingerstyle — the most versatile instrument on the planet.",
    longDescription:
      "The guitar is loved worldwide because it's portable, expressive and works in every style — acoustic ballads, blues, rock, gospel and afro-pop.",
    history:
      "The modern guitar evolved in 16th-century Spain and exploded globally in the 20th century with players like Django Reinhardt, Jimi Hendrix and BB King.",
    whatYouLearn: ["Tuning by ear & with a tuner", "Open chords & barre chords", "Strumming & picking patterns", "Reading tabs & chord charts", "Fingerstyle basics", "Playing full songs"],
    image: guitar,
    firstNotes: "open E A D G B e strings",
    primaryScale: "G major scale (open position)",
    soloFriendly: "minor pentatonic in A",
    keyTechnique: "chord changes and strumming",
    articulationTerm: "hammer-ons and pull-offs",
    ensembleContext: "in an acoustic duo or full band",
    practiceSong: "'Knockin' on Heaven's Door'",
    intermediateSong: "a fingerpicked ballad like 'Blackbird'",
    advancedSong: "an improvised blues in A",
  },
  {
    slug: "bass-guitar",
    name: "Bass Guitar",
    family: "strings",
    description: "Lock in with the drums and become the backbone of any band.",
    longDescription:
      "The bass is the glue between the drums and the melody. Bass players are always in demand because they make everything else sound better.",
    history:
      "The electric bass replaced the double bass in the 1950s. James Jamerson, Jaco Pastorius and Marcus Miller turned it into a lead voice.",
    whatYouLearn: ["Fretboard notes", "Finger & pick technique", "Reading bass tabs", "Locking in with drums", "Simple grooves", "Walking bass lines"],
    image: bass,
    firstNotes: "open E A D G strings",
    primaryScale: "E minor pentatonic",
    soloFriendly: "blues scale in E",
    keyTechnique: "locking in with the kick drum",
    articulationTerm: "muted vs. sustained notes",
    ensembleContext: "with the drummer",
    practiceSong: "a simple 1-5 root pattern in E",
    intermediateSong: "a Motown-style groove in F",
    advancedSong: "a walking bass line over a 12-bar blues",
  },
  {
    slug: "violin",
    name: "Violin",
    family: "strings",
    description: "Develop bowing, intonation and expression through a proven classical path.",
    longDescription:
      "The violin is the voice of the orchestra — expressive, singing, capable of the softest whisper and the loudest cry.",
    history:
      "Perfected in 16th-century Italy by makers like Stradivari, the violin dominates classical music and has crossed into folk, jazz and gospel.",
    whatYouLearn: ["Bow hold & posture", "Left-hand finger placement", "First position notes", "Simple bowing patterns", "Playing in tune (intonation)", "Reading treble clef"],
    image: violin,
    firstNotes: "open G D A E and first-finger notes",
    primaryScale: "D major scale (first position)",
    soloFriendly: "A minor pentatonic",
    keyTechnique: "smooth détaché bowing",
    articulationTerm: "détaché, legato and staccato",
    ensembleContext: "in a small ensemble",
    practiceSong: "'Twinkle, Twinkle Little Star'",
    intermediateSong: "a movement from Bach's Minuet in G",
    advancedSong: "a movement from a Vivaldi concerto",
  },
  {
    slug: "cello",
    name: "Cello",
    family: "strings",
    description: "The rich, singing tenor voice of the string family.",
    longDescription:
      "The cello has a range that mirrors the human voice, from a deep baritone to a soaring tenor. It's essential in orchestras, quartets and increasingly in pop and film music.",
    history:
      "Standardised in the 17th century, the cello was elevated to a solo instrument by Bach's Cello Suites and later by cellists like Pablo Casals and Yo-Yo Ma.",
    whatYouLearn: ["Correct sitting posture", "Left hand shape & intonation", "Bow technique in the lower half", "Reading bass clef", "Simple bowings", "First position notes"],
    image: cello,
    firstNotes: "open C G D A and first-finger notes",
    primaryScale: "G major scale (first position)",
    soloFriendly: "D minor scale",
    keyTechnique: "even bow speed and pressure",
    articulationTerm: "détaché and legato",
    ensembleContext: "in a string quartet",
    practiceSong: "'Long, Long Ago'",
    intermediateSong: "the Prelude from Bach's 1st Cello Suite (excerpt)",
    advancedSong: "the full Prelude from Bach's 1st Cello Suite",
  },
  {
    slug: "ukulele",
    name: "Ukulele",
    family: "strings",
    description: "The friendliest first instrument — full songs in your first week.",
    longDescription:
      "The ukulele is small, affordable and surprisingly capable. Its four nylon strings make chord shapes easy for beginners, and you can play thousands of songs with just a handful of chords.",
    history:
      "Developed in Hawaii in the 1880s from Portuguese instruments, the ukulele had a big revival with players like Israel Kamakawiwo'ole and Jake Shimabukuro.",
    whatYouLearn: ["Tuning G-C-E-A", "First 4 chords (C, F, Am, G)", "Basic strumming patterns", "Reading chord charts", "Fingerpicking basics", "Playing full songs"],
    image: ukulele,
    firstNotes: "open G C E A strings",
    primaryScale: "C major (open position)",
    soloFriendly: "C major pentatonic",
    keyTechnique: "clean chord changes",
    articulationTerm: "chuck (percussive) strumming",
    ensembleContext: "as a solo accompanist",
    practiceSong: "'Riptide' (C, G, Am, F)",
    intermediateSong: "'Somewhere Over the Rainbow' (Israel Kamakawiwo'ole)",
    advancedSong: "a fingerpicked instrumental in C",
  },
  {
    slug: "recorder",
    name: "Recorder",
    family: "woodwind",
    description: "A perfect first wind instrument — learn to read music and breathe like a pro.",
    longDescription:
      "The recorder gets a bad name from school music classes, but a well-played recorder is a beautiful, expressive instrument used across early music and folk styles.",
    history:
      "Popular from the medieval period through the Baroque era, the recorder was central to composers like Handel and Telemann and is still widely taught today.",
    whatYouLearn: ["Correct breath control", "Fingering the first notes", "Reading treble clef", "Tonguing to articulate notes", "Playing in tune", "Simple songs and duets"],
    image: recorder,
    firstNotes: "B A G (top three fingers)",
    primaryScale: "G major scale",
    soloFriendly: "D minor scale",
    keyTechnique: "steady breath and tonguing",
    articulationTerm: "single-tonguing",
    ensembleContext: "in a recorder duet",
    practiceSong: "'Hot Cross Buns'",
    intermediateSong: "a Baroque minuet",
    advancedSong: "a Handel sonata movement",
  },
  {
    slug: "flute",
    name: "Flute",
    family: "woodwind",
    description: "Bright, singing tone across classical, jazz and world music.",
    longDescription:
      "The flute is one of the oldest instruments in the world. On the modern concert flute you'll develop breath control, a beautiful tone and the ability to play across every style.",
    history:
      "The modern Boehm-system flute was perfected in the 1830s. It became a solo star through players like James Galway and Hubert Laws.",
    whatYouLearn: ["Producing your first tone", "Correct embouchure", "Fingerings for the first octave", "Reading treble clef", "Vibrato basics", "Simple melodies"],
    image: flute,
    firstNotes: "B A G (first octave)",
    primaryScale: "B-flat major scale",
    soloFriendly: "D minor scale",
    keyTechnique: "focused embouchure",
    articulationTerm: "tonguing and slurs",
    ensembleContext: "in a wind ensemble",
    practiceSong: "'Mary Had a Little Lamb'",
    intermediateSong: "a Bach minuet",
    advancedSong: "a movement from a Mozart flute concerto",
  },
  {
    slug: "saxophone",
    name: "Saxophone",
    family: "woodwind",
    description: "Embouchure, tone and improvisation across jazz, funk and gospel.",
    longDescription:
      "The saxophone is smooth, powerful and unmistakably human. From smooth jazz to church, the sax is a lifelong companion.",
    history:
      "Invented by Adolphe Sax in 1846, the saxophone became the voice of jazz through Charlie Parker, John Coltrane and Sonny Rollins.",
    whatYouLearn: ["Assembly & reed care", "Embouchure & breath support", "First notes on the sax", "Major scales", "Simple melodies", "First improv over a blues"],
    image: sax,
    firstNotes: "B A G (middle register)",
    primaryScale: "F major scale",
    soloFriendly: "blues scale in F",
    keyTechnique: "consistent embouchure and air support",
    articulationTerm: "legato tonguing",
    ensembleContext: "in a horn section",
    practiceSong: "a simple hymn like 'Amazing Grace'",
    intermediateSong: "a 12-bar blues melody",
    advancedSong: "a solo transcription over a jazz standard",
  },
  {
    slug: "trumpet",
    name: "Trumpet",
    family: "brass",
    description: "Powerful brass playing from first notes to soloing with confidence.",
    longDescription:
      "The trumpet is bold, bright and unforgettable. It leads brass sections in jazz, gospel, orchestras and marching bands.",
    history:
      "The modern valved trumpet appeared in the 1810s and was made iconic by Louis Armstrong, Miles Davis and Hugh Masekela.",
    whatYouLearn: ["Buzzing & embouchure", "Fingering the valves", "First 5 notes", "Long tones for a beautiful sound", "Simple songs", "Playing in tune with others"],
    image: trumpet,
    firstNotes: "C G low-C (open, 1+3, open)",
    primaryScale: "C major scale",
    soloFriendly: "blues scale in C",
    keyTechnique: "buzzing lips and steady air",
    articulationTerm: "single and double tonguing",
    ensembleContext: "in a brass section",
    practiceSong: "'When the Saints Go Marching In'",
    intermediateSong: "a jazz melody like 'St. Louis Blues'",
    advancedSong: "a Clifford Brown solo transcription",
  },
  {
    slug: "drums",
    name: "Drums",
    family: "percussion",
    description: "Build rock-solid timing, groove and coordination behind the kit.",
    longDescription:
      "Drums are the heartbeat of every band. You'll learn independence, timing and how to make people move.",
    history:
      "Drum kits as we know them were assembled in the early 1900s. Legends like Buddy Rich, Tony Allen and Questlove shaped modern grooves.",
    whatYouLearn: ["Kit setup & stick grip", "Reading drum notation", "Basic rock & pop beats", "Fills & transitions", "Timing with a metronome", "Playing to real songs"],
    image: drums,
    firstNotes: "kick, snare, hi-hat",
    primaryScale: "not applicable — focus on subdivisions",
    soloFriendly: "single-stroke roll and paradiddle",
    keyTechnique: "limb independence",
    articulationTerm: "accents and ghost notes",
    ensembleContext: "with a bass player",
    practiceSong: "a basic 4/4 rock beat at 90 BPM",
    intermediateSong: "a groove with a 16th-note hi-hat",
    advancedSong: "a linear fusion pattern",
  },
  {
    slug: "singing",
    name: "Singing & Vocal Training",
    family: "voice",
    description: "Breath, tone and pitch training for confident, expressive singing.",
    longDescription:
      "Your voice is the most personal instrument you'll ever play. Vocal training teaches you to sing on pitch, project without strain and communicate emotion.",
    history:
      "Formal vocal pedagogy dates back to Italian bel canto in the 17th century. Modern voice training draws from opera, gospel, musical theatre and pop.",
    whatYouLearn: ["Diaphragmatic breathing", "Vocal warm-ups", "Pitch accuracy", "Range extension", "Diction & vowel shapes", "Song interpretation"],
    image: singing,
    firstNotes: "5-note scale (do-re-mi-fa-sol) in a comfortable key",
    primaryScale: "major scale on solfège",
    soloFriendly: "call-and-response phrases",
    keyTechnique: "supported breath from the diaphragm",
    articulationTerm: "legato phrasing and clear consonants",
    ensembleContext: "in a small choir or with a band",
    practiceSong: "'Happy Birthday' in a comfortable key",
    intermediateSong: "a full pop ballad in your range",
    advancedSong: "an aria or jazz standard with improvisation",
  },
  {
    slug: "music-production",
    name: "Music Production",
    family: "production",
    description: "Build songs from scratch with a DAW, MIDI and mixing basics.",
    longDescription:
      "Music production is the modern craft of creating full songs on a computer. You'll learn a DAW, MIDI, virtual instruments, recording and mixing to a professional standard.",
    history:
      "Home production exploded in the 1990s with affordable computers. Today most hit records — from Afrobeats to K-Pop to hip-hop — are made in bedrooms and small studios.",
    whatYouLearn: ["DAW basics (transport, tracks, tools)", "MIDI programming", "Recording audio", "Mixing fundamentals", "EQ, compression and reverb", "Exporting a finished track"],
    image: production,
    firstNotes: "a 4-bar MIDI drum loop",
    primaryScale: "C minor for a modern trap/afrobeats vibe",
    soloFriendly: "melody in the pentatonic scale over the loop",
    keyTechnique: "gain staging and headroom",
    articulationTerm: "velocity and quantise",
    ensembleContext: "arranging multiple tracks",
    practiceSong: "an 8-bar loop with drums, bass and chords",
    intermediateSong: "a full 2-minute arrangement",
    advancedSong: "a finished, mixed and mastered track",
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

// ---- Music theory topics threaded through the courses ----
const THEORY_TOPICS: Record<Level, string[]> = {
  beginner: [
    "The musical alphabet (A B C D E F G)",
    "The staff, treble & bass clef",
    "Note values: whole, half, quarter, eighth",
    "Rests and silence in music",
    "Time signatures (4/4, 3/4, 2/4)",
    "Simple rhythms and counting",
    "Dynamics: piano, forte, crescendo",
    "The C major scale",
    "Intervals: 2nds, 3rds, 4ths, 5ths",
    "Simple chords: I, IV, V",
    "Tempo markings & the metronome",
    "Articulation: legato & staccato",
    "Basic ear training: high vs low, loud vs soft",
  ],
  intermediate: [
    "Major & minor scales",
    "Key signatures & the circle of fifths",
    "Triads: major, minor, diminished, augmented",
    "Chord inversions",
    "The pentatonic scale",
    "Chord progressions (I–V–vi–IV)",
    "Syncopation & 16th-note rhythms",
    "Reading in multiple keys",
    "Basic sight-reading strategy",
    "Ear training: intervals and chord quality",
    "Arpeggios across the range",
    "Simple modulation between keys",
    "Song form: verse / chorus / bridge",
  ],
  advanced: [
    "7th chords (maj7, min7, dominant 7)",
    "Modes of the major scale",
    "Secondary dominants",
    "Melodic & harmonic minor scales",
    "Advanced chord voicings & voice leading",
    "Extended harmony: 9ths, 11ths, 13ths",
    "Reharmonisation techniques",
    "Improvisation over changes",
    "Complex rhythms & odd meters",
    "Counterpoint basics",
    "Advanced sight-reading",
    "Composition & arranging basics",
    "Performance preparation & mindset",
  ],
};


// ---- Level-specific lesson templates ----
type Template = {
  title: (i: Instrument) => string;
  objectives: (i: Instrument) => string[];
  theory: (i: Instrument, theoryTopic: string) => string;
  steps: (i: Instrument) => string[];
  techniqueExercises: (i: Instrument) => string[];
  practiceRoutine: (i: Instrument) => string;
  homework: (i: Instrument) => string;
  tips: (i: Instrument) => string[];
  mistakes: (i: Instrument) => string[];
  visual: string;
  durationMin: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
};

const beginnerTemplates: Template[] = [
  {
    title: (i) => `Introduction to the ${i.name}`,
    objectives: (i) => [
      `Understand what the ${i.name.toLowerCase()} is`,
      `Learn how the ${i.name.toLowerCase()} is used`,
      "Practice basic posture for playing",
      "Practice basic hand position for playing",
    ],
    theory: (i, t) =>
      `Welcome to your first lesson on the ${i.name.toLowerCase()}! In this lesson, we\'ll explore what the ${i.name.toLowerCase()} is, how it\'s typically used in music, and the fundamental posture and hand positions required to play it effectively. We\'ll also touch upon ${t} to give you a foundational understanding of music theory related to your instrument. Proper posture and hand position are crucial for developing good technique and preventing discomfort, so we\'ll focus on these basics before we even play a note.`,
    steps: (i) => [
      `Identify the main parts of the ${i.name.toLowerCase()}`,
      `Demonstrate how the ${i.name.toLowerCase()} is held or positioned`,
      "Practice sitting or standing with correct playing posture",
      "Form the basic hand shape for playing the instrument",
    ],
    techniqueExercises: (i) => [
      `Spend 10-15 minutes becoming comfortable holding and using the ${i.name.toLowerCase()}`,
      "Perform gentle stretches for hands and wrists",
      "Practice maintaining correct posture for short periods",
    ],
    practiceRoutine: () =>
      "15 minutes: 5 min posture check, 5 min hand position practice, 5 min familiarization with the instrument.",
    homework: (i) =>
      `Observe professional musicians playing the ${i.name.toLowerCase()} and note their posture and hand position.`,
    tips: () => [
      "Start slowly and focus on comfort",
      "Use a mirror to check your posture and hand position",
      "Don\'t be afraid to adjust until it feels natural",
    ],
    mistakes: () => [
      "Slouching or hunching over the instrument",
      "Tensing up shoulders or wrists",
      "Gripping the instrument too tightly",
    ],
    visual: "Instrument diagram with posture/hand position",
    durationMin: 15,
    difficulty: 1,
  },
  {
    title: (i) => `Basic Notes on the ${i.name}`,
    objectives: (i) => [
      `Play ${i.firstNotes} cleanly`,
      "Understand simple rhythm patterns",
      "Apply basic finger placement",
    ],
    theory: (i, t) =>
      `Now that you\'re comfortable with your instrument, it\'s time to play your first notes! We\'ll focus on ${i.firstNotes} and introduce simple rhythm. Understanding ${t} will help you connect the sounds you make with the underlying musical structure. Remember to play slowly and deliberately, focusing on clear tones and accurate finger placement. This foundational step is crucial for developing good habits and building a strong musical base.`,
    steps: (i) => [
      `Play each of ${i.firstNotes} individually`,
      "Practice simple rhythm exercises (e.g., quarter notes)",
      "Focus on correct finger placement for each note",
      "Play short, repetitive patterns to build muscle memory",
    ],
    techniqueExercises: (i) => [
      `Repeat ${i.firstNotes} with a steady rhythm`,
      "Practice finger exercises to improve dexterity",
      "Play along with a metronome at a slow tempo",
    ],
    practiceRoutine: () =>
      "20 minutes: 5 min warm-up, 10 min playing first notes with rhythm, 5 min finger placement drills.",
    homework: (i) =>
      `Practice playing ${i.firstNotes} repeatedly until they sound clear and even.`,
    tips: () => [
      "Listen carefully to the sound you produce",
      "Use a metronome to develop a steady beat",
      "Relax your hands and fingers as much as possible",
    ],
    mistakes: () => [
      "Rushing through notes",
      "Inconsistent volume or tone",
      "Incorrect finger placement leading to buzzing or muffled sounds",
    ],
    visual: "Fingering chart for first notes",
    durationMin: 25,
    difficulty: 1,
  },
  {
    title: (i) => `Your First Song on the ${i.name}`,
    objectives: (i) => [
      `Play a simple beginner exercise or melody on the ${i.name.toLowerCase()}`,
      "Maintain a steady rhythm throughout the song",
      "Build confidence in your playing ability",
    ],
    theory: (i, t) =>
      `Congratulations on reaching your first song! This lesson is all about applying what you\'ve learned to play a complete, albeit simple, piece of music. We\'ll focus on playing with a steady rhythm and building your confidence. This is where ${t} comes into play, as understanding the structure of the song will help you play it more musically. Don\'t worry about perfection; the goal is to enjoy the process and feel the satisfaction of playing a full song.`,
    steps: (i) => [
      `Learn the melody for ${i.practiceSong}`,
      "Practice each phrase of the song slowly",
      "Play the entire song with a metronome",
      "Perform the song for yourself or a friend",
    ],
    techniqueExercises: (i) => [
      `Play ${i.practiceSong} repeatedly, focusing on smooth transitions`,
      "Practice counting out loud while playing",
      "Record yourself and listen back for areas to improve",
    ],
    practiceRoutine: () =>
      "25 minutes: 5 min warm-up, 15 min song practice (sections then full), 5 min free play.",
    homework: (i) =>
      `Perform ${i.practiceSong} for at least one person this week.`,
    tips: () => [
      "Break the song into small, manageable sections",
      "Don\'t be afraid to play slowly; speed will come with practice",
      "Enjoy the process of making music!",
    ],
    mistakes: () => [
      "Trying to play too fast too soon",
      "Skipping practice on difficult sections",
      "Getting discouraged by mistakes",
    ],
    visual: "Sheet music for first song",
    durationMin: 30,
    difficulty: 2,
  },
  {
    title: (i) => `Welcome to the ${i.name}`,
    objectives: (i) => [
      `Name every major part of the ${i.name.toLowerCase()}`,
      "Understand how sound is produced",
      "Set up your practice space safely",
    ],
    theory: (i, t) =>
      `Before you play a single note, it helps to know your instrument. The ${i.name.toLowerCase()} produces sound in a specific way — understanding that changes how you approach it. In this lesson we cover the anatomy of the ${i.name.toLowerCase()} and pair it with your first music theory topic: ${t}. Music is a written language and, just like any language, you have to learn a few symbols before you can read a sentence. We'll introduce those symbols slowly so you're never overwhelmed. By the end you should be able to point to every important part of the ${i.name.toLowerCase()} and explain what it does. This foundation makes every future lesson faster and clearer, because your teacher's instructions ("hold the bow near the frog", "your right thumb on middle C", "stick tip on the snare") will already make sense. Take your time here — most students who quit later say they wish they'd spent longer on the basics.`,
    steps: (i) => [
      `Unpack and place the ${i.name.toLowerCase()} the correct way`,
      "Identify each part out loud (say the names)",
      "Watch and copy how sound is produced",
      "Do one 30-second silent posture check",
    ],
    techniqueExercises: () => [
      "Sit / stand in playing position for 60 seconds, shoulders relaxed",
      "Take 10 slow diaphragmatic breaths",
      "Practise the resting position between attempts",
    ],
    practiceRoutine: (i) =>
      `10 minutes total: 3 minutes posture check, 3 minutes naming parts of the ${i.name.toLowerCase()} out loud, 4 minutes producing your very first sound repeatedly with clean form.`,
    homework: (i) =>
      `Write down the 5 most important parts of the ${i.name.toLowerCase()} in your practice journal and describe what each one does in one sentence.`,
    tips: () => [
      "Record a 30-second video of yourself in playing position — watching it back is the fastest fix",
      "Play in a quiet room so you can hear tone details",
      "Keep the instrument close to your practice spot — friction kills consistency",
    ],
    mistakes: () => [
      "Tensing your shoulders while trying to concentrate",
      "Rushing past posture to 'get to the fun part'",
      "Skipping the setup step and paying for it with pain later",
    ],
    visual: "Anatomy diagram",
    durationMin: 15,
    difficulty: 1,
  },
  {
    title: () => "Posture, hand position and how to hold the instrument",
    objectives: (i) => [
      "Set up correct posture that you can maintain for 30+ minutes",
      `Hold the ${i.name.toLowerCase()} in a way that produces the best sound`,
      "Learn what tension feels like — and how to release it",
    ],
    theory: (i, t) =>
      `Great sound starts before any note is played. Your posture and hand position on the ${i.name.toLowerCase()} directly control your tone, your speed and — crucially — whether you'll be able to play pain-free for years. In this lesson we also cover ${t}, because reading music and playing music share the same relaxed focus. Watch professional players and you'll notice how still and relaxed they look: that's not luck, that's trained posture. We'll break down each element (feet, hips, back, shoulders, arms, hands) and give you a checklist you can run through before every practice session. You'll also learn to recognise your body's warning signs — tightness in the shoulders, a locked wrist, a pinched breath — so you can release them before they become injuries.`,
    steps: () => [
      "Feet flat and hip-width apart (or seated squarely)",
      "Back tall but not stiff — imagine a string pulling the crown of your head up",
      "Shoulders drop away from your ears",
      "Elbows fall naturally, wrists straight",
      "Hands relaxed, thumb rounded, no gripping",
    ],
    techniqueExercises: (i) => [
      "Hold the perfect position for 2 minutes with your eyes closed and scan for tension",
      `Play one long note on the ${i.name.toLowerCase()} while a friend or mirror checks your posture`,
      "Roll your shoulders 5 times before every practice",
    ],
    practiceRoutine: () =>
      "15 minutes total: 5 minutes posture reset routine, 5 minutes playing one held note with checks every 30 seconds, 5 minutes gentle body reset (shoulder rolls, wrist circles, deep breaths).",
    homework: () =>
      "Take a photo of yourself in playing position from the front and the side. Compare with a reference photo of a pro. Note 2 differences you'll fix this week.",
    tips: () => [
      "Set a 30-second timer to remind you to reset posture during practice",
      "If it hurts, stop. Pain is information, not a badge",
      "Warm up your body before your instrument — it's still a physical skill",
    ],
    mistakes: () => [
      "Slouching once you 'get into' the music",
      "Death-gripping the instrument out of nervousness",
      "Sitting too far forward or too far back from the instrument",
    ],
    visual: "Posture reference chart",
    durationMin: 20,
    difficulty: 1,
  },
  {
    title: () => "Reading music: the staff, clefs and note names",
    objectives: () => [
      "Read notes on a staff with the treble (and/or bass) clef",
      "Name every line and space",
      "Sight-read a 4-bar rhythm",
    ],
    theory: (i, t) =>
      `Music notation is one of the great inventions in history. Five lines and four spaces let you write down any melody, ever. In this lesson we introduce the staff, the clef used most often on the ${i.name.toLowerCase()}, and how notes sit on it. We tie this directly into ${t} so the theory is not abstract — you'll be reading and playing the same page. Once you can read the staff, you unlock every piece of sheet music in the world. We take it slowly: line by line, space by space, with mnemonics that stick. Then we practise identifying a note in under 3 seconds — a skill that grows quickly with a little daily work. Reading music is like reading text: at first every letter is a struggle, then suddenly whole words appear. Trust the process.`,
    steps: () => [
      "Draw a 5-line staff and label the lines/spaces",
      "Learn the mnemonic for your clef (e.g. Every Good Boy Does Fine)",
      "Identify 10 notes flashcard-style at 3 seconds each",
      "Play the first 5 notes of the C major scale from the page",
    ],
    techniqueExercises: () => [
      "Say the note name out loud as you play it — every time",
      "Write out one bar of quarter notes and clap them",
      "Use a free flashcard app for 5 minutes daily",
    ],
    practiceRoutine: () =>
      "20 minutes: 5 minutes flashcards, 5 minutes clapping and counting rhythms, 10 minutes playing a 4-bar written exercise slowly with the metronome.",
    homework: () =>
      "Write out a familiar melody (like Happy Birthday) using letter names, then translate it onto a staff. Play it back.",
    tips: () => [
      "Use pencil so you can annotate without fear",
      "Read one new line of music every morning while your coffee brews",
      "Group notes visually — recognise shapes, not individual dots",
    ],
    mistakes: () => [
      "Guessing note names instead of using the mnemonic",
      "Ignoring the time signature and rhythm",
      "Practising fast before you can read slowly",
    ],
    visual: "Staff & clef reference",
    durationMin: 25,
    difficulty: 2,
  },
  {
    title: (i) => `Your first notes on the ${i.name.toLowerCase()}`,
    objectives: (i) => [
      `Play ${i.firstNotes} cleanly and evenly`,
      "Count each note out loud in 4/4",
      "Match the sound of a reference recording",
    ],
    theory: (i, t) =>
      `Playing your first notes is a big moment. On the ${i.name.toLowerCase()}, the first notes are ${i.firstNotes}. In this lesson we combine those first notes with the theory topic ${t}, so every physical action you take is tied to the music you're reading. We focus on tone first, speed later. A single perfectly-produced note is worth ten sloppy ones — always. You'll learn to listen for a clean start, a steady sustain and a clean release. This is the same discipline that professional players carry into their most complex pieces. It's also where students who plateau usually cut corners; if you don't cut them here, you'll accelerate later.`,
    steps: (i) => [
      "Play each of your first notes slowly, one at a time",
      "Hold each note for 4 beats and listen for a steady tone",
      "Play the notes up in order, then back down",
      `Play with a metronome at 60 BPM using ${i.firstNotes}`,
    ],
    techniqueExercises: (i) => [
      `10 slow long tones on each of ${i.firstNotes}`,
      "Play a note, sing/hum it, then play it again matching the pitch",
      "Play the notes in different rhythms (quarter, half, whole)",
    ],
    practiceRoutine: () =>
      "20 minutes: 5 minutes warm-up, 10 minutes playing the first notes cleanly with the metronome at 60 BPM, 5 minutes freely exploring the sound.",
    homework: (i) =>
      `Record yourself playing the ${i.firstNotes} up and down. Listen back and pick the cleanest note — that's your target sound for every other note.`,
    tips: () => [
      "Breathe out on every note (even non-wind instruments) — releases tension",
      "Slow is fast — clean at 60 BPM beats sloppy at 120 BPM",
      "Play into a wall for better acoustic feedback",
    ],
    mistakes: () => [
      "Rushing to more notes before the current ones sound clean",
      "Not counting out loud (you'll drift)",
      "Ignoring the release of each note",
    ],
    visual: "Fingering / notation chart",
    durationMin: 25,
    difficulty: 2,
  },
  {
    title: () => "Rhythm, note values and counting",
    objectives: () => [
      "Clap and play quarter, half, whole and eighth notes",
      "Count consistently in 4/4",
      "Play with a metronome at 60 BPM",
    ],
    theory: (i, t) =>
      `Rhythm is the beating heart of music. Great players are separated from good ones by their sense of time, not their technique. In this lesson we go deep on ${t} and on how to feel a steady pulse. You'll clap first, count out loud, and only then play on the ${i.name.toLowerCase()}. Clapping breaks the physical part into two skills so you can focus on time without also worrying about the note. Then you'll add the notes back in. We introduce the metronome as a friend — not a jail — and give you a simple daily habit that will train your internal clock. Within two weeks of consistent metronome work, students often report they can 'feel' the pulse even when the metronome is turned off. That's the goal.`,
    steps: () => [
      "Clap quarter notes for 8 beats",
      "Clap a mix of quarter + half + whole notes from a page",
      "Play the same pattern on your instrument, counting out loud",
      "Match a metronome at 60 BPM for 2 minutes without drifting",
    ],
    techniqueExercises: () => [
      "Set the metronome to 60 and play a note on every click for 60 seconds",
      "Set it to 60 and play a note on every OTHER click",
      "Clap the rhythm of a short familiar song from memory",
    ],
    practiceRoutine: () =>
      "20 minutes: 5 minutes clapping/counting only, 10 minutes playing simple rhythms with a metronome at 60 BPM, 5 minutes at 72 BPM.",
    homework: () =>
      "Choose a song you love. Clap the rhythm of the melody the whole way through. This trains your ear and time simultaneously.",
    tips: () => [
      "Count out loud — silent counting always drifts",
      "Foot tap on the beat as a physical anchor",
      "Practise with headphones and the metronome loud enough to feel",
    ],
    mistakes: () => [
      "Speeding up during exciting parts",
      "Slowing down when it gets hard",
      "Turning off the metronome as soon as it 'feels' right",
    ],
    visual: "Rhythm grid",
    durationMin: 25,
    difficulty: 2,
  },
  {
    title: (i) => `Play your first scale: ${i.primaryScale}`,
    objectives: (i) => [
      `Play the ${i.primaryScale} up and down cleanly`,
      "Understand why scales matter",
      "Use a scale as a warm-up",
    ],
    theory: (i, t) =>
      `Scales are the alphabet of music. Once you know ${i.primaryScale}, you understand a huge slice of the music you already love — because most pop, gospel, folk and even a lot of jazz uses this scale. We link this to ${t} so you see how the notes on the page match the notes under your fingers on the ${i.name.toLowerCase()}. A scale is not homework — it's a workout that builds tone, ear, technique and reading all at once. In this lesson we play the scale slowly, in strict rhythm, focusing on evenness. Every note should sound like the same person played it (that person being you). Speed comes later, and it comes naturally, once evenness is locked in.`,
    steps: (i) => [
      `Look at the notation for ${i.primaryScale}`,
      "Play it up slowly with a metronome at 60 BPM",
      "Play it back down at the same tempo",
      "Repeat 3 times — aim for even, matched tone on every note",
    ],
    techniqueExercises: (i) => [
      `Play the ${i.primaryScale} in quarter notes for 2 minutes`,
      "Play it in half notes with a metronome at 60 BPM",
      `Play it and sing each note name out loud`,
    ],
    practiceRoutine: (i) =>
      `25 minutes: 5 min warm-up, 10 min playing ${i.primaryScale} at 60 BPM, 5 min playing it at 72 BPM, 5 min cool down / free play.`,
    homework: (i) =>
      `Play ${i.primaryScale} up and down 5 times perfectly at 60 BPM. If you slip, restart the count. This builds discipline.`,
    tips: () => [
      "Say the note names out loud as you play — locks in reading",
      "Focus on the transitions between notes, not the notes themselves",
      "Keep your body relaxed for the whole scale",
    ],
    mistakes: () => [
      "Playing scales fast and sloppy",
      "Only playing up — always practise both directions",
      "Skipping scales because 'they're boring'",
    ],
    visual: "Scale fingering chart",
    durationMin: 25,
    difficulty: 2,
  },
  {
    title: () => "Dynamics: playing loud and soft",
    objectives: () => [
      "Recognise and play piano (p), mezzo (m) and forte (f)",
      "Add expression to a simple phrase",
      "Control your volume without changing tempo",
    ],
    theory: (i, t) =>
      `Music without dynamics is like a book read in a monotone. Dynamics are how you communicate emotion on the ${i.name.toLowerCase()}. We combine this with ${t} so you learn to read the markings on the page and translate them into sound. Playing quietly is often harder than playing loud — it demands focus and control. In this lesson you'll practise the same short phrase four ways: soft, loud, growing (crescendo) and fading (decrescendo). This tiny exercise transforms your musical vocabulary because suddenly you have four ways to say every phrase. Great players don't have more notes — they have more choices about how to play the notes they have.`,
    steps: () => [
      "Play a 4-note phrase at a comfortable middle volume",
      "Play the same phrase as softly as you can while keeping tone",
      "Play it as loudly as you can while keeping tone",
      "Play it starting soft and getting louder (crescendo)",
    ],
    techniqueExercises: (i) => [
      `Play ${i.primaryScale} soft going up, loud coming down`,
      "Play a long note starting silent and growing to full volume over 10 seconds",
      "Practise the same phrase five different ways in a row",
    ],
    practiceRoutine: () =>
      "20 minutes: 5 min warm-up, 10 min the same phrase in different dynamics, 5 min improvising with dynamics only (no new notes).",
    homework: () =>
      "Take one song you already know and play it entirely at a whisper volume without losing tone. This forces focus.",
    tips: () => [
      "Softer requires more focus than louder — it's a real skill",
      "Dynamics change how time feels — loud accelerates emotion, soft slows it",
      "Record yourself: what feels loud often isn't loud enough",
    ],
    mistakes: () => [
      "Speeding up when playing loud",
      "Losing tone when playing soft",
      "Ignoring dynamic markings on the page",
    ],
    visual: "Dynamic markings chart",
    durationMin: 20,
    difficulty: 2,
  },
  {
    title: () => "Simple chords and how songs are built",
    objectives: () => [
      "Understand what a chord is",
      "Play or arpeggiate 2 simple chords",
      "Recognise a I–IV–V progression by ear",
    ],
    theory: (i, t) =>
      `A chord is what happens when multiple notes are played (or implied) at the same time. Chords give music its emotion — major sounds bright, minor sounds sad, and progressions of chords create the story of a song. In this lesson we pair the chord basics with ${t} so you understand not just how chords sound but how they're built. Even on melodic instruments you should understand chords, because you're always playing over one (even if it's implied). By the end of this lesson you'll be able to hear a simple song and guess the chord family. That skill will grow into the ability to learn songs by ear — one of the most rewarding musical superpowers.`,
    steps: () => [
      "Learn what makes a chord 'major' vs 'minor'",
      "Play or arpeggiate a C major and A minor chord",
      "Listen to a song and count the chord changes",
      "Play along with a simple 2-chord loop",
    ],
    techniqueExercises: () => [
      "Alternate 4 beats of C, 4 beats of Am for 2 minutes",
      "Sing the root of each chord as it changes",
      "Try the same exercise with a different pair of chords",
    ],
    practiceRoutine: () =>
      "20 minutes: 5 min warm-up, 10 min chord/arpeggio exercise, 5 min playing along with a chord loop track.",
    homework: () =>
      "Pick a song you love and try to identify where the chord changes happen. You don't need to name them — just count them.",
    tips: () => [
      "Chords change on the strong beats (usually beat 1) — listen for that",
      "Feel the emotion of major vs minor in your body",
      "Play along with recordings — the ear develops fastest that way",
    ],
    mistakes: () => [
      "Rushing chord changes — you'll play them cleanly if you slow down",
      "Only practising chords in one order",
      "Not listening to the sound; watching your fingers only",
    ],
    visual: "Chord chart",
    durationMin: 25,
    difficulty: 3,
  },
  {
    title: (i) => `Play your first song: ${i.practiceSong}`,
    objectives: (i) => [
      `Play ${i.practiceSong} from start to finish`,
      "Combine everything you've learned so far",
      "Perform for a friend or record a full take",
    ],
    theory: (i, t) =>
      `This is the moment where all the pieces come together on the ${i.name.toLowerCase()}. You have notes, rhythm, dynamics and the beginnings of chord understanding. Now you'll apply them to ${i.practiceSong}. We tie this to the theory topic ${t} so you can see the reasoning inside the song — every note is a choice by the composer. Playing a full song, all the way through, without stopping, is a real milestone. Even short simple songs demand focus from start to finish. When you can do that, you're no longer just practising exercises — you're making music.`,
    steps: (i) => [
      `Read through ${i.practiceSong} slowly, without your instrument`,
      "Practise the trickiest bars in isolation",
      "Play the whole song at 60% tempo",
      "Play it once through without stopping — even if you slip",
    ],
    techniqueExercises: () => [
      "Isolate the hardest bar and repeat it 5 times cleanly",
      "Play the song silently in your head from start to finish",
      "Play the song with a metronome, then without",
    ],
    practiceRoutine: (i) =>
      `30 minutes: 5 min warm-up (scale), 10 min tricky bar drills, 10 min full run-throughs of ${i.practiceSong}, 5 min performance takes.`,
    homework: () =>
      "Record a full take of the song. Watch it back and note one thing to improve next week.",
    tips: () => [
      "Perform for someone — it changes your focus in a good way",
      "If you slip, don't stop — real performers keep going",
      "Play the song every day this week even after you 'know it'",
    ],
    mistakes: () => [
      "Restarting from the top every time you slip",
      "Only practising the easy sections",
      "Not learning the piece at slow tempo first",
    ],
    visual: "Full song score",
    durationMin: 30,
    difficulty: 3,
  },
  {
    title: () => "Level checkpoint: putting it all together",
    objectives: () => [
      "Review every skill from this level",
      "Perform a mini-recital of everything you've learned",
      "Prepare for the Intermediate level",
    ],
    theory: (i, t) =>
      `Congratulations — you've reached the checkpoint for Beginner ${i.name}. This lesson is a review and consolidation, not new material. We revisit ${t} in context and connect every previous lesson so the ${i.name.toLowerCase()} feels like one coherent skill instead of ten separate topics. Take this lesson seriously: reviewing is how skills stick. Musicians who move on too fast forget faster. Once you can perform this checkpoint cleanly, you're truly ready for the Intermediate level, where the real fun (scales in all keys, chords, timing under pressure, expression) begins.`,
    steps: (i) => [
      `Play ${i.primaryScale} up and down twice`,
      "Play a dynamic exercise (soft, loud, crescendo, decrescendo)",
      `Play ${i.practiceSong} from start to finish`,
      "Reflect: what improved most since Lesson 1?",
    ],
    techniqueExercises: (i) => [
      "5 minutes of long tones or steady sound production",
      `${i.primaryScale} at 3 different tempos`,
      "Sight-read a 4-bar exercise you've never seen",
    ],
    practiceRoutine: () =>
      "30 minutes: 10 min technical review, 10 min song review, 10 min sight-reading + free play. This becomes your ongoing daily template.",
    homework: () =>
      "Write a short paragraph in your practice journal: what you can do now that you couldn't do 10 lessons ago. Keep it — you'll want to read it in 6 months.",
    tips: () => [
      "Book a performance (even for one person) — deadlines drive progress",
      "The daily 30-minute template above works for the rest of your musical life",
      "Celebrate this — most students never even start",
    ],
    mistakes: () => [
      "Skipping the checkpoint because 'I already know this'",
      "Moving to Intermediate before your Beginner songs are truly clean",
      "Comparing yourself to others instead of past-you",
    ],
    visual: "Beginner recap chart",
    durationMin: 30,
    difficulty: 3,
  },
];

const intermediateTemplates: Template[] = [
  {
    title: () => "Improving Technique",
    objectives: (i) => [
      "Develop better posture and hand position",
      "Improve accuracy in playing notes",
      "Increase playing speed and fluidity",
      "Refine tone quality on the instrument",
    ],
    theory: (i, t) =>
      `Welcome to the intermediate level! Here, we focus on refining your technique. This lesson delves into improving your posture, hand position, accuracy, speed, and tone. We\\'ll connect these practical aspects with ${t}, understanding how a solid theoretical foundation enhances your physical playing. Consistent technical work is the cornerstone of advanced musicianship, allowing for greater expressive control and preventing bad habits from forming.`,
    steps: (i) => [
      "Review and adjust your basic posture and hand position",
      "Practice exercises designed to improve finger accuracy",
      "Work on speed drills with a metronome, gradually increasing tempo",
      "Focus on producing a consistent and resonant tone for each note",
    ],
    techniqueExercises: (i) => [
      `Practice ${i.primaryScale} with a focus on evenness and tone`,
      "Execute finger exercises to build dexterity and speed",
      "Play a simple melody, concentrating on smooth transitions and clear articulation",
    ],
    practiceRoutine: () =>
      "30 minutes: 10 min warm-up and posture check, 10 min accuracy and speed drills, 10 min tone production exercises.",
    homework: (i) =>
      `Record yourself playing a short technical exercise and critically evaluate your accuracy, speed, and tone.`,
    tips: () => [
      "Use a mirror or video to observe your technique",
      "Break down complex movements into smaller, manageable parts",
      "Listen to professional players for tone inspiration",
    ],
    mistakes: () => [
      "Neglecting warm-ups before practice",
      "Trying to play too fast before achieving accuracy",
      "Ignoring tension in the body while playing",
    ],
    visual: "Technique improvement exercises chart",
    durationMin: 30,
    difficulty: 3,
  },
  {
    title: () => "Scales and Chords",
    objectives: (i) => [
      `Learn basic scales beyond ${i.primaryScale}`,
      "Understand and play fundamental chords (where applicable)",
      "Improve rhythm and timing in complex patterns",
    ],
    theory: (i, t) =>
      `Scales and chords are the building blocks of music. Expanding your knowledge of these elements is crucial for intermediate players. In this lesson, we\\'ll explore new scales and introduce fundamental chords, linking them to ${t} to deepen your theoretical understanding. A strong grasp of scales and chords will unlock countless new songs and improvisation possibilities, making your playing more versatile and musical.`,
    steps: (i) => [
      `Learn and practice new scales relevant to the ${i.name.toLowerCase()}`,
      "Identify and play basic chords (if applicable to the instrument)",
      "Practice rhythmic patterns with syncopation and rests",
      "Apply new scales and chords to simple musical phrases",
    ],
    techniqueExercises: (i) => [
      `Play ${i.primaryScale} in different keys`,
      "Practice chord progressions smoothly and in time",
      "Improvise short melodies using newly learned scales",
    ],
    practiceRoutine: () =>
      "35 minutes: 10 min scale warm-up, 15 min chord practice (if applicable) and rhythm drills, 10 min applying scales/chords to music.",
    homework: (i) =>
      `Learn a new song that primarily uses the scales and chords covered in this lesson.`,
    tips: () => [
      "Practice scales with different rhythmic variations",
      "Use chord charts or diagrams as a reference",
      "Listen to music and try to identify the scales and chords being used",
    ],
    mistakes: () => [
      "Memorizing scales without understanding their structure",
      "Ignoring the sound quality of individual notes within chords",
      "Rushing through complex rhythms",
    ],
    visual: "Scale and chord diagrams",
    durationMin: 35,
    difficulty: 3,
  },
  {
    title: () => "Performance Skills",
    objectives: (i) => [
      "Learn to play smoothly and expressively",
      "Understand and apply dynamics (louds and softs)",
      "Develop musical expression and phrasing",
    ],
    theory: (i, t) =>
      `Moving beyond just playing the notes, this lesson focuses on making music truly expressive. We\\'ll explore performance skills such as playing smoothly, applying dynamics, and developing your musical interpretation. Connecting these to ${t}, you\\'ll learn how theoretical knowledge informs expressive choices. Performance is about telling a story with your instrument, and these skills will help you communicate emotions and ideas more effectively to your audience. If you would like to continue your musical journey through personalised online lessons, please contact me.`,
    steps: (i) => [
      "Practice connecting notes smoothly (legato)",
      "Experiment with playing phrases at different dynamic levels (piano, forte)",
      "Focus on phrasing and shaping melodies",
      "Record and critically listen to your performances",
    ],
    techniqueExercises: (i) => [
      "Play a familiar piece, exaggerating dynamics and phrasing",
      "Practice controlling the attack and release of each note",
      "Perform a short improvisation, emphasizing musical expression over technical complexity",
    ],
    practiceRoutine: () =>
      "40 minutes: 10 min technical warm-up, 15 min dynamic and phrasing exercises, 15 min applying performance skills to a piece.",
    homework: (i) =>
      `Choose a piece and prepare it for a \"performance\" (even if it\\'s just for yourself or a pet), focusing on musicality.`,
    tips: () => [
      "Listen to recordings of different artists performing the same piece",
      "Don\\'t be afraid to exaggerate dynamics in practice",
      "Connect with the emotion of the music you\\'re playing",
    ],
    mistakes: () => [
      "Playing everything at the same volume",
      "Neglecting expressive markings in the music",
      "Focusing only on technical accuracy, ignoring musicality",
    ],
    visual: "Dynamic and expression markings chart",
    durationMin: 40,
    difficulty: 4,
  },
];


const advancedTemplates: Template[] = [
  {
    title: () => "Advanced Techniques",
    objectives: (i) => [
      "Master complex techniques specific to your instrument",
      "Develop advanced finger dexterity and coordination",
      "Explore extended range and expressive capabilities",
      "Integrate advanced theory into practical application",
    ],
    theory: (i, t) =>
      `At the advanced level, we push the boundaries of your technical and musical abilities. This lesson focuses on mastering advanced techniques unique to the ${i.name.toLowerCase()}, enhancing your dexterity, and expanding your expressive range. We will delve deeper into ${t}, applying complex theoretical concepts to sophisticated musical passages. This stage is about transforming challenges into opportunities for growth, enabling you to tackle more demanding repertoire with confidence and artistry.`,
    steps: (i) => [
      "Practice advanced exercises for speed and precision",
      "Work on pieces that require intricate fingerwork or bowing techniques",
      "Experiment with different articulations and tonal colors",
      "Analyze and apply advanced theoretical concepts to your playing",
    ],
    techniqueExercises: (i) => [
      `Perform advanced scales and arpeggios at high tempos`,
      "Practice challenging etudes or technical studies",
      "Focus on seamless transitions between difficult passages",
    ],
    practiceRoutine: () =>
      "45 minutes: 15 min intensive technical warm-up, 20 min advanced exercise drills, 10 min application to complex pieces.",
    homework: (i) =>
      `Select a challenging piece and break it down into small, manageable sections for focused practice.`,
    tips: () => [
      "Consistency is key for mastering advanced techniques",
      "Seek out masterclasses or advanced workshops",
      "Don't shy away from difficult repertoire; it's where you grow most",
    ],
    mistakes: () => [
      "Overlooking fundamental techniques in pursuit of speed",
      "Practicing without a clear technical goal",
      "Becoming complacent with current skill level",
    ],
    visual: "Advanced technique diagrams and exercises",
    durationMin: 45,
    difficulty: 5,
  },
  {
    title: () => "Performance Preparation",
    objectives: (i) => [
      "Develop a comprehensive performance preparation routine",
      "Manage performance anxiety and build stage presence",
      "Refine musical interpretation for public presentation",
      "Prepare a polished piece for performance",
    ],
    theory: (i, t) =>
      `Performing is the ultimate test and reward of your musical journey. This lesson guides you through the essential steps of performance preparation, from managing anxiety to perfecting your stage presence. We integrate ${t} to ensure your interpretation is not only expressive but also theoretically sound. The goal is to equip you with the strategies and mindset needed to deliver a compelling and confident performance, whether for an audience or personal satisfaction.`,
    steps: (i) => [
      "Establish a consistent practice schedule leading up to a performance",
      "Practice performing under simulated pressure (e.g., recording yourself)",
      "Develop strategies for managing nerves and maintaining focus",
      "Refine your chosen performance piece, focusing on musicality and expression",
    ],
    techniqueExercises: (i) => [
      "Perform your piece for friends or family to gain experience",
      "Practice mental run-throughs of your performance",
      "Work on stage presence and audience engagement",
    ],
    practiceRoutine: () =>
      "50 minutes: 10 min warm-up, 20 min performance piece run-throughs, 10 min mental preparation, 10 min cool-down.",
    homework: (i) =>
      `Schedule a mock performance or record a high-quality video of your prepared piece.`,
    tips: () => [
      "Visualize success before you perform",
      "Focus on communicating the music, not just playing notes",
      "Embrace mistakes as learning opportunities, not failures",
    ],
    mistakes: () => [
      "Cramming practice sessions right before a performance",
      "Ignoring mental preparation for performance",
      "Allowing nerves to dictate your performance",
    ],
    visual: "Performance checklist and mental preparation guide",
    durationMin: 50,
    difficulty: 5,
  },
  {
    title: () => "Professional Development",
    objectives: (i) => [
      "Understand pathways for continued musical growth",
      "Develop effective long-term practice routines",
      "Explore opportunities for collaboration and mentorship",
      "Cultivate a lifelong passion for music",
    ],
    theory: (i, t) =>
      `You have completed the free Harmony Hub lessons. This final lesson is dedicated to your professional development as a musician, guiding you on how to continue your musical journey beyond this course. We will discuss strategies for sustained growth, effective practice routines, and the importance of collaboration and mentorship. By applying the principles of ${t}, you will be equipped to explore advanced musical concepts independently. This is not an end, but a new beginning, empowering you to shape your unique musical path. To continue learning with personalised online classes, advanced lessons and one-on-one coaching, please contact me.`,
    steps: (i) => [
      "Reflect on your musical journey and set new long-term goals",
      "Design a personalized practice routine for ongoing improvement",
      "Research opportunities for advanced study, workshops, or ensembles",
      "Connect with other musicians and mentors in your community",
    ],
    techniqueExercises: (i) => [
      "Continuously challenge yourself with new repertoire and techniques",
      "Engage in regular sight-reading and ear training exercises",
      "Explore different genres and styles on your instrument",
    ],
    practiceRoutine: () =>
      "60 minutes: 15 min warm-up, 30 min focused skill development, 15 min creative exploration/improvisation.",
    homework: (i) =>
      `Create a 6-month musical development plan, including specific goals and milestones.`,
    tips: () => [
      "Never stop learning and exploring new music",
      "Seek feedback from experienced musicians",
      "Share your music with others and collaborate",
    ],
    mistakes: () => [
      "Becoming stagnant in your practice routine",
      "Isolating yourself from the musical community",
      "Losing sight of the joy and passion for music",
    ],
    visual: "Musical journey roadmap",
    durationMin: 60,
    difficulty: 5,
  },
  {
    title: () => "Advanced technique and daily warm-up routine",
    objectives: () => [
      "Design a 20-minute technical warm-up",
      "Refine speed, control and articulation",
      "Track your top tempo weekly",
    ],
    theory: (i, t) =>
      `At the advanced level, technique is the tool that lets your ideas out. In this lesson we build a 20-minute daily warm-up for the ${i.name.toLowerCase()} that covers tone, scales, arpeggios and articulation. We link this with ${t} because advanced players never separate theory from practice. Your warm-up is a personal contract with your instrument — 20 minutes of undivided focus, every day, that keeps you sharp and lets you tackle any repertoire.`,
    steps: () => [
      "5 min long tones / tone production",
      "5 min scales in 4 keys with a metronome",
      "5 min arpeggios",
      "5 min articulation drills at target tempo",
    ],
    techniqueExercises: () => [
      "Track your top clean tempo for a technical passage — beat it weekly",
      "Play scales in shifting rhythms (2s, 3s, 4s, 5s)",
      "Play the warm-up with the metronome on 2 and 4",
    ],
    practiceRoutine: () =>
      "40 minutes: 20 min technical warm-up, 20 min repertoire.",
    homework: () =>
      "Log your daily warm-up for 7 days. Compare your top clean tempo on day 1 and day 7.",
    tips: () => [
      "The warm-up is the practice — not a chore before it",
      "Tempo growth comes from consistency, not intensity",
      "Rest is part of practice — don't ignore recovery",
    ],
    mistakes: () => [
      "Skipping the warm-up 'just this once'",
      "Practising fast to prove something",
      "Ignoring the body's warning signs",
    ],
    visual: "Warm-up routine card",
    durationMin: 40,
    difficulty: 4,
  },
  {
    title: () => "Ear training and transcription",
    objectives: () => [
      "Recognise all intervals within an octave",
      "Transcribe a 4-bar melody by ear",
      "Play what you hear without notation",
    ],
    theory: (i, t) =>
      `Ear training frees you from the page. In this lesson we drill ${t} — specifically interval recognition — and apply it to transcribing a real 4-bar melody. On the ${i.name.toLowerCase()} you'll listen, sing back, then play. Repeat. This loop rewires your brain to match sound with fingerings without conscious effort. Advanced players hear a melody and can play it back within seconds — that's not a gift, it's a trained skill.`,
    steps: () => [
      "Listen to two notes; identify the interval",
      "Sing the interval back",
      "Play it on your instrument",
      "Repeat with a 4-bar melody instead of intervals",
    ],
    techniqueExercises: () => [
      "5 min daily interval drill using any ear-training app",
      "Transcribe one 4-bar phrase every day for a week",
      "Sing the melody first, then play it",
    ],
    practiceRoutine: () =>
      "30 minutes: 10 min interval drill, 15 min transcription, 5 min play-back-what-you-hear game.",
    homework: () =>
      "Transcribe the melody of a favourite song's chorus. Write it down and play it.",
    tips: () => [
      "Sing first, always",
      "Start small — 2 notes, 3 notes, then a phrase",
      "Trust the ear — it will lead your fingers",
    ],
    mistakes: () => [
      "Trying to transcribe entire songs before you can do 4 bars",
      "Reaching for notation before really listening",
      "Getting frustrated when it's slow — it's supposed to be at first",
    ],
    visual: "Interval reference table",
    durationMin: 30,
    difficulty: 5,
  },
  {
    title: () => "7th chords and colour",
    objectives: () => [
      "Understand major 7, minor 7 and dominant 7 chords",
      "Play or outline them on your instrument",
      "Hear the difference between them",
    ],
    theory: (i, t) =>
      `Seventh chords add colour and sophistication to any music. In this lesson we cover ${t} and apply it directly on the ${i.name.toLowerCase()}. A major 7 sounds dreamy, a minor 7 sounds smooth, a dominant 7 sounds bluesy and demanding of resolution. Once you can play and hear 7th chords, jazz, gospel and R&B suddenly make sense.`,
    steps: () => [
      "Play or arpeggiate Cmaj7 (C E G B)",
      "Then Cm7 (C E♭ G B♭)",
      "Then C7 (C E G B♭)",
      "Alternate the three and listen to the colours",
    ],
    techniqueExercises: () => [
      "Play each 7th chord in 4 different keys",
      "Improvise short phrases over a static Cmaj7, then C7",
      "Identify 7th chords in songs you love",
    ],
    practiceRoutine: () =>
      "30 minutes: 10 min chord drills, 15 min improvising over a 7th chord loop, 5 min ear training on 7th chord quality.",
    homework: () =>
      "Find one song that uses maj7 and one that uses dominant 7. Sing along and feel the difference.",
    tips: () => [
      "The 7th of a chord is the most expressive note",
      "Practise 7th chords in every key over time",
      "Hear the chord colour first, then play the notes",
    ],
    mistakes: () => [
      "Confusing dominant 7 with major 7",
      "Only practising 7th chords in C",
      "Ignoring how 7th chords resolve",
    ],
    visual: "7th chord chart",
    durationMin: 30,
    difficulty: 5,
  },
  {
    title: () => "Modes of the major scale",
    objectives: () => [
      "Understand the 7 modes",
      "Play Dorian and Mixolydian",
      "Improvise using a mode",
    ],
    theory: (i, t) =>
      `Modes are different flavours of the same set of notes. In this lesson we cover ${t} and drill the two most useful modes: Dorian (minor jazz/funk sound) and Mixolydian (dominant/blues sound). On the ${i.name.toLowerCase()} we'll play each mode over a matching chord to hear its character. Understanding modes is a huge upgrade — it opens up jazz, film scoring, gospel and modern pop.`,
    steps: () => [
      "Play a C major scale (Ionian mode)",
      "Start from D and play the same notes up to D (Dorian)",
      "Start from G and play the same notes up to G (Mixolydian)",
      "Improvise for 60 seconds using Mixolydian over a G7 chord",
    ],
    techniqueExercises: () => [
      "Play each mode in 2 keys",
      "Improvise a 4-bar phrase using only Dorian",
      "Identify the mode of a familiar song",
    ],
    practiceRoutine: () =>
      "35 minutes: 10 min mode drills, 15 min improvisation over a chord loop, 10 min ear training with modes.",
    homework: () =>
      "Choose one mode and find 3 songs that use it. Play along.",
    tips: () => [
      "Start with Dorian and Mixolydian — most useful in modern music",
      "Feel the mode's character — happy, sad, tense, bright",
      "Improvise more than you drill",
    ],
    mistakes: () => [
      "Trying to memorise all 7 modes at once",
      "Playing modes without hearing them",
      "Using modes as scales instead of colours",
    ],
    visual: "Modes wheel",
    durationMin: 35,
    difficulty: 5,
  },
  {
    title: () => "Improvisation over changes",
    objectives: () => [
      "Improvise over a chord progression, not just one chord",
      "Target chord tones on strong beats",
      "Use motifs and repetition",
    ],
    theory: (i, t) =>
      `Real improvisation isn't random — it follows the chord changes. In this lesson we pair ${t} with the physical practice of improvising over a I–vi–ii–V progression on the ${i.name.toLowerCase()}. The trick: target the 3rd of each chord on beat 1. That single rule elevates every solo. We'll also practise repeating and developing a motif, so your solos feel composed rather than aimless.`,
    steps: () => [
      "Learn a I–vi–ii–V progression in C (C, Am, Dm, G7)",
      "Play the 3rd of each chord on beat 1 as a warm-up",
      "Improvise using only chord tones for 60 seconds",
      "Add scale tones and simple motifs",
    ],
    techniqueExercises: () => [
      "Improvise using only 4 notes per chord",
      "Repeat one motif with 3 rhythmic variations",
      "Record and transcribe your best 4-bar phrase",
    ],
    practiceRoutine: () =>
      "40 minutes: 10 min chord tone drills, 20 min improvising over changes, 10 min transcribing your best ideas.",
    homework: () =>
      "Record 3 different one-minute solos over the same progression. Compare — which felt best?",
    tips: () => [
      "Target the 3rd of every chord — instant sophistication",
      "Motifs and repetition beat 100 random notes",
      "Leave space — silence is a note",
    ],
    mistakes: () => [
      "Ignoring the chord changes and playing one scale over everything",
      "Playing too many notes",
      "Never recording — you can't improve what you don't hear",
    ],
    visual: "Chord tones diagram",
    durationMin: 40,
    difficulty: 5,
  },
  {
    title: () => "Advanced rhythm: polyrhythms and odd meters",
    objectives: () => [
      "Play in 5/4 and 7/8",
      "Feel a 3-over-2 polyrhythm",
      "Groove in odd meters",
    ],
    theory: (i, t) =>
      `Once you're comfortable in 4/4, odd meters (5/4, 7/8) and polyrhythms (3-over-2) unlock a huge world of music — from progressive rock to Afrobeat to modern jazz. In this lesson we cover ${t} and drill the physical feel on the ${i.name.toLowerCase()}. Odd meters aren't harder — they're just different, and the feel comes fast once you count them consistently.`,
    steps: () => [
      "Clap 5 as 3+2 for 2 minutes",
      "Play a simple riff in 5/4 with a metronome",
      "Clap 7 as 4+3 for 2 minutes",
      "Try a 3-over-2 polyrhythm (clap 3 with one hand, tap 2 with the other)",
    ],
    techniqueExercises: () => [
      "Play a familiar 4/4 melody transposed to 5/4",
      "Groove for 60 seconds in 7/8 without losing the pulse",
      "Practice polyrhythms with a metronome",
    ],
    practiceRoutine: () =>
      "30 minutes: 10 min counting drills, 15 min playing in odd meters, 5 min polyrhythm drills.",
    homework: () =>
      "Find a song in 5/4 or 7/8 (start with Take Five in 5/4). Count along.",
    tips: () => [
      "Sub-divide odd meters into small groups (3+2, 4+3)",
      "Move your body to the pulse — helps the feel",
      "Don't rush — clean counting first, tempo later",
    ],
    mistakes: () => [
      "Treating 5/4 as 4/4 with an extra beat",
      "Losing the pulse when the pattern gets complex",
      "Skipping polyrhythms because they feel weird at first",
    ],
    visual: "Odd meter grouping",
    durationMin: 30,
    difficulty: 5,
  },
  {
    title: () => "Studio and recording basics",
    objectives: () => [
      "Understand microphone placement",
      "Record a clean take at home",
      "Deliver a professional performance in one pass",
    ],
    theory: (i, t) =>
      `Modern musicians are also modern recordists. In this lesson we pair ${t} with the essentials of recording the ${i.name.toLowerCase()}: mic choice, mic placement, gain staging and headroom. Recording exposes every detail — every squeak, every hesitation. That's a gift: it makes you better. We'll finish by recording a clean take of a short piece and evaluating it professionally.`,
    steps: () => [
      "Set up a mic 6-12 inches from the sound source",
      "Set gain so peaks hit around -12 dBFS",
      "Record a full take, no punch-ins",
      "Listen back and note 3 things to improve",
    ],
    techniqueExercises: () => [
      "Record the same phrase 5 times, pick the best",
      "Practise starting cold — pros do it every day",
      "Record with headphones on so you hear yourself as the mic hears you",
    ],
    practiceRoutine: () =>
      "40 minutes: 10 min setup + mic placement, 25 min recording takes, 5 min listen-back notes.",
    homework: () =>
      "Publish (or share with one person) a recording of your favourite passage. Getting feedback is the whole point.",
    tips: () => [
      "Warm up before hitting record",
      "Play through mistakes — comping fixes small ones",
      "Compare your recording to reference tracks in the same style",
    ],
    mistakes: () => [
      "Clipping the input by setting gain too hot",
      "Punching in every tiny mistake instead of committing",
      "Never sharing recordings — feedback is fuel",
    ],
    visual: "Studio signal path",
    durationMin: 40,
    difficulty: 5,
  },
  {
    title: () => "Composition: writing your own music",
    objectives: () => [
      "Write an 8-bar melody",
      "Harmonise it with basic chords",
      "Perform it end to end",
    ],
    theory: (i, t) =>
      `Composition takes everything you know and turns it into something entirely yours. In this lesson we cover ${t} and use it to write an 8-bar melody on the ${i.name.toLowerCase()}. There is no 'right' answer here — only choices. We'll teach a simple structure (question / answer, or AA') so you have a scaffold to fill in. Even a short original melody is a huge milestone — you've moved from consumer to creator.`,
    steps: () => [
      "Choose a key and a 4-chord progression",
      "Improvise until a melodic idea catches your ear",
      "Write it down",
      "Play it back and refine",
    ],
    techniqueExercises: () => [
      "Compose one 4-bar phrase per day for a week",
      "Take a phrase and repeat it a step higher",
      "Write a variation of an existing melody",
    ],
    practiceRoutine: () =>
      "40 minutes: 10 min improvising, 20 min writing + notating, 10 min performing/refining.",
    homework: () =>
      "Write and record a 30-second original piece. Give it a title.",
    tips: () => [
      "Steal a rhythm from a song you love — then change the notes",
      "Set a timer — creativity thrives under constraints",
      "Perform your composition for someone",
    ],
    mistakes: () => [
      "Waiting for inspiration",
      "Editing before you have material",
      "Composing without ever playing what you wrote",
    ],
    visual: "Composition template",
    durationMin: 40,
    difficulty: 5,
  },
  {
    title: (i) => `Recital piece: ${i.advancedSong}`,
    objectives: (i) => [
      `Play ${i.advancedSong} at performance level`,
      "Prepare mentally for performance",
      "Record a professional take",
    ],
    theory: (i, t) =>
      `${i.advancedSong} is your final recital piece. We combine ${t} with a professional preparation routine. On the ${i.name.toLowerCase()}, this is the piece you'll play when someone says 'play me something'. Prepare it like a professional: sectional practice, slow tempo drills, mental run-throughs, dress rehearsals. This piece is a portrait of who you are as a musician right now.`,
    steps: (i) => [
      `Break ${i.advancedSong} into 4-8 sections`,
      "Drill each section at 50%, 75% and 100% tempo",
      "Run the whole piece daily without stopping",
      "Do a mental run-through away from the ${i.name.toLowerCase()}",
    ],
    techniqueExercises: () => [
      "Play the piece under 3 simulated pressures (record, audience, video)",
      "Play it with the metronome, then without, and match",
      "Play the piece one octave lower/higher (or transposed)",
    ],
    practiceRoutine: () =>
      "60 minutes: 15 min warm-up + scales, 30 min sectional + full run-throughs, 15 min performance simulations.",
    homework: () =>
      "Perform it live for at least 3 people. Book the date this week.",
    tips: () => [
      "Nerves are excitement — reframe, don't fight",
      "Play it perfectly at slow tempo before pushing speed",
      "Video yourself in performance mode — the truth is on the screen",
    ],
    mistakes: () => [
      "Practising more speed than accuracy",
      "Skipping mental run-throughs",
      "Not performing enough before the big day",
    ],
    visual: "Recital program",
    durationMin: 60,
    difficulty: 5,
  },
  {
    title: () => "Level checkpoint and next steps",
    objectives: () => [
      "Review every skill from the advanced level",
      "Perform a mini-recital",
      "Design your ongoing musical journey",
    ],
    theory: (i, t) =>
      `This is your Advanced checkpoint. We revisit ${t} in context and celebrate everything you've built on the ${i.name.toLowerCase()}. Advanced doesn't mean 'finished' — it means you now have the tools to keep growing on your own for the rest of your life. In this lesson we design your next 6-month plan: repertoire, technique goals, performance schedule and any collaboration.`,
    steps: (i) => [
      "Run the full recital piece one more time",
      `Play ${i.primaryScale} in 4 keys cleanly`,
      "Improvise over a chord loop with confidence",
      "Sketch your next 6-month plan",
    ],
    techniqueExercises: () => [
      "Sight-read a piece you've never seen",
      "Perform for a real audience this month",
      "Record a full session and share it",
    ],
    practiceRoutine: () =>
      "60 minutes: warm-up, recital run, improvisation, planning.",
    homework: () =>
      "Write your 6-month plan and share it with someone who will hold you to it.",
    tips: () => [
      "Advanced is a stage, not a summit",
      "Play with better musicians whenever possible",
      "Keep a practice journal for the rest of your musical life",
    ],
    mistakes: () => [
      "Treating 'advanced' as a finish line",
      "Stopping performances after finishing the course",
      "Comparing yourself to others instead of past-you",
    ],
    visual: "Advanced roadmap",
    durationMin: 45,
    difficulty: 5,
  },
];

const TEMPLATES: Record<Level, Template[]> = {
  beginner: beginnerTemplates,
  intermediate: intermediateTemplates,
  advanced: advancedTemplates,
};

function buildLessons(inst: Instrument, level: Level): Lesson[] {
  const tmpl = TEMPLATES[level];
  const topics = THEORY_TOPICS[level];
  return tmpl.map((t, i) => ({
    id: `l${i + 1}`,
    number: i + 1,
    title: t.title(inst),
    objectives: t.objectives(inst),
    theory: t.theory(inst, topics[i]),
    steps: t.steps(inst),
    techniqueExercises: t.techniqueExercises(inst),
    practiceRoutine: t.practiceRoutine(inst),
    homework: t.homework(inst),
    tips: t.tips(inst),
    mistakes: t.mistakes(inst),
    durationMin: t.durationMin,
    difficulty: t.difficulty,
    visual: t.visual,
    theoryTopic: topics[i],
  }));
}

export function getLessons(instrument: string | Instrument, level: Level): Lesson[] {
  const inst = typeof instrument === "string" ? getInstrument(instrument) : instrument;
  if (!inst) return [];
  return buildLessons(inst, level);
}

// Legacy alias for older callers
export function getModules(instrumentName: string, level: Level) {
  const inst = instruments.find((i) => i.name === instrumentName) ?? instruments[0];
  return buildLessons(inst, level);
}

export const LESSONS_PER_LEVEL: Record<Level, number> = {
  beginner: beginnerTemplates.length,
  intermediate: intermediateTemplates.length,
  advanced: advancedTemplates.length,
};
export const TOTAL_LESSONS_PER_INSTRUMENT =
  LESSONS_PER_LEVEL.beginner + LESSONS_PER_LEVEL.intermediate + LESSONS_PER_LEVEL.advanced;


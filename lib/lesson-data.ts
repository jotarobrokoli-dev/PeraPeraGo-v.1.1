// ============================================================
// PeraPeraGo — Lesson Data
// Source of truth: Materi Kelompok D (Aisatsu, Jikoshoukai,
//                  Kazoku, Ko-So-A-Do)
// All Japanese text: HIRAGANA / KATAKANA ONLY. Never kanji.
//
// TO ADD A NEW LESSON:
// 1. Append a new object to the `lessons` array below
// 2. Set isLocked: false when ready to publish
// 3. Fill in steps, speakingChallenges, listeningQuestions,
//    quiz — no other code changes needed
// ============================================================

export interface LessonStep {
  id: number
  title: string
  japanese: string
  romaji: string
  translation: string
  type: "learn" | "review" | "summary"
  practicePrompt?: string
  note?: string
}

export interface ListeningQuestion {
  id: number
  audioText: string
  question: string
  choices: string[]
  correctIndex: number
}

export interface SpeakingChallenge {
  id: number
  japanese: string
  romaji: string
  translation: string
  useStudentName?: boolean
  context?: string
}

export interface QuizQuestion {
  id: number
  type: "multiple-choice" | "listening" | "speaking" | "matching"
  question: string
  japanese?: string
  romaji?: string
  translation?: string
  choices?: string[]
  correctAnswer: string | number
  audioText?: string
  pairs?: Array<{ japanese: string; romaji: string; indonesian: string }>
  useStudentName?: boolean
}

export interface Lesson {
  id: string
  titleJapanese: string
  titleRomaji: string
  titleIndonesian: string
  description: string
  isLocked: boolean
  steps: LessonStep[]
  listeningQuestions: ListeningQuestion[]
  speakingChallenges: SpeakingChallenge[]
  quiz: QuizQuestion[]
}

// ============================================================
// LESSONS
// ============================================================

export const lessons: Lesson[] = [

  // ══════════════════════════════════════════════════════════
  // LESSON 1 — あいさつ (AISATSU)
  // Source: Bab A — Aisatsu to Jikoshoukai (halaman 1–4)
  // ══════════════════════════════════════════════════════════
  {
    id: "aisatsu",
    titleJapanese: "あいさつ",
    titleRomaji: "Aisatsu",
    titleIndonesian: "Salam",
    description: "Belajar berbagai jenis salam dalam bahasa Jepang.",
    isLocked: false,

    steps: [
      // ── Salam Berdasarkan Waktu ──────────────────────────
      {
        id: 1,
        title: "Selamat Pagi (Sopan)",
        japanese: "おはようございます。",
        romaji: "Ohayou gozaimasu.",
        translation: "Selamat pagi.",
        type: "learn",
        note: "Bentuk sopan — digunakan untuk guru, orang tua, atasan.",
      },
      {
        id: 2,
        title: "Selamat Pagi (Kasual)",
        japanese: "おはよう。",
        romaji: "Ohayou.",
        translation: "Selamat pagi.",
        type: "learn",
        note: "Bentuk kasual — digunakan untuk teman sebaya.",
      },
      {
        id: 3,
        title: "Selamat Siang / Sore",
        japanese: "こんにちは。",
        romaji: "Konnichiwa.",
        translation: "Selamat siang / selamat sore.",
        type: "learn",
        note: "Digunakan mulai jam 10–11 siang hingga matahari terbenam. Huruf は dibaca 'wa'.",
      },
      {
        id: 4,
        title: "Selamat Malam",
        japanese: "こんばんは。",
        romaji: "Konbanwa.",
        translation: "Selamat malam.",
        type: "learn",
        note: "Digunakan saat hari sudah mulai gelap. Huruf は dibaca 'wa'.",
      },
      {
        id: 5,
        title: "Selamat Tidur (Sopan)",
        japanese: "おやすみなさい。",
        romaji: "Oyasuminasai.",
        translation: "Selamat tidur / selamat beristirahat.",
        type: "learn",
        note: "Bentuk sopan.",
      },
      {
        id: 6,
        title: "Selamat Tidur (Kasual)",
        japanese: "おやすみ。",
        romaji: "Oyasumi.",
        translation: "Selamat tidur.",
        type: "learn",
        note: "Bentuk kasual.",
      },
      // ── Contoh Percakapan 1 ──────────────────────────────
      {
        id: 7,
        title: "Contoh: Salam Pagi di Sekolah",
        japanese: "せんせい、おはようございます。",
        romaji: "Sensei, ohayou gozaimasu.",
        translation: "Guru, selamat pagi.",
        type: "learn",
        practicePrompt: "Ucapkan salam pagi kepada gurumu!",
      },
      {
        id: 8,
        title: "Jawaban Guru",
        japanese: "アニサさん、おはよう。",
        romaji: "Anisa-san, ohayou.",
        translation: "Anisa, selamat pagi.",
        type: "learn",
        note: "Guru menjawab dengan bentuk kasual kepada murid.",
      },
      // ── Salam Saat Berpisah ──────────────────────────────
      {
        id: 9,
        title: "Sampai Jumpa (Perpisahan Lama)",
        japanese: "さようなら。",
        romaji: "Sayounara.",
        translation: "Selamat tinggal.",
        type: "learn",
        note: "Digunakan jika berpisah dalam waktu lama atau tidak tahu kapan bertemu lagi.",
      },
      {
        id: 10,
        title: "Sampai Jumpa Lagi (Kasual)",
        japanese: "じゃ、また。",
        romaji: "Ja, mata.",
        translation: "Sampai jumpa.",
        type: "learn",
        note: "Kasual — digunakan antar teman yang akan bertemu lagi.",
      },
      {
        id: 11,
        title: "Sampai Jumpa Besok",
        japanese: "また あした。",
        romaji: "Mata ashita.",
        translation: "Sampai jumpa besok.",
        type: "learn",
      },
      // ── Salam Keluar / Masuk Rumah ───────────────────────
      {
        id: 12,
        title: "Saat Berangkat dari Rumah",
        japanese: "いってきます。",
        romaji: "Ittekimasu.",
        translation: "Saya pergi / berangkat.",
        type: "learn",
        note: "Diucapkan saat akan pergi keluar rumah kepada orang yang ada di rumah.",
      },
      {
        id: 13,
        title: "Jawaban Saat Ada yang Berangkat",
        japanese: "いってらっしゃい。",
        romaji: "Itterasshai.",
        translation: "Selamat jalan / hati-hati di jalan.",
        type: "learn",
        note: "Jawaban dari orang rumah saat ada yang berangkat.",
      },
      {
        id: 14,
        title: "Saat Pulang ke Rumah",
        japanese: "ただいま。",
        romaji: "Tadaima.",
        translation: "Saya pulang.",
        type: "learn",
        note: "Diucapkan saat sudah sampai rumah.",
      },
      {
        id: 15,
        title: "Jawaban Saat Ada yang Pulang",
        japanese: "おかえりなさい。",
        romaji: "Okaerinasai.",
        translation: "Selamat datang kembali.",
        type: "learn",
        note: "Jawaban orang tua atau yang dihormati. Untuk anak cukup おかえり (Okaeri).",
      },
      // ── Contoh Percakapan 2 ──────────────────────────────
      {
        id: 16,
        title: "Contoh: Berangkat dari Rumah",
        japanese: "いってきます。",
        romaji: "Ittekimasu.",
        translation: "Aku berangkat.",
        type: "learn",
        practicePrompt: "Ucapkan salam saat berangkat dari rumah!",
      },
      {
        id: 17,
        title: "Jawaban Ibu: Hati-hati",
        japanese: "いってらっしゃい。",
        romaji: "Itterasshai.",
        translation: "Hati-hati di jalan.",
        type: "learn",
      },
      // ── Ungkapan Terima Kasih dan Maaf ───────────────────
      {
        id: 18,
        title: "Terima Kasih (Sopan)",
        japanese: "ありがとうございます。",
        romaji: "Arigatou gozaimasu.",
        translation: "Terima kasih banyak.",
        type: "learn",
        note: "Bentuk sopan — untuk orang tua, guru, atasan.",
      },
      {
        id: 19,
        title: "Terima Kasih (Kasual)",
        japanese: "ありがとう。",
        romaji: "Arigatou.",
        translation: "Terima kasih.",
        type: "learn",
        note: "Bentuk kasual — untuk teman sebaya.",
      },
      {
        id: 20,
        title: "Selamat Makan",
        japanese: "いただきます。",
        romaji: "Itadakimasu.",
        translation: "Selamat makan.",
        type: "learn",
        note: "Diucapkan sebelum makan sebagai ungkapan terima kasih atas makanan.",
      },
      {
        id: 21,
        title: "Terima Kasih Setelah Makan",
        japanese: "ごちそうさまでした。",
        romaji: "Gochisousama deshita.",
        translation: "Terima kasih atas makanan / jamuannya.",
        type: "learn",
        note: "Diucapkan setelah makan.",
      },
      {
        id: 22,
        title: "Permisi / Maaf Ringan",
        japanese: "すみません。",
        romaji: "Sumimasen.",
        translation: "Maaf / permisi.",
        type: "learn",
        note: "Untuk minta maaf ringan, memanggil pelayan, atau berterima kasih saat merepotkan orang.",
      },
      {
        id: 23,
        title: "Mohon Maaf (Tulus)",
        japanese: "ごめんなさい。",
        romaji: "Gomen nasai.",
        translation: "Mohon maaf.",
        type: "learn",
        note: "Digunakan untuk meminta maaf dengan tulus atas kesalahan pribadi.",
      },
      // ── Contoh Percakapan 3 ──────────────────────────────
      {
        id: 24,
        title: "Contoh: Terima Kasih kepada Guru",
        japanese: "せんせい、ありがとうございます。",
        romaji: "Sensei, arigatou gozaimasu.",
        translation: "Guru, terima kasih banyak.",
        type: "learn",
        practicePrompt: "Ucapkan terima kasih kepada gurumu!",
      },
      {
        id: 25,
        title: "Review",
        japanese: "ふくしゅう",
        romaji: "Fukushuu",
        translation: "Review semua ungkapan salam.",
        type: "review",
      },
      {
        id: 26,
        title: "Siap Mengerjakan Quiz",
        japanese: "じゅんび かんりょう",
        romaji: "Junbi kanryou",
        translation: "Kamu siap untuk tantangan!",
        type: "summary",
      },
    ],

    listeningQuestions: [
      {
        id: 1,
        audioText: "おはようございます。",
        question: "Salam apa yang diucapkan?",
        choices: ["Selamat malam", "Selamat pagi (sopan)", "Selamat siang", "Selamat tidur"],
        correctIndex: 1,
      },
      {
        id: 2,
        audioText: "ありがとうございます。",
        question: "Apa makna ungkapan tersebut?",
        choices: ["Maaf", "Permisi", "Terima kasih banyak", "Selamat makan"],
        correctIndex: 2,
      },
      {
        id: 3,
        audioText: "いってきます。",
        question: "Kapan ungkapan ini diucapkan?",
        choices: ["Saat pulang ke rumah", "Saat tidur", "Saat berangkat dari rumah", "Saat makan"],
        correctIndex: 2,
      },
      {
        id: 4,
        audioText: "ごめんなさい。",
        question: "Apa makna ungkapan ini?",
        choices: ["Terima kasih", "Mohon maaf (tulus)", "Permisi", "Selamat datang"],
        correctIndex: 1,
      },
    ],

    speakingChallenges: [
      { id: 1,  japanese: "おはようございます。",         romaji: "Ohayou gozaimasu.",         translation: "Selamat pagi (sopan).",              context: "Salam pagi kepada guru" },
      { id: 2,  japanese: "おはよう。",                   romaji: "Ohayou.",                   translation: "Selamat pagi (kasual).",             context: "Salam pagi kepada teman" },
      { id: 3,  japanese: "こんにちは。",                 romaji: "Konnichiwa.",               translation: "Selamat siang / sore.",              context: "Salam siang" },
      { id: 4,  japanese: "こんばんは。",                 romaji: "Konbanwa.",                 translation: "Selamat malam.",                     context: "Salam malam" },
      { id: 5,  japanese: "おやすみなさい。",             romaji: "Oyasuminasai.",             translation: "Selamat tidur (sopan).",             context: "Salam tidur sopan" },
      { id: 6,  japanese: "さようなら。",                 romaji: "Sayounara.",                translation: "Selamat tinggal.",                   context: "Berpisah dalam waktu lama" },
      { id: 7,  japanese: "じゃ、また。",                 romaji: "Ja, mata.",                 translation: "Sampai jumpa.",                      context: "Pamit kasual" },
      { id: 8,  japanese: "また あした。",               romaji: "Mata ashita.",              translation: "Sampai jumpa besok.",                context: "Pamit sampai besok" },
      { id: 9,  japanese: "いってきます。",               romaji: "Ittekimasu.",               translation: "Saya berangkat.",                    context: "Berangkat dari rumah" },
      { id: 10, japanese: "いってらっしゃい。",           romaji: "Itterasshai.",              translation: "Hati-hati di jalan.",                context: "Menjawab yang berangkat" },
      { id: 11, japanese: "ただいま。",                   romaji: "Tadaima.",                  translation: "Saya pulang.",                       context: "Saat tiba di rumah" },
      { id: 12, japanese: "おかえりなさい。",             romaji: "Okaerinasai.",              translation: "Selamat datang kembali.",            context: "Menyambut yang pulang" },
      { id: 13, japanese: "ありがとうございます。",       romaji: "Arigatou gozaimasu.",       translation: "Terima kasih banyak.",               context: "Berterima kasih kepada guru" },
      { id: 14, japanese: "ありがとう。",                 romaji: "Arigatou.",                 translation: "Terima kasih.",                      context: "Berterima kasih kepada teman" },
      { id: 15, japanese: "いただきます。",               romaji: "Itadakimasu.",              translation: "Selamat makan.",                     context: "Sebelum makan" },
      { id: 16, japanese: "ごちそうさまでした。",         romaji: "Gochisousama deshita.",     translation: "Terima kasih atas makanannya.",      context: "Setelah makan" },
      { id: 17, japanese: "すみません。",                 romaji: "Sumimasen.",                translation: "Permisi / maaf.",                    context: "Memanggil perhatian atau minta maaf ringan" },
      { id: 18, japanese: "ごめんなさい。",               romaji: "Gomen nasai.",              translation: "Mohon maaf.",                        context: "Minta maaf dengan tulus" },
      { id: 19, japanese: "せんせい、おはようございます。", romaji: "Sensei, ohayou gozaimasu.", translation: "Guru, selamat pagi.",               context: "Percakapan: salam pagi di sekolah" },
      { id: 20, japanese: "せんせい、ありがとうございます。", romaji: "Sensei, arigatou gozaimasu.", translation: "Guru, terima kasih banyak.",   context: "Percakapan: berterima kasih kepada guru" },
    ],

    quiz: [
      // 8 Speaking
      { id: 1,  type: "speaking", question: "Ucapkan salam pagi yang sopan:", japanese: "おはようございます。", romaji: "Ohayou gozaimasu.", translation: "Selamat pagi (sopan).", correctAnswer: "おはようございます" },
      { id: 2,  type: "speaking", question: "Ucapkan salam siang:", japanese: "こんにちは。", romaji: "Konnichiwa.", translation: "Selamat siang.", correctAnswer: "こんにちは" },
      { id: 3,  type: "speaking", question: "Ucapkan salam malam:", japanese: "こんばんは。", romaji: "Konbanwa.", translation: "Selamat malam.", correctAnswer: "こんばんは" },
      { id: 4,  type: "speaking", question: "Ucapkan salam saat berangkat:", japanese: "いってきます。", romaji: "Ittekimasu.", translation: "Saya berangkat.", correctAnswer: "いってきます" },
      { id: 5,  type: "speaking", question: "Ucapkan salam saat pulang:", japanese: "ただいま。", romaji: "Tadaima.", translation: "Saya pulang.", correctAnswer: "ただいま" },
      { id: 6,  type: "speaking", question: "Ucapkan terima kasih yang sopan:", japanese: "ありがとうございます。", romaji: "Arigatou gozaimasu.", translation: "Terima kasih banyak.", correctAnswer: "ありがとうございます" },
      { id: 7,  type: "speaking", question: "Ucapkan ungkapan sebelum makan:", japanese: "いただきます。", romaji: "Itadakimasu.", translation: "Selamat makan.", correctAnswer: "いただきます" },
      { id: 8,  type: "speaking", question: "Ucapkan permohonan maaf yang tulus:", japanese: "ごめんなさい。", romaji: "Gomen nasai.", translation: "Mohon maaf.", correctAnswer: "ごめんなさい" },
      // 4 Listening
      { id: 9,  type: "listening", question: "Dengarkan audio. Salam apa yang diucapkan?", audioText: "こんばんは。", choices: ["Selamat pagi", "Selamat siang", "Selamat malam", "Selamat tidur"], correctAnswer: 2 },
      { id: 10, type: "listening", question: "Dengarkan audio. Apa artinya?", audioText: "すみません。", choices: ["Terima kasih", "Selamat makan", "Permisi / Maaf", "Saya berangkat"], correctAnswer: 2 },
      { id: 11, type: "listening", question: "Dengarkan audio. Kapan diucapkan?", audioText: "ごちそうさまでした。", choices: ["Sebelum makan", "Setelah makan", "Saat berangkat", "Saat tidur"], correctAnswer: 1 },
      { id: 12, type: "listening", question: "Dengarkan audio. Apa yang sedang terjadi?", audioText: "おかえりなさい。", choices: ["Ada yang berangkat", "Ada yang pulang ke rumah", "Ada yang tidur", "Ada yang makan"], correctAnswer: 1 },
      // 4 Pattern Recognition
      {
        id: 13, type: "matching", question: "Cocokkan salam berdasarkan waktu:",
        pairs: [
          { japanese: "おはようございます", romaji: "Ohayou gozaimasu", indonesian: "Selamat pagi (sopan)" },
          { japanese: "こんにちは",          romaji: "Konnichiwa",       indonesian: "Selamat siang/sore" },
          { japanese: "こんばんは",          romaji: "Konbanwa",         indonesian: "Selamat malam" },
          { japanese: "おやすみなさい",      romaji: "Oyasuminasai",     indonesian: "Selamat tidur" },
        ], correctAnswer: 0,
      },
      {
        id: 14, type: "matching", question: "Cocokkan salam saat keluar/masuk rumah:",
        pairs: [
          { japanese: "いってきます",     romaji: "Ittekimasu",    indonesian: "Saya berangkat" },
          { japanese: "いってらっしゃい", romaji: "Itterasshai",   indonesian: "Hati-hati di jalan" },
          { japanese: "ただいま",         romaji: "Tadaima",       indonesian: "Saya pulang" },
          { japanese: "おかえりなさい",   romaji: "Okaerinasai",   indonesian: "Selamat datang kembali" },
        ], correctAnswer: 0,
      },
      { id: 15, type: "multiple-choice", question: "Perbedaan おはようございます dan おはよう adalah…", choices: ["Tidak ada perbedaan", "Gozaimasu lebih sopan, untuk guru dan orang tua", "Ohayou lebih sopan", "Keduanya digunakan malam hari"], correctAnswer: 1 },
      { id: 16, type: "multiple-choice", question: "Huruf は pada こんにちは dan こんばんは dibaca…", choices: ["ha", "wa", "ba", "ka"], correctAnswer: 1 },
      // 4 Comprehension
      { id: 17, type: "multiple-choice", question: "Saat memanggil pelayan di restoran, ungkapan yang tepat adalah…", choices: ["ごめんなさい", "ありがとう", "すみません", "おやすみ"], correctAnswer: 2 },
      { id: 18, type: "multiple-choice", question: "Ungkapan apa yang diucapkan orang tua saat menyambut anak yang pulang?", choices: ["いってらっしゃい", "おかえりなさい", "ただいま", "いってきます"], correctAnswer: 1 },
      { id: 19, type: "multiple-choice", question: "さようなら digunakan ketika…", choices: ["Akan bertemu lagi besok", "Berpisah dalam waktu lama atau tidak tahu kapan bertemu", "Menyambut tamu", "Makan bersama"], correctAnswer: 1 },
      { id: 20, type: "multiple-choice", question: "ごちそうさまでした diucapkan…", choices: ["Sebelum makan", "Saat berangkat", "Setelah makan sebagai terima kasih", "Saat bertemu pertama kali"], correctAnswer: 2 },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LESSON 2 — じこしょうかい (JIKOSHOUKAI)
  // Source: Bab A — Jikoshoukai (halaman 4–7)
  // ══════════════════════════════════════════════════════════
  {
    id: "jikoshoukai",
    titleJapanese: "じこしょうかい",
    titleRomaji: "Jikoshoukai",
    titleIndonesian: "Perkenalan Diri",
    description: "Belajar memperkenalkan diri dalam bahasa Jepang.",
    isLocked: true,

    steps: [
      // ── はじめまして ─────────────────────────────────────
      {
        id: 1,
        title: "Salam Kenal",
        japanese: "はじめまして。",
        romaji: "Hajimemashite.",
        translation: "Salam kenal / senang bertemu.",
        type: "learn",
        note: "Digunakan saat pertama kali bertemu. Tidak perlu diulang saat bertemu lagi.",
      },
      {
        id: 2,
        title: "Pola: はじめまして + Nama + です",
        japanese: "はじめまして、アニサです。",
        romaji: "Hajimemashite, Anisa desu.",
        translation: "Salam kenal, saya Anisa.",
        type: "learn",
        practicePrompt: "Coba perkenalkan namamu sendiri!",
      },
      {
        id: 3,
        title: "Menyebut Nama",
        japanese: "わたしは あきらです。",
        romaji: "Watashi wa Akira desu.",
        translation: "Nama saya Akira.",
        type: "learn",
      },
      // ── Umur (さい) ──────────────────────────────────────
      {
        id: 4,
        title: "Pola Menyebut Umur",
        japanese: "じゅうななさいです。",
        romaji: "Juunanasai desu.",
        translation: "Saya berumur 17 tahun.",
        type: "learn",
        note: "Pola: Angka + さい + です",
      },
      {
        id: 5,
        title: "Umur 16 Tahun",
        japanese: "じゅうろくさいです。",
        romaji: "Juurokusai desu.",
        translation: "Saya berumur 16 tahun.",
        type: "learn",
      },
      {
        id: 6,
        title: "Umur 15 Tahun",
        japanese: "じゅうごさいです。",
        romaji: "Juugosai desu.",
        translation: "Saya berumur 15 tahun.",
        type: "learn",
      },
      {
        id: 7,
        title: "Umur 18 Tahun",
        japanese: "じゅうはっさいです。",
        romaji: "Juuhassai desu.",
        translation: "Saya berumur 18 tahun.",
        type: "learn",
      },
      {
        id: 8,
        title: "Tabel Umur: 1–10 Tahun",
        japanese: "いちさい・にさい・さんさい・よんさい・ごさい・ろくさい・ななさい・はっさい・きゅうさい・じゅっさい",
        romaji: "Is-sai / Ni-sai / San-sai / Yon-sai / Go-sai / Roku-sai / Nana-sai / Has-sai / Kyuu-sai / Jus-sai",
        translation: "1 tahun / 2 tahun / 3 tahun / 4 tahun / 5 tahun / 6 tahun / 7 tahun / 8 tahun / 9 tahun / 10 tahun",
        type: "learn",
        note: "Perhatikan perubahan bunyi: 1=is-sai, 8=has-sai, 10=jus-sai",
      },
      {
        id: 9,
        title: "Tabel Umur: 11–20 Tahun",
        japanese: "じゅういっさい・じゅうにさい・じゅうさんさい・じゅうよんさい・じゅうごさい・じゅうろくさい・じゅうななさい・じゅうはっさい・じゅうきゅうさい・はたち",
        romaji: "Juu-is-sai / Juu-ni-sai / Juu-san-sai / Juu-yon-sai / Juu-go-sai / Juu-roku-sai / Juu-nana-sai / Juu-has-sai / Juu-kyuu-sai / Hatachi",
        translation: "11 / 12 / 13 / 14 / 15 / 16 / 17 / 18 / 19 / 20 tahun",
        type: "learn",
        note: "20 tahun = はたち (hatachi) — bentuk khusus",
      },
      // ── Asal (からきました) ───────────────────────────────
      {
        id: 10,
        title: "Pola Menyebut Asal",
        japanese: "いんどねしあから きました。",
        romaji: "Indonesia kara kimashita.",
        translation: "Saya berasal dari Indonesia.",
        type: "learn",
        note: "Pola: Negara/Kota + からきました",
      },
      {
        id: 11,
        title: "Kosakata Negara: Indonesia",
        japanese: "インドネシア",
        romaji: "Indoneshia",
        translation: "Indonesia",
        type: "learn",
      },
      {
        id: 12,
        title: "Kosakata Negara: Jepang",
        japanese: "にほん",
        romaji: "Nihon",
        translation: "Jepang",
        type: "learn",
      },
      {
        id: 13,
        title: "Kosakata Negara: Korea",
        japanese: "かんこく",
        romaji: "Kankoku",
        translation: "Korea",
        type: "learn",
      },
      {
        id: 14,
        title: "Kosakata Negara: China",
        japanese: "ちゅうごく",
        romaji: "Chuugoku",
        translation: "China",
        type: "learn",
      },
      {
        id: 15,
        title: "Kosakata Negara: Brazil",
        japanese: "ブラジル",
        romaji: "Burajiru",
        translation: "Brazil",
        type: "learn",
      },
      // ── Contoh Perkenalan Lengkap ─────────────────────────
      {
        id: 16,
        title: "Perkenalan Lengkap (1): Salam Kenal",
        japanese: "はじめまして、アニサです。",
        romaji: "Hajimemashite, Anisa desu.",
        translation: "Salam kenal, saya Anisa.",
        type: "learn",
        practicePrompt: "Ganti 'Anisa' dengan namamu sendiri!",
      },
      {
        id: 17,
        title: "Perkenalan Lengkap (2): Umur",
        japanese: "じゅうななさいです。",
        romaji: "Juunanasai desu.",
        translation: "Saya berumur 17 tahun.",
        type: "learn",
        practicePrompt: "Sebutkan umurmu sendiri!",
      },
      {
        id: 18,
        title: "Perkenalan Lengkap (3): Asal",
        japanese: "インドネシアから きました。",
        romaji: "Indonesia kara kimashita.",
        translation: "Saya berasal dari Indonesia.",
        type: "learn",
      },
      {
        id: 19,
        title: "Penutup Perkenalan",
        japanese: "どうぞ よろしく おねがいします。",
        romaji: "Douzo yoroshiku onegaishimasu.",
        translation: "Mohon bimbingannya.",
        type: "learn",
      },
      {
        id: 20,
        title: "Review",
        japanese: "ふくしゅう",
        romaji: "Fukushuu",
        translation: "Review semua materi perkenalan diri.",
        type: "review",
      },
      {
        id: 21,
        title: "Siap Mengerjakan Quiz",
        japanese: "じゅんび かんりょう",
        romaji: "Junbi kanryou",
        translation: "Kamu siap untuk tantangan!",
        type: "summary",
      },
    ],

    listeningQuestions: [
      {
        id: 1,
        audioText: "はじめまして、アニサです。",
        question: "Apa yang sedang dilakukan pembicara?",
        choices: ["Berpamitan", "Memperkenalkan diri", "Berterima kasih", "Meminta maaf"],
        correctIndex: 1,
      },
      {
        id: 2,
        audioText: "じゅうななさいです。",
        question: "Berapa umur pembicara?",
        choices: ["15 tahun", "16 tahun", "17 tahun", "18 tahun"],
        correctIndex: 2,
      },
      {
        id: 3,
        audioText: "インドネシアから きました。",
        question: "Dari mana pembicara berasal?",
        choices: ["Jepang", "Korea", "Indonesia", "China"],
        correctIndex: 2,
      },
      {
        id: 4,
        audioText: "どうぞ よろしく おねがいします。",
        question: "Kapan kalimat ini biasanya diucapkan?",
        choices: ["Saat berpamitan", "Saat menutup perkenalan diri", "Saat makan", "Saat pulang"],
        correctIndex: 1,
      },
    ],

    speakingChallenges: [
      { id: 1,  japanese: "はじめまして。",                    romaji: "Hajimemashite.",                translation: "Salam kenal.",                        context: "Pembuka perkenalan" },
      { id: 2,  japanese: "わたしは あきらです。",             romaji: "Watashi wa Akira desu.",         translation: "Nama saya Akira.",                    context: "Menyebut nama", useStudentName: true },
      { id: 3,  japanese: "じゅうろくさいです。",              romaji: "Juurokusai desu.",               translation: "Saya berumur 16 tahun.",              context: "Menyebut umur 16" },
      { id: 4,  japanese: "じゅうななさいです。",              romaji: "Juunanasai desu.",               translation: "Saya berumur 17 tahun.",              context: "Menyebut umur 17" },
      { id: 5,  japanese: "じゅうはっさいです。",              romaji: "Juuhassai desu.",                translation: "Saya berumur 18 tahun.",              context: "Menyebut umur 18" },
      { id: 6,  japanese: "インドネシアから きました。",       romaji: "Indonesia kara kimashita.",      translation: "Saya berasal dari Indonesia.",        context: "Menyebut asal negara" },
      { id: 7,  japanese: "にほんから きました。",             romaji: "Nihon kara kimashita.",          translation: "Saya berasal dari Jepang.",           context: "Asal negara: Jepang" },
      { id: 8,  japanese: "かんこくから きました。",           romaji: "Kankoku kara kimashita.",        translation: "Saya berasal dari Korea.",            context: "Asal negara: Korea" },
      { id: 9,  japanese: "はじめまして、アニサです。",        romaji: "Hajimemashite, Anisa desu.",     translation: "Salam kenal, saya Anisa.",            context: "Perkenalan lengkap 1" },
      { id: 10, japanese: "じゅうななさいです。",              romaji: "Juunanasai desu.",               translation: "Saya berumur 17 tahun.",              context: "Perkenalan lengkap 2" },
      { id: 11, japanese: "インドネシアから きました。",       romaji: "Indonesia kara kimashita.",      translation: "Saya berasal dari Indonesia.",        context: "Perkenalan lengkap 3" },
      { id: 12, japanese: "どうぞ よろしく おねがいします。", romaji: "Douzo yoroshiku onegaishimasu.", translation: "Mohon bimbingannya.",                 context: "Penutup perkenalan" },
      { id: 13, japanese: "わたしは こうこうせいです。",       romaji: "Watashi wa koukousei desu.",     translation: "Saya seorang siswa SMA.",             context: "Status sekolah" },
      { id: 14, japanese: "しゅみは おんがくを きくことです。", romaji: "Shumi wa ongaku wo kikukoto desu.", translation: "Hobi saya mendengarkan musik.",  context: "Menyebut hobi" },
      { id: 15, japanese: "しょうらい、せんせいに なりたいです。", romaji: "Shourai, sensei ni naritai desu.", translation: "Saya ingin menjadi guru.",       context: "Menyebut cita-cita" },
    ],

    quiz: [
      // 8 Speaking
      { id: 1,  type: "speaking", question: "Ucapkan salam kenal:", japanese: "はじめまして。", romaji: "Hajimemashite.", translation: "Salam kenal.", correctAnswer: "はじめまして" },
      { id: 2,  type: "speaking", question: "Perkenalkan namamu:", japanese: "わたしは [name] です。", romaji: "Watashi wa [name] desu.", translation: "Nama saya [name].", correctAnswer: "わたしは", useStudentName: true },
      { id: 3,  type: "speaking", question: "Ucapkan umur 16 tahun:", japanese: "じゅうろくさいです。", romaji: "Juurokusai desu.", translation: "Saya berumur 16 tahun.", correctAnswer: "じゅうろくさいです" },
      { id: 4,  type: "speaking", question: "Ucapkan umur 17 tahun:", japanese: "じゅうななさいです。", romaji: "Juunanasai desu.", translation: "Saya berumur 17 tahun.", correctAnswer: "じゅうななさいです" },
      { id: 5,  type: "speaking", question: "Sebutkan asal dari Indonesia:", japanese: "インドネシアから きました。", romaji: "Indonesia kara kimashita.", translation: "Saya berasal dari Indonesia.", correctAnswer: "インドネシアから きました" },
      { id: 6,  type: "speaking", question: "Ucapkan penutup perkenalan:", japanese: "どうぞ よろしく おねがいします。", romaji: "Douzo yoroshiku onegaishimasu.", translation: "Mohon bimbingannya.", correctAnswer: "どうぞ よろしく" },
      { id: 7,  type: "speaking", question: "Ucapkan status sebagai siswa SMA:", japanese: "わたしは こうこうせいです。", romaji: "Watashi wa koukousei desu.", translation: "Saya seorang siswa SMA.", correctAnswer: "こうこうせいです" },
      { id: 8,  type: "speaking", question: "Ucapkan perkenalan lengkap (salam kenal):", japanese: "はじめまして、アニサです。", romaji: "Hajimemashite, Anisa desu.", translation: "Salam kenal, saya Anisa.", correctAnswer: "はじめまして" },
      // 4 Listening
      { id: 9,  type: "listening", question: "Dengarkan audio. Berapa umur pembicara?", audioText: "じゅうろくさいです。", choices: ["15 tahun", "16 tahun", "17 tahun", "18 tahun"], correctAnswer: 1 },
      { id: 10, type: "listening", question: "Dengarkan audio. Dari mana pembicara?", audioText: "かんこくから きました。", choices: ["Indonesia", "Jepang", "Korea", "China"], correctAnswer: 2 },
      { id: 11, type: "listening", question: "Dengarkan audio. Apa yang diperkenalkan?", audioText: "しゅみは おんがくです。", choices: ["Umur", "Hobi", "Nama", "Asal"], correctAnswer: 1 },
      { id: 12, type: "listening", question: "Dengarkan audio. Apa kalimat ini?", audioText: "どうぞ よろしく おねがいします。", choices: ["Salam kenal", "Mohon bimbingannya", "Terima kasih", "Sampai jumpa"], correctAnswer: 1 },
      // 4 Pattern Recognition
      {
        id: 13, type: "matching", question: "Cocokkan pola perkenalan dengan artinya:",
        pairs: [
          { japanese: "はじめまして",        romaji: "Hajimemashite",     indonesian: "Salam kenal" },
          { japanese: "～さいです",           romaji: "~ sai desu",        indonesian: "Saya berumur ~ tahun" },
          { japanese: "～からきました",       romaji: "~ kara kimashita",  indonesian: "Saya berasal dari ~" },
          { japanese: "よろしくおねがいします", romaji: "Yoroshiku onegaishimasu", indonesian: "Mohon bimbingannya" },
        ], correctAnswer: 0,
      },
      {
        id: 14, type: "matching", question: "Cocokkan nama negara dalam bahasa Jepang:",
        pairs: [
          { japanese: "インドネシア", romaji: "Indoneshia", indonesian: "Indonesia" },
          { japanese: "にほん",       romaji: "Nihon",      indonesian: "Jepang" },
          { japanese: "かんこく",     romaji: "Kankoku",    indonesian: "Korea" },
          { japanese: "ちゅうごく",   romaji: "Chuugoku",   indonesian: "China" },
        ], correctAnswer: 0,
      },
      { id: 15, type: "multiple-choice", question: "20 tahun dalam bahasa Jepang adalah…", choices: ["にじゅっさい", "はたち", "じゅうにさい", "よんじゅっさい"], correctAnswer: 1 },
      { id: 16, type: "multiple-choice", question: "Pola kalimat untuk menyebut umur adalah…", choices: ["Nama + さい + です", "Angka + さい + です", "Negara + さい + です", "さい + Angka + です"], correctAnswer: 1 },
      // 4 Comprehension
      { id: 17, type: "multiple-choice", question: "Kapan はじめまして digunakan?", choices: ["Setiap kali bertemu", "Hanya saat pertama kali bertemu", "Saat berpisah", "Setelah makan"], correctAnswer: 1 },
      { id: 18, type: "multiple-choice", question: "Kalimat mana yang benar untuk menyebut asal dari Korea?", choices: ["にほんからきました", "かんこくからきました", "ちゅうごくからきました", "ブラジルからきました"], correctAnswer: 1 },
      { id: 19, type: "multiple-choice", question: "Cara mengucapkan umur 18 tahun yang benar adalah…", choices: ["じゅうはちさい", "じゅうはっさい", "じゅうやさい", "はちじゅっさい"], correctAnswer: 1 },
      { id: 20, type: "multiple-choice", question: "Kalimat perkenalan yang tepat adalah…", choices: ["はじめまして、アニサからきました", "はじめまして、アニサです", "アニサ、はじめまして、さい", "です、アニサ、はじめまして"], correctAnswer: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LESSON 3 — かぞく (KAZOKU)
  // Source: Bab B — Kazoku (halaman 7–10)
  // ══════════════════════════════════════════════════════════
  {
    id: "kazoku",
    titleJapanese: "かぞく",
    titleRomaji: "Kazoku",
    titleIndonesian: "Keluarga",
    description: "Belajar kosakata dan percakapan tentang anggota keluarga.",
    isLocked: true,

    steps: [
      // ── Kosakata Keluarga (Milik Sendiri vs Orang Lain) ──
      {
        id: 1,
        title: "Ayah — Milik Sendiri vs Orang Lain",
        japanese: "ちち / おとうさん",
        romaji: "Chichi / Otoosan",
        translation: "Ayah (milik sendiri) / Ayah (milik orang lain)",
        type: "learn",
        note: "ちち digunakan saat membicarakan ayah sendiri. おとうさん digunakan saat menyebut ayah orang lain.",
      },
      {
        id: 2,
        title: "Ibu — Milik Sendiri vs Orang Lain",
        japanese: "はは / おかあさん",
        romaji: "Haha / Okaasan",
        translation: "Ibu (milik sendiri) / Ibu (milik orang lain)",
        type: "learn",
      },
      {
        id: 3,
        title: "Kakak Laki-laki",
        japanese: "あに / おにいさん",
        romaji: "Ani / Oniisan",
        translation: "Kakak laki-laki (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 4,
        title: "Kakak Perempuan",
        japanese: "あね / おねえさん",
        romaji: "Ane / Oneesan",
        translation: "Kakak perempuan (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 5,
        title: "Adik Laki-laki",
        japanese: "おとうと / おとうとさん",
        romaji: "Otooto / Otootosan",
        translation: "Adik laki-laki (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 6,
        title: "Adik Perempuan",
        japanese: "いもうと / いもうとさん",
        romaji: "Imooto / Imootosan",
        translation: "Adik perempuan (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 7,
        title: "Kakek",
        japanese: "そふ / おじいさん",
        romaji: "Sofu / Ojiisan",
        translation: "Kakek (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 8,
        title: "Nenek",
        japanese: "そぼ / おばあさん",
        romaji: "Sobo / Obaasan",
        translation: "Nenek (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 9,
        title: "Paman",
        japanese: "おじ / おじさん",
        romaji: "Oji / Ojisan",
        translation: "Paman (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 10,
        title: "Bibi",
        japanese: "おば / おばさん",
        romaji: "Oba / Obasan",
        translation: "Bibi (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 11,
        title: "Suami",
        japanese: "おっと / しゅじん",
        romaji: "Otto / Shujin",
        translation: "Suami (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 12,
        title: "Istri",
        japanese: "つま / かない",
        romaji: "Tsuma / Kanai",
        translation: "Istri (milik sendiri) / (milik orang lain)",
        type: "learn",
      },
      {
        id: 13,
        title: "Anak Laki-laki / Anak Perempuan",
        japanese: "むすこ / むすめ",
        romaji: "Musuko / Musume",
        translation: "Anak laki-laki / Anak perempuan",
        type: "learn",
      },
      // ── Jumlah Keluarga ───────────────────────────────────
      {
        id: 14,
        title: "Hitungan Orang: 1–5",
        japanese: "ひとり・ふたり・さんにん・よにん・ごにん",
        romaji: "Hitori / Futari / Sannin / Yonin / Gonin",
        translation: "1 orang / 2 orang / 3 orang / 4 orang / 5 orang",
        type: "learn",
        note: "1 orang = ひとり, 2 orang = ふたり (bentuk khusus). 3 ke atas: angka + にん",
      },
      {
        id: 15,
        title: "Menanyakan Jumlah Keluarga",
        japanese: "かぞくは なんにんですか。",
        romaji: "Kazoku wa nannin desu ka?",
        translation: "Keluarga Anda ada berapa orang?",
        type: "learn",
      },
      {
        id: 16,
        title: "Menjawab: 4 Orang",
        japanese: "よにんかぞくです。",
        romaji: "Yonin kazoku desu.",
        translation: "Keluarga saya ada 4 orang.",
        type: "learn",
        practicePrompt: "Coba sebutkan jumlah anggota keluargamu!",
      },
      {
        id: 17,
        title: "Menjawab Detail",
        japanese: "ちちと ははと おとうとと わたしです。",
        romaji: "Chichi to haha to otooto to watashi desu.",
        translation: "Ada ayah, ibu, adik laki-laki, dan saya.",
        type: "learn",
      },
      // ── Sifat/Karakter Anggota Keluarga ──────────────────
      {
        id: 18,
        title: "Sifat: Baik / Ramah",
        japanese: "やさしい",
        romaji: "Yasashii",
        translation: "Baik / ramah",
        type: "learn",
      },
      {
        id: 19,
        title: "Sifat: Ceria",
        japanese: "あかるい",
        romaji: "Akarui",
        translation: "Ceria",
        type: "learn",
      },
      {
        id: 20,
        title: "Sifat: Pendiam",
        japanese: "しずかな",
        romaji: "Shizuka na",
        translation: "Pendiam",
        type: "learn",
      },
      {
        id: 21,
        title: "Sifat: Tegas",
        japanese: "きびしい",
        romaji: "Kibishii",
        translation: "Tegas",
        type: "learn",
      },
      {
        id: 22,
        title: "Sifat: Rajin / Serius",
        japanese: "まじめな",
        romaji: "Majime na",
        translation: "Rajin / serius",
        type: "learn",
      },
      {
        id: 23,
        title: "Pola: Sifat Anggota Keluarga",
        japanese: "ははは やさしいです。",
        romaji: "Haha wa yasashii desu.",
        translation: "Ibu saya baik hati.",
        type: "learn",
        note: "Pola: Anggota Keluarga + は + Sifat + です",
      },
      {
        id: 24,
        title: "Contoh: Ayah Rajin",
        japanese: "ちちは まじめです。",
        romaji: "Chichi wa majime desu.",
        translation: "Ayah saya rajin.",
        type: "learn",
      },
      // ── Percakapan ────────────────────────────────────────
      {
        id: 25,
        title: "Dialog: Menanyakan Foto Keluarga",
        japanese: "ジョイさん、これは おねえさんの しゃしんですか。",
        romaji: "Joi-san, kore wa oneesan no shashin desu ka?",
        translation: "Joy, apakah ini foto kakak perempuanmu?",
        type: "learn",
        practicePrompt: "Coba ucapkan kalimat tanya ini!",
      },
      {
        id: 26,
        title: "Dialog: Menjawab Foto",
        japanese: "いいえ、あねじゃありません。わたしの いもうとです。",
        romaji: "Iie, ane ja arimasen. Watashi no imooto desu.",
        translation: "Bukan, bukan kakak perempuan. Ini adik perempuan saya.",
        type: "learn",
      },
      {
        id: 27,
        title: "Dialog: Reaksi",
        japanese: "そうですか。かわいいですね。",
        romaji: "Sou desu ka. Kawaii desu ne.",
        translation: "Oh begitu. Imut ya.",
        type: "learn",
      },
      {
        id: 28,
        title: "Dialog: Menanyakan Jumlah Keluarga",
        japanese: "アニスさんの かぞくは なんにんですか。",
        romaji: "Anisu-san no kazoku wa nannin desu ka?",
        translation: "Keluarga Anis ada berapa orang?",
        type: "learn",
      },
      {
        id: 29,
        title: "Dialog: Menjawab Jumlah & Anggota",
        japanese: "よにんかぞくです。ちちと ははと おとうとと わたしです。",
        romaji: "Yonin kazoku desu. Chichi to haha to otooto to watashi desu.",
        translation: "Keluarga saya 4 orang. Ada ayah, ibu, adik laki-laki, dan saya.",
        type: "learn",
        practicePrompt: "Ceritakan anggota keluargamu!",
      },
      {
        id: 30,
        title: "Dialog: Menanyakan Sifat Ayah",
        japanese: "ジョイさんの おとうさんは どんなひとですか。",
        romaji: "Joi-san no otoosan wa donna hito desu ka?",
        translation: "Ayah Joy orangnya seperti apa?",
        type: "learn",
      },
      {
        id: 31,
        title: "Dialog: Menjawab Sifat Ayah",
        japanese: "ちちは とても まじめです。",
        romaji: "Chichi wa totemo majime desu.",
        translation: "Ayah saya sangat rajin.",
        type: "learn",
      },
      {
        id: 32,
        title: "Dialog: Sifat Ibu",
        japanese: "ははは いつも あかるいですよ。そして、とても やさしいです。",
        romaji: "Haha wa itsumo akarui desu yo. Soshite, totemo yasashii desu.",
        translation: "Ibu saya selalu ceria. Dan, sangat baik hati.",
        type: "learn",
        practicePrompt: "Ceritakan sifat anggota keluargamu!",
      },
      {
        id: 33,
        title: "Review",
        japanese: "ふくしゅう",
        romaji: "Fukushuu",
        translation: "Review semua materi keluarga.",
        type: "review",
      },
      {
        id: 34,
        title: "Siap Mengerjakan Quiz",
        japanese: "じゅんび かんりょう",
        romaji: "Junbi kanryou",
        translation: "Kamu siap untuk tantangan!",
        type: "summary",
      },
    ],

    listeningQuestions: [
      {
        id: 1,
        audioText: "ちちは やさしいです。",
        question: "Siapa yang dibicarakan dan bagaimana sifatnya?",
        choices: ["Ibu — ceria", "Ayah — baik hati", "Kakak — rajin", "Adik — pendiam"],
        correctIndex: 1,
      },
      {
        id: 2,
        audioText: "よにんかぞくです。",
        question: "Ada berapa anggota keluarga?",
        choices: ["2 orang", "3 orang", "4 orang", "5 orang"],
        correctIndex: 2,
      },
      {
        id: 3,
        audioText: "いいえ、あねじゃありません。わたしの いもうとです。",
        question: "Siapakah orang yang dimaksud?",
        choices: ["Kakak perempuan pembicara", "Adik perempuan pembicara", "Ibu pembicara", "Teman pembicara"],
        correctIndex: 1,
      },
      {
        id: 4,
        audioText: "ははは いつも あかるいです。",
        question: "Bagaimana sifat ibu pembicara?",
        choices: ["Pendiam", "Tegas", "Selalu ceria", "Rajin"],
        correctIndex: 2,
      },
    ],

    speakingChallenges: [
      { id: 1,  japanese: "ちち",                                              romaji: "Chichi",                                    translation: "Ayah (milik sendiri)",              context: "Kosakata keluarga" },
      { id: 2,  japanese: "おとうさん",                                        romaji: "Otoosan",                                   translation: "Ayah (milik orang lain)",            context: "Kosakata keluarga sopan" },
      { id: 3,  japanese: "はは",                                              romaji: "Haha",                                      translation: "Ibu (milik sendiri)",               context: "Kosakata keluarga" },
      { id: 4,  japanese: "おかあさん",                                        romaji: "Okaasan",                                   translation: "Ibu (milik orang lain)",            context: "Kosakata keluarga sopan" },
      { id: 5,  japanese: "かぞくは なんにんですか。",                         romaji: "Kazoku wa nannin desu ka?",                 translation: "Keluarga Anda ada berapa orang?",   context: "Menanyakan jumlah keluarga" },
      { id: 6,  japanese: "よにんかぞくです。",                                romaji: "Yonin kazoku desu.",                        translation: "Keluarga saya ada 4 orang.",        context: "Menjawab jumlah keluarga" },
      { id: 7,  japanese: "さんにんかぞくです。",                              romaji: "Sannin kazoku desu.",                       translation: "Keluarga saya ada 3 orang.",        context: "Menjawab jumlah keluarga" },
      { id: 8,  japanese: "ちちと ははと わたしです。",                        romaji: "Chichi to haha to watashi desu.",            translation: "Ada ayah, ibu, dan saya.",          context: "Menyebut anggota keluarga" },
      { id: 9,  japanese: "ははは やさしいです。",                             romaji: "Haha wa yasashii desu.",                    translation: "Ibu saya baik hati.",               context: "Sifat ibu" },
      { id: 10, japanese: "ちちは まじめです。",                               romaji: "Chichi wa majime desu.",                    translation: "Ayah saya rajin.",                  context: "Sifat ayah" },
      { id: 11, japanese: "ははは いつも あかるいです。",                      romaji: "Haha wa itsumo akarui desu.",               translation: "Ibu saya selalu ceria.",            context: "Sifat ibu dari dialog" },
      { id: 12, japanese: "ちちは とても まじめです。",                        romaji: "Chichi wa totemo majime desu.",             translation: "Ayah saya sangat rajin.",           context: "Sifat ayah dari dialog" },
      { id: 13, japanese: "いいえ、あねじゃありません。わたしの いもうとです。", romaji: "Iie, ane ja arimasen. Watashi no imooto desu.", translation: "Bukan kakak, ini adik saya.", context: "Dialog foto keluarga" },
      { id: 14, japanese: "そうですか。かわいいですね。",                       romaji: "Sou desu ka. Kawaii desu ne.",               translation: "Oh begitu. Imut ya.",               context: "Reaksi dalam percakapan" },
      { id: 15, japanese: "ちちと ははと おとうとと わたしです。",             romaji: "Chichi to haha to otooto to watashi desu.", translation: "Ayah, ibu, adik laki-laki, dan saya.", context: "Menyebut anggota keluarga lengkap" },
    ],

    quiz: [
      // 8 Speaking
      { id: 1,  type: "speaking", question: "Ucapkan 'ayah' (milik sendiri):", japanese: "ちち", romaji: "Chichi", translation: "Ayah (milik sendiri).", correctAnswer: "ちち" },
      { id: 2,  type: "speaking", question: "Ucapkan 'ibu' (milik orang lain):", japanese: "おかあさん", romaji: "Okaasan", translation: "Ibu (milik orang lain).", correctAnswer: "おかあさん" },
      { id: 3,  type: "speaking", question: "Tanyakan jumlah keluarga:", japanese: "かぞくは なんにんですか。", romaji: "Kazoku wa nannin desu ka?", translation: "Keluarga ada berapa orang?", correctAnswer: "なんにんですか" },
      { id: 4,  type: "speaking", question: "Jawab: keluarga 4 orang:", japanese: "よにんかぞくです。", romaji: "Yonin kazoku desu.", translation: "Keluarga saya 4 orang.", correctAnswer: "よにんかぞくです" },
      { id: 5,  type: "speaking", question: "Ucapkan: ibu saya baik hati:", japanese: "ははは やさしいです。", romaji: "Haha wa yasashii desu.", translation: "Ibu saya baik hati.", correctAnswer: "ははは やさしいです" },
      { id: 6,  type: "speaking", question: "Ucapkan: ayah saya sangat rajin:", japanese: "ちちは とても まじめです。", romaji: "Chichi wa totemo majime desu.", translation: "Ayah saya sangat rajin.", correctAnswer: "ちちは とても まじめです" },
      { id: 7,  type: "speaking", question: "Ucapkan: ibu selalu ceria:", japanese: "ははは いつも あかるいです。", romaji: "Haha wa itsumo akarui desu.", translation: "Ibu saya selalu ceria.", correctAnswer: "ははは いつも あかるい" },
      { id: 8,  type: "speaking", question: "Sebutkan anggota keluarga: ayah, ibu, adik, dan saya:", japanese: "ちちと ははと おとうとと わたしです。", romaji: "Chichi to haha to otooto to watashi desu.", translation: "Ada ayah, ibu, adik, dan saya.", correctAnswer: "ちちと ははと" },
      // 4 Listening
      { id: 9,  type: "listening", question: "Dengarkan audio. Bagaimana sifat ibu?", audioText: "ははは いつも あかるいです。", choices: ["Pendiam", "Tegas", "Selalu ceria", "Rajin"], correctAnswer: 2 },
      { id: 10, type: "listening", question: "Dengarkan audio. Berapa anggota keluarga?", audioText: "さんにんかぞくです。", choices: ["2 orang", "3 orang", "4 orang", "5 orang"], correctAnswer: 1 },
      { id: 11, type: "listening", question: "Dengarkan audio. Siapakah yang dimaksud?", audioText: "わたしの いもうとです。", choices: ["Kakak perempuan", "Adik perempuan", "Kakak laki-laki", "Adik laki-laki"], correctAnswer: 1 },
      { id: 12, type: "listening", question: "Dengarkan audio. Bagaimana sifat ayah?", audioText: "ちちは とても まじめです。", choices: ["Sangat ceria", "Sangat rajin/serius", "Sangat baik hati", "Sangat pendiam"], correctAnswer: 1 },
      // 4 Pattern Recognition
      {
        id: 13, type: "matching", question: "Cocokkan anggota keluarga (milik sendiri):",
        pairs: [
          { japanese: "ちち",     romaji: "Chichi",  indonesian: "Ayah" },
          { japanese: "はは",     romaji: "Haha",    indonesian: "Ibu" },
          { japanese: "おとうと", romaji: "Otooto",  indonesian: "Adik laki-laki" },
          { japanese: "いもうと", romaji: "Imooto",  indonesian: "Adik perempuan" },
        ], correctAnswer: 0,
      },
      {
        id: 14, type: "matching", question: "Cocokkan sifat dengan artinya:",
        pairs: [
          { japanese: "やさしい",  romaji: "Yasashii", indonesian: "Baik / ramah" },
          { japanese: "あかるい",  romaji: "Akarui",   indonesian: "Ceria" },
          { japanese: "まじめな",  romaji: "Majime na", indonesian: "Rajin / serius" },
          { japanese: "きびしい",  romaji: "Kibishii", indonesian: "Tegas" },
        ], correctAnswer: 0,
      },
      { id: 15, type: "multiple-choice", question: "Saat membicarakan ibu sendiri kepada orang lain, kata yang tepat adalah…", choices: ["おかあさん", "はは", "おばさん", "おねえさん"], correctAnswer: 1 },
      { id: 16, type: "multiple-choice", question: "Cara mengatakan '3 orang keluarga' adalah…", choices: ["ひとりかぞく", "ふたりかぞく", "さんにんかぞく", "よにんかぞく"], correctAnswer: 2 },
      // 4 Comprehension
      { id: 17, type: "multiple-choice", question: "Apa perbedaan ちち dan おとうさん?", choices: ["Tidak ada perbedaan", "ちち untuk keluarga sendiri, おとうさん untuk keluarga orang lain", "おとうさん lebih kasual", "ちち untuk ibu"], correctAnswer: 1 },
      { id: 18, type: "multiple-choice", question: "Kalimat yang benar untuk mengatakan 'ibu saya baik hati' adalah…", choices: ["おかあさんは やさしいです", "ははは やさしいです", "おばさんは やさしいです", "あねは やさしいです"], correctAnswer: 1 },
      { id: 19, type: "multiple-choice", question: "Hitungan '1 orang' dan '2 orang' dalam bahasa Jepang adalah…", choices: ["いちにん dan ににん", "ひとり dan ふたり", "いちさい dan にさい", "いっこ dan にこ"], correctAnswer: 1 },
      { id: 20, type: "multiple-choice", question: "Dalam dialog, Joy menjawab foto itu adalah adik perempuannya. Kalimat yang digunakan adalah…", choices: ["あねじゃありません。おねえさんです", "いいえ、あねじゃありません。わたしの いもうとです", "はい、あねです", "いもうとじゃありません"], correctAnswer: 1 },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LESSON 4 — こそあど (KO-SO-A-DO)
  // Source: Bab C — Kata Tunjuk (halaman 10–16)
  // ══════════════════════════════════════════════════════════
  {
    id: "kosoado",
    titleJapanese: "こそあど",
    titleRomaji: "Ko-So-A-Do",
    titleIndonesian: "Kata Tunjuk",
    description: "Belajar kata tunjuk benda, tempat, dan arah dalam bahasa Jepang.",
    isLocked: true,

    steps: [
      // ── Kosakata ─────────────────────────────────────────
      {
        id: 1,
        title: "Kosakata: Benda",
        japanese: "ほん・えんぴつ・かばん・とけい・ぱそこん",
        romaji: "Hon / Enpitsu / Kaban / Tokei / Pasokon",
        translation: "Buku / Pensil / Tas / Jam / Laptop",
        type: "learn",
      },
      {
        id: 2,
        title: "Kosakata: Sifat",
        japanese: "おもしろい・あたらしい・いい・きれいな・べんりな",
        romaji: "Omoshiroi / Atarashii / Ii / Kirei na / Benri na",
        translation: "Menarik / Baru / Bagus / Bersih/Indah / Praktis",
        type: "learn",
      },
      {
        id: 3,
        title: "Kosakata: Tempat",
        japanese: "きょうしつ・うち・がっこう・といれ・ぎんこう",
        romaji: "Kyoushitsu / Uchi / Gakkou / Toire / Ginkou",
        translation: "Ruang kelas / Rumah / Sekolah / Toilet / Bank",
        type: "learn",
      },
      // ── Kata Tunjuk Benda 1: これ・それ・あれ・どれ ──────
      {
        id: 4,
        title: "これ — Ini (dekat pembicara)",
        japanese: "これは ほんです。",
        romaji: "Kore wa hon desu.",
        translation: "Ini adalah buku.",
        type: "learn",
        note: "これ — bendanya dekat atau sedang dipegang pembicara.",
      },
      {
        id: 5,
        title: "それ — Itu (dekat lawan bicara)",
        japanese: "それは えんぴつです。",
        romaji: "Sore wa enpitsu desu.",
        translation: "Itu adalah pensil.",
        type: "learn",
        note: "それ — bendanya dekat atau sedang dipegang lawan bicara.",
      },
      {
        id: 6,
        title: "あれ — Itu Jauh",
        japanese: "あれは とけいです。",
        romaji: "Are wa tokei desu.",
        translation: "Itu (jauh) adalah jam.",
        type: "learn",
        note: "あれ — bendanya jauh dari pembicara dan lawan bicara.",
      },
      {
        id: 7,
        title: "どれ — Yang Mana?",
        japanese: "どれが あなたの かばんですか。",
        romaji: "Dore ga anata no kaban desu ka?",
        translation: "Yang mana tas milikmu?",
        type: "learn",
        note: "どれ — digunakan untuk bertanya pilihan benda.",
        practicePrompt: "Coba ucapkan kalimat tanya ini!",
      },
      // ── Kata Tunjuk Benda 2: この・その・あの・どの ──────
      {
        id: 8,
        title: "この — … Ini (melekat pada benda)",
        japanese: "この かばんは あたらしいです。",
        romaji: "Kono kaban wa atarashii desu.",
        translation: "Tas ini baru.",
        type: "learn",
        note: "この harus langsung diikuti kata benda. Tidak bisa berdiri sendiri.",
      },
      {
        id: 9,
        title: "その — … Itu",
        japanese: "その ぱそこんは いいです。",
        romaji: "Sono pasokon wa ii desu.",
        translation: "Laptop itu bagus.",
        type: "learn",
      },
      {
        id: 10,
        title: "あの — … Itu Jauh",
        japanese: "あの ほんは おもしろいです。",
        romaji: "Ano hon wa omoshiroi desu.",
        translation: "Buku itu (di sana) menarik.",
        type: "learn",
      },
      {
        id: 11,
        title: "どの — … Yang Mana?",
        japanese: "どの かばんが いいですか。",
        romaji: "Dono kaban ga ii desu ka?",
        translation: "Tas yang mana yang bagus?",
        type: "learn",
        practicePrompt: "Coba ucapkan kalimat tanya ini!",
      },
      // ── Kata Tunjuk Tempat: ここ・そこ・あそこ・どこ ────
      {
        id: 12,
        title: "ここ — Di Sini",
        japanese: "ここは きょうしつです。",
        romaji: "Koko wa kyoushitsu desu.",
        translation: "Di sini adalah ruang kelas.",
        type: "learn",
        note: "ここ — tempat pembicara berada.",
      },
      {
        id: 13,
        title: "そこ — Di Situ",
        japanese: "そこは といれです。",
        romaji: "Soko wa toire desu.",
        translation: "Di situ adalah toilet.",
        type: "learn",
        note: "そこ — tempat lawan bicara berada.",
      },
      {
        id: 14,
        title: "あそこ — Di Sana",
        japanese: "あそこは ぎんこうです。",
        romaji: "Asoko wa ginkou desu.",
        translation: "Di sana adalah bank.",
        type: "learn",
        note: "あそこ — jauh dari keduanya. Perhatikan: あそこ bukan あこ.",
      },
      {
        id: 15,
        title: "どこ — Di Mana?",
        japanese: "といれは どこですか。",
        romaji: "Toire wa doko desu ka?",
        translation: "Toiletnya di mana?",
        type: "learn",
        practicePrompt: "Coba tanyakan lokasi ruang kelas!",
      },
      // ── Kata Tunjuk Arah Sopan: こちら・そちら・あちら・どちら
      {
        id: 16,
        title: "こちら — Di Sini (Sopan)",
        japanese: "きょうしつは こちらです。",
        romaji: "Kyoushitsu wa kochira desu.",
        translation: "Ruang kelas ada di sebelah sini.",
        type: "learn",
        note: "こちら adalah versi sopan dari ここ. Juga bisa menunjuk arah.",
      },
      {
        id: 17,
        title: "そちら — Di Situ (Sopan)",
        japanese: "ぎんこうは そちらです。",
        romaji: "Ginkou wa sochira desu.",
        translation: "Bank ada di sebelah situ.",
        type: "learn",
      },
      {
        id: 18,
        title: "あちら — Di Sana (Sopan)",
        japanese: "といれは あちらです。",
        romaji: "Toire wa achira desu.",
        translation: "Toilet ada di sebelah sana.",
        type: "learn",
      },
      {
        id: 19,
        title: "どちら — Di Mana? (Sopan)",
        japanese: "きょうしつは どちらですか。",
        romaji: "Kyoushitsu wa dochira desu ka?",
        translation: "Ruang kelas ada di sebelah mana?",
        type: "learn",
        practicePrompt: "Coba ucapkan pertanyaan sopan ini!",
      },
      // ── Tips Ko-So-A-Do ───────────────────────────────────
      {
        id: 20,
        title: "Tips: Rumus Ko-So-A-Do",
        japanese: "こ・そ・あ・ど",
        romaji: "Ko · So · A · Do",
        translation: "Ko = dekat pembicara | So = dekat lawan bicara | A = jauh keduanya | Do = pertanyaan",
        type: "learn",
        note: "Semua kata tunjuk mengikuti pola ini. Ko=dekat pembicara, So=dekat lawan bicara, A=jauh, Do=tanya.",
      },
      {
        id: 21,
        title: "Perbedaan これ vs この",
        japanese: "これは ほんです。 / この ほんは おもしろいです。",
        romaji: "Kore wa hon desu. / Kono hon wa omoshiroi desu.",
        translation: "Ini buku. / Buku ini menarik.",
        type: "learn",
        note: "これ berdiri sendiri + partikel は. この harus langsung diikuti kata benda.",
      },
      {
        id: 22,
        title: "Review",
        japanese: "ふくしゅう",
        romaji: "Fukushuu",
        translation: "Review semua kata tunjuk.",
        type: "review",
      },
      {
        id: 23,
        title: "Siap Mengerjakan Quiz",
        japanese: "じゅんび かんりょう",
        romaji: "Junbi kanryou",
        translation: "Kamu siap untuk tantangan!",
        type: "summary",
      },
    ],

    listeningQuestions: [
      {
        id: 1,
        audioText: "これは ほんです。",
        question: "Benda apa yang disebutkan, dan posisinya?",
        choices: ["Pensil — dekat lawan bicara", "Buku — dekat pembicara", "Tas — jauh dari keduanya", "Jam — dekat pembicara"],
        correctIndex: 1,
      },
      {
        id: 2,
        audioText: "といれは どこですか。",
        question: "Apa yang sedang ditanyakan?",
        choices: ["Lokasi bank", "Lokasi kelas", "Lokasi toilet", "Lokasi sekolah"],
        correctIndex: 2,
      },
      {
        id: 3,
        audioText: "あの ほんは おもしろいです。",
        question: "Di mana posisi buku tersebut?",
        choices: ["Dekat pembicara", "Dekat lawan bicara", "Jauh dari keduanya", "Di tangan pembicara"],
        correctIndex: 2,
      },
      {
        id: 4,
        audioText: "きょうしつは こちらです。",
        question: "Apa yang disampaikan pembicara?",
        choices: ["Menanyakan lokasi kelas", "Menunjukkan lokasi kelas (sopan)", "Mendeskripsikan kelas", "Menyebut nama kelas"],
        correctIndex: 1,
      },
    ],

    speakingChallenges: [
      { id: 1,  japanese: "これは ほんです。",                  romaji: "Kore wa hon desu.",                   translation: "Ini adalah buku.",                   context: "Kata tunjuk: ini" },
      { id: 2,  japanese: "それは えんぴつです。",              romaji: "Sore wa enpitsu desu.",               translation: "Itu adalah pensil.",                 context: "Kata tunjuk: itu (dekat lawan)" },
      { id: 3,  japanese: "あれは とけいです。",               romaji: "Are wa tokei desu.",                  translation: "Itu (jauh) adalah jam.",             context: "Kata tunjuk: itu jauh" },
      { id: 4,  japanese: "どれが あなたの かばんですか。",    romaji: "Dore ga anata no kaban desu ka?",     translation: "Yang mana tas milikmu?",             context: "Kata tanya: yang mana?" },
      { id: 5,  japanese: "この かばんは あたらしいです。",    romaji: "Kono kaban wa atarashii desu.",       translation: "Tas ini baru.",                      context: "この + benda" },
      { id: 6,  japanese: "その ぱそこんは いいです。",        romaji: "Sono pasokon wa ii desu.",            translation: "Laptop itu bagus.",                  context: "その + benda" },
      { id: 7,  japanese: "あの ほんは おもしろいです。",      romaji: "Ano hon wa omoshiroi desu.",          translation: "Buku itu menarik.",                  context: "あの + benda" },
      { id: 8,  japanese: "どの かばんが いいですか。",        romaji: "Dono kaban ga ii desu ka?",           translation: "Tas yang mana yang bagus?",          context: "どの + benda + pertanyaan" },
      { id: 9,  japanese: "ここは きょうしつです。",           romaji: "Koko wa kyoushitsu desu.",            translation: "Di sini adalah ruang kelas.",        context: "Kata tunjuk tempat: di sini" },
      { id: 10, japanese: "そこは といれです。",               romaji: "Soko wa toire desu.",                 translation: "Di situ adalah toilet.",             context: "Kata tunjuk tempat: di situ" },
      { id: 11, japanese: "あそこは ぎんこうです。",           romaji: "Asoko wa ginkou desu.",               translation: "Di sana adalah bank.",               context: "Kata tunjuk tempat: di sana" },
      { id: 12, japanese: "といれは どこですか。",             romaji: "Toire wa doko desu ka?",              translation: "Toiletnya di mana?",                context: "Menanyakan lokasi" },
      { id: 13, japanese: "きょうしつは こちらです。",         romaji: "Kyoushitsu wa kochira desu.",         translation: "Ruang kelas ada di sebelah sini.",   context: "Kata tunjuk sopan: こちら" },
      { id: 14, japanese: "ぎんこうは そちらです。",           romaji: "Ginkou wa sochira desu.",             translation: "Bank ada di sebelah situ.",          context: "Kata tunjuk sopan: そちら" },
      { id: 15, japanese: "といれは あちらです。",             romaji: "Toire wa achira desu.",               translation: "Toilet ada di sebelah sana.",        context: "Kata tunjuk sopan: あちら" },
      { id: 16, japanese: "きょうしつは どちらですか。",       romaji: "Kyoushitsu wa dochira desu ka?",      translation: "Ruang kelas ada di sebelah mana?",   context: "Pertanyaan sopan: どちら" },
      { id: 17, japanese: "これは ぱそこんです。",             romaji: "Kore wa pasokon desu.",               translation: "Ini adalah laptop.",                 context: "Variasi: benda laptop" },
      { id: 18, japanese: "あの ほんは きれいです。",          romaji: "Ano hon wa kirei desu.",              translation: "Buku itu (jauh) bersih/indah.",      context: "Kombinasi kata tunjuk + sifat" },
      { id: 19, japanese: "この かばんは べんりです。",        romaji: "Kono kaban wa benri desu.",           translation: "Tas ini praktis.",                   context: "Kombinasi kata tunjuk + sifat" },
      { id: 20, japanese: "がっこうは どこですか。",           romaji: "Gakkou wa doko desu ka?",             translation: "Sekolahnya di mana?",               context: "Menanyakan lokasi sekolah" },
    ],

    quiz: [
      // 8 Speaking
      { id: 1,  type: "speaking", question: "Ucapkan: Ini adalah buku:", japanese: "これは ほんです。", romaji: "Kore wa hon desu.", translation: "Ini adalah buku.", correctAnswer: "これは ほんです" },
      { id: 2,  type: "speaking", question: "Ucapkan: Itu (dekat lawan) adalah pensil:", japanese: "それは えんぴつです。", romaji: "Sore wa enpitsu desu.", translation: "Itu adalah pensil.", correctAnswer: "それは えんぴつです" },
      { id: 3,  type: "speaking", question: "Ucapkan: Tas ini baru:", japanese: "この かばんは あたらしいです。", romaji: "Kono kaban wa atarashii desu.", translation: "Tas ini baru.", correctAnswer: "この かばんは" },
      { id: 4,  type: "speaking", question: "Ucapkan: Di sini adalah ruang kelas:", japanese: "ここは きょうしつです。", romaji: "Koko wa kyoushitsu desu.", translation: "Di sini ruang kelas.", correctAnswer: "ここは きょうしつです" },
      { id: 5,  type: "speaking", question: "Ucapkan: Toiletnya di mana?", japanese: "といれは どこですか。", romaji: "Toire wa doko desu ka?", translation: "Toiletnya di mana?", correctAnswer: "といれは どこですか" },
      { id: 6,  type: "speaking", question: "Ucapkan versi sopan: Ruang kelas di sebelah sini:", japanese: "きょうしつは こちらです。", romaji: "Kyoushitsu wa kochira desu.", translation: "Ruang kelas ada di sebelah sini.", correctAnswer: "こちらです" },
      { id: 7,  type: "speaking", question: "Ucapkan: Di sana adalah bank:", japanese: "あそこは ぎんこうです。", romaji: "Asoko wa ginkou desu.", translation: "Di sana adalah bank.", correctAnswer: "あそこは ぎんこうです" },
      { id: 8,  type: "speaking", question: "Ucapkan: Laptop itu bagus:", japanese: "その ぱそこんは いいです。", romaji: "Sono pasokon wa ii desu.", translation: "Laptop itu bagus.", correctAnswer: "その ぱそこんは いいです" },
      // 4 Listening
      { id: 9,  type: "listening", question: "Dengarkan audio. Apa artinya?", audioText: "あれは とけいです。", choices: ["Ini jam (dekat)", "Itu jam (dekat lawan bicara)", "Itu jam (jauh)", "Di mana jam?"], correctAnswer: 2 },
      { id: 10, type: "listening", question: "Dengarkan audio. Apa yang ditanyakan?", audioText: "がっこうは どこですか。", choices: ["Lokasi toilet", "Lokasi bank", "Lokasi sekolah", "Lokasi rumah"], correctAnswer: 2 },
      { id: 11, type: "listening", question: "Dengarkan audio. Benda apa, dan bagaimana sifatnya?", audioText: "この かばんは べんりです。", choices: ["Tas ini baru", "Tas ini praktis", "Buku ini menarik", "Laptop itu bagus"], correctAnswer: 1 },
      { id: 12, type: "listening", question: "Dengarkan audio. Apa yang ditunjukkan?", audioText: "といれは あちらです。", choices: ["Menanyakan toilet", "Menunjukkan toilet (sopan)", "Mendeskripsikan toilet", "Memuji toilet"], correctAnswer: 1 },
      // 4 Pattern Recognition
      {
        id: 13, type: "matching", question: "Cocokkan kata tunjuk benda dengan posisinya:",
        pairs: [
          { japanese: "これ", romaji: "Kore", indonesian: "Ini — dekat pembicara" },
          { japanese: "それ", romaji: "Sore", indonesian: "Itu — dekat lawan bicara" },
          { japanese: "あれ", romaji: "Are",  indonesian: "Itu — jauh dari keduanya" },
          { japanese: "どれ", romaji: "Dore", indonesian: "Yang mana?" },
        ], correctAnswer: 0,
      },
      {
        id: 14, type: "matching", question: "Cocokkan kata tunjuk tempat (sopan):",
        pairs: [
          { japanese: "こちら", romaji: "Kochira", indonesian: "Di sini / sebelah sini" },
          { japanese: "そちら", romaji: "Sochira", indonesian: "Di situ / sebelah situ" },
          { japanese: "あちら", romaji: "Achira",  indonesian: "Di sana / sebelah sana" },
          { japanese: "どちら", romaji: "Dochira", indonesian: "Di mana? / sebelah mana?" },
        ], correctAnswer: 0,
      },
      { id: 15, type: "multiple-choice", question: "Perbedaan これ dan この adalah…", choices: ["Tidak ada perbedaan", "これ berdiri sendiri + は, この harus diikuti kata benda", "この berdiri sendiri, これ diikuti kata benda", "Keduanya harus diikuti kata benda"], correctAnswer: 1 },
      { id: 16, type: "multiple-choice", question: "Untuk bertanya lokasi secara sopan, kata yang digunakan adalah…", choices: ["どこ", "どれ", "どちら", "どの"], correctAnswer: 2 },
      // 4 Comprehension
      { id: 17, type: "multiple-choice", question: "あそこ digunakan untuk menunjuk tempat yang…", choices: ["Dekat pembicara", "Dekat lawan bicara", "Jauh dari pembicara dan lawan bicara", "Tidak diketahui"], correctAnswer: 2 },
      { id: 18, type: "multiple-choice", question: "Kalimat yang benar untuk mengatakan 'Buku itu (jauh) menarik' adalah…", choices: ["これは ほんは おもしろいです", "あの ほんは おもしろいです", "どの ほんは おもしろいです", "その ほんは おもしろいです"], correctAnswer: 1 },
      { id: 19, type: "multiple-choice", question: "Jika benda ada di tangan lawan bicara Anda, kata tunjuk yang tepat adalah…", choices: ["これ", "それ", "あれ", "どれ"], correctAnswer: 1 },
      { id: 20, type: "multiple-choice", question: "Mengapa あそこ digunakan bukan あこ?", choices: ["あこ adalah kata yang berbeda", "あそこ adalah bentuk baku, bukan あこ", "あこ artinya jauh ke kiri saja", "Tidak ada alasannya"], correctAnswer: 1 },
    ],
  },

  // ── Stubs (konten menyusul) ────────────────────────────────────────────────
  {
    id: "shumi",
    titleJapanese: "しゅみ",
    titleRomaji: "Shumi",
    titleIndonesian: "Hobi",
    description: "Bercerita tentang hobi dan kegemaran.",
    isLocked: true,
    steps: [], listeningQuestions: [], speakingChallenges: [], quiz: [],
  },
  {
    id: "kaimono",
    titleJapanese: "かいもの",
    titleRomaji: "Kaimono",
    titleIndonesian: "Belanja",
    description: "Percakapan di toko dan cara berbelanja.",
    isLocked: true,
    steps: [], listeningQuestions: [], speakingChallenges: [], quiz: [],
  },
  {
    id: "resutoran",
    titleJapanese: "れすとらん",
    titleRomaji: "Resutoran",
    titleIndonesian: "Restoran",
    description: "Percakapan di restoran dan cara memesan makanan.",
    isLocked: true,
    steps: [], listeningQuestions: [], speakingChallenges: [], quiz: [],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}

export function getActiveLesson(): Lesson | undefined {
  return lessons.find((l) => !l.isLocked)
}

// Legacy compat — keeps old flat routes (/listening, /speaking) compiling
export const lessonData         = lessons[0].steps
export const listeningQuestions = lessons[0].listeningQuestions
export const speakingChallenges = lessons[0].speakingChallenges
export const quizQuestions      = lessons[0].quiz

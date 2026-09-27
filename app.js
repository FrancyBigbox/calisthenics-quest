/* Calisthenics Quest — logica principale */
(() => {
  "use strict";

  const STORAGE_KEY = "calisthenicsQuestProgressV3";
  const DAYS = ["lunedi", "martedi", "mercoledi", "giovedi", "venerdi", "sabato", "domenica"];
  const DAY_NAMES = {
    lunedi: "Lunedì", martedi: "Martedì", mercoledi: "Mercoledì",
    giovedi: "Giovedì", venerdi: "Venerdì", sabato: "Sabato", domenica: "Domenica"
  };

  const PROGRAM = {
    lunedi: {
      short: "Lun", type: "Casa", title: "Lunedì · Calisthenics A",
      subtitle: "25–30 minuti · Parte alta + core",
      note: "Tecnica pulita e niente cedimento. Devi rimanere fresco per il calcio del martedì.",
      kind: "home",
      exercises: [
        { name: "Riscaldamento", detail: "Rotazioni polsi/spalle, 10 scapular push-up, 5 push-up facili.", mode: "timer", target: 300, xp: 8, type: "Preparazione" },
        { name: "Push-up classici", detail: "3 serie × 10 · Recupero 90 sec · Lascia 2–3 ripetizioni in riserva.", mode: "reps", target: 30, xp: 18, type: "Spinta" },
        { name: "Australian pull-up", detail: "3 serie × 6 · Recupero 90 sec · Tira il petto verso il supporto.", mode: "reps", target: 18, xp: 18, type: "Trazione" },
        { name: "Push-up declinati", detail: "2 serie × 6 · Piedi su un supporto basso e stabile.", mode: "reps", target: 12, xp: 14, type: "Spinta" },
        { name: "Hollow hold", detail: "2 serie × 20 secondi · Lombari aderenti al pavimento.", mode: "timer", target: 40, xp: 12, type: "Core" },
        { name: "Leg raises", detail: "2 serie × 8 · Scendi piano e non inarcare la schiena.", mode: "reps", target: 16, xp: 12, type: "Core" }
      ]
    },
    martedi: {
      short: "Mar", type: "Calcio", title: "Martedì · Calcio", subtitle: "15:30 · Corsa e resistenza",
      note: "Arriva idratato. Dopo allenamento fai il pranzo completo: carboidrati + proteine + acqua.", kind: "football",
      exercises: [
        { name: "Allenamento calcio", detail: "Corsa e resistenza con la squadra. Segna quando hai finito.", mode: "check", target: 1, xp: 35, type: "Squadra" },
        { name: "Recupero post-calcio", detail: "Acqua + pranzo completo dopo la seduta.", mode: "check", target: 1, xp: 10, type: "Recupero" }
      ]
    },
    mercoledi: {
      short: "Mer", type: "Calcio", title: "Mercoledì · Calcio", subtitle: "19:00 · Forza e gambe",
      note: "Forza e gambe con il calcio: non aggiungere squat, affondi o salti a casa.", kind: "football",
      exercises: [
        { name: "Allenamento calcio", detail: "Forza e gambe con la squadra. Non aggiungere lavoro gambe a casa.", mode: "check", target: 1, xp: 35, type: "Squadra" },
        { name: "Recupero serale", detail: "Cena completa, acqua e sonno per recuperare bene.", mode: "check", target: 1, xp: 10, type: "Recupero" }
      ]
    },
    giovedi: {
      short: "Gio", type: "Casa", title: "Giovedì · Calisthenics B",
      subtitle: "20–25 minuti · Parte alta + core",
      note: "Sessione breve: venerdì hai velocità a calcio, quindi devi finire ancora fresco.", kind: "home",
      exercises: [
        { name: "Riscaldamento", detail: "Rotazioni polsi/spalle, 10 scapular push-up, 5 push-up facili.", mode: "timer", target: 240, xp: 8, type: "Preparazione" },
        { name: "Diamond push-up", detail: "3 serie × 6 · Mani vicine senza forzare i polsi.", mode: "reps", target: 18, xp: 18, type: "Spinta" },
        { name: "Australian pull-up lenti", detail: "3 serie × 6 · Discesa controllata di 2–3 secondi.", mode: "reps", target: 18, xp: 18, type: "Trazione" },
        { name: "Push-up classici lenti", detail: "2 serie × 6 · 3 secondi in discesa.", mode: "reps", target: 12, xp: 14, type: "Spinta" },
        { name: "Side plank", detail: "2 serie × 20 secondi per lato · 80 secondi totali.", mode: "timer", target: 80, xp: 12, type: "Core" },
        { name: "Superman", detail: "2 serie × 10 · Contrai schiena e glutei in alto.", mode: "reps", target: 20, xp: 12, type: "Schiena" }
      ]
    },
    venerdi: {
      short: "Ven", type: "Calcio", title: "Venerdì · Calcio", subtitle: "15:30 · Scarico e velocità",
      note: "Scarico e velocità: non fare calisthenics extra, proteggi le energie per la partita.", kind: "football",
      exercises: [
        { name: "Allenamento calcio", detail: "Scarico e velocità con la squadra. Arriva fresco.", mode: "check", target: 1, xp: 35, type: "Squadra" },
        { name: "Recupero pre-partita", detail: "Acqua, cena completa e buon sonno.", mode: "check", target: 1, xp: 10, type: "Recupero" }
      ]
    },
    sabato: {
      short: "Sab", type: "Partita", title: "Sabato · Partita / Recupero", subtitle: "Segna ciò che fai",
      note: "Se giochi, segna la partita. Se riposi, fai soltanto mobilità leggera e recupero.", kind: "match",
      exercises: [
        { name: "Partita o recupero", detail: "Se giochi segna completato; se riposi, fai mobilità leggera.", mode: "check", target: 1, xp: 40, type: "Missione" }
      ]
    },
    domenica: {
      short: "Dom", type: "Partita", title: "Domenica · Partita / Recupero", subtitle: "Segna ciò che fai",
      note: "Se giochi, segna la partita. Se riposi, prepara corpo, acqua e alimentazione per la nuova settimana.", kind: "match",
      exercises: [
        { name: "Partita o recupero", detail: "Se giochi segna completato; se riposi, fai mobilità leggera.", mode: "check", target: 1, xp: 40, type: "Missione" }
      ]
    }
  };

  const REWARDS = [
    [1, "🧤", "Guanti base", "La tua avventura è iniziata."],
    [2, "👕", "Maglia da campione", "Nuovo look per il tuo avatar."],
    [3, "🩳", "Pantaloni pro", "Il kit sportivo prende forma."],
    [4, "🎨", "Colore elettrico", "Sblocchi un nuovo dettaglio estetico."],
    [5, "🥋", "Cintura dorata", "Un simbolo di costanza."],
    [6, "🛡️", "Titolo: Costante", "Hai costruito una vera abitudine."],
    [7, "🎽", "Fascia guerriero", "Un look da combattente."],
    [8, "⚡", "Effetto velocità", "Il tuo avatar acquista energia."],
    [9, "🏅", "Medaglia disciplina", "Nove livelli di impegno."],
    [10, "🦸", "Mantello elite", "Ora il tuo avatar sembra un eroe."],
    [11, "🔵", "Aura blu", "Un’aura da atleta avanzato."],
    [12, "👑", "Titolo: Dominatore", "Sei entrato nella fascia alta."],
    [13, "🔥", "Aura fuoco", "La tua costanza diventa visibile."],
    [14, "🥇", "Medaglia oro", "Quattordici livelli completati."],
    [15, "✨", "Aura leggenda", "L’avatar raggiunge la forma leggenda."],
    [16, "🧢", "Cappellino street", "Nuovo cosmetico urbano."],
    [17, "💎", "Emblema diamante", "Premio raro per la costanza."],
    [18, "🐺", "Titolo: Lupo", "Allenamento silenzioso, risultati reali."],
    [19, "🌌", "Aura cosmica", "Un effetto estetico speciale."],
    [20, "🏆", "Coppa d’acciaio", "Venti livelli: grande traguardo."],
    [21, "🧥", "Giacca da team", "Nuovo outfit sbloccato."],
    [22, "⚔️", "Titolo: Guerriero", "Ora la tua campagna è seria."],
    [23, "🌠", "Scia luminosa", "Effetto premium per l’avatar."],
    [24, "🪙", "Bonus monete", "Ricompensa extra di progressione."],
    [25, "🦁", "Titolo: Leone", "Venticinque livelli di disciplina."],
    [26, "🎭", "Maschera neon", "Cosmetico speciale."],
    [27, "🚀", "Boost XP", "Un simbolo della tua crescita."],
    [28, "🏟️", "Titolo: Capitano", "Leadership e costanza."],
    [29, "🌟", "Stella campione", "Sei a un livello dalla grande soglia."],
    [30, "👑", "Corona Quest", "Livello 30: campione della tua evoluzione."],
    [31, "🛸", "Skin futuristica", "Continui oltre il livello 30."],
    [32, "🏹", "Titolo: Leggenda", "La quest non finisce mai."],
    [33, "💠", "Cristallo XP", "Premio di altissimo livello."],
    [34, "🌈", "Aura prisma", "Un’aura rara e colorata."],
    [35, "♾️", "Titolo: Inarrestabile", "Hai dimostrato una costanza enorme."]
  ];

  const COSMETIC_BY_LEVEL = {
    2: "shirt", 3: "pants", 5: "belt", 7: "headband", 10: "cape", 15: "aura"
  };

  const el = (id) => document.getElementById(id);
  let state;
  let activeDay = getTodayKey();
  let timers = {};
  let speechRecognition = null;
  let toastTimeout = null;

  function getWeekKey() {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    const offset = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - offset);
    return date.toISOString().slice(0, 10);
  }

  function getTodayKey() {
    return ["domenica", "lunedi", "martedi", "mercoledi", "giovedi", "venerdi", "sabato"][new Date().getDay()];
  }

  function getDefaultState() {
    return {
      weekKey: getWeekKey(),
      xp: 0,
      coins: 0,
      completedSessions: 0,
      streak: 0,
      lastSessionDate: null,
      theme: "dark",
      exercises: {},
      sessionBonus: {},
      equipped: { shirt: false, pants: false, belt: false, headband: false, cape: false, aura: false }
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...getDefaultState(), ...(parsed || {}), equipped: { ...getDefaultState().equipped, ...(parsed?.equipped || {}) } };
    } catch {
      return getDefaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function checkNewWeek() {
    if (state.weekKey !== getWeekKey()) {
      state.weekKey = getWeekKey();
      state.exercises = {};
      state.sessionBonus = {};
      saveState();
      showModal("🔄", "Nuova settimana", "La tabella settimanale è stata resettata. XP, livelli, monete, avatar e premi sono rimasti al sicuro.");
    }
  }

  function getLevelInfo(xp = state.xp) {
    let level = 1;
    let spent = 0;
    let needed = requiredXp(level);
    while (xp - spent >= needed) {
      spent += needed;
      level += 1;
      needed = requiredXp(level);
    }
    return { level, current: xp - spent, needed, spent };
  }

  function requiredXp(level) {
    return Math.round(75 + (level - 1) * 22 + Math.pow(level - 1, 1.36) * 19);
  }

  function getReward(level) {
    return REWARDS.find((reward) => reward[0] === level) || [level, "🎁", "Ricompensa misteriosa", "Hai raggiunto un nuovo livello."];
  }

  function getNextReward(level) {
    return REWARDS.find((reward) => reward[0] > level) || [level + 1, "♾️", "Nuova leggenda", "Continua: ogni livello richiede più XP."];
  }

  function exerciseId(day, index) {
    return `${state.weekKey}:${day}:${index}`;
  }

  function sessionId(day) {
    return `${state.weekKey}:session:${day}`;
  }

  function getExerciseState(day, index) {
    return state.exercises[exerciseId(day, index)] || { value: 0, completed: false };
  }

  function isDayComplete(day) {
    return PROGRAM[day].exercises.every((_, index) => getExerciseState(day, index).completed);
  }

  function formatTime(totalSeconds) {
    const safe = Math.max(0, totalSeconds);
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function getWeekDates() {
    const start = new Date(`${state.weekKey}T12:00:00`);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("it-IT", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}`;
  }

  function muscleProgress() {
    const level = getLevelInfo().level;
    const completed = Object.values(state.exercises).filter((exercise) => exercise.completed).length;
    return Math.min(100, Math.round(Math.min(65, (level - 1) * 3.2) + Math.min(35, completed * 1.15)));
  }

  function evolutionText(progress) {
    if (progress < 12) return "Fisico: base secca";
    if (progress < 26) return "Fisico: primi segnali";
    if (progress < 43) return "Fisico: più definito";
    if (progress < 61) return "Fisico: atletico";
    if (progress < 80) return "Fisico: forte e definito";
    return "Fisico: forma leggenda";
  }

  function rankText(level) {
    if (level < 3) return "RECLUTA";
    if (level < 6) return "COSTANTE";
    if (level < 10) return "GUERRIERO";
    if (level < 15) return "ELITE";
    if (level < 25) return "CAMPIONE";
    return "LEGGENDA";
  }

  function renderAll() {
    checkNewWeek();
    renderTheme();
    renderStats();
    renderAvatar();
    renderDayTabs();
    renderActiveDay();
    renderWeeklyGrid();
  }

  function renderTheme() {
    document.body.classList.toggle("light", state.theme === "light");
    el("themeButton").innerHTML = state.theme === "light" ? "<span aria-hidden=\"true\">🌙</span>" : "<span aria-hidden=\"true\">☀️</span>";
  }

  function renderStats() {
    const info = getLevelInfo();
    const next = getNextReward(info.level);
    const percent = Math.min(100, Math.round((info.current / info.needed) * 100));

    el("headerLevel").textContent = info.level;
    el("levelNumber").textContent = info.level;
    el("totalXp").textContent = state.xp;
    el("coins").textContent = state.coins;
    el("streak").textContent = state.streak;
    el("sessions").textContent = state.completedSessions;
    el("rankChip").textContent = rankText(info.level);
    el("xpNumbers").textContent = `${info.current} / ${info.needed} XP`;
    el("xpProgress").style.width = `${percent}%`;
    el("xpHint").textContent = `${info.needed - info.current} XP al livello ${info.level + 1}. Ogni livello è più impegnativo.`;
    el("nextRewardIcon").textContent = next[1];
    el("nextRewardName").textContent = next[2];
    el("nextRewardText").textContent = `Raggiungi il livello ${next[0]} per sbloccarlo.`;
  }

  function renderAvatar() {
    const progress = muscleProgress();
    const level = getLevelInfo().level;
    const stage = Math.min(5, Math.floor(progress / 20));
    const scale = 0.88 + stage * 0.045 + Math.min(0.045, (progress % 20) / 440);
    const x = 210 - 210 * scale;
    const y = 240 - 240 * scale;

    el("fighterBody").setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
    el("avatarMuscles").setAttribute("opacity", progress >= 16 ? "1" : "0");
    el("avatarAura").setAttribute("opacity", state.equipped.aura || level >= 15 ? "1" : "0");
    el("avatarShirt").setAttribute("opacity", state.equipped.shirt ? "1" : "0");
    el("avatarPants").setAttribute("opacity", state.equipped.pants ? "1" : "0");
    el("avatarBelt").setAttribute("opacity", state.equipped.belt ? "1" : "0");
    el("avatarHeadband").setAttribute("opacity", state.equipped.headband ? "1" : "0");
    el("avatarCape").setAttribute("opacity", state.equipped.cape ? "1" : "0");

    const title = stage === 0 ? "Recluta determinato" : stage === 1 ? "Atleta in crescita" : stage === 2 ? "Fisico atletico" : stage === 3 ? "Guerriero forte" : stage === 4 ? "Elite calisthenics" : "Leggenda in evoluzione";
    el("heroTitle").textContent = title;
    el("heroSubtitle").textContent = `Livello ${level}: cresci un esercizio completato alla volta.`;
    el("avatarEvolutionLabel").textContent = evolutionText(progress);
    el("muscleProgressText").textContent = `${progress}% · ${evolutionText(progress).replace("Fisico: ", "")}`;
    el("muscleProgressBar").style.width = `${progress}%`;
  }

  function renderDayTabs() {
    const tabs = el("dayTabs");
    tabs.innerHTML = "";
    DAYS.forEach((day) => {
      const button = document.createElement("button");
      button.className = `day-tab ${day === activeDay ? "active" : ""} ${isDayComplete(day) ? "completed" : ""}`;
      button.type = "button";
      button.innerHTML = `${PROGRAM[day].short}<small>${PROGRAM[day].type}</small>`;
      button.addEventListener("click", () => {
        activeDay = day;
        renderDayTabs();
        renderActiveDay();
      });
      tabs.appendChild(button);
    });
  }

  function renderActiveDay() {
    const day = PROGRAM[activeDay];
    el("dayTitle").textContent = day.title;
    el("weekDateRange").textContent = `Settimana ${getWeekDates()} · Reset automatico ogni lunedì.`;
    el("trainingNote").innerHTML = `<span>${day.kind === "home" ? "🛡️" : day.kind === "football" ? "⚽" : "🏟️"}</span><p>${day.note}</p>`;
    el("finishSessionButton").textContent = isDayComplete(activeDay) ? "✓ Seduta completata" : "Completa seduta";
    renderExercises();
  }

  function renderExercises() {
    const list = el("exerciseList");
    const template = el("exerciseTemplate");
    list.innerHTML = "";

    PROGRAM[activeDay].exercises.forEach((exercise, index) => {
      const clone = template.content.cloneNode(true);
      const card = clone.querySelector(".exercise-card");
      const saved = getExerciseState(activeDay, index);
      card.classList.toggle("completed", saved.completed);
      clone.querySelector(".exercise-type").textContent = exercise.type;
      clone.querySelector(".exercise-name").textContent = exercise.name;
      clone.querySelector(".exercise-detail").textContent = exercise.detail;
      clone.querySelector(".exercise-xp").textContent = `+${exercise.xp} XP`;

      const controls = clone.querySelector(".exercise-controls");
      if (exercise.mode === "reps") renderRepControls(controls, exercise, index, saved);
      if (exercise.mode === "timer") renderTimerControls(controls, exercise, index, saved);
      if (exercise.mode === "check") renderCheckControls(controls, exercise, index, saved);

      list.appendChild(clone);
    });
  }

  function renderRepControls(container, exercise, index, saved) {
    const fragment = el("manualCounterTemplate").content.cloneNode(true);
    const current = fragment.querySelector(".rep-current");
    const target = fragment.querySelector(".rep-target");
    const minus = fragment.querySelector(".decrement-button");
    const plus = fragment.querySelector(".increment-button");
    const voice = fragment.querySelector(".voice-button");
    const done = fragment.querySelector(".done-button");
    const status = fragment.querySelector(".control-status");

    current.textContent = saved.value || 0;
    target.textContent = `/ ${exercise.target}`;
    if (saved.completed) status.textContent = "Missione completata.";

    minus.addEventListener("click", () => updateRep(index, -1));
    plus.addEventListener("click", () => updateRep(index, 1));
    done.addEventListener("click", () => completeExercise(index));
    voice.addEventListener("click", () => startVoice(index, status));
    container.appendChild(fragment);
  }

  function renderTimerControls(container, exercise, index, saved) {
    const fragment = el("timerTemplate").content.cloneNode(true);
    const start = fragment.querySelector(".timer-start-button");
    const display = fragment.querySelector(".timer-display");
    const reset = fragment.querySelector(".timer-reset-button");
    const done = fragment.querySelector(".done-button");
    const status = fragment.querySelector(".control-status");
    const id = exerciseId(activeDay, index);

    const currentTimer = timers[id];
    display.textContent = formatTime(currentTimer?.remaining ?? exercise.target);
    if (saved.completed) status.textContent = "Missione completata.";

    start.addEventListener("click", () => toggleTimer(index, start, display, status));
    reset.addEventListener("click", () => resetTimer(index, display, start, status));
    done.addEventListener("click", () => completeExercise(index));
    container.appendChild(fragment);
  }

  function renderCheckControls(container, exercise, index, saved) {
    const fragment = el("checkTemplate").content.cloneNode(true);
    const button = fragment.querySelector(".done-button");
    const status = fragment.querySelector(".control-status");
    if (saved.completed) {
      button.textContent = "✓ Completato";
      status.textContent = "Missione registrata.";
    }
    button.addEventListener("click", () => completeExercise(index));
    container.appendChild(fragment);
  }

  function updateRep(index, change) {
    const exercise = PROGRAM[activeDay].exercises[index];
    const id = exerciseId(activeDay, index);
    const saved = getExerciseState(activeDay, index);
    if (saved.completed) return toast("Questo esercizio è già completato.");

    const nextValue = Math.max(0, Math.min(exercise.target, (saved.value || 0) + change));
    state.exercises[id] = { value: nextValue, completed: false };
    saveState();

    if (nextValue >= exercise.target) {
      completeExercise(index);
    } else {
      renderExercises();
    }
  }

  function setRepValue(index, value) {
    const exercise = PROGRAM[activeDay].exercises[index];
    const id = exerciseId(activeDay, index);
    const saved = getExerciseState(activeDay, index);
    if (saved.completed) return;

    state.exercises[id] = { value: Math.max(0, Math.min(exercise.target, value)), completed: false };
    saveState();
    if (value >= exercise.target) completeExercise(index);
    else renderExercises();
  }

  function toggleTimer(index, button, display, status) {
    const exercise = PROGRAM[activeDay].exercises[index];
    const id = exerciseId(activeDay, index);
    const saved = getExerciseState(activeDay, index);
    if (saved.completed) return toast("Questo esercizio è già completato.");

    if (!timers[id]) timers[id] = { remaining: exercise.target, interval: null };
    const timer = timers[id];

    if (timer.interval) {
      clearInterval(timer.interval);
      timer.interval = null;
      button.textContent = "▶ Riprendi";
      status.textContent = "Timer in pausa.";
      return;
    }

    button.textContent = "⏸ Pausa";
    status.textContent = "Timer attivo. Respira e mantieni la forma.";
    timer.interval = setInterval(() => {
      timer.remaining -= 1;
      display.textContent = formatTime(timer.remaining);
      if (timer.remaining <= 0) {
        clearInterval(timer.interval);
        timer.interval = null;
        completeExercise(index);
      }
    }, 1000);
  }

  function resetTimer(index, display, button, status) {
    const exercise = PROGRAM[activeDay].exercises[index];
    const id = exerciseId(activeDay, index);
    if (timers[id]?.interval) clearInterval(timers[id].interval);
    timers[id] = { remaining: exercise.target, interval: null };
    display.textContent = formatTime(exercise.target);
    button.textContent = "▶ Via";
    status.textContent = "Timer reimpostato.";
  }

  function completeExercise(index) {
    const exercise = PROGRAM[activeDay].exercises[index];
    const id = exerciseId(activeDay, index);
    const saved = getExerciseState(activeDay, index);
    if (saved.completed) return toast("Missione già completata.");

    const beforeLevel = getLevelInfo().level;
    state.exercises[id] = { value: exercise.target, completed: true };
    state.xp += exercise.xp;
    state.coins += 1;
    saveState();

    const afterLevel = getLevelInfo().level;
    animateProgress();
    renderAll();

    showModal("✅", "Missione completata", `Hai ricevuto +${exercise.xp} XP e +1 moneta. Il tuo avatar diventa un po’ più forte.`, `+${exercise.xp} XP · +1 🪙`);
    if (afterLevel > beforeLevel) {
      setTimeout(() => showLevelModal(afterLevel), 350);
    }
  }

  function finishActiveSession() {
    if (!isDayComplete(activeDay)) {
      showModal("🧩", "Mancano missioni", "Completa tutti gli esercizi della scheda prima di ricevere il bonus seduta. Se sei molto stanco, usa la modalità seduta leggera.");
      return;
    }

    const id = sessionId(activeDay);
    if (state.sessionBonus[id]) {
      showModal("⭐", "Bonus già ricevuto", "Questa seduta è già stata registrata. Ottimo lavoro: il recupero ora conta quanto l’allenamento.");
      return;
    }

    const beforeLevel = getLevelInfo().level;
    state.sessionBonus[id] = true;
    state.xp += 30;
    state.coins += 5;
    state.completedSessions += 1;
    updateStreak();
    saveState();

    const afterLevel = getLevelInfo().level;
    animateProgress();
    renderAll();
    showModal("🏆", "Seduta completata!", "Bonus ottenuto: +30 XP e +5 monete. Hai completato tutta la missione del giorno.", "+30 XP · +5 🪙");
    if (afterLevel > beforeLevel) setTimeout(() => showLevelModal(afterLevel), 350);
  }

  function updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (state.lastSessionDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    state.streak = state.lastSessionDate === yesterdayKey ? state.streak + 1 : 1;
    state.lastSessionDate = today;
  }

  function showLevelModal(level) {
    const reward = getReward(level);
    const cosmetic = COSMETIC_BY_LEVEL[level];
    if (cosmetic) state.equipped[cosmetic] = true;
    saveState();
    renderAll();
    showModal(reward[1], `Livello ${level} sbloccato!`, reward[3], `Premio: ${reward[2]}`);
  }

  function renderWeeklyGrid() {
    const grid = el("weeklyGrid");
    grid.innerHTML = "";
    DAYS.forEach((day) => {
      const item = document.createElement("div");
      const done = isDayComplete(day);
      item.className = `weekly-day ${done ? "done" : ""}`;
      item.innerHTML = `<strong>${DAY_NAMES[day]}</strong><small>${done ? "Missione completata" : PROGRAM[day].kind === "home" ? "Calisthenics" : PROGRAM[day].kind === "football" ? "Allenamento calcio" : "Partita o recupero"}</small>`;
      grid.appendChild(item);
    });
  }

  function parseItalianNumber(text) {
    const numeric = text.match(/\d+/);
    if (numeric) return Number(numeric[0]);

    const dictionary = {
      zero: 0, uno: 1, due: 2, tre: 3, quattro: 4, cinque: 5,
      sei: 6, sette: 7, otto: 8, nove: 9, dieci: 10, undici: 11,
      dodici: 12, tredici: 13, quattordici: 14, quindici: 15,
      sedici: 16, diciassette: 17, diciotto: 18, diciannove: 19,
      venti: 20, ventuno: 21, ventidue: 22, ventitre: 23,
      ventiquattro: 24, venticinque: 25, ventisei: 26, ventisette: 27,
      ventotto: 28, ventinove: 29, trenta: 30, quaranta: 40, cinquanta: 50
    };

    const normalized = text.toLowerCase().replace(/[’']/g, "").trim();
    for (const [word, number] of Object.entries(dictionary)) {
      if (normalized.includes(word)) return number;
    }
    return null;
  }

  function startVoice(index, statusElement) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      statusElement.textContent = "Voce non supportata qui: usa +1, funziona sempre.";
      toast("Il browser non supporta la voce. Usa i pulsanti +1.");
      return;
    }

    if (speechRecognition) {
      try { speechRecognition.stop(); } catch (_) {}
    }

    speechRecognition = new Recognition();
    speechRecognition.lang = "it-IT";
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false;
    speechRecognition.maxAlternatives = 1;
    statusElement.textContent = "🎙️ Ti ascolto: dì il numero totale, es. dieci.";

    speechRecognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      const number = parseItalianNumber(transcript);
      if (number === null) {
        statusElement.textContent = `Non ho capito “${transcript}”. Prova a dire un numero.`;
        return;
      }
      statusElement.textContent = `Riconosciuto: ${number}`;
      setRepValue(index, number);
      if (number >= PROGRAM[activeDay].exercises[index].target) {
        try { speechRecognition.stop(); } catch (_) {}
      }
    };

    speechRecognition.onerror = (event) => {
      const message = event.error === "not-allowed" ? "Permesso microfono negato: usa +1." : "Voce momentaneamente non disponibile: usa +1.";
      statusElement.textContent = message;
      toast(message);
    };

    speechRecognition.onend = () => {
      if (statusElement.textContent.includes("Ti ascolto")) statusElement.textContent = "Voce terminata. Puoi riavviarla o usare +1.";
      speechRecognition = null;
    };

    try {
      speechRecognition.start();
    } catch (_) {
      statusElement.textContent = "Impossibile avviare la voce: usa +1.";
    }
  }

  function animateProgress() {
    const avatar = el("fighterAvatar");
    avatar.classList.remove("pulse");
    void avatar.offsetWidth;
    avatar.classList.add("pulse");
  }

  function showLightSession() {
    const current = PROGRAM[activeDay];
    if (current.kind !== "home") {
      showModal("⚽", "Oggi c’è calcio", "Nei giorni calcio fai soltanto la seduta con la squadra. Non aggiungere calisthenics extra: serve recupero per correre e giocare forte.");
      return;
    }
    showModal("⚡", "Seduta leggera", "Se sei stanco fai: 2×8 push-up, 2×6 Australian pull-up e 2×20 secondi di hollow hold o side plank. Dura 10–12 minuti. Non è un fallimento: è gestione intelligente della fatica.");
  }

  function openWardrobe() {
    const level = getLevelInfo().level;
    const unlocked = Object.keys(COSMETIC_BY_LEVEL).map(Number).filter((needed) => level >= needed);
    if (!unlocked.length) {
      showModal("🎁", "Guardaroba bloccato", "Raggiungi il livello 2 per sbloccare la prima Maglia da campione.");
      return;
    }

    const list = unlocked.map((needed) => {
      const id = COSMETIC_BY_LEVEL[needed];
      const reward = getReward(needed);
      const active = state.equipped[id];
      return `${reward[1]} ${reward[2]}${active ? " · indossato" : " · sbloccato"}`;
    }).join("<br>");

    showModal("👔", "Guardaroba", "I cosmetici principali si equipaggiano automaticamente quando li sblocchi.<br><br>" + list);
  }

  function resetWeek() {
    const accepted = window.confirm("Vuoi reimpostare solo le missioni di questa settimana? XP, livelli, monete, avatar e premi non verranno cancellati.");
    if (!accepted) return;

    Object.values(timers).forEach((timer) => timer.interval && clearInterval(timer.interval));
    timers = {};
    state.exercises = {};
    state.sessionBonus = {};
    state.weekKey = getWeekKey();
    saveState();
    renderAll();
    toast("Missioni della settimana reimpostate.");
  }

  function showModal(icon, title, text, reward = "") {
    el("modalIcon").textContent = icon;
    el("modalTitle").textContent = title;
    el("modalText").innerHTML = text;
    el("modalEyebrow").textContent = title.includes("Livello") ? "NUOVO LIVELLO" : "CALISTHENICS QUEST";
    const rewardBox = el("modalReward");
    rewardBox.innerHTML = reward;
    rewardBox.hidden = !reward;
    el("modalBackdrop").hidden = false;
    requestAnimationFrame(() => el("modalIcon").classList.add("reward-pop"));
  }

  function closeModal() {
    el("modalBackdrop").hidden = true;
    el("modalIcon").classList.remove("reward-pop");
  }

  function toast(message) {
    const node = el("toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => node.classList.remove("show"), 2800);
  }

  function bindEvents() {
    el("themeButton").addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      saveState();
      renderTheme();
    });

    el("finishSessionButton").addEventListener("click", finishActiveSession);
    el("lightSessionButton").addEventListener("click", showLightSession);
    el("resetWeekButton").addEventListener("click", resetWeek);
    el("wardrobeButton").addEventListener("click", openWardrobe);
    el("profileButton").addEventListener("click", () => {
      const info = getLevelInfo();
      showModal("📊", "Profilo atleta", `Livello ${info.level} · ${state.xp} XP totali · ${state.coins} monete · ${state.completedSessions} sedute completate.`);
    });

    el("modalCloseButton").addEventListener("click", closeModal);
    el("modalConfirmButton").addEventListener("click", closeModal);
    el("modalBackdrop").addEventListener("click", (event) => {
      if (event.target === el("modalBackdrop")) closeModal();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
  }

  function init() {
    state = loadState();
    checkNewWeek();
    bindEvents();
    renderAll();
  }

  init();
})();

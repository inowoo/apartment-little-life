const APP_VERSION = 'v0.2.0';

const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const ui = {
  titleScreen: document.querySelector('#title-screen'),
  start: document.querySelector('#start-button'),
  titleVersion: document.querySelector('#title-version'),
  gameVersion: document.querySelector('#game-version'),
  day: document.querySelector('#day-label'),
  time: document.querySelector('#time-label'),
  period: document.querySelector('#period-label'),
  pause: document.querySelector('#pause-button'),
  speed: document.querySelector('#speed-button'),
  resetCamera: document.querySelector('#reset-camera-button'),
  panel: document.querySelector('#resident-panel'),
  panelClose: document.querySelector('#panel-close-button'),
  avatar: document.querySelector('#resident-avatar'),
  name: document.querySelector('#resident-name'),
  subtitle: document.querySelector('#resident-subtitle'),
  location: document.querySelector('#resident-location'),
  action: document.querySelector('#resident-action'),
  thought: document.querySelector('#resident-thought'),
  profile: document.querySelector('#resident-profile'),
  log: document.querySelector('#resident-log'),
  logCount: document.querySelector('#resident-log-count'),
};

ui.titleVersion.textContent = APP_VERSION;
ui.gameVersion.textContent = APP_VERSION;

const WORLD = {
  buildingX: 140,
  buildingY: 120,
  roomWidth: 280,
  roomHeight: 205,
  floors: 5,
  roomsPerFloor: 5,
};
WORLD.width = WORLD.roomWidth * WORLD.roomsPerFloor;
WORLD.height = WORLD.roomHeight * WORLD.floors;

const residents = [
  {
    id: 'misaki', name: '田中 美咲', initials: '美', room: 302, role: '出版社勤務', schedule: 'office',
    profile: '34歳。真面目で少し心配性。最近、仕事をこのまま続けるか迷っている。',
    appearance: { skin: '#e7b98f', hair: '#332722', shirt: '#b54a5a', pants: '#39435b', accent: '#f0cf77', hairStyle: 1, build: 0 },
    thoughts: {
      morning: '今日もちゃんと間に合うかな。', day: '午後の打ち合わせ、早く終わらないかな。', evening: '帰ったら何もしたくない。', night: '転職サイトだけ、少し見てみようかな。', late: '明日のことは明日考えよう。'
    }
  },
  {
    id: 'sota', name: '佐藤 蒼太', initials: '蒼', room: 404, role: '大学生', schedule: 'university',
    profile: '20歳。大学2年生。人当たりは良いが、予定はだいたい行き当たりばったり。',
    appearance: { skin: '#e8bd95', hair: '#1c2029', shirt: '#3979a8', pants: '#28333f', accent: '#d56b35', hairStyle: 2, build: 0 },
    thoughts: {
      morning: '一限、間に合うかな。', day: '帰りに本屋へ寄ろう。', evening: '晩飯どうしよう。', night: 'もうちょっとだけゲームしよう。', late: 'さすがに寝た方がいいな。'
    }
  },
  {
    id: 'haru', name: '山本 はる', initials: 'は', room: 203, role: '小学生', schedule: 'child',
    profile: '10歳。よく喋り、マンションの大人にもすぐ挨拶する。算数の宿題は少し苦手。',
    appearance: { skin: '#efc9a1', hair: '#3b2d25', shirt: '#e2b436', pants: '#446b7c', accent: '#dc564a', hairStyle: 3, build: -1 },
    thoughts: {
      morning: '今日の給食なんだっけ。', day: '早く帰って遊びたい。', evening: '宿題、あとでやればいいかな。', night: '明日の時間割、見たっけ？', late: 'もう眠い。'
    }
  },
  {
    id: 'naoko', name: '山本 直子', initials: '直', room: 203, role: '在宅勤務', schedule: 'remote',
    profile: '41歳。はるの母。自宅でデザイン関係の仕事をしている。仕事中でも家のことが気になる。',
    appearance: { skin: '#e4b58d', hair: '#4a3024', shirt: '#6d8f68', pants: '#4b4b53', accent: '#d6c7a2', hairStyle: 4, build: 0 },
    thoughts: {
      morning: '洗濯を回してから仕事を始めよう。', day: '集中できるうちにここまで終わらせたい。', evening: '夕飯、簡単なものでいいかな。', night: '明日の分だけ片付けておこう。', late: '今日はもう終わり。'
    }
  },
  {
    id: 'genzo', name: '高橋 源三', initials: '源', room: 101, role: '退職後', schedule: 'retired',
    profile: '72歳。口数は少ないが、毎朝ベランダから空を見るのが習慣。',
    appearance: { skin: '#d9aa82', hair: '#b7b6ad', shirt: '#766d59', pants: '#3d4550', accent: '#9e8d67', hairStyle: 5, build: 1 },
    thoughts: {
      morning: '今日は少し暖かそうだ。', day: '買い物は昼前に済ませるか。', evening: 'ニュースでも見るかな。', night: '明日はどこまで歩こう。', late: '夜更かしはよくないな。'
    }
  },
  {
    id: 'fumi', name: '高橋 文江', initials: '文', room: 101, role: '退職後', schedule: 'retired',
    profile: '69歳。源三の妻。近所の店の特売日をよく覚えている。',
    appearance: { skin: '#dfb18c', hair: '#a9a79e', shirt: '#a45e74', pants: '#59566a', accent: '#d9c36e', hairStyle: 6, build: 0 },
    thoughts: {
      morning: '今日はシーツも洗おう。', day: '卵を買い忘れないようにしないと。', evening: '明日の朝ごはん、何にしよう。', night: 'あの人、またテレビをつけたまま寝そう。', late: '戸締まりだけ確認しよう。'
    }
  },
  {
    id: 'ren', name: '木村 蓮', initials: '蓮', room: 201, role: '無職', schedule: 'hikikomori',
    profile: '27歳。ほとんど外へ出ない。夜になると活動的になり、オンライン上ではよく喋る。',
    appearance: { skin: '#d6a982', hair: '#202126', shirt: '#46414e', pants: '#252a31', accent: '#7d79a9', hairStyle: 7, build: 0 },
    thoughts: {
      morning: '外が明るい。そろそろ寝ようかな。', day: '宅配、置き配にしておけばよかった。', evening: 'やっと静かになってきた。', night: '今日は調子がいい。', late: 'この時間が一番落ち着く。'
    }
  },
  {
    id: 'riko', name: '森田 莉子', initials: '莉', room: 204, role: '看護師（夜勤あり）', schedule: 'night',
    profile: '29歳。夜勤が多く、他の住人と生活時間がずれている。帰宅後に甘い物を食べるのが小さな楽しみ。',
    appearance: { skin: '#e8bd95', hair: '#30272b', shirt: '#d8e4e6', pants: '#5d7890', accent: '#75a6a8', hairStyle: 8, build: 0 },
    thoughts: {
      morning: '帰ったらシャワーだけ浴びて寝よう。', day: 'もう少し寝ていたい。', evening: 'そろそろ支度しないと。', night: '今夜は落ち着いてるといいな。', late: 'あと何時間だろう。'
    }
  },
  {
    id: 'akira', name: '小林 晶', initials: '晶', room: 305, role: '漫画家', schedule: 'manga',
    profile: '38歳。締切前になると昼夜が逆転する漫画家。独り言が多い。',
    appearance: { skin: '#ddb18d', hair: '#242126', shirt: '#8d5f44', pants: '#4a423f', accent: '#d8d3c7', hairStyle: 9, build: 0 },
    thoughts: {
      morning: '寝る前にあと一コマだけ。', day: '起きた。たぶん朝じゃない。', evening: 'ここからが本番。', night: '線が決まらない……。', late: '今なら描ける気がする。'
    }
  },
  {
    id: 'kenji', name: '伊藤 健司', initials: '健', room: 501, role: '会社員', schedule: 'officeLate',
    profile: '46歳。帰宅が遅い会社員。家では静かに過ごすが、最近よくため息をつく。',
    appearance: { skin: '#d8a57d', hair: '#2a2825', shirt: '#5f6a78', pants: '#30343a', accent: '#9f4a45', hairStyle: 10, build: 1 },
    thoughts: {
      morning: '今日こそ早く帰りたい。', day: 'メールがまた増えてる。', evening: 'まだ終わらないか。', night: 'コンビニで何か買って帰ろう。', late: 'もう寝るだけだな。'
    }
  },
  {
    id: 'mei', name: 'リン・メイ', initials: 'M', room: 502, role: '留学生', schedule: 'university',
    profile: '22歳。日本語を勉強中の留学生。料理が好きで、週末はよく友人を呼ぶ。',
    appearance: { skin: '#e9bb91', hair: '#242027', shirt: '#a54c48', pants: '#31465a', accent: '#e4b458', hairStyle: 11, build: 0 },
    thoughts: {
      morning: '今日は日本語で質問してみよう。', day: '帰りにスーパーへ行こう。', evening: '新しいレシピを試したい。', night: '今日の言い方、自然だったかな。', late: '家族にメッセージして寝よう。'
    }
  },
  {
    id: 'yui', name: '松本 結衣', initials: '結', room: 402, role: 'フリーランス', schedule: 'remote',
    profile: '31歳。自宅で映像編集をしている。締切が近いと部屋からほとんど出ない。',
    appearance: { skin: '#e2b48b', hair: '#392a31', shirt: '#76528e', pants: '#3b4154', accent: '#6ea7a5', hairStyle: 12, build: 0 },
    thoughts: {
      morning: '先にコーヒーを淹れよう。', day: 'レンダー待ちの間に洗濯しよう。', evening: '今日はここで区切りたい。', night: 'もう一回だけ確認しよう。', late: '書き出しが終わるまで寝られない。'
    }
  }
];

for (const resident of residents) {
  resident.logs = [];
  resident.lastStateKey = null;
}

const state = {
  gameMinutes: 6 * 60 + 30,
  day: 1,
  started: false,
  paused: true,
  speedIndex: 1,
  speeds: [0.5, 1, 4, 12],
  selectedResidentId: null,
  lastFrameTime: performance.now(),
  hitResidents: [],
};

const camera = {
  x: 0,
  y: 0,
  scale: 1,
  minScale: 0.42,
  maxScale: 2.5,
};

const pointerState = {
  pointers: new Map(),
  primaryDown: null,
  dragging: false,
  pinch: null,
};

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function resetCamera() {
  const rect = canvas.getBoundingClientRect();
  const contentWidth = WORLD.width + 280;
  const contentHeight = WORLD.height + 260;
  const fit = Math.min(rect.width / contentWidth, rect.height / contentHeight);
  camera.scale = clamp(fit, camera.minScale, 1.1);
  camera.x = (rect.width - WORLD.width * camera.scale) * 0.5 - WORLD.buildingX * camera.scale;
  camera.y = (rect.height - WORLD.height * camera.scale) * 0.5 - WORLD.buildingY * camera.scale + 28;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getHour() {
  return (state.gameMinutes / 60) % 24;
}

function formatTime() {
  const total = Math.floor(state.gameMinutes) % (24 * 60);
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function getPeriod(hour) {
  if (hour >= 5 && hour < 10) return '朝';
  if (hour >= 10 && hour < 16) return '昼';
  if (hour >= 16 && hour < 19) return '夕方';
  if (hour >= 19 && hour < 24) return '夜';
  return '深夜';
}

function getThoughtKey(hour) {
  if (hour >= 5 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'evening';
  if (hour >= 20 && hour < 24) return 'night';
  return 'late';
}

function getResidentState(resident, hour) {
  const thought = resident.thoughts[getThoughtKey(hour)];

  switch (resident.schedule) {
    case 'office':
      if (hour < 6.5) return home('睡眠中', '自室', thought);
      if (hour < 8.1) return home('出勤の支度', '自室', thought);
      if (hour < 18.7) return away('勤務中', '会社', thought);
      if (hour < 20) return away('帰宅途中', '外出中', thought);
      if (hour < 23.5) return home('自由時間', '自室', thought);
      return home('就寝の支度', '自室', thought);
    case 'officeLate':
      if (hour < 6.7) return home('睡眠中', '自室', thought);
      if (hour < 8.2) return home('出勤の支度', '自室', thought);
      if (hour < 21.2) return away('勤務中', '会社', thought);
      if (hour < 22.2) return away('帰宅途中', '外出中', thought);
      if (hour < 24) return home('遅い夕食', '自室', thought);
      return home('睡眠中', '自室', thought);
    case 'child':
      if (hour < 6.5) return home('睡眠中', '自室', thought);
      if (hour < 8) return home('登校の支度', '自室', thought);
      if (hour < 15.3) return away('授業中', '学校', thought);
      if (hour < 17.5) return home('遊んでいる', '自室', thought);
      if (hour < 20) return home('宿題と夕食', '自室', thought);
      if (hour < 21.5) return home('自由時間', '自室', thought);
      return home('睡眠中', '自室', thought);
    case 'remote':
      if (hour < 6.8) return home('睡眠中', '自室', thought);
      if (hour < 9) return home('朝の支度', '自室', thought);
      if (hour < 12) return home('在宅で仕事中', '自室', thought);
      if (hour < 13) return home('昼休み', '自室', thought);
      if (hour < 18.2) return home('在宅で仕事中', '自室', thought);
      if (hour < 23.5) return home('家で過ごしている', '自室', thought);
      return home('睡眠中', '自室', thought);
    case 'retired':
      if (hour < 6) return home('睡眠中', '自室', thought);
      if (hour < 9.5) return home('朝の時間', '自室', thought);
      if (hour < 11) return away('買い物・散歩', '近所', thought);
      if (hour < 14) return home('昼食・休憩', '自室', thought);
      if (hour < 18) return home('家事や趣味', '自室', thought);
      if (hour < 22.5) return home('テレビを見ている', '自室', thought);
      return home('睡眠中', '自室', thought);
    case 'university':
      if (hour < 7.5) return home('睡眠中', '自室', thought);
      if (hour < 9.2) return home('出かける支度', '自室', thought);
      if (hour < 16.5) return away('大学にいる', '大学', thought);
      if (hour < 18) return away('寄り道', '外出中', thought);
      if (hour < 24) return home('自由時間', '自室', thought);
      return home('睡眠中', '自室', thought);
    case 'night':
      if (hour < 7.3) return away('夜勤中', '勤務先', thought);
      if (hour < 8.2) return away('帰宅途中', '外出中', thought);
      if (hour < 14.5) return home('睡眠中', '自室', thought);
      if (hour < 18.8) return home('家で過ごしている', '自室', thought);
      if (hour < 19.7) return home('夜勤の支度', '自室', thought);
      return away('夜勤中', '勤務先', thought);
    case 'hikikomori':
      if (hour >= 6 && hour < 14) return home('睡眠中', '自室', thought);
      if (hour < 19) return home('PCを見ている', '自室', thought);
      return home('オンラインで活動中', '自室', thought);
    case 'manga':
      if (hour >= 7 && hour < 13.5) return home('睡眠中', '自室', thought);
      if (hour >= 13.5 && hour < 15) return home('起床・食事', '自室', thought);
      if (hour >= 15 && hour < 18.5) return home('作画中', '自室', thought);
      if (hour >= 18.5 && hour < 19.2) return away('コンビニへ外出', '近所', thought);
      return home('作画中', '自室', thought);
    default:
      return home('家で過ごしている', '自室', thought);
  }
}

function home(action, location, thought) {
  return { isHome: true, action, location, thought };
}

function away(action, location, thought) {
  return { isHome: false, action, location, thought };
}

function roomToCell(room) {
  const floor = Math.floor(room / 100);
  const column = (room % 100) - 1;
  const row = WORLD.floors - floor;
  return { floor, column, row };
}

function getRoomRect(room) {
  const { column, row } = roomToCell(room);
  return {
    x: WORLD.buildingX + column * WORLD.roomWidth,
    y: WORLD.buildingY + row * WORLD.roomHeight,
    width: WORLD.roomWidth,
    height: WORLD.roomHeight,
  };
}

function getResidentsInRoom(room) {
  return residents.filter((resident) => resident.room === room);
}

function recordResidentActivity(force = false) {
  const hour = getHour();
  for (const resident of residents) {
    const status = getResidentState(resident, hour);
    const stateKey = `${status.location}|${status.action}`;
    if (!force && resident.lastStateKey === stateKey) continue;

    resident.lastStateKey = stateKey;
    resident.logs.unshift({
      day: state.day,
      time: formatTime(),
      location: status.location,
      action: status.action,
      thought: status.thought,
    });
    resident.logs = resident.logs.slice(0, 80);
  }
}

function updateGame(deltaSeconds) {
  if (!state.started || state.paused) return;
  const speed = state.speeds[state.speedIndex];
  state.gameMinutes += deltaSeconds * 5 * speed;

  while (state.gameMinutes >= 24 * 60) {
    state.gameMinutes -= 24 * 60;
    state.day += 1;
  }

  recordResidentActivity(false);
}

function updateHud() {
  const hour = getHour();
  ui.day.textContent = `${state.day}日目`;
  ui.time.textContent = formatTime();
  ui.period.textContent = getPeriod(hour);
  ui.pause.textContent = state.paused ? '再開' : '一時停止';
  ui.speed.textContent = `速度 x${state.speeds[state.speedIndex]}`;

  if (state.selectedResidentId) {
    updateResidentPanel(residents.find((r) => r.id === state.selectedResidentId));
  }
}

function getSkyColors(hour) {
  if (hour >= 5 && hour < 8) return ['#6f819b', '#c49579'];
  if (hour >= 8 && hour < 16) return ['#6c9dc2', '#c5d5d8'];
  if (hour >= 16 && hour < 19) return ['#875f73', '#cf8457'];
  if (hour >= 19 && hour < 22) return ['#2b3452', '#171c2d'];
  return ['#12182a', '#090d18'];
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  const hour = getHour();
  const [topColor, bottomColor] = getSkyColors(hour);
  const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);

  drawPixelSky(rect, hour);

  ctx.save();
  ctx.translate(Math.round(camera.x), Math.round(camera.y));
  ctx.scale(camera.scale, camera.scale);
  ctx.imageSmoothingEnabled = false;

  drawGround();
  drawBuilding(hour);

  ctx.restore();
}

function drawPixelSky(rect, hour) {
  ctx.save();
  ctx.globalAlpha = hour >= 19 || hour < 5 ? 0.8 : 0.35;
  ctx.fillStyle = '#f2e6be';
  const count = hour >= 19 || hour < 5 ? 28 : 7;
  for (let i = 0; i < count; i += 1) {
    const x = (i * 137 + 53) % Math.max(1, rect.width);
    const y = (i * 71 + 41) % Math.max(1, rect.height * 0.65);
    const size = i % 3 === 0 ? 3 : 2;
    ctx.fillRect(Math.round(x), Math.round(y), size, size);
  }
  ctx.restore();
}

function drawGround() {
  const y = WORLD.buildingY + WORLD.height;
  ctx.fillStyle = '#31383b';
  ctx.fillRect(-500, y, WORLD.width + 1200, 170);
  ctx.fillStyle = '#596166';
  ctx.fillRect(-500, y + 12, WORLD.width + 1200, 4);
  ctx.fillStyle = '#242a2d';
  for (let x = -500; x < WORLD.width + 700; x += 36) ctx.fillRect(x, y + 48, 22, 4);
}

function drawBuilding(hour) {
  ctx.fillStyle = '#24262a';
  ctx.fillRect(WORLD.buildingX - 18, WORLD.buildingY - 32, WORLD.width + 36, WORLD.height + 50);

  state.hitResidents = [];

  for (let floor = 1; floor <= WORLD.floors; floor += 1) {
    for (let column = 0; column < WORLD.roomsPerFloor; column += 1) {
      const room = floor * 100 + column + 1;
      drawRoom(room, hour);
    }
  }

  ctx.fillStyle = '#15171a';
  ctx.fillRect(WORLD.buildingX - 35, WORLD.buildingY - 48, WORLD.width + 70, 20);
  ctx.fillStyle = '#d1cbbd';
  ctx.font = 'bold 26px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('APARTMENT LITTLE LIFE', WORLD.buildingX, WORLD.buildingY - 62);
}

function drawRoom(room, hour) {
  const r = getRoomRect(room);
  const occupants = getResidentsInRoom(room);
  const states = occupants.map((resident) => ({ resident, status: getResidentState(resident, hour) }));
  const anyoneHome = states.some((item) => item.status.isHome);
  const night = hour < 6 || hour >= 19;

  ctx.fillStyle = night && anyoneHome ? '#5b5037' : '#cfc5b2';
  ctx.fillRect(r.x + 2, r.y + 2, r.width - 4, r.height - 4);
  drawFurniture(r, room);

  ctx.strokeStyle = '#615c55';
  ctx.lineWidth = 4;
  ctx.strokeRect(r.x, r.y, r.width, r.height);

  ctx.fillStyle = '#25272a';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(String(room), r.x + 12, r.y + 24);

  const awayCount = states.filter((item) => !item.status.isHome).length;
  if (awayCount > 0) {
    ctx.fillStyle = '#323439';
    ctx.fillRect(r.x + r.width - 72, r.y + 9, 60, 23);
    ctx.fillStyle = '#ededed';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`外出 ${awayCount}`, r.x + r.width - 42, r.y + 25);
  }

  const homeResidents = states.filter((item) => item.status.isHome);
  homeResidents.forEach((item, index) => drawResident(item.resident, item.status, r, index, homeResidents.length));
}

function drawFurniture(r, room) {
  const variant = room % 4;
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(r.x + 12, r.y + 38, r.width - 24, r.height - 50);

  const floorY = r.y + r.height - 24;
  ctx.fillStyle = '#8a7864';
  ctx.fillRect(r.x + 22, floorY - 30, 86, 28);
  ctx.fillStyle = '#5a5047';
  ctx.fillRect(r.x + 28, floorY - 2, 8, 16);
  ctx.fillRect(r.x + 94, floorY - 2, 8, 16);

  ctx.fillStyle = '#746657';
  ctx.fillRect(r.x + r.width - 78, floorY - 68, 54, 66);
  ctx.fillStyle = '#a8b5b8';
  ctx.fillRect(r.x + r.width - 70, floorY - 60, 38, 24);
  ctx.fillStyle = '#35414b';
  ctx.fillRect(r.x + r.width - 66, floorY - 56, 30, 16);

  if (variant === 0 || variant === 2) {
    ctx.fillStyle = '#6d5f50';
    ctx.fillRect(r.x + 122, floorY - 20, 80, 10);
    ctx.fillRect(r.x + 130, floorY - 10, 6, 12);
    ctx.fillRect(r.x + 188, floorY - 10, 6, 12);
  } else {
    ctx.fillStyle = '#7a6d5d';
    ctx.fillRect(r.x + 128, floorY - 43, 62, 41);
  }

  ctx.fillStyle = '#a99e82';
  ctx.fillRect(r.x + 42, r.y + 48, 54, 34);
  ctx.fillStyle = '#5f6f68';
  ctx.fillRect(r.x + 48, r.y + 54, 42, 22);
}

function getPose(action) {
  if (action.includes('睡眠')) return 'sleep';
  if (action.includes('PC') || action.includes('作画') || action.includes('仕事') || action.includes('宿題')) return 'sit';
  if (action.includes('テレビ') || action.includes('自由時間') || action.includes('家で過ご')) return 'idle';
  if (action.includes('支度') || action.includes('朝の時間') || action.includes('家事') || action.includes('食事')) return 'busy';
  return 'idle';
}

function drawResident(resident, status, roomRect, index, count) {
  const baseX = roomRect.x + roomRect.width * (count === 1 ? 0.5 : (index + 1) / (count + 1));
  const baseY = roomRect.y + roomRect.height - 48;
  const selected = state.selectedResidentId === resident.id;
  const pose = getPose(status.action);
  const frame = Math.floor(performance.now() / 360) % 2;

  if (selected) {
    ctx.strokeStyle = '#fff5d8';
    ctx.lineWidth = 3;
    ctx.strokeRect(Math.round(baseX - 32), Math.round(baseY - 82), 64, 88);
  }

  drawPixelPerson(resident, Math.round(baseX), Math.round(baseY), pose, frame);

  ctx.fillStyle = '#17191d';
  ctx.fillRect(Math.round(baseX - 52), Math.round(baseY + 11), 104, 20);
  ctx.fillStyle = '#f5f5f5';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(resident.name.split(' ')[1] || resident.name, Math.round(baseX), Math.round(baseY + 26));

  state.hitResidents.push({ resident, x: baseX, y: baseY - 35 });

  if (selected) drawThoughtBubble(baseX, baseY - 112, status.action);
}

function drawPixelPerson(resident, x, y, pose, frame) {
  const a = resident.appearance;
  const p = resident.role === '小学生' ? 3 : 4;
  const bodyWide = a.build > 0 ? 4 : 3;
  const bodyNarrow = a.build < 0 ? 2 : bodyWide;
  const px = (gx, gy, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + gx * p, y + gy * p, w * p, h * p);
  };

  if (pose === 'sleep') {
    px(-7, -5, 14, 4, '#6f665d');
    px(-6, -9, 4, 4, a.skin);
    px(-6, -10, 4, 2, a.hair);
    px(-2, -8, 8, 3, a.shirt);
    px(4, -8, 2, 2, a.pants);
    px(-7, -4, 14, 1, '#c9bca6');
    return;
  }

  if (pose === 'sit') {
    px(-3, -14, 6, 5, a.skin);
    drawPixelHair(px, a.hairStyle, a.hair, -3, -15);
    px(-bodyNarrow, -9, bodyNarrow * 2, 6, a.shirt);
    px(-3, -3, 6, 3, a.pants);
    px(2, 0, 4, 2, a.pants);
    px(-5, -7, 2, 2, a.skin);
    px(3, -7, 2, 2, a.skin);
    px(5, -8, 2, 1, a.accent);
    return;
  }

  const bob = pose === 'busy' && frame === 1 ? -1 : 0;
  const ox = frame === 1 && pose === 'busy' ? 1 : 0;
  const py = (gx, gy, w, h, color) => px(gx + ox, gy + bob, w, h, color);

  py(-3, -16, 6, 5, a.skin);
  drawPixelHair(py, a.hairStyle, a.hair, -3, -17);
  py(-bodyWide, -11, bodyWide * 2, 7, a.shirt);
  py(-bodyWide - 1, -10, 1, 5, a.skin);
  py(bodyWide, -10, 1, 5, a.skin);
  py(-3, -4, 3, 5, a.pants);
  py(0, -4, 3, 5, a.pants);

  if (pose === 'busy') {
    py(frame === 0 ? -4 : 3, -7, 2, 2, a.accent);
  } else {
    py(-1, -9, 2, 1, a.accent);
  }
}

function drawPixelHair(px, style, color, x, y) {
  switch (style % 6) {
    case 0:
      px(x, y, 6, 2, color); px(x - 1, y + 1, 2, 4, color); break;
    case 1:
      px(x, y, 6, 2, color); px(x, y + 1, 1, 4, color); px(x + 5, y + 1, 1, 4, color); break;
    case 2:
      px(x, y, 6, 2, color); px(x + 1, y - 1, 4, 1, color); px(x - 1, y + 2, 2, 2, color); break;
    case 3:
      px(x, y, 6, 2, color); px(x - 1, y + 1, 1, 5, color); px(x + 6, y + 1, 1, 5, color); break;
    case 4:
      px(x + 1, y, 4, 2, color); px(x, y + 1, 6, 1, color); break;
    default:
      px(x, y, 6, 2, color); px(x - 1, y + 2, 1, 3, color); px(x + 6, y + 2, 1, 3, color); px(x + 5, y + 4, 2, 2, color); break;
  }
}

function drawThoughtBubble(x, y, text) {
  const width = Math.max(120, Math.min(220, text.length * 15 + 28));
  const height = 42;
  ctx.fillStyle = '#f4f1e8';
  roundedRect(ctx, x - width / 2, y - height / 2, width, height, 4);
  ctx.fill();
  ctx.fillStyle = '#202226';
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y + 5);
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function screenToWorld(screenX, screenY) {
  return {
    x: (screenX - camera.x) / camera.scale,
    y: (screenY - camera.y) / camera.scale,
  };
}

function hitTestResident(screenX, screenY) {
  const world = screenToWorld(screenX, screenY);
  let best = null;
  let bestDistance = Infinity;
  for (const hit of state.hitResidents) {
    const distanceToResident = Math.hypot(world.x - hit.x, world.y - hit.y);
    const radius = Math.max(34, 30 / camera.scale);
    if (distanceToResident <= radius && distanceToResident < bestDistance) {
      best = hit.resident;
      bestDistance = distanceToResident;
    }
  }
  return best;
}

function selectResident(resident) {
  state.selectedResidentId = resident.id;
  ui.panel.classList.remove('hidden');
  updateResidentPanel(resident);
}

function updateResidentPanel(resident) {
  if (!resident) return;
  const status = getResidentState(resident, getHour());
  ui.avatar.textContent = resident.initials;
  ui.avatar.style.background = resident.appearance.shirt;
  ui.name.textContent = resident.name;
  ui.subtitle.textContent = `${resident.room}号室 / ${resident.role}`;
  ui.location.textContent = status.location;
  ui.action.textContent = status.action;
  ui.thought.textContent = `「${status.thought}」`;
  ui.profile.textContent = resident.profile;
  ui.log.innerHTML = '';
  ui.logCount.textContent = `${resident.logs.length}件`;

  const logs = resident.logs.length ? resident.logs.slice(0, 30) : null;
  if (!logs) {
    const li = document.createElement('li');
    li.textContent = 'まだ生活ログはありません。';
    ui.log.appendChild(li);
    return;
  }

  for (const entry of logs) {
    const li = document.createElement('li');
    li.textContent = `${entry.day}日目 ${entry.time}　${entry.location}：${entry.action}`;
    li.title = entry.thought;
    ui.log.appendChild(li);
  }
}

function localPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

canvas.addEventListener('pointerdown', (event) => {
  if (!state.started) return;
  event.preventDefault();
  canvas.setPointerCapture?.(event.pointerId);
  const p = localPointerPosition(event);
  pointerState.pointers.set(event.pointerId, p);

  if (pointerState.pointers.size === 1) {
    pointerState.primaryDown = { pointerId: event.pointerId, x: p.x, y: p.y, lastX: p.x, lastY: p.y };
    pointerState.dragging = false;
    pointerState.pinch = null;
  } else if (pointerState.pointers.size === 2) {
    const points = [...pointerState.pointers.values()];
    const mid = midpoint(points[0], points[1]);
    pointerState.pinch = {
      startDistance: distance(points[0], points[1]),
      startScale: camera.scale,
      worldAtMid: screenToWorld(mid.x, mid.y),
    };
    pointerState.dragging = true;
    canvas.classList.add('dragging');
  }
});

canvas.addEventListener('pointermove', (event) => {
  if (!pointerState.pointers.has(event.pointerId)) return;
  event.preventDefault();
  const p = localPointerPosition(event);
  pointerState.pointers.set(event.pointerId, p);

  if (pointerState.pointers.size >= 2 && pointerState.pinch) {
    const points = [...pointerState.pointers.values()].slice(0, 2);
    const currentDistance = Math.max(1, distance(points[0], points[1]));
    const mid = midpoint(points[0], points[1]);
    camera.scale = clamp(
      pointerState.pinch.startScale * (currentDistance / pointerState.pinch.startDistance),
      camera.minScale,
      camera.maxScale
    );
    camera.x = mid.x - pointerState.pinch.worldAtMid.x * camera.scale;
    camera.y = mid.y - pointerState.pinch.worldAtMid.y * camera.scale;
    return;
  }

  if (pointerState.pointers.size === 1 && pointerState.primaryDown) {
    const down = pointerState.primaryDown;
    const moved = Math.hypot(p.x - down.x, p.y - down.y);
    if (moved > 6) {
      pointerState.dragging = true;
      canvas.classList.add('dragging');
    }
    if (pointerState.dragging) {
      camera.x += p.x - down.lastX;
      camera.y += p.y - down.lastY;
    }
    down.lastX = p.x;
    down.lastY = p.y;
  }
});

function endPointer(event) {
  if (!pointerState.pointers.has(event.pointerId)) return;
  const p = localPointerPosition(event);
  const wasSingleTap = pointerState.pointers.size === 1 && !pointerState.dragging && pointerState.primaryDown;

  if (wasSingleTap) {
    const resident = hitTestResident(p.x, p.y);
    if (resident) selectResident(resident);
  }

  pointerState.pointers.delete(event.pointerId);
  if (pointerState.pointers.size < 2) pointerState.pinch = null;
  if (pointerState.pointers.size === 0) {
    pointerState.primaryDown = null;
    pointerState.dragging = false;
    canvas.classList.remove('dragging');
  }
}

canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);

canvas.addEventListener('wheel', (event) => {
  if (!state.started) return;
  event.preventDefault();
  const p = localPointerPosition(event);
  const before = screenToWorld(p.x, p.y);
  const factor = Math.exp(-event.deltaY * 0.0012);
  camera.scale = clamp(camera.scale * factor, camera.minScale, camera.maxScale);
  camera.x = p.x - before.x * camera.scale;
  camera.y = p.y - before.y * camera.scale;
}, { passive: false });

function midpoint(a, b) {
  return { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

ui.start.addEventListener('click', () => {
  state.started = true;
  state.paused = false;
  state.lastFrameTime = performance.now();
  recordResidentActivity(true);
  ui.titleScreen.classList.add('hidden');
  updateHud();
});

ui.pause.addEventListener('click', () => {
  if (!state.started) return;
  state.paused = !state.paused;
  updateHud();
});

ui.speed.addEventListener('click', () => {
  state.speedIndex = (state.speedIndex + 1) % state.speeds.length;
  updateHud();
});

ui.resetCamera.addEventListener('click', resetCamera);
ui.panelClose.addEventListener('click', () => ui.panel.classList.add('hidden'));

window.addEventListener('resize', () => {
  resizeCanvas();
  resetCamera();
});

function frame(now) {
  const delta = Math.min((now - state.lastFrameTime) / 1000, 0.1);
  state.lastFrameTime = now;
  updateGame(delta);
  updateHud();
  draw();
  requestAnimationFrame(frame);
}

resizeCanvas();
resetCamera();
ui.panel.classList.add('hidden');
updateHud();
draw();
requestAnimationFrame(frame);

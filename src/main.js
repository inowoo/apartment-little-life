const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d');

const ui = {
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
};

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
    symbol: '●', profile: '34歳。真面目で少し心配性。最近、仕事をこのまま続けるか迷っている。',
    thoughts: {
      morning: '今日もちゃんと間に合うかな。', day: '午後の打ち合わせ、早く終わらないかな。', evening: '帰ったら何もしたくない。', night: '転職サイトだけ、少し見てみようかな。', late: '明日のことは明日考えよう。'
    }
  },
  {
    id: 'sota', name: '佐藤 蒼太', initials: '蒼', room: 404, role: '大学生', schedule: 'university',
    symbol: '▲', profile: '20歳。大学2年生。人当たりは良いが、予定はだいたい行き当たりばったり。',
    thoughts: {
      morning: '一限、間に合うかな。', day: '帰りに本屋へ寄ろう。', evening: '晩飯どうしよう。', night: 'もうちょっとだけゲームしよう。', late: 'さすがに寝た方がいいな。'
    }
  },
  {
    id: 'haru', name: '山本 はる', initials: 'は', room: 203, role: '小学生', schedule: 'child',
    symbol: '■', profile: '10歳。よく喋り、マンションの大人にもすぐ挨拶する。算数の宿題は少し苦手。',
    thoughts: {
      morning: '今日の給食なんだっけ。', day: '早く帰って遊びたい。', evening: '宿題、あとでやればいいかな。', night: '明日の時間割、見たっけ？', late: 'もう眠い。'
    }
  },
  {
    id: 'naoko', name: '山本 直子', initials: '直', room: 203, role: '在宅勤務', schedule: 'remote',
    symbol: '◆', profile: '41歳。はるの母。自宅でデザイン関係の仕事をしている。仕事中でも家のことが気になる。',
    thoughts: {
      morning: '洗濯を回してから仕事を始めよう。', day: '集中できるうちにここまで終わらせたい。', evening: '夕飯、簡単なものでいいかな。', night: '明日の分だけ片付けておこう。', late: '今日はもう終わり。'
    }
  },
  {
    id: 'genzo', name: '高橋 源三', initials: '源', room: 101, role: '退職後', schedule: 'retired',
    symbol: '★', profile: '72歳。口数は少ないが、毎朝ベランダから空を見るのが習慣。',
    thoughts: {
      morning: '今日は少し暖かそうだ。', day: '買い物は昼前に済ませるか。', evening: 'ニュースでも見るかな。', night: '明日はどこまで歩こう。', late: '夜更かしはよくないな。'
    }
  },
  {
    id: 'fumi', name: '高橋 文江', initials: '文', room: 101, role: '退職後', schedule: 'retired',
    symbol: '✿', profile: '69歳。源三の妻。近所の店の特売日をよく覚えている。',
    thoughts: {
      morning: '今日はシーツも洗おう。', day: '卵を買い忘れないようにしないと。', evening: '明日の朝ごはん、何にしよう。', night: 'あの人、またテレビをつけたまま寝そう。', late: '戸締まりだけ確認しよう。'
    }
  },
  {
    id: 'ren', name: '木村 蓮', initials: '蓮', room: 201, role: '無職', schedule: 'hikikomori',
    symbol: '◇', profile: '27歳。ほとんど外へ出ない。夜になると活動的になり、オンライン上ではよく喋る。',
    thoughts: {
      morning: '外が明るい。そろそろ寝ようかな。', day: '宅配、置き配にしておけばよかった。', evening: 'やっと静かになってきた。', night: '今日は調子がいい。', late: 'この時間が一番落ち着く。'
    }
  },
  {
    id: 'riko', name: '森田 莉子', initials: '莉', room: 204, role: '看護師（夜勤あり）', schedule: 'night',
    symbol: '✚', profile: '29歳。夜勤が多く、他の住人と生活時間がずれている。帰宅後に甘い物を食べるのが小さな楽しみ。',
    thoughts: {
      morning: '帰ったらシャワーだけ浴びて寝よう。', day: 'もう少し寝ていたい。', evening: 'そろそろ支度しないと。', night: '今夜は落ち着いてるといいな。', late: 'あと何時間だろう。'
    }
  },
  {
    id: 'akira', name: '小林 晶', initials: '晶', room: 305, role: '漫画家', schedule: 'manga',
    symbol: '⬟', profile: '38歳。締切前になると昼夜が逆転する漫画家。独り言が多い。',
    thoughts: {
      morning: '寝る前にあと一コマだけ。', day: '起きた。たぶん朝じゃない。', evening: 'ここからが本番。', night: '線が決まらない……。', late: '今なら描ける気がする。'
    }
  },
  {
    id: 'kenji', name: '伊藤 健司', initials: '健', room: 501, role: '会社員', schedule: 'officeLate',
    symbol: '⬢', profile: '46歳。帰宅が遅い会社員。家では静かに過ごすが、最近よくため息をつく。',
    thoughts: {
      morning: '今日こそ早く帰りたい。', day: 'メールがまた増えてる。', evening: 'まだ終わらないか。', night: 'コンビニで何か買って帰ろう。', late: 'もう寝るだけだな。'
    }
  },
  {
    id: 'mei', name: 'リン・メイ', initials: 'M', room: 502, role: '留学生', schedule: 'university',
    symbol: '⬣', profile: '22歳。日本語を勉強中の留学生。料理が好きで、週末はよく友人を呼ぶ。',
    thoughts: {
      morning: '今日は日本語で質問してみよう。', day: '帰りにスーパーへ行こう。', evening: '新しいレシピを試したい。', night: '今日の言い方、自然だったかな。', late: '家族にメッセージして寝よう。'
    }
  },
  {
    id: 'yui', name: '松本 結衣', initials: '結', room: 402, role: 'フリーランス', schedule: 'remote',
    symbol: '⬤', profile: '31歳。自宅で映像編集をしている。締切が近いと部屋からほとんど出ない。',
    thoughts: {
      morning: '先にコーヒーを淹れよう。', day: 'レンダー待ちの間に洗濯しよう。', evening: '今日はここで区切りたい。', night: 'もう一回だけ確認しよう。', late: '書き出しが終わるまで寝られない。'
    }
  }
];

const state = {
  gameMinutes: 6 * 60 + 30,
  day: 1,
  paused: false,
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
  canvas.dataset.dpr = String(dpr);
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

function updateGame(deltaSeconds) {
  if (state.paused) return;
  const speed = state.speeds[state.speedIndex];
  state.gameMinutes += deltaSeconds * 5 * speed;

  while (state.gameMinutes >= 24 * 60) {
    state.gameMinutes -= 24 * 60;
    state.day += 1;
  }
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
  if (hour >= 5 && hour < 8) return ['#7f98b2', '#d6b89e'];
  if (hour >= 8 && hour < 16) return ['#8fb6d9', '#d8e7ef'];
  if (hour >= 16 && hour < 19) return ['#9c7483', '#e2a36f'];
  if (hour >= 19 && hour < 22) return ['#35405f', '#1f263b'];
  return ['#151b2e', '#0c1020'];
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

  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.scale, camera.scale);

  drawGround();
  drawBuilding(hour);

  ctx.restore();
}

function drawGround() {
  const y = WORLD.buildingY + WORLD.height;
  ctx.fillStyle = '#39434a';
  ctx.fillRect(-500, y, WORLD.width + 1200, 170);
  ctx.fillStyle = '#626d70';
  ctx.fillRect(-500, y + 12, WORLD.width + 1200, 4);
}

function drawBuilding(hour) {
  ctx.fillStyle = '#2b2d31';
  ctx.fillRect(WORLD.buildingX - 18, WORLD.buildingY - 32, WORLD.width + 36, WORLD.height + 50);

  state.hitResidents = [];

  for (let floor = 1; floor <= WORLD.floors; floor += 1) {
    for (let column = 0; column < WORLD.roomsPerFloor; column += 1) {
      const room = floor * 100 + column + 1;
      drawRoom(room, hour);
    }
  }

  ctx.fillStyle = '#17191d';
  ctx.fillRect(WORLD.buildingX - 35, WORLD.buildingY - 48, WORLD.width + 70, 20);
  ctx.fillStyle = '#d4d0c6';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('APARTMENT LITTLE LIFE', WORLD.buildingX, WORLD.buildingY - 62);
}

function drawRoom(room, hour) {
  const r = getRoomRect(room);
  const occupants = getResidentsInRoom(room);
  const states = occupants.map((resident) => ({ resident, status: getResidentState(resident, hour) }));
  const anyoneHome = states.some((item) => item.status.isHome);
  const night = hour < 6 || hour >= 19;

  ctx.fillStyle = night && anyoneHome ? '#5d5542' : '#d5cec0';
  ctx.fillRect(r.x + 2, r.y + 2, r.width - 4, r.height - 4);

  drawFurniture(r, room);

  ctx.strokeStyle = '#6e675d';
  ctx.lineWidth = 3;
  ctx.strokeRect(r.x, r.y, r.width, r.height);

  ctx.fillStyle = '#25272a';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(String(room), r.x + 12, r.y + 24);

  const awayCount = states.filter((item) => !item.status.isHome).length;
  if (awayCount > 0) {
    ctx.fillStyle = 'rgba(30, 32, 35, 0.72)';
    ctx.fillRect(r.x + r.width - 72, r.y + 9, 60, 23);
    ctx.fillStyle = '#f0f0f0';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`外出 ${awayCount}`, r.x + r.width - 42, r.y + 25);
  }

  const homeResidents = states.filter((item) => item.status.isHome);
  homeResidents.forEach((item, index) => drawResident(item.resident, item.status, r, index, homeResidents.length));
}

function drawFurniture(r, room) {
  const variant = room % 4;

  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(r.x + 12, r.y + 38, r.width - 24, r.height - 50);

  ctx.fillStyle = '#8e8175';
  ctx.fillRect(r.x + 24, r.y + r.height - 53, 82, 31);
  ctx.fillStyle = '#655d56';
  ctx.fillRect(r.x + 31, r.y + r.height - 22, 6, 16);
  ctx.fillRect(r.x + 92, r.y + r.height - 22, 6, 16);

  ctx.fillStyle = '#7c6f62';
  ctx.fillRect(r.x + r.width - 80, r.y + r.height - 86, 54, 64);
  ctx.fillStyle = '#b9c5c8';
  ctx.fillRect(r.x + r.width - 73, r.y + r.height - 79, 40, 25);

  if (variant === 0 || variant === 2) {
    ctx.fillStyle = '#786a59';
    ctx.fillRect(r.x + 120, r.y + r.height - 44, 80, 10);
  } else {
    ctx.fillStyle = '#857866';
    ctx.fillRect(r.x + 128, r.y + r.height - 63, 62, 42);
  }
}

function drawResident(resident, status, roomRect, index, count) {
  const baseX = roomRect.x + roomRect.width * (count === 1 ? 0.5 : (index + 1) / (count + 1));
  const baseY = roomRect.y + roomRect.height - 54;
  const bob = Math.sin((performance.now() / 700) + resident.room + index) * 2;
  const x = baseX;
  const y = baseY + bob;

  const selected = state.selectedResidentId === resident.id;
  if (selected) {
    ctx.beginPath();
    ctx.arc(x, y - 27, 28, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  ctx.fillStyle = '#25282d';
  ctx.fillRect(x - 13, y - 24, 26, 33);

  ctx.beginPath();
  ctx.arc(x, y - 36, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#e7c4a5';
  ctx.fill();
  ctx.strokeStyle = '#25282d';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#f5f5f5';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(resident.initials, x, y - 31);

  ctx.fillStyle = '#17191d';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText(resident.symbol, x, y + 27);

  ctx.fillStyle = 'rgba(24, 25, 28, 0.82)';
  ctx.fillRect(x - 55, y + 34, 110, 22);
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(resident.name.split(' ')[1] || resident.name, x, y + 49);

  state.hitResidents.push({ resident, x, y: y - 20, radius: 34 / camera.scale + 12 });

  if (selected) {
    drawThoughtBubble(x, y - 90, status.action);
  }
}

function drawThoughtBubble(x, y, text) {
  const width = Math.max(120, Math.min(220, text.length * 15 + 28));
  const height = 42;
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  roundedRect(ctx, x - width / 2, y - height / 2, width, height, 14);
  ctx.fill();
  ctx.fillStyle = '#202226';
  ctx.font = '14px system-ui, sans-serif';
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
    const dx = world.x - hit.x;
    const dy = world.y - hit.y;
    const distance = Math.hypot(dx, dy);
    const radius = Math.max(32, 28 / camera.scale);
    if (distance <= radius && distance < bestDistance) {
      best = hit.resident;
      bestDistance = distance;
    }
  }
  return best;
}

function selectResident(resident) {
  state.selectedResidentId = resident.id;
  const status = getResidentState(resident, getHour());
  const stamp = `${state.day}日目 ${formatTime()}　${status.action}`;
  resident.logs ??= [];
  if (resident.logs[0] !== stamp) {
    resident.logs.unshift(stamp);
    resident.logs = resident.logs.slice(0, 8);
  }
  ui.panel.classList.remove('hidden');
  updateResidentPanel(resident);
}

function updateResidentPanel(resident) {
  if (!resident) return;
  const status = getResidentState(resident, getHour());
  ui.avatar.textContent = resident.initials;
  ui.name.textContent = resident.name;
  ui.subtitle.textContent = `${resident.room}号室 / ${resident.role}`;
  ui.location.textContent = status.location;
  ui.action.textContent = status.action;
  ui.thought.textContent = `「${status.thought}」`;
  ui.profile.textContent = resident.profile;
  ui.log.innerHTML = '';
  const logs = resident.logs?.length ? resident.logs : ['まだ観察記録はありません。'];
  for (const entry of logs) {
    const li = document.createElement('li');
    li.textContent = entry;
    ui.log.appendChild(li);
  }
}

function localPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

canvas.addEventListener('pointerdown', (event) => {
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
    const newScale = clamp(
      pointerState.pinch.startScale * (currentDistance / pointerState.pinch.startDistance),
      camera.minScale,
      camera.maxScale
    );
    camera.scale = newScale;
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

  if (pointerState.pointers.size < 2) {
    pointerState.pinch = null;
  }
  if (pointerState.pointers.size === 0) {
    pointerState.primaryDown = null;
    pointerState.dragging = false;
    canvas.classList.remove('dragging');
  }
}

canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);

canvas.addEventListener('wheel', (event) => {
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

ui.pause.addEventListener('click', () => {
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
requestAnimationFrame(frame);

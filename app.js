const APP_VERSION = "2026-04-28-2";
const modes = {
  grounding: {
    title: "지금 진정하기",
    skillTitle: "STOP 기술",
    skillDescription: "멈추기, 한발 물러서기, 관찰하기, 신중하게 행동하기 순서로 충동과 과열을 낮춥니다.",
    skillSteps: [
      "손을 멈추고 즉시 행동을 보류합니다.",
      "심호흡하며 한 발 물러섭니다.",
      "몸감각, 감정, 사실을 관찰합니다.",
      "지금 나를 덜 해치는 행동을 고릅니다."
    ],
    opening: "지금 가장 견디기 어려운 감정과 바로 하고 싶은 행동을 같이 적어보세요."
  },
  mindfulness: {
    title: "마음챙김",
    skillTitle: "Observe and Describe",
    skillDescription: "판단보다 관찰을 먼저 두고, 몸감각과 사실을 짧게 묘사해 감정의 열기를 낮춥니다.",
    skillSteps: [
      "지금 보이는 것 3가지를 말합니다.",
      "몸에서 느껴지는 감각 2가지를 적습니다.",
      "판단어 대신 사실 묘사로 바꿉니다.",
      "지금 이 순간 한 가지 행동만 합니다."
    ],
    opening: "지금 이 순간 보이는 것, 몸에서 느껴지는 것, 머릿속 생각을 각각 한 줄씩 적어보세요."
  },
  distress: {
    title: "고통 감내",
    skillTitle: "TIP 기술",
    skillDescription: "체온, 호흡, 근육 사용을 바꿔 급격한 정서 고조를 신체적으로 낮추는 기술입니다.",
    skillSteps: [
      "차가운 물이나 차가운 감각으로 몸을 깨웁니다.",
      "짧고 강한 움직임으로 에너지를 배출합니다.",
      "4초 들이마시고 6초 내쉬는 호흡을 반복합니다.",
      "근육 힘을 줬다가 천천히 풉니다."
    ],
    opening: "지금 강도가 0부터 10까지 몇인지, 그리고 10분 안에 버텨야 하는 상황인지 알려주세요."
  },
  emotion: {
    title: "감정 조절",
    skillTitle: "Check the Facts",
    skillDescription: "감정을 부정하지 않되, 사실과 해석을 나눠 감정의 강도와 방향을 다시 봅니다.",
    skillSteps: [
      "실제로 일어난 사실을 한 줄로 적습니다.",
      "내가 붙인 해석을 따로 적습니다.",
      "증거가 있는 생각과 없는 생각을 나눕니다.",
      "필요하면 반대행동이나 문제해결로 이어갑니다."
    ],
    opening: "무슨 일이 있었는지 사실만 먼저 적고, 그 뒤에 내가 붙인 해석을 따로 적어보세요."
  },
  relationship: {
    title: "관계 대화 정리",
    skillTitle: "DEAR MAN",
    skillDescription: "원하는 것을 분명하게 말하면서도 관계와 자기존중을 같이 지키는 대화 구조입니다.",
    skillSteps: [
      "상황을 평가 없이 설명합니다.",
      "느낌과 입장을 분명히 말합니다.",
      "원하는 요청을 구체적으로 말합니다.",
      "흔들리지 않고 차분하게 반복합니다."
    ],
    opening: "누구와의 대화인지, 내가 원하는 결과가 무엇인지 한 문장씩 적어보세요."
  }
};

const skillLibrary = [
  {
    name: "Wise Mind",
    description: "감정만도 아니고 이성만도 아닌 상태에서, 사실과 가치 둘 다를 보고 행동을 고르는 기술입니다.",
    steps: [
      "지금 느끼는 감정을 짧게 인정합니다.",
      "확인 가능한 사실을 따로 적습니다.",
      "내가 중요하게 여기는 방향을 한 줄로 적습니다.",
      "감정과 사실을 모두 반영한 다음 행동을 고릅니다."
    ],
    keywords: ["헷갈", "모르겠", "혼란", "정리", "복잡", "어떡", "어떻게 해야"]
  },
  {
    name: "STOP 기술",
    description: "충동적으로 행동하기 전 10초라도 간격을 만들고, 지금 손해를 줄이는 선택을 하게 돕습니다.",
    steps: [
      "멈추고 바로 행동하지 않습니다.",
      "한 발 물러서며 깊게 숨 쉽니다.",
      "내 감정, 생각, 상황을 관찰합니다.",
      "목표에 맞는 다음 행동을 고릅니다."
    ],
    keywords: ["화", "폭발", "충동", "당장", "미치겠", "쏘고", "보내고", "답장", "짜증"]
  },
  {
    name: "TIP 기술",
    description: "감정이 너무 커서 생각이 안 될 때 얼굴에 찬 감각, 느린 호흡, 짧은 강한 움직임으로 각성을 낮춥니다.",
    steps: [
      "얼굴에 차가운 감각을 줍니다.",
      "짧게 강한 움직임으로 각성을 분산합니다.",
      "4초 들이마시고 6초 내쉬는 호흡을 반복합니다.",
      "근육을 강하게 줬다가 천천히 풉니다."
    ],
    keywords: ["불안", "패닉", "숨", "심장", "과호흡", "떨", "공황", "긴장"]
  },
  {
    name: "ACCEPTS",
    description: "위기 순간 주의를 분산해 충동이 지나갈 시간을 버는 고통 감내 기술입니다.",
    steps: [
      "활동 하나를 정해 주의를 돌립니다.",
      "잠시 다른 사람에게 관심을 보냅니다.",
      "비교 대신 지금 버티는 것에 집중합니다.",
      "감정과 반대되는 감각이나 생각으로 전환합니다."
    ],
    keywords: ["못 버티", "괴로", "지옥", "압도", "버텨야", "견디기", "무너질"]
  },
  {
    name: "IMPROVE",
    description: "상상, 의미, 기도나 바람, 이완, 한 번에 한 가지, 휴식, 격려로 순간의 고통을 덜어냅니다.",
    steps: [
      "조금 더 안전한 장면을 상상합니다.",
      "이 순간의 의미를 가장 작은 단위로 찾습니다.",
      "몸을 이완하고 한 번에 한 가지에만 집중합니다.",
      "스스로에게 버틸 수 있는 말을 건넵니다."
    ],
    keywords: ["너무 힘들", "숨막", "괴롭", "지친", "지옥같", "버티기"]
  },
  {
    name: "Check the Facts",
    description: "사실과 추측을 분리해 감정이 현재 상황에 맞는 강도인지 다시 보게 합니다.",
    steps: [
      "실제로 일어난 사실만 적습니다.",
      "내 해석과 예측을 따로 분리합니다.",
      "감정이 사실에 맞는 강도인지 확인합니다.",
      "맞지 않으면 반대행동이나 문제해결로 넘어갑니다."
    ],
    keywords: ["오해", "추측", "분석", "생각", "확신", "버림받", "싫어하는 것 같"]
  },
  {
    name: "Opposite Action",
    description: "감정이 사실과 맞지 않거나 지나치게 커졌을 때, 감정이 시키는 행동의 반대 방향으로 작게 움직입니다.",
    steps: [
      "감정이 시키는 행동 충동을 적습니다.",
      "그 반대 방향의 작은 행동을 정합니다.",
      "몸 자세, 표정, 말투까지 반대 방향으로 맞춥니다.",
      "행동 후 감정 강도 변화를 확인합니다."
    ],
    keywords: ["우울", "숨고", "회피", "무기력", "침대", "아무것도", "하기 싫"]
  },
  {
    name: "PLEASE",
    description: "수면, 식사, 몸상태, 약물, 운동 같은 기본 신체 조건을 관리해 감정 취약성을 낮춥니다.",
    steps: [
      "오늘 수면, 식사, 몸상태를 확인합니다.",
      "아픈 곳이나 지친 몸을 먼저 돌봅니다.",
      "기분을 흔드는 물질 사용 여부를 점검합니다.",
      "가능한 가장 작은 건강 행동 하나를 실행합니다."
    ],
    keywords: ["예민", "민감", "잠", "수면", "배고", "지쳤", "피곤", "몸상태"]
  },
  {
    name: "Self-Soothe",
    description: "오감을 이용해 현재 순간의 안전감과 진정감을 회복하는 기술입니다.",
    steps: [
      "보기에 편한 것 하나를 찾습니다.",
      "만졌을 때 안정되는 감각을 사용합니다.",
      "진정되는 소리나 향, 따뜻한 음료를 활용합니다.",
      "몸이 조금 가라앉을 때까지 반복합니다."
    ],
    keywords: ["외로", "공허", "텅 빈", "허무", "서러", "울고 싶"]
  },
  {
    name: "DEAR MAN",
    description: "원하는 것을 정중하지만 분명하게 말하는 관계 기술입니다.",
    steps: [
      "상황을 사실대로 설명합니다.",
      "내 감정과 입장을 표현합니다.",
      "구체적으로 원하는 것을 요청하거나 거절합니다.",
      "침착함을 유지하며 협상 가능한 부분을 찾습니다."
    ],
    keywords: ["남편", "아내", "친구", "연인", "회사", "상사", "말해야", "부탁", "거절", "싸움"]
  },
  {
    name: "GIVE",
    description: "관계를 해치지 않으면서 부드럽고 존중 있게 대화하는 기술입니다.",
    steps: [
      "상대에게 부드럽게 접근합니다.",
      "공격보다 관심과 이해를 보입니다.",
      "상대 감정을 어느 정도는 인정합니다.",
      "말투와 표정을 부드럽게 유지합니다."
    ],
    keywords: ["서운", "오해", "관계", "상처", "차갑", "멀어", "대화"]
  },
  {
    name: "FAST",
    description: "상대에게 휩쓸리지 않으면서도 자기존중을 지키는 대화 기술입니다.",
    steps: [
      "나와 상대 모두에게 공정하게 봅니다.",
      "필요 없는 과한 사과는 줄입니다.",
      "내 가치와 기준에서 벗어나지 않습니다.",
      "과장 없이 사실대로 말합니다."
    ],
    keywords: ["만만", "끌려", "죄송", "미안", "자존감", "존중", "눈치"]
  }
];

const crisisKeywords = ["죽고 싶", "자살", "자해", "사라지고 싶", "끝내고 싶", "해치고 싶"];
const calmingKeywords = ["이제 괜찮아", "괜찮아졌어", "진정됐어", "좀 나아졌어", "버틸 수 있어", "괜찮은 편이야", "좀 괜찮아"];

const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const modeList = document.getElementById("modeList");
const engineList = document.getElementById("engineList");
const modeTitle = document.getElementById("modeTitle");
const skillTitle = document.getElementById("skillTitle");
const skillDescription = document.getElementById("skillDescription");
const skillSteps = document.getElementById("skillSteps");
const installButton = document.getElementById("installButton");
const statusPill = document.getElementById("statusPill");
const engineNote = document.getElementById("engineNote");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyButton = document.getElementById("saveApiKeyButton");
const clearApiKeyButton = document.getElementById("clearApiKeyButton");
const toggleApiKeyButton = document.getElementById("toggleApiKeyButton");
const apiKeyPanel = document.getElementById("apiKeyPanel");

let currentMode = "grounding";
let currentEngine = "local";
let deferredPrompt = null;
let gptAvailable = false;
let gptModel = null;
let sessionApiKey = localStorage.getItem("dialectical-openai-key") || "";

function setApiKeyPanel(open) {
  apiKeyPanel.classList.toggle("hidden", !open);
  toggleApiKeyButton.textContent = open ? "키 설정 닫기" : (sessionApiKey ? "저장된 키 보기" : "키 설정 열기");
}

function readConversationHistory() {
  return Array.from(chatWindow.querySelectorAll(".message")).map((message) => ({
    role: message.classList.contains("user") ? "user" : "assistant",
    text: message.querySelector(":scope p:last-child")?.textContent?.trim() || ""
  }));
}

function addMessage(role, text) {
  const article = document.createElement("article");
  article.className = `message ${role}`;

  const label = document.createElement("p");
  label.className = "message-label";
  label.textContent = role === "assistant" ? "변증법" : "나";

  const content = document.createElement("p");
  content.textContent = text;

  article.append(label, content);
  chatWindow.appendChild(article);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return article;
}

function setMode(modeKey) {
  currentMode = modeKey;
  const mode = modes[modeKey];
  modeTitle.textContent = mode.title;
  skillTitle.textContent = mode.skillTitle;
  skillDescription.textContent = mode.skillDescription;
  renderSkillSteps(mode.skillSteps);

  document.querySelectorAll(".mode-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === modeKey);
  });
}

function renderSkillSteps(steps) {
  skillSteps.innerHTML = "";
  steps.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    skillSteps.appendChild(item);
  });
}

function updateEngineUi() {
  document.querySelectorAll(".engine-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.engine === currentEngine);
  });

  if (currentEngine === "gpt" && gptAvailable) {
    statusPill.textContent = `${gptModel || "GPT"} 연결`;
    engineNote.textContent = "AI가 문맥을 읽고 지금 상태를 더 유연하게 정리해드립니다.";
    apiKeyInput.value = sessionApiKey;
    setApiKeyPanel(false);
    return;
  }

  if (currentEngine === "gpt" && !gptAvailable) {
    statusPill.textContent = "AI 연결 필요";
    engineNote.textContent = "AI 연결 모드는 아직 준비되지 않았어요. 그래도 아래 자연 상담 모드로는 바로 이어서 도와드릴 수 있어요.";
    apiKeyInput.value = sessionApiKey;
    setApiKeyPanel(!sessionApiKey);
    return;
  }

  statusPill.textContent = "자연 정리 모드";
  engineNote.textContent = "연결이 없어도 대화하듯 상태를 정리해드리고, 필요할 때만 자기조절 기술을 조심스럽게 제안합니다.";
  apiKeyInput.value = sessionApiKey;
  setApiKeyPanel(false);
}

function setEngine(engine) {
  currentEngine = engine;
  localStorage.setItem("dialectical-engine", currentEngine);
  updateEngineUi();
}

function detectSkill(text) {
  const lowered = text.toLowerCase();
  return skillLibrary.find((skill) => skill.keywords.some((keyword) => lowered.includes(keyword.toLowerCase())));
}

function isCrisis(text) {
  const lowered = text.toLowerCase();
  return crisisKeywords.some((keyword) => lowered.includes(keyword));
}

function isCalming(text) {
  const lowered = text.toLowerCase();
  return calmingKeywords.some((keyword) => lowered.includes(keyword));
}

function inferTone(text) {
  const lowered = text.toLowerCase();

  if (isCalming(text)) {
    return "calm";
  }
  if (isCrisis(text)) {
    return "crisis";
  }
  if (["불안", "미치겠", "답장", "심장", "떨", "공황"].some((word) => lowered.includes(word))) {
    return "anxious";
  }
  if (["화", "빡", "짜증", "열받", "폭발"].some((word) => lowered.includes(word))) {
    return "angry";
  }
  if (["지루", "평온", "멍", "그냥", "무난"].some((word) => lowered.includes(word))) {
    return "flat";
  }
  if (["우울", "무기력", "숨고", "아무것도", "지친"].some((word) => lowered.includes(word))) {
    return "low";
  }
  return "mixed";
}

function buildNaturalResponse(text, skill) {
  const tone = inferTone(text);

  if (tone === "calm") {
    return "지금은 크게 흔들리는 상태라기보다 조금 가라앉고 정리되는 쪽에 가까워 보여요. 굳이 더 파고들기보다는 이 상태를 유지하는 쪽이 더 잘 맞겠습니다. 원하면 지금 기분을 짧게 정리해드리거나, 이 평온함을 이어가는 방법만 가볍게 같이 볼 수 있어요.";
  }

  if (tone === "flat") {
    return "지금은 불안이나 위기라기보다 조용하고 약간 심심한 쪽에 가까워 보여요. 당장 뭘 해결해야 하는 순간은 아닌 것 같고, 그냥 이 상태를 편하게 지나가도 괜찮습니다. 원하면 이 느낌을 한 문장으로 정리해드리거나, 조금 더 생기를 주는 아주 작은 행동 하나만 같이 고를 수 있어요.";
  }

  if (tone === "anxious") {
    return `지금은 마음이 조금 빨라진 상태로 보여요. 그래서 문제를 바로 해결하려 하기보다 먼저 몸과 생각의 속도를 낮추는 게 더 도움이 될 수 있어요. 우선은 ${skill.name} 쪽이 잘 맞아 보여요. 숨을 천천히 내쉬거나, 시선을 주변으로 돌리거나, 지금 사실로 확인되는 것만 잠깐 붙잡아도 훨씬 덜 흔들릴 수 있어요.`;
  }

  if (tone === "angry") {
    return `지금은 감정이 앞으로 확 튀어나가려는 느낌에 가까워 보여요. 이런 때는 바로 반응하는 것보다 한 템포 늦추는 게 손해를 줄여줘요. 지금은 ${skill.name} 쪽이 잘 맞아 보입니다. 당장 답하거나 행동하기 전에 잠깐 멈추고, 몸에 들어간 힘부터 조금 빼는 쪽으로 가보면 좋겠어요.`;
  }

  if (tone === "low") {
    return `지금은 많이 과열됐다기보다 기운이 가라앉고 안으로 접히는 느낌에 가까워 보여요. 이럴 때는 나를 몰아붙이기보다 아주 작은 움직임 하나를 만드는 게 더 현실적입니다. ${skill.name} 쪽으로 가보면 좋겠어요. 거창하게 바꾸려 하기보다 지금 할 수 있는 가장 작은 다음 행동만 같이 잡아도 충분해요.`;
  }

  return `지금 적은 말 안에는 몇 가지 감정이 같이 섞여 있는 것 같아요. 그래서 섣불리 단정하기보다, 지금 당신에게 가장 덜 부담스러운 방향으로 정리해드리는 게 좋겠습니다. 우선은 ${skill.name} 쪽이 맞아 보여요. 필요하면 제가 이 상황을 더 짧고 편한 말로 다시 정리해드릴게요.`;
}

function buildCoachingResponse(text) {
  if (isCrisis(text)) {
    return {
      message: "지금 메시지에는 즉각적인 위험 신호가 보여요. 혼자 정리하려 하기보다, 주변 사람 한 명에게 바로 연락하고 지역 응급실이나 위기 지원 체계에 즉시 연결하는 게 우선입니다. 한국에서는 자살예방상담전화 109, 정신건강상담전화 1577-0199를 이용할 수 있어요.",
      skill: {
        name: "즉각적 안전 확보",
        description: "혼자 분석하지 말고 사람, 장소, 연락망을 바로 연결하는 단계가 우선입니다.",
        steps: [
          "혼자 있지 말고 주변 사람 1명에게 바로 연락합니다.",
          "위험한 물건이나 장소에서 잠시 떨어집니다.",
          "응급실이나 위기상담 전화에 즉시 연결합니다.",
          "채팅보다 실제 사람과 연결을 우선합니다."
        ]
      }
    };
  }

  const matchedSkill = detectSkill(text) || {
    name: modes[currentMode].skillTitle,
    description: modes[currentMode].skillDescription,
    steps: modes[currentMode].skillSteps
  };

  const modePrompts = {
    grounding: "지금은 STOP 순서로 가겠습니다. 손을 멈추고, 한 발 물러서고, 보이는 것 3개와 몸감각 2개를 적어보세요.",
    mindfulness: "마음챙김 핸드아웃 기준으로 가겠습니다. Observe와 Describe만 먼저 하겠습니다. 판단 없이 사실 묘사 3줄을 적어보세요.",
    distress: "고통 감내로 가겠습니다. 지금이 극심한 감정이면 TIP을 먼저 쓰고, 조금 버틸 수 있으면 ACCEPTS나 IMPROVE로 넘어가겠습니다.",
    emotion: "감정조절에서는 Check the Facts를 먼저 봅니다. 사실, 해석, 가장 두려운 예측을 한 줄씩 나눠 적어보세요.",
    relationship: "관계 영역은 DEAR MAN, GIVE, FAST를 같이 봅니다. 상황, 감정, 요청, 지키고 싶은 자기존중 기준을 순서대로 적어보세요."
  };

  const followUp = {
    "Wise Mind": "지금 이 상황에서 감정만 따르면 하고 싶은 행동과, 사실만 따르면 하고 싶은 행동을 각각 한 줄씩 적어보세요.",
    "STOP 기술": "지금 바로 보내려던 말이나 하려던 행동을 10분만 미루고, 그 사이에 손과 턱에 들어간 힘을 빼보세요.",
    "TIP 기술": "가능하면 세면대의 찬물, 차가운 팩, 느린 날숨부터 먼저 사용해보세요.",
    "ACCEPTS": "버티는 시간이 목표라면 지금 10분짜리 주의전환 활동 하나를 바로 고르겠습니다.",
    "IMPROVE": "지금 순간을 조금 덜 고통스럽게 만드는 상상, 의미, 이완 중 무엇이 제일 가능한지 골라보세요.",
    "Check the Facts": "상대가 실제로 한 행동과, 내가 추론한 의미를 분리하면 감정 강도가 달라지는지 보겠습니다.",
    "Opposite Action": "감정이 시키는 행동을 그대로 따르면 결과가 나빠질 때 반대 방향으로 아주 작게 움직이는 게 핵심입니다.",
    "PLEASE": "지금 감정 자체를 분석하기 전에 수면, 식사, 피로, 몸상태를 먼저 점검하는 게 더 효과적일 수 있습니다.",
    "Self-Soothe": "생각을 바꾸기 어렵다면 오감으로 먼저 몸을 안정시키는 쪽이 더 빠를 수 있습니다.",
    "DEAR MAN": "원하는 말을 제가 짧은 대화문 형태로 바꿔드릴 수 있습니다.",
    "GIVE": "맞서면서도 관계를 완전히 깨지 않으려면 부드러운 말투와 상대 감정 인정이 같이 필요합니다.",
    "FAST": "이번 대화에서 절대 잃고 싶지 않은 내 기준이 무엇인지 먼저 한 줄로 적어보세요."
  };

  if (isCalming(text)) {
    return {
      message: buildNaturalResponse(text, { name: "상태 유지" }),
      skill: {
        name: "상태 유지",
        description: "위기를 키우지 않고, 지금 도움이 된 요소를 짧게 확인해 안정 상태를 유지합니다.",
        steps: [
          "조금 나아진 이유를 한 가지 확인합니다.",
          "지금 몸 상태를 다시 한 번 살핍니다.",
          "다시 흔들리면 할 행동 하나만 정합니다.",
          "필요 없으면 더 깊게 파고들지 않습니다."
        ]
      }
    };
  }

  return {
    message: `${buildNaturalResponse(text, matchedSkill)} ${followUp[matchedSkill.name] || ""}`,
    skill: matchedSkill
  };
}

function persistConversation() {
  localStorage.setItem("dialectical-chat", chatWindow.innerHTML);
}

function clearPersistedStateIfNeeded() {
  const savedVersion = localStorage.getItem("dialectical-app-version");
  if (savedVersion !== APP_VERSION) {
    localStorage.removeItem("dialectical-chat");
    localStorage.setItem("dialectical-app-version", APP_VERSION);
  }
}

function restoreConversation() {
  const saved = localStorage.getItem("dialectical-chat");
  if (saved) {
    chatWindow.innerHTML = saved;
  }
}

async function fetchConfig() {
  try {
    const response = await fetch("./api/config", {
      cache: "no-store",
      headers: sessionApiKey ? { "x-openai-api-key": sessionApiKey } : {}
    });
    if (!response.ok) {
      throw new Error("config_failed");
    }

    const config = await response.json();
    gptAvailable = Boolean(config.gptEnabled);
    gptModel = config.model || null;
  } catch {
    gptAvailable = false;
    gptModel = null;
  }

  updateEngineUi();
}

async function requestGptReply(message) {
  const history = readConversationHistory().slice(0, -1);
  const response = await fetch("./api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionApiKey ? { "x-openai-api-key": sessionApiKey } : {})
    },
    body: JSON.stringify({
      message,
      mode: currentMode,
      history
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || payload.error || "gpt_failed");
  }

  return payload;
}

modeList.addEventListener("click", (event) => {
  const button = event.target.closest(".mode-chip");
  if (!button) {
    return;
  }

  setMode(button.dataset.mode);
  addMessage("assistant", modes[currentMode].opening);
  persistConversation();
});

engineList.addEventListener("click", (event) => {
  const button = event.target.closest(".engine-chip");
  if (!button) {
    return;
  }

  if (button.dataset.engine === "gpt" && !gptAvailable) {
    currentEngine = "gpt";
    localStorage.setItem("dialectical-engine", currentEngine);
    updateEngineUi();
    addMessage("assistant", "AI 연결 모드는 아직 준비되지 않았어요. 그래도 바로 아래 자연 상담 모드로는 계속 도와드릴 수 있어요.");
    persistConversation();
    return;
  }

  setEngine(button.dataset.engine);
  addMessage(
    "assistant",
    currentEngine === "gpt"
      ? "AI 연결 모드로 전환했습니다. 한 줄만 적어도 문맥을 읽고 더 유연하게 정리해드릴게요."
      : "자연 정리 모드로 전환했습니다. 너무 분석적으로 묻지 않고, 대화하듯 정리해드릴게요."
  );
  persistConversation();
});

document.querySelectorAll(".prompt-button").forEach((button) => {
  button.addEventListener("click", () => {
    userInput.value = button.dataset.prompt;
    userInput.focus();
  });
});

saveApiKeyButton.addEventListener("click", async () => {
  const value = apiKeyInput.value.trim();
  if (!value) {
    addMessage("assistant", "API 키를 먼저 붙여넣어 주세요.");
    persistConversation();
    return;
  }

  sessionApiKey = value;
  localStorage.setItem("dialectical-openai-key", sessionApiKey);
  await fetchConfig();

  if (gptAvailable) {
    addMessage("assistant", "AI 연결이 준비됐어요. 이제부터는 더 유연한 방식으로 계속 이어서 도와드릴게요.");
    setApiKeyPanel(false);
  } else {
    addMessage("assistant", "키를 저장했지만 아직 연결을 확인하지 못했어요. 키가 맞는지 한 번만 확인해 주세요.");
    setApiKeyPanel(true);
  }
  persistConversation();
});

clearApiKeyButton.addEventListener("click", async () => {
  sessionApiKey = "";
  localStorage.removeItem("dialectical-openai-key");
  apiKeyInput.value = "";
  await fetchConfig();
  addMessage("assistant", "저장된 API 키를 지웠어요.");
  setApiKeyPanel(true);
  persistConversation();
});

toggleApiKeyButton.addEventListener("click", () => {
  setApiKeyPanel(apiKeyPanel.classList.contains("hidden"));
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = userInput.value.trim();
  if (!text) {
    return;
  }

  addMessage("user", text);
  userInput.value = "";
  userInput.focus();
  persistConversation();

  if (currentEngine === "gpt" && gptAvailable && !isCrisis(text)) {
    const pending = addMessage("assistant", "말한 뜻을 정리하고 있어요...");
    pending.classList.add("pending");

    try {
      const parsed = await requestGptReply(text);
      pending.querySelector(":scope p:last-child").textContent = parsed.reply;
      pending.classList.remove("pending");

      if (parsed.skill?.name) {
        skillTitle.textContent = parsed.skill.name;
      }

      if (parsed.skill?.description) {
        skillDescription.textContent = parsed.skill.description;
      }

      if (Array.isArray(parsed.skill?.steps) && parsed.skill.steps.length > 0) {
        renderSkillSteps(parsed.skill.steps);
      }

    } catch (error) {
      pending.remove();
      const fallback = buildCoachingResponse(text);
      skillTitle.textContent = fallback.skill.name;
      skillDescription.textContent = fallback.skill.description;
      renderSkillSteps(fallback.skill.steps || modes[currentMode].skillSteps);
      addMessage("assistant", `${fallback.message} GPT 연결은 실패했습니다: ${error.message}`);
    }

    persistConversation();
    return;
  }

  const result = buildCoachingResponse(text);
  skillTitle.textContent = result.skill.name;
  skillDescription.textContent = result.skill.description;
  renderSkillSteps(result.skill.steps || modes[currentMode].skillSteps);
  addMessage("assistant", result.message);
  persistConversation();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installButton.classList.remove("hidden");
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) {
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installButton.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`./sw.js?v=${APP_VERSION}`);
  });
}

clearPersistedStateIfNeeded();
restoreConversation();
localStorage.setItem("dialectical-engine", "local");
setApiKeyPanel(!sessionApiKey);
setMode(currentMode);
fetchConfig();
updateEngineUi();

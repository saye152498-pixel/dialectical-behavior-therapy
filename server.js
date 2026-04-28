const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;

function loadDotEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 4173);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".png": "image/png"
};

const CRISIS_NOTE = "자해, 자살, 즉각적 위험 신호가 보이면 일반 상담보다 즉각적 안전 확보를 우선하고, 한국 기준 자살예방상담전화 109와 정신건강상담전화 1577-0199 또는 응급실 연결을 안내한다.";
const PARSING_EXAMPLES = [
  '입력: "아 개빡쳐" -> inferred_state: "분노", inferred_intensity: "높음", inferred_need: "충동 낮추기", skill_name: "STOP"',
  '입력: "답장 안 와 미치겠네" -> inferred_state: "불안", inferred_intensity: "높음", inferred_need: "진정과 해석 분리", skill_name: "TIP" 또는 "Check the Facts"',
  '입력: "이제 좀 괜찮아" -> inferred_state: "안정 회복", inferred_intensity: "안정중", inferred_need: "상태 유지", skill_name: "Wise Mind" 또는 "상태 유지"',
  '입력: "뭐라 말해야 할지 모르겠어" -> inferred_state: "관계 긴장", inferred_intensity: "중간", inferred_need: "대화문 정리", skill_name: "DEAR MAN"',
  '입력: "그냥 다 귀찮고 숨고 싶어" -> inferred_state: "무기력/우울", inferred_intensity: "중간~높음", inferred_need: "아주 작은 행동 시작", skill_name: "Opposite Action"',
  '입력: "나도 내가 왜 이러는지 모르겠어" -> inferred_state: "혼란", inferred_intensity: "중간", inferred_need: "정리와 안정", skill_name: "Wise Mind"',
  '입력: "괜찮은 척 하는데 사실 터질 것 같아" -> inferred_state: "감정 억누름/과부하", inferred_intensity: "높음", inferred_need: "즉시 진정", skill_name: "TIP"',
  '입력: "죽고 싶진 않은데 사라지고 싶어" -> inferred_state: "위험 신호", inferred_intensity: "높음", inferred_need: "즉각적 안전 확보", skill_name: "즉각적 안전 확보"'
].join(" ");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function sendFile(response, targetPath) {
  const extension = path.extname(targetPath).toLowerCase();
  const mimeType = MIME_TYPES[extension] || "application/octet-stream";

  fs.readFile(targetPath, (error, data) => {
    if (error) {
      sendJson(response, 404, { error: "not_found" });
      return;
    }

    response.writeHead(200, { "Content-Type": mimeType });
    response.end(data);
  });
}

function getSafePath(urlPath) {
  const normalized = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const requested = normalized === "/" ? "/index.html" : normalized;
  const absolute = path.join(ROOT, requested);

  if (!absolute.startsWith(ROOT)) {
    return null;
  }

  return absolute;
}

function extractText(responseJson) {
  if (typeof responseJson.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  if (!Array.isArray(responseJson.output)) {
    return "";
  }

  const parts = [];

  for (const item of responseJson.output) {
    if (!Array.isArray(item.content)) {
      continue;
    }

    for (const content of item.content) {
      if (content.type === "output_text" && typeof content.text === "string") {
        parts.push(content.text);
      }
    }
  }

  return parts.join("\n").trim();
}

function parseJsonReply(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function buildInstructions(mode) {
  const modeGuide = {
    grounding: "우선순위는 정서 강도를 낮추는 것이다. STOP, TIP, ACCEPTS, IMPROVE 중 현재 상황에 맞는 하나를 골라 아주 짧은 단계로 제시한다.",
    mindfulness: "Observe, Describe, Nonjudgmentally, One-Mindfully, Effectively에 맞는 질문을 우선한다.",
    distress: "고통 감내 영역에 집중한다. 위기 통과를 목표로 하고, 바로 적용할 행동 1~3개만 제시한다.",
    emotion: "Check the Facts, Opposite Action, Problem Solving, PLEASE 축으로 감정과 사실을 분리하게 돕는다.",
    relationship: "DEAR MAN, GIVE, FAST를 사용해 실제로 보낼 수 있는 문장 초안을 만든다."
  };

  return [
    "너는 DBT 기반 대화 코치다.",
    "치료사인 척하지 말고, 의료 진단이나 확정적 치료 효과를 약속하지 마라.",
    "답변은 한국어로 한다.",
    "말투는 따뜻하지만 간결하게 유지한다.",
    "사용자는 종종 한 줄만 입력한다. 입력이 짧아도 과잉 해석하지 말고, 확실하지 않으면 단정하지 마라.",
    "사용자가 괜찮아졌다고 말하면 위기로 몰아가지 말고 안정 상태 유지 쪽으로 답하라.",
    "먼저 사용자의 말을 내부적으로 파싱해서 감정, 강도, 원하는 도움을 추론하라.",
    "한국어 구어체, 욕설, 줄임말, 반어, 괜찮은 척, 애매한 표현도 문맥으로 읽어라.",
    "사용자가 무엇을 원하는지 명확히 못 말해도 진정하기, 정리하기, 대화문 만들기, 상태 유지 중 하나로 먼저 잡아라.",
    "출력은 반드시 JSON 하나로만 반환하라. 마크다운이나 코드펜스는 쓰지 마라.",
    'JSON 형식은 {"inferred_state":"", "inferred_intensity":"낮음|중간|높음|안정중", "inferred_need":"", "skill_name":"", "skill_description":"", "steps":["", "", ""], "reply":""} 이다.',
    "reply에는 1) 짧은 공감 2) 상황 정리 3) 지금 쓸 DBT 기술 1개 4) 바로 할 행동 2~4단계 5) 필요하면 사용자가 다음 답장에 적을 문장 1개를 포함한다.",
    PARSING_EXAMPLES,
    "기술 이름은 가능하면 Wise Mind, STOP, TIP, ACCEPTS, IMPROVE, Check the Facts, Opposite Action, PLEASE, Self-Soothe, DEAR MAN, GIVE, FAST 중에서 고른다.",
    "상담 비용 때문에 혼자 연습하는 사람을 돕는 맥락이므로, 실행 가능하고 짧은 과제로 안내한다.",
    CRISIS_NOTE,
    modeGuide[mode] || modeGuide.grounding
  ].join(" ");
}

function buildInput(history, message, mode) {
  const items = [
    {
      role: "system",
      content: [
        {
          type: "input_text",
          text: `현재 모드: ${mode}`
        }
      ]
    }
  ];

  const recentHistory = Array.isArray(history) ? history.slice(-8) : [];

  for (const entry of recentHistory) {
    if (!entry || (entry.role !== "user" && entry.role !== "assistant")) {
      continue;
    }

    items.push({
      role: entry.role,
      content: [
        {
          type: "input_text",
          text: String(entry.text || "")
        }
      ]
    });
  }

  items.push({
    role: "user",
    content: [
      {
        type: "input_text",
        text: String(message || "")
      }
    ]
  });

  return items;
}

async function readBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function handleChat(request, response) {
  const runtimeApiKey = request.headers["x-openai-api-key"] || OPENAI_API_KEY;

  if (!runtimeApiKey) {
    sendJson(response, 503, {
      error: "missing_api_key",
      message: "아직 API 키가 설정되지 않아 AI 상담을 시작할 수 없습니다."
    });
    return;
  }

  let payload;

  try {
    payload = JSON.parse(await readBody(request));
  } catch {
    sendJson(response, 400, { error: "invalid_json" });
    return;
  }

  const message = String(payload.message || "").trim();
  const mode = String(payload.mode || "grounding");
  const history = Array.isArray(payload.history) ? payload.history : [];

  if (!message) {
    sendJson(response, 400, { error: "empty_message" });
    return;
  }

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${runtimeApiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        instructions: buildInstructions(mode),
        input: buildInput(history, message, mode),
        max_output_tokens: 500
      })
    });

    const responseJson = await apiResponse.json();

    if (!apiResponse.ok) {
      sendJson(response, apiResponse.status, {
        error: "openai_error",
        details: responseJson
      });
      return;
    }

    const text = extractText(responseJson);
    const parsed = parseJsonReply(text);

    if (!parsed || typeof parsed.reply !== "string") {
      sendJson(response, 502, {
        error: "invalid_model_output",
        raw: text
      });
      return;
    }

    sendJson(response, 200, {
      reply: parsed.reply || "응답을 생성하지 못했습니다. 다시 시도해 주세요.",
      inferredState: parsed.inferred_state || "",
      inferredIntensity: parsed.inferred_intensity || "",
      inferredNeed: parsed.inferred_need || "",
      skill: {
        name: parsed.skill_name || "",
        description: parsed.skill_description || "",
        steps: Array.isArray(parsed.steps) ? parsed.steps.slice(0, 4) : []
      },
      model: OPENAI_MODEL,
      responseId: responseJson.id || null
    });
  } catch (error) {
    sendJson(response, 500, {
      error: "request_failed",
      message: error instanceof Error ? error.message : "unknown_error"
    });
  }
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (request.method === "GET" && requestUrl.pathname === "/api/config") {
    const runtimeApiKey = request.headers["x-openai-api-key"] || OPENAI_API_KEY;
    sendJson(response, 200, {
      gptEnabled: Boolean(runtimeApiKey),
      model: OPENAI_MODEL
    });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/chat") {
    await handleChat(request, response);
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "method_not_allowed" });
    return;
  }

  const safePath = getSafePath(requestUrl.pathname);
  if (!safePath) {
    sendJson(response, 403, { error: "forbidden" });
    return;
  }

  const targetPath = fs.existsSync(safePath) ? safePath : path.join(ROOT, "index.html");
  sendFile(response, targetPath);
});

server.listen(PORT, HOST, () => {
  console.log(`변증법 앱 서버 실행 중: http://${HOST}:${PORT}`);
});

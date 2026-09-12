import time
from typing import Any

from google import genai


def _client(api_key: str):
    return genai.Client(api_key=api_key)


def run_gemini(api_key: str, model: str, prompt: str) -> str:
    # Call Gemini with brief retry handling for transient 429/503 errors.
    last_error: Exception | None = None
    for attempt, delay in enumerate((0, 2, 5), start=1):
        if delay:
            time.sleep(delay)
        try:
            # Keep the Client object alive for the whole request.
            # Calling _client(api_key).models.generate_content(...) on a temporary
            # object can allow the client to be garbage-collected/closed too early.
            client = _client(api_key)
            try:
                response = client.models.generate_content(model=model, contents=prompt)
            finally:
                # Close the underlying HTTP client only after the synchronous request is complete.
                try:
                    client.close()
                except Exception:
                    pass

            text = (response.text or "").strip()
            if not text:
                raise RuntimeError("Gemini가 빈 응답을 반환했습니다.")
            return text
        except Exception as exc:
            last_error = exc
            message = str(exc).upper()
            transient = any(x in message for x in ("503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED", "HIGH DEMAND"))
            if not transient or attempt == 3:
                break
    raise RuntimeError(f"Gemini API 호출 실패: {last_error}")


def dispatch_ai(api_key: str, model: str, path: str, payload: dict[str, Any]) -> str:
    if path == "/api/analyze-assessment":
        text = str(payload.get("text", "")).strip()
        if not text:
            raise ValueError("수행평가 안내문을 입력해 주세요.")
        prompt = f'''너는 대한민국 고등학생의 수행평가 이해와 계획을 돕는 학업 도우미다.
아래 안내문에 실제로 적힌 내용만 근거로 분석하라. 안내문에 없는 날짜, 분량, 제출 방식, 준비물 등을 임의로 만들어내지 마라.
수행평가의 정답이나 완성본을 대신 작성하는 것이 아니라 학생이 해야 할 일을 이해하고 계획하도록 돕는 것이 목적이다.

반드시 다음 구조로 한국어로 답하라.
[핵심 내용]
2~3문장 요약

[해야 할 일]
☐ 형태의 체크리스트 4~8개

[중요 조건]
안내문에 명시된 분량, 형식, 제출 방식, 날짜, 준비물, 평가 요소 등을 항목으로 정리. 명시되지 않은 항목은 쓰지 않음.

[놓치기 쉬운 부분]
실수하기 쉬운 조건이나 반드시 확인해야 할 점을 정리. 근거가 없으면 "안내문에서 추가 조건은 확인되지 않았습니다."라고 답함.

수행평가 안내문:
{text}
'''
        return run_gemini(api_key, model, prompt)

    if path == "/api/recommend-today":
        assessments = payload.get("assessments", [])
        prompt = f'''너는 고등학생의 오늘 공부 계획을 세워 주는 학업 도우미다.
아래 JSON 데이터에는 학생에게 실제로 등록된 수행평가만 들어 있다.
데이터 밖의 수행평가나 학교 정보를 만들어내지 마라.

우선순위 판단 기준:
- 마감일까지 남은 날짜
- 배점
- 현재 진행률
- 예상 작업량
- 아직 완료하지 않은 체크리스트

오늘 하루에 현실적으로 할 수 있도록 최대 3개의 할 일만 추천하라.
각 항목은 "1. 수행평가명 - 오늘 할 일" 형식으로 쓰고, 바로 아래 줄에 왜 우선해야 하는지 짧게 설명하라.
마지막에 "오늘의 핵심" 한 문장도 덧붙여라.

수행평가 데이터:
{assessments}
'''
        return run_gemini(api_key, model, prompt)

    if path == "/api/plan-assessments":
        assessments = payload.get("assessments", [])
        prompt = f'''너는 고등학생의 수행평가 계획을 세우는 학업 도우미다.
아래 JSON 데이터에 있는 수행평가만 사용하고, 존재하지 않는 일정이나 요구사항은 만들지 마라.
마감일, 현재 진행률, 예상 작업량, 미완료 체크리스트를 고려해 계획을 세워라.

한국어로 다음 형식으로 답하라.
[우선순위]
1~3개 수행평가를 우선순위대로 정리하고 이유를 한 문장씩 설명

[오늘]
실행할 일

[내일]
실행할 일

[그 이후]
마감 전까지의 간단한 단계

한 날에 과도하게 많은 일을 몰아넣지 마라.

수행평가 데이터:
{assessments}
'''
        return run_gemini(api_key, model, prompt)

    if path == "/api/school-question":
        question = str(payload.get("question", "")).strip()
        context = payload.get("context", {})
        if not question:
            raise ValueError("질문을 입력해 주세요.")
        prompt = f'''너는 "잠신 플래너" 안의 학교생활 정보를 설명하는 도우미다.
아래 [앱 데이터]가 유일한 사실 근거다.
앱 데이터에 없는 수행평가, 수업 진도, 시간표, 일정, 준비물, 공지를 추측하거나 만들어내지 마라.
질문에 답할 근거가 부족하면 반드시 "현재 잠신 플래너에 등록된 정보만으로는 확인할 수 없습니다."라고 분명히 말하라.
학생에게 필요하면 관련 날짜, D-Day, 과목, 준비물, 숙제 등을 간단히 정리해도 된다.
한국어로 간결하게 답하라.

[학생 질문]
{question}

[앱 데이터]
{context}
'''
        return run_gemini(api_key, model, prompt)

    raise ValueError(f"지원하지 않는 AI 요청입니다: {path}")

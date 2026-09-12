# 잠신 플래너 — 기존 UI 유지 Streamlit 버전

기존 `jamsin-planner-gemini-fixed`의 HTML/CSS/JavaScript UI와 localStorage 기능을 유지하면서, Gemini 호출만 Streamlit Python backend/Secrets를 통해 처리하도록 변환한 버전입니다.

## 로컬 실행

1. `.streamlit/secrets.toml.example`을 복사해 `.streamlit/secrets.toml`을 만듭니다.
2. API 키를 입력합니다.

```toml
GEMINI_API_KEY = "본인 API 키"
GEMINI_MODEL = "gemini-3.8-flash"
```

3. 설치 및 실행:

```powershell
python -m pip install -r requirements.txt
python -m streamlit run streamlit_app.py
```

Live Server와 Uvicorn/FastAPI는 필요 없습니다.

## 데모 계정

- 학생: `20101 / 김이박 / 1234`
- 교사: `teacher01 / 1234` 또는 `김교사 / 1234`

## Streamlit Cloud

GitHub에 push할 때 `.streamlit/secrets.toml`은 `.gitignore` 때문에 올라가지 않습니다. Streamlit Community Cloud의 App settings → Secrets에 같은 TOML 내용을 넣고 `streamlit_app.py`를 Main file path로 배포합니다.

## 저장 방식

학생 진행률과 교사가 추가한 수행평가/수업 진도/일정, 로그인 상태는 기존과 동일하게 브라우저 `localStorage`에 저장됩니다. 따라서 같은 브라우저에서는 유지되지만 다른 기기와 자동 동기화되지는 않습니다.

## 2026-09-12 수정
Streamlit Component로 합치는 과정에서 localStorage의 `teacherAssessments`/`teacherProgress` 함수 이름과 교사용 페이지 함수 이름이 충돌해 발생하던 `BidiComponentError: Identifier ... has already been declared` 오류를 수정했습니다.

from pathlib import Path
import os

import streamlit as st

from services.gemini_service import dispatch_ai

BASE_DIR = Path(__file__).resolve().parent

st.set_page_config(
    page_title="잠신 플래너",
    page_icon=str(BASE_DIR / "assets" / "school-logo.webp"),
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Make Streamlit itself visually disappear so the original HTML/CSS UI fills the page.
st.markdown(
    """
    <style>
      header[data-testid="stHeader"], footer, #MainMenu {display:none !important;}
      [data-testid="stAppViewContainer"] {background:#f5f7fa;}
      [data-testid="stMainBlockContainer"] {
        padding:0 !important;
        max-width:none !important;
        width:100% !important;
      }
      [data-testid="stVerticalBlock"] {gap:0 !important;}
      .stApp {min-height:100vh;}
    </style>
    """,
    unsafe_allow_html=True,
)


def _secret(name: str, default: str | None = None) -> str | None:
    try:
        return st.secrets.get(name, default)
    except Exception:
        return os.getenv(name, default)


API_KEY = _secret("GEMINI_API_KEY")
MODEL = _secret("GEMINI_MODEL", "gemini-3.8-flash") or "gemini-3.8-flash"

if not API_KEY:
    st.error(
        "Gemini API 키가 없습니다. 로컬에서는 .streamlit/secrets.toml에 "
        'GEMINI_API_KEY = "..." 를 입력하고, 배포할 때는 Streamlit Cloud의 Secrets에 등록해 주세요.'
    )
    st.stop()

HTML = '<div id="app"></div>'
CSS = (BASE_DIR / "frontend" / "component.css").read_text(encoding="utf-8")
JS = (BASE_DIR / "frontend" / "component.js").read_text(encoding="utf-8")


def handle_ai_request():
    """Receive an AI request from the original JavaScript UI and return Gemini's response."""
    component_state = st.session_state.get("jamsin_planner_component")
    request = getattr(component_state, "ai_request", None) if component_state is not None else None
    if not request:
        return

    request_id = request.get("id")
    try:
        result = dispatch_ai(
            api_key=API_KEY,
            model=MODEL,
            path=request.get("path", ""),
            payload=request.get("payload", {}) or {},
        )
        st.session_state["jamsin_ai_response"] = {
            "id": request_id,
            "ok": True,
            "result": result,
        }
    except Exception as exc:
        st.session_state["jamsin_ai_response"] = {
            "id": request_id,
            "ok": False,
            "error": str(exc),
        }


jamsin_component = st.components.v2.component(
    name="jamsin_planner_original_ui",
    html=HTML,
    css=CSS,
    js=JS,
    isolate_styles=False,
)

jamsin_component(
    key="jamsin_planner_component",
    data={"ai_response": st.session_state.get("jamsin_ai_response")},
    on_ai_request_change=handle_ai_request,
    width="stretch",
    height="content",
)

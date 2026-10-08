"""ChatOpenAI factories. gpt-5 series only — gpt-4* chat models are forbidden."""

from __future__ import annotations

from langchain_openai import ChatOpenAI

from rag_agent.config import settings


# Patch langchain_openai to preserve Google Gemini thought_signatures across tool calls
from langchain_core.messages import AIMessage
from langchain_openai.chat_models import base as _lc_base

_tool_extras: dict[str, dict] = {}
_orig_convert_dict = _lc_base._convert_dict_to_message
_orig_convert_delta = _lc_base._convert_delta_to_message_chunk
_orig_lc_to_openai = _lc_base._lc_tool_call_to_openai_tool_call


def _patched_convert_dict(_dict):
    msg = _orig_convert_dict(_dict)
    if isinstance(msg, AIMessage) and _dict.get("tool_calls"):
        for rtc in _dict["tool_calls"]:
            if "extra_content" in rtc and rtc.get("id"):
                _tool_extras[rtc["id"]] = rtc["extra_content"]
    return msg


def _patched_convert_delta(_dict, default_class):
    msg = _orig_convert_delta(_dict, default_class)
    if _dict.get("tool_calls"):
        for rtc in _dict["tool_calls"]:
            if "extra_content" in rtc and rtc.get("id"):
                _tool_extras[rtc["id"]] = rtc["extra_content"]
    return msg


def _patched_lc_to_openai(tool_call):
    res = _orig_lc_to_openai(tool_call)
    tc_id = tool_call.get("id")
    if tc_id and tc_id in _tool_extras:
        res["extra_content"] = _tool_extras[tc_id]
    return res


_lc_base._convert_dict_to_message = _patched_convert_dict
_lc_base._convert_delta_to_message_chunk = _patched_convert_delta
_lc_base._lc_tool_call_to_openai_tool_call = _patched_lc_to_openai


def _assert_gpt5(model: str) -> None:
    if model.startswith(("gpt-4", "gpt-3")):
        raise ValueError(
            f"Refusing to use obsolete chat model {model!r}; use the gpt-5 series."
        )


def fast_model() -> ChatOpenAI:
    """Small, cheap model for routine steps."""
    kwargs: dict = {"model": settings.model_fast, "streaming": True, "max_retries": 5}
    if settings.openai_base_url:
        kwargs["base_url"] = settings.openai_base_url
        kwargs["api_key"] = settings.openai_api_key
    else:
        _assert_gpt5(settings.model_fast)
    return ChatOpenAI(**kwargs)


def heavy_model() -> ChatOpenAI:
    """Capable reasoning model for planning + answer synthesis."""
    kwargs: dict = {"model": settings.model_heavy, "streaming": True, "max_retries": 5}
    if settings.openai_base_url:
        kwargs["base_url"] = settings.openai_base_url
        kwargs["api_key"] = settings.openai_api_key
    else:
        _assert_gpt5(settings.model_heavy)
        kwargs["reasoning"] = {"effort": settings.reasoning_effort}
    return ChatOpenAI(**kwargs)
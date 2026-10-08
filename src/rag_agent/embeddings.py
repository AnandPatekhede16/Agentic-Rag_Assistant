"""Embeddings factory: OpenAIEmbeddings or native GeminiEmbeddings."""

from __future__ import annotations

from functools import lru_cache
import json
import urllib.request

from langchain_core.embeddings import Embeddings
from langchain_openai import OpenAIEmbeddings

from rag_agent.config import settings


class GeminiEmbeddings(Embeddings):
    """Google Gemini embedding provider using native REST API."""

    def __init__(self, key: str, model: str = "models/gemini-embedding-001"):
        self.key = key
        self.model = model if model.startswith("models/") else f"models/{model}"

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        res: list[list[float]] = []
        for i in range(0, len(texts), 50):
            batch = texts[i : i + 50]
            url = f"https://generativelanguage.googleapis.com/v1beta/{self.model}:batchEmbedContents?key={self.key}"
            payload = {
                "requests": [
                    {"model": self.model, "content": {"parts": [{"text": t}]}}
                    for t in batch
                ]
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                for item in data.get("embeddings", []):
                    res.append(item["values"])
        return res

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]


@lru_cache
def get_embeddings() -> Embeddings:
    if settings.openai_base_url and "googleapis.com" in settings.openai_base_url:
        return GeminiEmbeddings(
            key=settings.openai_api_key,
            model=settings.embedding_model,
        )
    return OpenAIEmbeddings(model=settings.embedding_model)

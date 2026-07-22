from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Assistant de Révision - API"

    ollama_base_url: str = "https://ollama.com"
    ollama_api_key: str = ""
    llm_model: str = "gpt-oss:120b"
    embedding_model: str = "nomic-embed-text"

    database_url: str = "sqlite+aiosqlite:///./data/app.db"

    chroma_persist_dir: str = "./data/chroma"
    chroma_collection_name: str = "cours_documents"

    upload_dir: str = "./data/uploads"
    max_upload_size_mb: int = 25
    allowed_extensions: set[str] = {".pdf", ".txt", ".md"}

    chunk_size: int = 500
    chunk_overlap: int = 50
    top_k_retrieval: int = 5

    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
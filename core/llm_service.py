from openai import OpenAI
from core.config import settings
from core.logger import logger

client = None

def get_api_details():
    """Returns (api_key, is_groq, base_url, default_model) based on configured keys"""
    if settings.GROQ_API_KEY:
        return settings.GROQ_API_KEY, True, "https://api.groq.com/openai/v1", "llama-3.3-70b-versatile"
    elif settings.OPENAI_API_KEY:
        is_groq = settings.OPENAI_API_KEY.startswith("gsk_")
        if is_groq:
            return settings.OPENAI_API_KEY, True, "https://api.groq.com/openai/v1", "llama-3.3-70b-versatile"
        return settings.OPENAI_API_KEY, False, None, "gpt-4o-mini"
    return None, False, None, None

try:
    api_key, is_groq, base_url, default_model = get_api_details()
    if api_key:
        if is_groq:
            client = OpenAI(
                base_url=base_url,
                api_key=api_key
            )
            logger.info("Groq Client Initialized")
        else:
            client = OpenAI(
                api_key=api_key
            )
            logger.info("OpenAI Client Initialized")
    else:
        logger.warning("API Key Missing")

except Exception as e:
    logger.error(f"LLM Client Init Error: {str(e)}")
    client = None


def generate_mock_llm_response(prompt: str) -> str:
    # Extract question from prompt
    question = "the provided question"
    if "Question:" in prompt:
        parts = prompt.split("Question:")
        if len(parts) > 1:
            question = parts[1].strip()
            if "Provide:" in question:
                question = question.split("Provide:")[0].strip()

    return f"""### 1. Clear Answer
(Mock Mode Active - LLM Quota Exceeded/Unconfigured)
Regarding your question: **"{question}"**

Based on the analyzed system architecture documentation, the design utilizes modular components with a clear separation of concerns. The layers are structured logically to handle high-throughput file ingestion and downstream AI processing tasks.

### 2. Architecture Insights
* **Modular Layering**: The backend uses distinct controller, service, and data extraction layers to maintain a clean codebase.
* **Vector Ingestion**: PDF documents are successfully parsed, chunked, and embedded into local vector storage (ChromaDB) using SentenceTransformers.
* **Asynchronous Scalability**: The stateless nature of the FastAPI endpoints allows the system to easily scale horizontally.

### 3. Recommendations
* **Caching Layer**: Integrate a caching solution (like Redis) for frequent vector queries to improve API latency.
* **Observability**: Deploy centralized logging and monitoring (Prometheus/Grafana) to trace asynchronous workflow pipelines.
* **Event-Driven Architecture**: If document processing volume grows significantly, introduce a message queue (like RabbitMQ or Kafka) to handle jobs out-of-band.
"""


def generate_llm_response(prompt: str):
    global client
    try:
        api_key, is_groq, base_url, default_model = get_api_details()
        
        # Initialize or reinitialize client if settings change or if client is None
        if client is None or client.api_key != api_key:
            if api_key:
                if is_groq:
                    client = OpenAI(
                        base_url=base_url,
                        api_key=api_key
                    )
                    logger.info("Groq Client Initialized dynamically")
                else:
                    client = OpenAI(
                        api_key=api_key
                    )
                    logger.info("OpenAI Client Initialized dynamically")

        if client is None:
            logger.warning("No API Key configured. Falling back to Mock LLM response.")
            return generate_mock_llm_response(prompt)

        # Decide model name
        model_name = settings.MODEL_NAME
        # If using Groq and the model is default OpenAI, use the Groq default model
        if is_groq and ("gpt-" in model_name.lower() or model_name == "gpt-4o-mini"):
            model_name = default_model

        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert Software Architecture Reviewer."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3
        )

        return response.choices[0].message.content

    except Exception as e:
        error_msg = str(e)
        logger.error(f"LLM Error: {error_msg}")
        
        # If it is a quota or rate limit error, fallback to mock response to keep the application fully functional
        if "quota" in error_msg.lower() or "429" in error_msg or "rate limit" in error_msg.lower():
            logger.warning("LLM API Quota exceeded or Rate Limited. Falling back to Mock LLM response.")
            return generate_mock_llm_response(prompt)

        return f"LLM Error: {error_msg}"
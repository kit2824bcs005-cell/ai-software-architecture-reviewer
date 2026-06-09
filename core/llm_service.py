from core.logger import logger
from core.config import settings

try:
    from openai import OpenAI

    if settings.OPENAI_API_KEY:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
    else:
        client = None

except Exception:
    client = None


def generate_llm_response(prompt: str):

    try:

        if client is None:
            logger.warning("OpenAI API key not configured")

            return """
OpenAI API key not configured.

This is a placeholder response.

Configure OPENAI_API_KEY to enable AI answers.
"""

        logger.info("LLM request started")

        response = client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert software architecture AI."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        result = response.choices[0].message.content

        logger.info("LLM request successful")

        return result

    except Exception as e:

        logger.error(f"LLM error: {str(e)}")

        return f"LLM Error: {str(e)}"
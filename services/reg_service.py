import os
import uuid

from core.logger import logger
from core.llm_service import generate_llm_response

from rag.pdf_parser import extract_text_from_pdf
from rag.chunking import create_chunks
from rag.embeddings import create_embeddings
from rag.vector_db import store_embeddings
from rag.retriever import search_similar_chunks

from rag.architecture_engine import (
    detect_architecture,
    score_architecture,
    generate_recommendations
)

from rag.report_generator import generate_pdf_report


# -----------------------------------
# PDF PROCESSING PIPELINE
# -----------------------------------
def process_pdf(file_path):

    logger.info(f"Processing PDF: {file_path}")

    text = extract_text_from_pdf(file_path)

    chunks = create_chunks(text)

    embeddings = create_embeddings(chunks)

    store_embeddings(chunks, embeddings)

    logger.info("PDF processing completed")

    return {
        "text_length": len(text),
        "chunks": len(chunks),
        "embeddings": len(embeddings)
    }


# -----------------------------------
# AI RESPONSE GENERATION
# -----------------------------------
def generate_ai_response(question, model):

    try:
        logger.info(f"Question received: {question}")

        query_embedding = model.encode([question]).tolist()

        logger.info("Embedding created")

        chunks = search_similar_chunks(query_embedding)

        logger.info(f"Retrieved chunks: {len(chunks)}")

        context = "\n\n".join(chunks)

        prompt = f"""
You are a senior software architecture reviewer.

Context:
{context}

Question:
{question}

Provide:
1. Clear Answer
2. Architecture Insights
3. Recommendations
"""

        logger.info("Calling LLM")

        answer = generate_llm_response(prompt)

        logger.info("LLM response received")

        architecture = detect_architecture(context)

        scores = score_architecture(context)

        recommendations = generate_recommendations(context)

        report_id = str(uuid.uuid4())

        os.makedirs("reports", exist_ok=True)

        report_path = f"reports/{report_id}.pdf"

        generate_pdf_report(
            report_path,
            question,
            answer,
            architecture,
            scores,
            recommendations
        )

        logger.info("Report generated successfully")

        return {
            "answer": answer,
            "architecture_type": architecture,
            "scores": scores,
            "recommendations": recommendations,
            "report": report_path,
            "sources": chunks
        }

    except Exception as e:

        logger.error(f"generate_ai_response ERROR: {str(e)}")

        return {
            "answer": f"ERROR: {str(e)}",
            "architecture_type": "Unknown",
            "scores": {},
            "recommendations": [],
            "report": None,
            "sources": []
        }
from rag.vector_db import collection


def search_similar_chunks(query_embedding):

    # numpy array -> python list
    if hasattr(query_embedding, "tolist"):
        query_embedding = query_embedding.tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3
    )

    documents = results.get("documents", [])

    if not documents:
        return []

    return documents[0]
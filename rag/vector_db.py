import chromadb

client = chromadb.PersistentClient(path="chroma_db")

collection = client.get_or_create_collection(
    name="pdf_chunks"
)


def store_embeddings(chunks, embeddings):

    ids = []
    docs = []
    embeds = []

    for i, chunk in enumerate(chunks):
        ids.append(str(i))
        docs.append(chunk)
        embeds.append(embeddings[i].tolist())

    collection.add(
        ids=ids,
        documents=docs,
        embeddings=embeds
    )

    return "Stored in ChromaDB successfully"
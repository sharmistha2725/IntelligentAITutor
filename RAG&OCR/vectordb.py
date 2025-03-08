# from langchain_community.vectorstores import Chroma
from langchain_chroma import Chroma
import models
import utils


def initialize_chroma(persist_directory="./chroma_db"):
    """
    Initializes and returns a Chroma vector store.

    Args:
        persist_directory - Directory to store ChromaDB.
    
    Returns:
        vectorstore - Initialized Chroma vector store.
    """
    # Initialize the Chroma vector store
    hf_embeddings = models.create_hugging_face_embedding_model()
    vectorstore = Chroma(embedding_function=hf_embeddings, persist_directory=persist_directory)
    vectorstore._persist_directory
    return vectorstore

#### INDEXING ####
def store_pdf_in_chroma(uploaded_file, vectorstore):
    """
    Stores it in a local ChromaDB.

    Args:
        uploaded_file -> file for RAG ingestion pipeline
        vectorstore ->  Instance of vector store        

    Returns:
        vectorstore -> Instance of vector store        
    """

    splits = utils.process_pdf_for_rag(uploaded_file)

    # Embed and store in local ChromaDB
    vectorstore.add_documents(splits)


#### RETRIEVAL ####
def retrieve_from_chroma(query, vectorstore):
    """
    Retrieves the most relevant documents from the Chroma vector store
    based on the user's query.

    Args:
        query -> The query string for searching the vector store.
        vectorstore -> The Chroma vector store instance for document retrieval.

    Returns:
        documents - The most relevant documents retrieved from Chroma.
    """
    # Retrieve documents based on the query
    retriever = vectorstore.as_retriever()
    documents = retriever.get_relevant_documents(query)

    return documents
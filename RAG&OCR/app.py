import streamlit as st
import chains
import vectordb

def content_generator_app():
    """
    Generates Poem Generator App with Streamlit, providing user input and displaying output.
    Includes a sidebar with two sections: Poem Generator and File Ingestion for RAG.
    """

    # Sidebar configuration
    st.sidebar.title("Menu")
    section = st.sidebar.radio(
        "Choose a section:",
        ("Poem Generator RAG", "RAG File Ingestion")
    )

    # db initialization
    vectordatabase = vectordb.initialize_chroma()

    # Condition for poem generation page
    if section == "Poem Generator RAG":
      st.title("Lets generate a poem ! 👋")

      with st.form("poem_generator"):
          topic = st.text_input(
            "Enter a topic for the poem:"
          )
          submitted = st.form_submit_button("Submit")

          toggle_state = st.checkbox("Check me to enable RAG")

          if submitted:
              if toggle_state:
                   response = chains.generate_poem_rag_chain(topic, vectordatabase)
              else:
                  response = chains.generate_poem_chain(topic)
             
              st.info(response)
    
    # Condition for RAG File Ingestion
    elif section == "RAG File Ingestion":
        st.title("RAG File Ingestion")

        uploaded_file = st.file_uploader("Upload a file:", type=["txt", "csv", "docx", "pdf"])

        if uploaded_file is not None:
            vectordb.store_pdf_in_chroma(uploaded_file, vectordatabase)
            st.success(f"File '{uploaded_file.name}' uploaded  and file embedding stored in vectordb successfully!")

content_generator_app()

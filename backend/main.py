from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
import logging

# Configura o logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Carrega variáveis de ambiente
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Configuração da API do Google
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY não encontrada nas variáveis de ambiente")
    raise ValueError("GEMINI_API_KEY não encontrada nas variáveis de ambiente")

genai.configure(api_key=GEMINI_API_KEY)

# Nome do modelo a ser usado
model_name_to_use = 'models/gemini-1.5-pro'
logger.info(f"Nome do modelo configurado para uso: {model_name_to_use}")

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestaoRequest(BaseModel):
    questao: str

def generate_adapted_question(input_text: str, tipo: str):
    if tipo == "TDAH":
        system_instruction = (
            "Você é um revisor de provas. Sua tarefa é adaptar questões para alunos com TDAH.\n"
            "REGRAS IMPORTANTES:\n"
            "- NÃO EXPLIQUE a questão.\n"
            "- NÃO INTERPRETE nem dê opinião.\n"
            "- NÃO diga se a frase está confusa.\n"
            "- NÃO responda à pergunta.\n"
            "- NÃO dê dicas ou pistas sobre a resposta.\n"
            "- NÃO altere o desafio, lógica ou objetivo da questão.\n"
            "- NÃO simplifique o conteúdo pedagógico.\n"
            "- Apenas reescreva a questão de forma mais clara e direta.\n"
            "- Use frases curtas e objetivas.\n"
            "- Use palavras simples.\n"
            "- Mantenha o conteúdo, sentido, desafio e lógica original.\n"
            "EXEMPLO:\n"
            "Original: 'Explique como funciona o ciclo da água, citando os principais processos envolvidos.'\n"
            "Adaptado: 'Explique o ciclo da água. Fale dos processos principais.'"
        )
    else:  # DISLEXIA
        system_instruction = (
            "Você é um revisor de provas. Sua tarefa é adaptar questões para alunos com dislexia.\n"
            "REGRAS IMPORTANTES:\n"
            "- NÃO EXPLIQUE a questão.\n"
            "- NÃO INTERPRETE nem dê opinião.\n"
            "- NÃO diga se a frase está confusa.\n"
            "- NÃO responda à pergunta.\n"
            "- NÃO dê dicas ou pistas sobre a resposta.\n"
            "- NÃO altere o desafio, lógica ou objetivo da questão.\n"
            "- NÃO simplifique o conteúdo pedagógico.\n"
            "- Apenas reescreva a questão para facilitar a leitura.\n"
            "- Use palavras simples e frases curtas.\n"
            "- Separe em tópicos, se necessário.\n"
            "- Mantenha o conteúdo, sentido, desafio e lógica original da pergunta."
        )

    model = genai.GenerativeModel(
        model_name_to_use,
        system_instruction=system_instruction
    )

    try:
        response = model.generate_content(
            f"Questão original: {input_text}\nReescreva a questão adaptada, obedecendo estritamente às regras acima. Não explique, não opine, não interprete, não dê dicas e não responda. Mantenha o mesmo desafio e lógica da questão original.",
            generation_config={
                "temperature": 0.5,
                "top_p": 1,
                "top_k": 40,
                "max_output_tokens": 512,
            }
        )
        return response.text
    except Exception as e:
        logger.error(f"Erro ao gerar conteúdo: {e}", exc_info=True)
        raise

@app.post("/adaptar-tdah")
async def adaptar_tdah(request: QuestaoRequest):
    try:
        questao_adaptada = generate_adapted_question(request.questao, "TDAH")
        return {"questao_adaptada": questao_adaptada}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/adaptar-dislexia")
async def adaptar_dislexia(request: QuestaoRequest):
    try:
        questao_adaptada = generate_adapted_question(request.questao, "DISLEXIA")
        return {"questao_adaptada": questao_adaptada}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
import logging # Importa o módulo logging

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

# --- Adicionado: Verificação de modelos disponíveis ---
# O log abaixo mostra os modelos disponíveis que suportam generateContent.
# Use um desses nomes para a variável model_name_to_use se 'gemini-pro' não funcionar.
# A saída do terminal anterior mostrou que 'gemini-pro' não está disponível.
# Estamos alterando para 'models/gemini-1.5-pro' como um modelo de texto geral disponível.
try:
    logger.info("Tentando listar modelos disponíveis...")
    for m in genai.list_models():
        # Verifica se o modelo suporta a operação generateContent
        if 'generateContent' in m.supported_generation_methods:
            logger.info(f"Modelo disponível que suporta generateContent: {m.name}")

except Exception as e:
    logger.error(f"Erro ao listar modelos: {e}")
    # Em um ambiente de produção, você pode querer lidar com isso de forma diferente
    logger.warning("Não foi possível listar modelos. Verifique a conexão ou a chave da API.")


# Define o nome do modelo a ser usado.
# Alterado de 'gemini-pro' para um modelo disponível que suporta generateContent,
# com base na saída do terminal anterior. 'models/gemini-1.5-pro' é um bom candidato.
model_name_to_use = 'models/gemini-1.5-pro'
logger.info(f"Nome do modelo configurado para uso: {model_name_to_use}")

# --- Fim da adição ---


app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestaoRequest(BaseModel):
    questao: str

def generate_adapted_question(input_text: str, tipo: str):
    if tipo == "TDAH":
        system_instruction = (
            "Você é um revisor de provas escolares. Sua tarefa é adaptar questões de prova para alunos com TDAH, "
            "reescrevendo-as de forma mais clara, simples e direta, sem mudar o conteúdo pedagógico.\n"
            "Siga estas regras:\n"
            "- Use frases curtas e objetivas\n"
            "- Evite palavras complexas ou ambíguas\n"
            "- Prefira estrutura em tópicos, quando possível\n"
            "- Mantenha o mesmo nível escolar e disciplina da questão original\n" # Removido destaque com negrito
            "- Nunca responda a pergunta, apenas reescreva\n"
            # Exemplo de adaptação ajustado sem negrito
            "Exemplo:\n"
            "Original: 'Explique como funciona o ciclo da água, citando os principais processos envolvidos.'\n"
            "Adaptado: 'Explique o ciclo da água. Fale dos processos principais.'"
        )
    else: # Assumimos DISLEXIA
        system_instruction = (
            "Você é um revisor de provas escolares. Sua tarefa é adaptar questões de prova para alunos com dislexia, "
            "tornando-as mais acessíveis visualmente e fáceis de ler.\n"
            "Siga estas regras:\n"
            "- Use frases curtas e simples\n"
            "- Use palavras comuns, evite termos difíceis\n"
            "- Separe informações em tópicos curtos\n"
            "- Evite frases muito longas ou com muitas vírgulas\n"
            "- Use exemplos quando ajudar na compreensão\n"
            "- Mantenha o conteúdo pedagógico original\n" # Removido destaque com negrito
            "- Nunca responda à pergunta, apenas reescreva\n"
            # Exemplo de adaptação ajustado sem negrito
            "Exemplo:\n"
            "Original: 'Explique como funciona o ciclo da água, citando os principais processos envolvidos.'\n"
            "Adaptado: 'Explique o ciclo da água. Fale dos processos principais.'" # Mantido 'chuva' no exemplo para dislexia, removido negrito
        )
    prompt = f"{system_instruction}\n\nQuestão original:\n{input_text}\n\nRetorne apenas a questão adaptada, sem explicações adicionais."
    # Usa o nome do modelo determinado na inicialização
    model = genai.GenerativeModel(model_name_to_use)
    response = model.generate_content(prompt)
    return response.text

@app.post("/adaptar-tdah")
async def adaptar_tdah(request: QuestaoRequest):
    try:
        questao_adaptada = generate_adapted_question(request.questao, "TDAH")
        return {"questao_adaptada": questao_adaptada}
    except Exception as e:
        logger.error(f"ERRO GEMINI TDAH: {e}", exc_info=True) # Loga o traceback completo
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/adaptar-dislexia")
async def adaptar_dislexia(request: QuestaoRequest):
    try:
        questao_adaptada = generate_adapted_question(request.questao, "DISLEXIA")
        return {"questao_adaptada": questao_adaptada}
    except Exception as e:
        logger.error(f"ERRO GEMINI DISLEXIA: {e}", exc_info=True) # Loga o traceback completo
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
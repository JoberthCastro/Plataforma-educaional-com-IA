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
            "- Adapte o texto para ser claro e direto para alunos com TDAH.\n"
            "- Quebre frases longas e complexas em sentenças mais curtas e fáceis de processar.\n"
            "- Apresente as informações de forma linear, clara e concisa.\n"
            "- Mantenha todos os dados numéricos e fatos essenciais da questão original.\n"
            "- A pergunta final deve ser clara e única.\n"
            "EXEMPLO:\n"
            "Original: 'João, um estudante do ensino fundamental que estava comprando materiais escolares numa papelaria bastante movimentada da cidade, decidiu adquirir exatamente três unidades de lápis grafite do tipo HB, cada um ao valor de R$ 1,50. Além disso, ele comprou também uma borracha branca da mesma marca dos lápis, cujo preço era equivalente à metade do valor total que ele havia gasto com os três lápis, porém a atendente informou que a borracha estava com um desconto promocional de 20%, o qual foi aplicado no caixa, e a pergunta que se faz é: qual foi o valor total gasto por João ao final da compra, considerando todos os itens mencionados e o desconto aplicado?'\n"
            "Adaptado: 'João comprou 3 lápis. Cada lápis custa R$ 1,50. Ele comprou 1 borracha. O preço da borracha era metade do preço dos 3 lápis. A borracha teve 20% de desconto. Quanto João gastou no total?'"
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
            "- Adapte o texto para ser fácil de ler para alunos com dislexia.\n"
            "- Use vocabulário simples e frases curtas.\n"
            "- Apresente as informações de forma direta, usando quebras de linha para separar ideias se necessário.\n"
            "- Mantenha o conteúdo, sentido, desafio e lógica original da pergunta.\n"
            "EXEMPLO:\n"
            "Original: 'João comprou 3 lápis. Cada lápis custou R$ 1,50. Ele comprou uma borracha. A borracha custa metade do preço dos 3 lápis. A borracha tem 20% de desconto. Quanto João gastou no total?'\n"
            "Adaptado: 'João comprou 3 lápis. Cada lápis custa R$ 1,50. Ele comprou 1 borracha. O preço da borracha era metade do preço dos 3 lápis. A borracha teve 20% de desconto. Quanto João gastou no total?'"
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
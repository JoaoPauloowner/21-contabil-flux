import { db, ensureDatabaseInitialized } from "./db";
import { knowledgeArticles } from "./db/schema";
import { eq } from "drizzle-orm";

export type ReplyDraft = {
  content: string;
  confidence: "low" | "medium" | "high";
  sourceIds: string[];
  sources: { id: string; title: string }[];
  requiresHumanReview: true;
  model: string;
};

export type GenerateDraftInput = {
  requestId: string;
  organizationId: string;
  subject: string;
  description: string;
  clientName: string;
  department: string;
};

export interface AiProvider {
  generateReplyDraft(input: GenerateDraftInput): Promise<ReplyDraft>;
}

export class AccountingAiProvider implements AiProvider {
  async generateReplyDraft(input: GenerateDraftInput): Promise<ReplyDraft> {
    await ensureDatabaseInitialized();

    // 1. Busca artigos de conhecimento relevantes no banco da organização
    const articles = await db
      .select()
      .from(knowledgeArticles)
      .where(eq(knowledgeArticles.organizationId, input.organizationId));

    const matchedArticles = articles.filter(
      (a) => a.department === input.department || a.department === "geral"
    );

    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // Se o usuário já tiver configurado chave real da OpenAI:
    if (openAiKey) {
      try {
        const prompt = `Você é um assistente técnico operacional de um escritório contábil no Brasil.
Elabore um rascunho de resposta profissional, cortês e direto para o cliente "${input.clientName}".
Departamento: ${input.department.toUpperCase()}
Assunto: ${input.subject}
Contexto: ${input.description}
Fontes internas disponíveis:
${matchedArticles.map((a) => `- ${a.title}: ${a.body}`).join("\n")}

Regras estritas:
- Nunca garanta isenções fiscais ou pareceres sem revisão humana.
- Seja claro sobre prazos e documentos necessários.
- Tom profissional contábil brasileiro.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: process.env.AI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            return {
              content,
              confidence: "high",
              sourceIds: matchedArticles.map((a) => a.id),
              sources: matchedArticles.map((a) => ({ id: a.id, title: a.title })),
              requiresHumanReview: true,
              model: process.env.AI_MODEL || "gpt-4o-mini",
            };
          }
        }
      } catch (e) {
        console.warn("Falha na chamada OpenAI, utilizando gerador estruturado:", e);
      }
    }

    // Se o usuário configurou Google Gemini:
    if (geminiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Você é um assistente operacional contábil. Elabore um rascunho de resposta para o cliente "${input.clientName}" sobre "${input.subject}": ${input.description}. Procedimento interno: ${matchedArticles[0]?.body || "Seguir prazos legais"}.`,
                  },
                ],
              },
            ],
          }),
        });
        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return {
              content: text,
              confidence: "high",
              sourceIds: matchedArticles.map((a) => a.id),
              sources: matchedArticles.map((a) => ({ id: a.id, title: a.title })),
              requiresHumanReview: true,
              model: "gemini-1.5-flash",
            };
          }
        }
      } catch (e) {
        console.warn("Falha na chamada Gemini, utilizando gerador estruturado:", e);
      }
    }

    // Gerador contextual estruturado (quando as chaves de API externas ainda não foram inseridas)
    const baseArticle = matchedArticles[0];
    let guidance = "";
    if (input.department === "fiscal") {
      guidance = "Ressaltamos a importância do envio pontual dos arquivos fiscais (SPED/relatórios de notas) para apuração antes do dia 20.";
    } else if (input.department === "pessoal") {
      guidance = "Lembramos que admissões e movimentações devem ser enviadas com antecedência para envio correto dos eventos no eSocial.";
    } else if (input.department === "societario") {
      guidance = "Estamos checando os prazos da Junta Comercial e da Receita Federal para emissão do DBE e protocolo de registro.";
    } else {
      guidance = "Nossa equipe está auditando as conciliações e os lançamentos para elaboração do balancete.";
    }

    const draftText = `Prezada equipe da ${input.clientName},

Recebemos sua solicitação sobre "${input.subject}".

${input.description ? `Registramos os detalhes informados: "${input.description}". ` : ""}
${guidance}

${baseArticle ? `Conforme nossos procedimentos padrão (${baseArticle.title}):\n"${baseArticle.body.slice(0, 180)}..."\n` : ""}
Estamos à disposição caso haja documentos complementares. Favor confirmar se todos os arquivos deste período já foram anexados.

Atenciosamente,
Equipe 21 Contábil & Associados`;

    return {
      content: draftText,
      confidence: baseArticle ? "high" : "medium",
      sourceIds: matchedArticles.map((a) => a.id),
      sources: matchedArticles.map((a) => ({ id: a.id, title: a.title })),
      requiresHumanReview: true,
      model: "contabil-rules-engine-v1",
    };
  }
}

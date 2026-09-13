import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini AI Financial Advisor API Endpoint
  app.post('/api/advisor', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({
          reply: 'Chave de API do Gemini não configurada. Usando modo de inteligência offline.',
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `Você é o consultor de finanças pessoais do aplicativo Finanças Pro.
Sua meta é fornecer conselhos práticos, encorajadores, altamente personalizados e fáceis de aplicar em português do Brasil (pt-BR).
Sempre considere o contexto financeiro informado do usuário para responder com números reais.
Responda de forma concisa e direta em 2 a 3 parágrafos.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemInstruction}\n\n${context}\n\nPergunta do Usuário: ${prompt}`,
      });

      const reply = response.text || 'Não foi possível gerar uma resposta no momento.';
      res.json({ reply });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: 'Erro ao processar consulta de IA' });
    }
  });

  // Serve Vite in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Finanças Pro rodando na porta ${PORT}`);
  });
}

startServer();

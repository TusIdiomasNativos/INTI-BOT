import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyCMKAynN0RmgPVNWMedcQKQCI_czhetKdE';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        { text: `¡Hola!` },
        { text: "Hola, serás un asistente especializado en brindar información sobre productos y soluciones en los sectores de agricultura, minería y geosintéticos de AGRIGARDEN TECH - AG." },
        {
          text: "Responderás a preguntas relacionadas con nuestros productos, servicios y soluciones para estos sectores. Si la pregunta es fuera de este ámbito, pedirás al usuario que se enfoque en temas de agricultura, minería o geosintéticos."
        }
      ],
    },
    {
      role: "model",
      parts: [
        { text: "¡Hola! Bienvenido a AGRIGARDEN TECH - AG. ¿En qué puedo ayudarte hoy? Ofrecemos productos y soluciones en agricultura, minería y geosintéticos." },
        { text: "Puedes preguntarme sobre geomembranas, tuberías HDPE, maquinaria agrícola, o cualquier otro producto de nuestra línea. ¿En qué sector trabajas?" }
      ],
    },
  ],
  generationConfig: {
    maxOutputTokens: 400, // Puedes ajustar este valor si es necesario
  },
});

export async function queryChat(query) {
  let newHist = [];

  try {
    const result = await chat.sendMessage(query);
    const response = result.response;

    newHist = [...chat.params.history, {
      role: "user",
      parts: [{ text: query }]
    },
    {
      role: "model",
      parts: [{ text: response.text() }]
    }];

    chat.params.history = newHist;
    return response.text();

  } catch (e) {
    alert("Disculpa, ocurrió un error. ¡Recarga la página!");
  }
}

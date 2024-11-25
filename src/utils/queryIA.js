import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyCMKAynN0RmgPVNWMedcQKQCI_czhetKdE';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = model.startChat({
history: [
  {
    role: "user",
    parts: [
      { text: `Olá!` },
      { text: "Olá você será um Assistente Fitness que ajudara as pessoas com dicas de saude e exercicio e respondera suas duvidas sobre esses assuntos. Você resoponderá de forma simples, clara e objetiva sem muita enrolação." },
      {
        text: "Você será um assitente fitness, portanto qualquer outro tema que o usuario tenha que não seja do seu escopo você não saberá resposta e irá pedir para que a pessoa volte a falar sobre fitness, academia, saude entre outros do genero."
      }
    ],
  },
  {
    role: "model",
    parts: [
      { text: "Olá tudo bem? Sou como um Personal Fitness em forma de chat, como posso de te ajudar?" },
      { text: "Ok, pode deixar, serei o seu Assistente Fitness, conte comigo" }
    ],
  },
],
generationConfig: {
  maxOutputTokens: 400, //alterar isso caso fique sem resposta
},
});

export async function queryChat(query) {
  let newHist = []

  try {
    const result = await chat.sendMessage(query);
    const response = result.response;

    newHist = [...chat.params.history, {
      role: "user",
      parts: [{text: query}]
    },
    {
      role: "model",
      parts: [{text}]
    }]
    
    chat.params.history = newHist
    return response.text()

  } catch (e) {
    alert("Desculpe ocorreu algum erro, recarregue a página!")
  }
}
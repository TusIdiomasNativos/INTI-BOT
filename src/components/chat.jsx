'use client';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useRef, useEffect } from "react";
import { Message } from "./message";
import Loader from "./loader";
import Header from "./header";
import QueryForm from "./form/queryForm";

// API Key de Google Gemini
const API_KEY = 'AIzaSyB2todRABn_3D_YIGqZAxQYJpp4nSv6Eu4';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Historia inicial del chat (donde el profesor INTI introduce el quechua)
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        { text: `¡Hola!` },
        { text: "Hola, serás un asistente especializado en enseñar quechua y sus aplicaciones. Responderás a preguntas relacionadas con vocabulario, gramática y frases comunes en quechua." },
        { text: "Si la pregunta es fuera de este ámbito, pedirás al usuario que se enfoque en aprender quechua." }
      ],
    },
    {
      role: "model",
      parts: [
        { text: "¡Hola! Soy INTI, tu profesor virtual de quechua. Estoy aquí para enseñarte este idioma nativo." },
        { text: "Puedes preguntarme sobre vocabulario, frases comunes, o incluso practicar gramática. ¿Listo para empezar?" }
      ],
    },
  ],
  generationConfig: {
    maxOutputTokens: 400,
  },
});

export function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef(null);
  let text;
  let newHist = [];

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Función para manejar las consultas del usuario
  async function run(query) {
    try {
      setLoading(true);

      // Definir cómo responderá el profesor INTI a las preguntas
      if (query.toLowerCase().includes("vocabulario") || query.toLowerCase().includes("frases")) {
        // Si el usuario pregunta por vocabulario o frases, respondemos con ejemplos en quechua
        const vocabulario = [
          { español: "hola", quechua: "rimaykullayki" },
          { español: "gracias", quechua: "sulpayki" },
          { español: "sí", quechua: "ari" },
          { español: "no", quechua: "mana" },
          { español: "¿cómo estás?", quechua: "Imaynalla kashanki?" }
        ];

        text = `Aquí tienes algunos ejemplos de vocabulario básico en quechua:\n`;
        vocabulario.forEach(item => {
          text += `${item.español} = ${item.quechua}\n`;
        });

      } else if (query.toLowerCase().includes("gramática")) {
        // Si el usuario pregunta por gramática, proporcionamos una explicación básica
        text = "En quechua, el orden común de las palabras es Sujeto-Objeto-Verbo (SOV). Ejemplo: 'Ñuqa qampa rikuni' significa 'Yo te veo'.";
      } else if (query.toLowerCase().includes("dónde me quedé") || query.toLowerCase().includes("qué me falta aprender")) {
        // Responder sobre el progreso del usuario
        const lastInteraction = chat.params.history[chat.params.history.length - 1];
        const lastUserMessage = lastInteraction.role === "user" ? lastInteraction.parts[0].text : "No hay mensajes previos.";
        text = `Te quedaste en: "${lastUserMessage}". ¿Te gustaría seguir aprendiendo desde ahí o prefieres revisar algo en particular?`;

      } else {
        // Responder con un saludo general o en función de la lección
        text = "¡Bienvenido! ¿Qué te gustaría aprender hoy? Puedes preguntarme sobre vocabulario, frases o gramática en quechua.";
      }

      // Actualizar los mensajes con la respuesta
      setMessages([...messages, {
        text,
        query
      }]);

      // Actualizar la historia del chat
      newHist = [...chat.params.history, {
        role: "user",
        parts: [{ text: query }]
      },
      {
        role: "model",
        parts: [{ text }]
      }];

      chat.params.history = newHist;

      setLoading(false);
    } catch (e) {
      alert("Disculpa, ocurrió un error. ¡Recarga la página!");
      setLoading(false);
    }
  }

  const generatedMessages = messages.map((msg, index) => {
    return (
      <div className="flex flex-col gap-3" key={index}>
        <div>
          <Message isUser={true} name={props.name} text={msg.query} />
        </div>
        <div ref={index === messages.length - 1 ? lastMessageRef : null}>
          <Message isUser={false} text={msg.text} />
        </div>
      </div>
    );
  });

  return (
    <section className="flex flex-col gap-3 w-[85%] rounded-md mx-auto pb-2 bg-zinc-900">
      <Header />

      <div className="chat max-h-80 overflow-y-auto px-2 flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          {generatedMessages}
        </div>

        {loading && <Loader />}
      </div>

      <QueryForm run={run} />
    </section>
  );
}

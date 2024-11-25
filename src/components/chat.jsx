'use client';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useRef, useEffect, useCallback } from "react";
import { Message } from "./message"; // Asegúrate de tener este componente de mensaje.
import Loader from "./loader"; // Asegúrate de tener este componente de carga.
import Header from "./header"; // Asegúrate de tener este componente de cabecera.
import QueryForm from "./form/queryForm"; // Asegúrate de tener este componente para manejar las consultas.

const API_KEY = 'AIzaSyCBhI4EgWkeTgvMG0ifbcZuLt4xkyzMbCE';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const topics = [
  "Abecedario",
  "Verbos Tiempo Qhechua",
  "Presente Supervivencia Qhechua",
  "Preterito Colores Qhechua",
  "Futuro Clima Qhechua",
  "Imperativo Lugares Qhechua",
  "Comparativo Compras Qhechua",
  "Adverbios Animales Qhechua",
  "Negación Cuerpo Qhechua",
  "Pronombres Viaje Qhechua",
  "Preguntas Malentendidos Qhechua",
  "Artículo Determinativo Familia Qhechua",
  "Sustantivos Trabajo Qhechua",
  "Adjetivos Alimento Qhechua",
  "Plural Idiomas Qhechua",
  "Preposiciones Direcciones Qhechua",
  "Femenino Ropas Qhechua",
  "Números Escuela Qhechua",
  "Libro Medicina Qhechua",
  "Vocabulario Libro Medicina Qhechua"
];

const genAIModel = genAI.getGenerativeModel({ model: "gemini-pro" });
const chat = genAIModel.startChat({
  history: [
    {
      role: "user",
      parts: [
        { text: "¡Hola! Soy INTI BOT, tu profesor de Quechua." },
        { text: "¿Cómo te llamas?" },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "¡Hola! Soy INTI BOT. ¿Cómo te llamas?" },
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
  const [abecedario, setAbecedario] = useState([]);
  const lastMessageRef = useRef(null);
  let text;
  let newHist = [];

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Cargar el archivo JSON con el abecedario
  const fetchAbecedario = useCallback(async () => {
    try {
      const response = await fetch('./data.json');  // El archivo está en el mismo lugar que este script
      const data = await response.json();
      setAbecedario(data);
    } catch (error) {
      console.error("Error al cargar el abecedario:", error);
    }
  }, []);

  useEffect(() => {
    fetchAbecedario(); // Cargar los datos cuando el componente se monte
  }, [fetchAbecedario]);

  // Función para enviar mensajes
  async function run(query) {
    try {
      setLoading(true);
      const result = await chat.sendMessage(query);
      const response = result.response;
      text = await response.text();

      // Aquí preguntamos por el nombre del usuario
      if (query.toLowerCase().includes("me llamo")) {
        text = `¡Hola, ${query.split("me llamo")[1].trim()}! ¿Te gustaría ver la lista de temas para aprender Quechua hoy?`;
      }

      // Lógica para mostrar la lista de temas si el usuario lo pide
      if (query.toLowerCase().includes("quiero ver la lista")) {
        text = `Aquí están los temas disponibles para aprender hoy. Elige uno escribiendo su número o nombre:\n${topics.join("\n")}`;
      }

      // Aquí se puede agregar la lógica para identificar el tema seleccionado
      const selectedTopic = topics.find(topic => query.includes(topic)); // Verifica si el tema está en el mensaje del usuario

      if (selectedTopic) {
        // Lógica adicional para manejar la elección del tema
        text = `Has seleccionado el tema: ${selectedTopic}. Vamos a empezar a aprender sobre ello.`;
      }

      // Actualiza los mensajes con la respuesta
      setMessages([
        ...messages,
        { text, query },
      ]);

      newHist = [
        ...chat.params.history,
        { role: "user", parts: [{ text: query }] },
        { role: "model", parts: [{ text }] },
      ];

      chat.params.history = newHist;

      setLoading(false);
    } catch (e) {
      alert("Disculpa, ocurrió un error. ¡Recarga la página!");
      setLoading(false);
    }
  }

  // Componente para mostrar el abecedario
  function AbecedarioContent({ content }) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {content.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-lg font-bold">{item.letter}</span>
            <audio controls>
              <source src={item.audio} type="audio/ogg" />
              Tu navegador no soporta reproducción de audio.
            </audio>
          </div>
        ))}
      </div>
    );
  }

  // Renderiza los mensajes generados
  const generatedMessages = messages.map((msg, index) => (
    <div className="flex flex-col gap-3" key={index}>
      <div>
        <Message isUser={true} name={props.name} text={msg.query} />
      </div>
      <div ref={index === messages.length - 1 ? lastMessageRef : null}>
        <Message isUser={false} text={msg.text} />
      </div>
    </div>
  ));

  return (
    <section className="flex flex-col gap-3 w-[85%] rounded-md mx-auto pb-2 bg-zinc-900">
      <Header />

      {/* Mostramos el abecedario debajo de los mensajes */}
      {abecedario.length > 0 && <AbecedarioContent content={abecedario} />}

      <div className="chat max-h-80 overflow-y-auto px-2 flex flex-col gap-3">
        {generatedMessages}
        {loading && <Loader />}
      </div>

      <QueryForm run={run} />
    </section>
  );
}

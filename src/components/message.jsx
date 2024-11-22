import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import PropTypes from 'prop-types'; // Importar PropTypes para validación

export function Message(props) {
  const botName = 'Inti'; // Nombre del bot

  return (
    <div className={`flex gap-2.5 px-1 lg:px-3 ${props.isUser ? 'justify-start' : 'justify-end'}`}>
      {props.isUser && (
        <img className="size-7 lg:size-8 rounded-full bg-zinc-400" src="/images/gojo.png" alt="Imagen del usuario" />
      )}

      <div className={`flex flex-col w-[85%] p-2 px-3 lg:max-w-[70%] leading-1.5 lg:p-4 border-gray-200
        ${props.isUser ? 'rounded-e-2xl rounded-es-2xl bg-purple-600' : 'rounded-l-2xl rounded-br-2xl bg-white'}`}>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className={`text-sm font-semibold ${props.isUser ? 'text-white' : 'text-purple-950'}`}>
            {props.isUser ? props.name : botName}
          </span>
        </div>

        <Markdown 
          remarkPlugins={[remarkGfm]} 
          className={`text-md font-normal py-2.5 ${props.isUser ? 'text-white' : 'text-purple-950'}`}
        >
          {props.text}
        </Markdown> 
      </div>

      {!props.isUser && (
        <img className="size-7 lg:size-8 rounded-full bg-zinc-400" src="/images/icon.webp" alt="Imagen del bot" />
      )}
    </div>
  );
}

// Definición de PropTypes
Message.propTypes = {
  isUser: PropTypes.bool.isRequired,
  name: PropTypes.string,
  text: PropTypes.string.isRequired,
};

import Input from "./input";

export default function DataInput(props) {
  const handleSubmit = e => {
    e.preventDefault()
    props.handleEnable(false)
  }
  
  return (
    <section className={`
        absolute flex flex-col gap-3 justify-center items-center 
        top-10 left-auto py-8 px-20 rounded-xl ring-1 ring-purple-500
        bg-black bg-opacity-85
      `}>
        
        <p className="text-white text-xl font-bold">
          IA<span className='text-semibold text-purple-700'>INTI</span> !
        </p>

        <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
          <Input handleChange={props.handleName} label='Nombre'/>
          {/* <Input handleChange={props.handleAge} label='Idade'/> */}

          <button type="submit" className={`
            p-3 bg-purple-950 text-white font-semibold text-base
            rounded-xl mt-2 hover:bg-purple-900
          `}>
            Enviar
          </button>
        </form>
      </section>
  )
}
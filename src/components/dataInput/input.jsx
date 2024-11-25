export default function Input(props) {
  const handleChange = e => {
    props.handleChange(e.target.value)
  }
  
  return (
    <div className="mb-3">
      <label className="block text-purple-700 text-sm font-bold mb-1">
        {props.label}
      </label>

      <input 
        className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-white bg-opacity-10 border-none leading-tight" 
        type="text"
        onChange={handleChange}
        required
      />
    </div>
  )
}
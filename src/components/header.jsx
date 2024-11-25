import { Joystick } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center gap-3 text-white pl-5 bg-gradient-to-r from-purple-700 to-blue-600 rounded-lg py-3 shadow-lg">
      <div>
        <Joystick size={36} strokeWidth={2.4} className="hover:scale-110 transition-transform duration-200" />
      </div>
      <h2 className="font-semibold text-5xl lg:text-6xl">
        INTI<span className="font-bold text-yellow-300">BOT</span>
      </h2>
    </div>
  )
}

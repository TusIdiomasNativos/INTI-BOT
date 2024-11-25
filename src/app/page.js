'use client'

import { Chat } from "@/components/chat";
import Loading from "./loading";
import { Suspense, useState } from "react";
import DataInput from "@/components/dataInput/dataInput";

export default function Home() {
  const [name, setName] = useState('')
  const [age, setAge] = useState(0)
  const [enable, setEnable] = useState(true)
  
  return (
    <div className="relative flex justify-center w-full lg:w-[85%] mx-auto pt-4 bg-zinc-800">

      <Suspense fallback={<Loading/>}>
        {enable 
         ? <DataInput 
             handleName={setName} 
             handleAge={setAge}
             handleEnable={setEnable}
           />
          : <Chat name={name} age={age}/>
        }
      </Suspense>
    </div>
  )
}

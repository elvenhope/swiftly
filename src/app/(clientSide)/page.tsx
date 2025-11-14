import Image from "next/image";

export default function Home() {
  return (
      <>
          <div className="container mx-auto flex justify-items-center flex-col">
              <h1 className="text-center text-5xl">Welcome text!</h1>

              <button className="bg-english-violet p-5 rounded-2xl cursor-pointer hover:bg-dark-purple max-w-3xs">Click me!</button>
          </div>
      </>
  )
}

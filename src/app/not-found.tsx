import Image from "next/image"

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="text-4xl font-bold">Whoops</div>
      <div className="mt-2">We are still working on this!</div>
      <div className="">Meanwhile, have a happy Angelina!</div>
      <Image src={"/angelina.png"} width={200} height={200} alt="Cute Angelina"/>      
    </div>
  )
}
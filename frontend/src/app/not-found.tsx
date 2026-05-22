import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="text-4xl font-bold">Whoops</div>
      <div className="mt-2">Either you are trying to access something that didn't exist</div>
      <div className="">or we are still working on this feature</div>
      <div className="mt-5">Either way, have a happy Angelina!</div>
      <Image src={"/angelina.png"} width={200} height={200} alt="Cute Angelina"/>      
      <Link href={"/"}> {'> >'} Press here to go back {'< <'} </Link>
    </div>
  )
}
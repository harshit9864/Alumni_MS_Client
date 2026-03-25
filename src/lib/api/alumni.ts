export default async function FetchAlumni(token:string,role:string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/direc`,{
    headers:{
      Authorization:`Bearer ${token}`,
      role:role
    },
    
  })
  const result = await res.json();
  if(!res.ok){
    throw new Error(result.message || "something went wrong")
  }
  return result
}
export default async function FetchAlumni(token:string,role:string) {
  const res = await fetch("http://localhost:8080/api/direc",{
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
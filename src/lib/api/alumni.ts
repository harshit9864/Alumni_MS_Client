export default async function FetchAlumni() {
  const res = await fetch("http://localhost:8080/api/direc")
  const result = await res.json();
  if(!res.ok){
    throw new Error(result.message || "something went wrong")
  }
  return result
}
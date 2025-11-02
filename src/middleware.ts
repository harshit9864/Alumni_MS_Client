import { clerkMiddleware,createRouteMatcher  } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'


const isProtectedRoute = createRouteMatcher(['/admin(.*)','/alumni(.*)','/student(.*)','/select-role'])
const notStudentRoute = createRouteMatcher(['/admin(.*)','/alumni(.*)'])
const notAlumniRoute = createRouteMatcher(['/admin(.*)','/student(.*)'])
const notAdminRoute = createRouteMatcher(['/alumni(.*)','/student(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes starting with `/admin`
  if (notStudentRoute(req) && (await auth()).sessionClaims?.metadata?.role === 'student') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
  if (notAlumniRoute(req) && (await auth()).sessionClaims?.metadata?.role === 'alumni') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
  if (notAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role === 'admin') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
  if (isProtectedRoute(req)) await auth.protect()

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
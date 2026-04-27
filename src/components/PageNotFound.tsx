import { Button } from "@/components/ui/button";

function PageNotFound() {
  return (
    <>
      <main className="grid w-screen min-h-dvh place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-semibold">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild>
              <a
                href="/"
              >
                Go back home
              </a>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

export default PageNotFound;
import { sanityFetch } from "@/src/sanity/lib/live";
import { queryNavbarData } from "@/src/sanity/lib/query";
import { NavbarContent } from "./navbar-content";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export async function NavbarServer() {
  const response = await sanityFetch({ query: queryNavbarData });

  if (!response?.data) {
    console.log("No navbar data found");
    return null;
  }

  // Extract data with default values
  const {
    columns = [],
    buttons = [],
    logo = null,
    siteTitle = "Cascade Business Law",
  } = response.data;

  console.log("Navbar Data:", { columns, buttons, logo, siteTitle });

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-gray-800 to-gray-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <NavbarContent
        columns={columns}
        buttons={buttons}
        logo={logo}
        siteTitle={siteTitle}
      />
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-gray-800 to-gray-900 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold">
                Sanity Builder
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/pages">
                  <Button variant="ghost">Pages</Button>
                </Link>
                <Link href="/create">
                  <Button variant="ghost">Create</Button>
                </Link>
                <Link href="/explore">
                  <Button variant="ghost">Explore</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

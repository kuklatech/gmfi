import { Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import { MenuIcon, XIcon } from "@heroicons/react/outline"
import Link from "next/link"
import Head from "next/head"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Organizations", href: "/organizations" },
  { name: "Add organization", href: "/organizations/add" },
  { name: "Mission graph", href: "/mission" },
  { name: "Roadmap", href: "/roadmap" },
]
const footerNavigation = {
  legal: [{ name: "Privacy", href: "/privacy-policy" }],
}

export const BasicLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: JSX.Element
  children: any
}) => {
  return (
    <div className="bg-white">
      <Head>
        <title>
          Global Mission Fulfillment Index - who does a good job for the world?
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className="relative bg-sky-800 pb-24 sm:pb-32">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-gradient-to-l from-sky-800 to-cyan-700 mix-blend-multiply"
            aria-hidden="true"
          />
        </div>
        <Popover as="div" className="relative z-10">
          <nav
            className="relative mx-auto flex max-w-7xl items-center justify-between px-4 pt-6 pb-2 sm:px-6 lg:px-8"
            aria-label="Global"
          >
            <div className="flex w-full items-center justify-between lg:w-auto">
              <div className="-mr-2 flex items-center lg:hidden">
                <Popover.Button className="focus-ring-inset inline-flex items-center justify-center rounded-md bg-sky-800 bg-opacity-0 p-2 text-cyan-100 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="hidden space-x-10 lg:ml-10 lg:flex">
              {navigation.map((item) => (
                <Link href={item.href} key={item.name}>
                  <a className="text-base font-medium text-white hover:text-cyan-100">
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
          </nav>

          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute inset-x-0 top-0 origin-top transform p-2 transition lg:hidden"
            >
              <div className="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="flex items-center justify-between px-5 pt-4">
                  <div className="-mr-2">
                    <Popover.Button className="text-warm-gray-400 hover:bg-warm-gray-100 inline-flex items-center justify-center rounded-md bg-white p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="pt-5 pb-6">
                  <div className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link href={item.href} key={item.name}>
                        <a className="text-warm-gray-900 hover:bg-warm-gray-50 block rounded-md px-3 py-2 text-base font-medium">
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <div className="relative mx-auto mt-12 max-w-md px-4 sm:mt-16 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle}
        </div>
      </header>

      <main>
        <div
          className={
            "mx-auto max-w-md py-16 px-4 sm:max-w-3xl sm:py-16 sm:px-4 lg:max-w-7xl lg:px-8"
          }
        >
          {children}
        </div>
        {/* FAQ */}
      </main>

      <footer className="bg-white" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-md py-12 px-4 sm:max-w-3xl sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <p className="text-warm-gray-500 text-base">
                Our mission is to inspire and help people contribute to the
                positive change for the world.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div className="mt-12 md:mt-0">
                  <h3 className="text-warm-gray-700 text-sm font-semibold uppercase tracking-wider">
                    Legal
                  </h3>
                  <ul role="list" className="mt-4 space-y-4">
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href}>
                          <a className="text-warm-gray-500 hover:text-warm-gray-900 text-base">
                            {item.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="border-warm-gray-200 mt-12 border-t pt-8">
            <p className="text-warm-gray-400 text-base xl:text-center">
              &copy; 2022 kukla.tech. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

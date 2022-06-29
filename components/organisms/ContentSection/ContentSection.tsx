export const ContentSection = (props: { title: string; children: any }) => (
  <div className="bg-warm-gray-50">
    <div className="mx-auto max-w-md py-12 px-4 sm:max-w-3xl sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div>
          <h2 className="text-warm-gray-900 text-3xl font-extrabold">
            {props.title}
          </h2>
        </div>
        <div className="mt-12 lg:col-span-2 lg:mt-0">
          <div className="space-y-12">{props.children}</div>
        </div>
      </div>
    </div>
  </div>
)

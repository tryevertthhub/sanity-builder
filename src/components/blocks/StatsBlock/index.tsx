export type StatsBlockProps = {
  _type: "statsBlock";
  title?: string;
  subtitle?: string;
  stats?: {
    _key: string;
    value: string;
    label: string;
    description?: string;
    icon?: {
      asset: {
        url: string;
      };
      alt?: string;
    };
  }[];
  backgroundImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
};

export function StatsBlock({
  title,
  subtitle,
  stats = [],
  backgroundImage,
}: StatsBlockProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100 py-32 sm:py-40">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,theme(colors.blue.50/30%)_0%,transparent_75%)]" />

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        {backgroundImage ? (
          <>
            <img
              src={backgroundImage.asset.url}
              alt={backgroundImage.alt || ""}
              className="h-full w-full object-cover opacity-5"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100/90 to-white/80" />
          </>
        ) : (
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/5 ring-1 ring-slate-100 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-3xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-wide">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat._key}
                className="relative flex flex-col items-center group hover:scale-105 transition-transform duration-300"
              >
                {/* Decorative element */}
                <div className="absolute -inset-x-3 -inset-y-6 z-0 scale-95 bg-white/80 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:-inset-y-8 backdrop-blur-2xl rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(59,130,246,0.08)]" />

                {stat.icon && (
                  <div className="relative mb-6 z-10">
                    <div className="rounded-xl bg-white/80 p-3 ring-1 ring-slate-200/50 shadow-lg">
                      <img
                        src={stat.icon.asset.url}
                        alt={stat.icon.alt || ""}
                        className="h-8 w-8"
                      />
                    </div>
                  </div>
                )}

                <dt className="relative z-10 order-2 mt-2 text-base font-medium leading-7 text-slate-600">
                  {stat.label}
                </dt>
                <dd className="relative z-10 order-1 text-4xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                  {stat.value}
                </dd>
                {stat.description && (
                  <p className="relative z-10 order-3 mt-3 text-sm leading-6 text-slate-500">
                    {stat.description}
                  </p>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

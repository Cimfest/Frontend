export default function MetricsSection() {
  const metrics = [
    {
      value: '10,000+',
      label: 'Active Artists',
      color: 'text-[#fbbf24]'
    },
    {
      value: '50,000+',
      label: 'Tracks Created',
      color: 'text-green-400'
    },
    {
      value: '45+',
      label: 'Countries',
      color: 'text-red-400'
    },
    {
      value: '98%',
      label: 'Satisfaction',
      color: 'text-[#fbbf24]'
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl md:text-5xl font-bold ${metric.color} mb-2`}>
                {metric.value}
              </div>
              <div className="text-gray-400 text-sm md:text-base">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
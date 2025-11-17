
import React from 'react';

const MetricItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center px-4 py-6">
    <p className="text-4xl md:text-5xl font-bold text-brand-primary">{value}</p>
    <p className="mt-2 text-lg text-gray-300">{label}</p>
  </div>
);

const MetricsSection: React.FC = () => {
  return (
    <section className="py-16 bg-brand-dark border-t-4 border-b-4 border-brand-blue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <div className="flex justify-center border-r border-gray-700 md:border-r last:border-r-0">
            <MetricItem value="10,000+" label="Active Artists" />
          </div>
          <div className="flex justify-center border-r border-gray-700 md:border-r last:border-r-0">
            <MetricItem value="50,000+" label="Tracks Created" />
          </div>
          <div className="flex justify-center border-r border-gray-700 md:border-r last:border-r-0">
            <MetricItem value="45+" label="Countries" />
          </div>
          <div className="flex justify-center">
            <MetricItem value="98%" label="Satisfaction" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;

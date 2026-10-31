"use client";

interface RapportChartProps {
  data: { label: string; value: number }[];
  title?: string;
}

export const RapportChart = ({ data, title }: RapportChartProps) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-lg border border-imo-gray p-5">
      {title && <h3 className="font-bold text-imo-dark mb-4">{title}</h3>}
      <div className="space-y-3">
        {data.map((item) => {
          const pct = (item.value / max) * 100;
          return (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-semibold text-imo-dark">{item.value}</span>
              </div>
              <div className="h-2 bg-imo-gray-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-imo-green transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
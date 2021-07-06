import { Radar } from "react-chartjs-2";

export default function Monthly({ categories }) {
  const options = {
    scale: {
      ticks: { beginAtZero: true },
    },
    maintainAspectRatio: false,
  };
  return (
    <div className="monthly">
      <Radar
        data={{
          labels: categories.map((c) => (c._id ? c._id : "misc")),
          datasets: [
            {
              label: "Expenses",
              data: categories.map((c) => Math.log10(c.total)),
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderWidth: 1,
            },
          ],
        }}
        // options={{ maintainAspectRatio: false }}
      />
    </div>
  );
}

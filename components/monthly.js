import { PolarArea } from "react-chartjs-2";

export default function Monthly({ categories }) {
  return (
    <div className="monthly">
      <PolarArea
        data={{
          labels: categories.map((c) => (c._id ? c._id : "misc")),
          datasets: [
            {
              label: "Sum spent",
              data: categories.map((c) => Math.log10(c.total)),
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(255, 159, 64, 0.5)",
              ],
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
}

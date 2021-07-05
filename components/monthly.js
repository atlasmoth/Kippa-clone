import { PolarArea } from "react-chartjs-2";
const genColor = () =>
  `rgba(${Math.floor(Math.random() * 256)},${Math.floor(
    Math.random() * 256
  )},${Math.floor(Math.random() * 256)},0.5)`;

export default function Monthly({ categories }) {
  return (
    <div className="monthly">
      <PolarArea
        data={{
          labels: categories.map((c) => (c._id ? c._id : "misc")),
          datasets: [
            {
              label: "Amount spent",
              data: categories.map((c) => Math.log10(c.total)),
              backgroundColor: Array.from(new Array(categories.length), () =>
                genColor()
              ),
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
}

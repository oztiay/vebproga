import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

// Интерфейс для данных графика
interface ChartData {
  x: number[];
  y: number[];
}

const App: React.FC = () => {
  const [points, setPoints] = useState<string[]>([]);
  const [functionType, setFunctionType] = useState<"sin" | "cos" | "exp" | "ln" | "tg">("sin");
  const [chartData, setChartData] = useState<ChartData>({ x: [], y: [] });


  // Функция для вычисления ряда Маклорена
  const calculateMaclaurin = (func: "sin" | "cos" | "exp" | "ln" | "tg", xValues: number[], terms: number = 10): number[] => {
    const results: number[] = [];
    for (let x of xValues) {
      let result = 0;
      for (let n = 0; n < terms; n++) {
        if (func === "sin") {
          result += Math.pow(-1, n) * Math.pow(x, 2 * n + 1) / factorial(2 * n + 1);
        } else if (func === "cos") {
          result += Math.pow(-1, n) * Math.pow(x, 2 * n) / factorial(2 * n);
        } else if (func === "exp") {
          result += Math.pow(x, n) / factorial(n);
        } else if (func == "ln") {
          if (x <= 0 || x >= 1) {
            throw new Error("Логарифмическая функция ln(1+x) определена только для |x| < 1.");
          }
          if (n == 0) n +=1
          result += Math.pow(-1, n + 1) * Math.pow(x, n) / n;
        } else if (func == "tg") {
          const B2n = calculateBernoulli(2 * n);
          result += (Math.pow(-1, n - 1) * Math.pow(2, 2 * n) * (Math.pow(2, 2 * n) - 1) * B2n) / factorial(2 * n) * Math.pow(x, 2 * n - 1);
        }
      }
      results.push(result);
    }
    return results;
  };

  // ряд бернулли
  const bernoulliNumbers: number[] = [];
  const calculateBernoulli = (n: number): number => {
    if (bernoulliNumbers[n] !== undefined) return bernoulliNumbers[n];
    if (n === 0) return 1;
    if (n === 1) return -0.5;
    let sum = 0;
    for (let k = 0; k < n; k++) {
      sum += calculateBernoulli(k) * binomialCoefficient(n, k) * ((n - k + 1) / (n + 1));
    }
    bernoulliNumbers[n] = -sum;
    return bernoulliNumbers[n];
  };
  const binomialCoefficient = (n: number, k: number): number => {
    return factorial(n) / (factorial(k) * factorial(n - k));
  };

  // Факториал
  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const xValues = points.map((point) => parseFloat(point));
    const yValues = calculateMaclaurin(functionType, xValues);

    setChartData({
      x: xValues,
      y: yValues,
    });
  };

  // Опции для ECharts
  const chartOptions = {
    xAxis: {
      type: "value",
      name: "x",
    },
    yAxis: {
      type: "value",
      name: "y",
    },
    series: [
      {
        data: chartData.x.map((x, index) => [x, chartData.y[index]]),
        type: "line",
        smooth: true,
        name: `${functionType}(x)`,
      },
      {
        data: chartData.x.map((x, index) => [x, chartData.y[index]]),
        type: "scatter",
        name: "Точки",
      },
    ],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [`${functionType}(x)`, "Точки"],
    },
  };

  return (
    <div className="App">
      <h1>Вычисление значений функций с использованием рядов Маклорена</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Введите точки (через пробел): 
          <input
            type="text"
            value={points.join(" ")}
            onChange={(e) => setPoints(e.target.value.split(" "))}
          />
        </label>
        <br />
        <label>
          Выберите функцию:
          <select
            value={functionType}
            onChange={(e) => setFunctionType(e.target.value as "sin" | "cos" | "exp" | "ln" | "tg")}
          >
            <option value="sin">sin(x)</option>
            <option value="cos">cos(x)</option>
            <option value="exp">exp(x)</option>
            <option value="ln">ln(x)</option>
            <option value="tg">tg(x)</option>
          </select>
        </label>
        <br />
        <button type="submit">Построить график</button>
      </form>
      <ReactECharts option={chartOptions} style={{ height: "500px", marginTop: "20px" }} />
    </div>
  );
};

export default App;
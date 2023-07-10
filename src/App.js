import { useEffect, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState("");
  const [currencyFrom, setCurrencyFrom] = useState("USD");
  const [currencyTo, setCurrencyTo] = useState("PLN");

  useEffect(
    function () {
      if (!amount) return;
      const controller = new AbortController();

      async function fetchCurrency() {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${currencyFrom}&to=${currencyTo}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        setResult(data.rates[Object.keys(data.rates)[0]]);
      }

      if (currencyFrom === currencyTo) return setResult(amount);
      fetchCurrency();

      return () => controller.abort();
    },
    [amount, currencyFrom, currencyTo]
  );

  return (
    <>
      <div className="container App">
        <div className="currency-control">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <div className="currency-select">
            <Selection
              currencyValue={currencyFrom}
              onSetCurrency={setCurrencyFrom}
            />

            <p className="arrow">&rarr;</p>

            <Selection
              currencyValue={currencyTo}
              onSetCurrency={setCurrencyTo}
            />
          </div>
        </div>

        <Result amount={amount} result={result} />
      </div>

      {amount && result ? (
        <Details
          amount={amount}
          currencyFrom={currencyFrom}
          currencyTo={currencyTo}
          result={result}
        />
      ) : null}
    </>
  );
}

function Result({ amount, result }) {
  return (
    <div className="result">
      <p>{amount && result ? result.toFixed(2) : "Start!"}</p>
    </div>
  );
}

function Selection({ currencyValue, onSetCurrency }) {
  return (
    <select
      value={currencyValue}
      onChange={(e) => onSetCurrency(e.target.value)}
    >
      <option value={"USD"}>USD</option>
      <option value={"EUR"}>EUR</option>
      <option value={"CAD"}>CAD</option>
      <option value={"INR"}>INR</option>
      <option value={"PLN"}>PLN</option>
    </select>
  );
}

function Details({ amount, currencyFrom, currencyTo, result }) {
  const currencyCalculated = (result / amount).toFixed(2);
  return (
    <p className="details">
      1 {currencyFrom} is {currencyCalculated} {currencyTo}
    </p>
  );
}

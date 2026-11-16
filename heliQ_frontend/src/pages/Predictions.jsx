
import { useState } from "react";
import { Info, RotateCcw, Send } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { API_BASE_URL } from "@/config/app";

// Features aligned with the backend prediction API
const FIELDS = [
  {
    name: "irradiance",
    label: "Solar irradiance",
    unit: "W/m²",
    min: 0,
    max: 1400,
    step: 1,
    initial: 800,
  },
  {
    name: "temperature",
    label: "Ambient temperature",
    unit: "°C",
    min: -20,
    max: 60,
    step: 0.1,
    initial: 32,
  },
  {
    name: "humidity",
    label: "Humidity",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    initial: 40,
  },
  {
    name: "wind_speed",
    label: "Wind speed",
    unit: "m/s",
    min: 0,
    max: 40,
    step: 0.1,
    initial: 3,
  },
];

const initialValues = () =>
  Object.fromEntries(FIELDS.map((field) => [
    field.name,
    String(field.initial),
  ]));

export default function Predictions() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};

    for (const field of FIELDS) {
      const raw = values[field.name].trim();
      const num = Number(raw);

      if (raw === "" || !Number.isFinite(num)) {
        next[field.name] = "Enter a valid number";
      } else if (num < field.min || num > field.max) {
        next[field.name] =
          `Must be between ${field.min} and ${field.max}`;
      }
    }

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length > 0) {
      setResult(null);
      setApiError("");
      return;
    }

    const requestBody = Object.fromEntries(
      FIELDS.map((field) => [
        field.name,
        Number(values[field.name]),
      ]),
    );

    setPayload(requestBody);
    setResult(null);
    setApiError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail || data),
        );
      }

      setResult(data);
    } catch (error) {
      setApiError(
        error.message || "Unable to connect to prediction API.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValues(initialValues());
    setErrors({});
    setPayload(null);
    setResult(null);
    setApiError("");
  };

  return (
    <>
      <PageHeader
        title="Energy Output Prediction"
        description="Forecast solar energy output using the trained ML model."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            title="Input parameters"
            description="Enter the weather conditions."
          />

          <form onSubmit={handleSubmit} noValidate>
            <CardBody className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    {field.label}
                  </label>

                  <div className="relative">
                    <input
                      id={field.name}
                      type="number"
                      inputMode="decimal"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={values[field.name]}
                      onChange={(e) =>
                        handleChange(field.name, e.target.value)
                      }
                      aria-invalid={Boolean(errors[field.name])}
                      className={`h-10 w-full rounded-lg border bg-white pl-3 pr-14 text-sm focus:outline-none ${
                        errors[field.name]
                          ? "border-rose-400 focus:border-rose-500"
                          : "border-slate-300 focus:border-brand-400"
                      }`}
                    />

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      {field.unit}
                    </span>
                  </div>

                  {errors[field.name] && (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </CardBody>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <Button
                type="button"
                variant="ghost"
                icon={RotateCcw}
                onClick={handleReset}
              >
                Reset
              </Button>

              <Button
                type="submit"
                icon={Send}
                disabled={loading}
              >
                {loading ? "Predicting..." : "Predict output"}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Prediction result"
            action={<Badge variant="neutral">Live API</Badge>}
          />

          <CardBody>
            {!result && !apiError && (
              <div className="flex gap-3 rounded-lg bg-sky-50 p-3 text-sm text-sky-800">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Enter the weather parameters and submit to get
                  a prediction from the trained ML model.
                </p>
              </div>
            )}

            {loading && (
              <p className="mt-4 text-sm text-slate-500">
                Model is generating your prediction...
              </p>
            )}

            {apiError && (
              <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                <p className="font-semibold">Prediction failed</p>
                <p className="mt-1 break-words">{apiError}</p>
              </div>
            )}

            {result && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-5">
                <p className="text-sm font-medium text-emerald-800">
                  Predicted energy output
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-700">
                  {Number(result.predicted_energy_output).toFixed(4)}
                  {" "}
                  {result.unit}
                </p>

                <p className="mt-2 text-xs text-emerald-700">
                  {result.status}
                </p>
              </div>
            )}

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Request payload
            </p>

            {payload ? (
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300">
                {JSON.stringify(payload, null, 2)}
              </pre>
            ) : (
              <p className="mt-2 rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                Fill in the form and press Predict output.
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

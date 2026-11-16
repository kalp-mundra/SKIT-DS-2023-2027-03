import { useState } from "react";
import { Info, RotateCcw, Send } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Input fields for the prediction form.
// NOTE: names/ranges are placeholders - align them with the ML model's feature list.
const FIELDS = [
  { name: "irradiance", label: "Solar irradiance", unit: "W/m²", min: 0, max: 1400, step: 1, initial: 800 },
  { name: "ambientTemp", label: "Ambient temperature", unit: "°C", min: -20, max: 60, step: 0.1, initial: 32 },
  { name: "moduleTemp", label: "Module temperature", unit: "°C", min: -20, max: 100, step: 0.1, initial: 45 },
  { name: "humidity", label: "Humidity", unit: "%", min: 0, max: 100, step: 1, initial: 40 },
  { name: "windSpeed", label: "Wind speed", unit: "m/s", min: 0, max: 40, step: 0.1, initial: 3 },
  { name: "cloudCover", label: "Cloud cover", unit: "%", min: 0, max: 100, step: 1, initial: 10 },
];

const initialValues = () =>
  Object.fromEntries(FIELDS.map((f) => [f.name, String(f.initial)]));

export default function Predictions() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState(null);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    for (const f of FIELDS) {
      const raw = values[f.name].trim();
      const num = Number(raw);
      if (raw === "" || Number.isNaN(num)) next[f.name] = "Enter a number";
      else if (num < f.min || num > f.max)
        next[f.name] = `Must be between ${f.min} and ${f.max}`;
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setPayload(null);
      return;
    }
    // Build the request body exactly as it will be sent to the backend later
    setPayload(
      Object.fromEntries(FIELDS.map((f) => [f.name, Number(values[f.name])])),
    );
  };

  const handleReset = () => {
    setValues(initialValues());
    setErrors({});
    setPayload(null);
  };

  return (
    <>
      <PageHeader
        title="Energy Output Prediction"
        description="Forecast solar energy output using the trained ML model."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Input parameters"
            description="Enter the weather and panel conditions."
          />
          <form onSubmit={handleSubmit} noValidate>
            <CardBody className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <div key={f.name}>
                  <label
                    htmlFor={f.name}
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      id={f.name}
                      type="number"
                      inputMode="decimal"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={values[f.name]}
                      onChange={(e) => handleChange(f.name, e.target.value)}
                      aria-invalid={Boolean(errors[f.name])}
                      className={`h-10 w-full rounded-lg border bg-white pl-3 pr-14 text-sm focus:outline-none ${
                        errors[f.name]
                          ? "border-rose-400 focus:border-rose-500"
                          : "border-slate-300 focus:border-brand-400"
                      }`}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      {f.unit}
                    </span>
                  </div>
                  {errors[f.name] && (
                    <p className="mt-1 text-xs text-rose-600">{errors[f.name]}</p>
                  )}
                </div>
              ))}
            </CardBody>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <Button variant="ghost" icon={RotateCcw} onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" icon={Send}>
                Predict output
              </Button>
            </div>
          </form>
        </Card>

        {/* Result */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Prediction result"
            action={<Badge variant="neutral">Not connected</Badge>}
          />
          <CardBody>
            <div className="flex gap-3 rounded-lg bg-sky-50 p-3 text-sm text-sky-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>
                The prediction API is not connected yet. Submitting the form shows
                the data that will be sent to the backend model.
              </p>
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Request payload
            </p>
            {payload ? (
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300">
                {JSON.stringify(payload, null, 2)}
              </pre>
            ) : (
              <p className="mt-2 rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                Fill in the form and press “Predict output”.
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

import axios from "axios";
import { useState } from "react";
const API_URL = process.env.REACT_APP_API_URL 
function PredictionForm() {
  const [values, setValues] = useState({
    age: "",
    sex: "1",
    chest_pain_type: "0",
    resting_blood_pressure: "",
    serum_cholestoral: "",
    fasting_blood_sugar: "0",
    resting_electrocardiographic: "0",
    maximum_heart_rate: "",
    exercise_induced_angina: "0",
    oldpeak: "",
    slope: "0",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const features = [
      Number(values.age),
      Number(values.sex),
      Number(values.chest_pain_type),
      Number(values.resting_blood_pressure),
      Number(values.serum_cholestoral),
      Number(values.fasting_blood_sugar),
      Number(values.resting_electrocardiographic),
      Number(values.maximum_heart_rate),
      Number(values.exercise_induced_angina),
      Number(values.oldpeak),
      Number(values.slope),
    ];

    try {
      setLoading(true);
      setResult(null);
      const res = await axios.post(`${API_URL}/api/predict/`, {
        features,
      });
      setResult(res.data);

      const history = JSON.parse(
        localStorage.getItem("prediction_history") || "[]"
      );
      history.push(res.data);
      localStorage.setItem("prediction_history", JSON.stringify(history));
    } catch (err) {
      setResult({ error: err?.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center px-4 py-10 mt-17">
      <div className="bg-gray-900 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6 text-teal-400">
          Heart Disease Prediction
        </h2>

        <form
          onSubmit={handleSubmit}
          className="sm:grid sm:grid-cols-2 gap-5"
        >
          
          <div className="mb-6">
            <label className="block mb-1 font-semibold">Age</label>
            <input
              name="age"
              type="number"
              value={values.age}
              onChange={handleChange}
              placeholder="Enter Age"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Sex</label>
            <select
              name="sex"
              value={values.sex}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Chest Pain Type</label>
            <select
              name="chest_pain_type"
              value={values.chest_pain_type}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">
              Resting Blood Pressure
            </label>
            <input
              type="number"
              name="resting_blood_pressure"
              value={values.resting_blood_pressure}
              onChange={handleChange}
              placeholder="Above 100"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">
              Serum Cholesterol (mg/dL)
            </label>
            <input
              type="number"
              name="serum_cholestoral"
              value={values.serum_cholestoral}
              onChange={handleChange}
              placeholder="Above 200"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">
              Fasting Blood Sugar (&gt;120 mg/dL)
            </label>
            <select
              name="fasting_blood_sugar"
              value={values.fasting_blood_sugar}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="0">False</option>
              <option value="1">True</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">
              Resting Electrocardiographic
            </label>
            <select
              name="resting_electrocardiographic"
              value={values.resting_electrocardiographic}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="0">Normal</option>
              <option value="1">ST-T Wave Abnormality</option>
              <option value="2">
                Left Ventricular Hypertrophy (Possible/Definite)
              </option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">
              Maximum Heart Rate
            </label>
            <input
              type="number"
              name="maximum_heart_rate"
              value={values.maximum_heart_rate}
              onChange={handleChange}
              placeholder="e.g. 150"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">
              Exercise Induced Angina
            </label>
            <select
              name="exercise_induced_angina"
              value={values.exercise_induced_angina}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Oldpeak</label>
            <input
              type="number"
              step="0.1"
              name="oldpeak"
              value={values.oldpeak}
              onChange={handleChange}
              placeholder="e.g. 1.5"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Slope</label>
            <select
              name="slope"
              value={values.slope}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="0">Upsloping</option>
              <option value="1">Flat</option>
              <option value="2">Downsloping</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 mt-4 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold text-white transition disabled:opacity-60"
          >
            {loading ? "Predicting..." : "Predict Now"}
          </button>
        </form>

        {result && (
          <div className="mt-6 text-center">
            {result.error ? (
              <p className="text-red-400 font-semibold">
                Error:{" "}
                {typeof result.error === "object"
                  ? JSON.stringify(result.error, null, 2)
                  : String(result.error)}
              </p>
            ) : (
              <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg mt-3">
                <p className="text-lg">
                  Prediction Result:{" "}
                  <span
                    className={`font-bold ${
                      result.prediction === 1
                        ? "text-red-500"
                        : "text-green-400"
                    }`}
                  >
                    {result.prediction === 1 ? "Positive" : "Negative"}
                  </span>
                </p>
                {result.probability && (
                  <p className="text-sm text-gray-400 mt-1">
                    Confidence: {(result.probability * 100).toFixed(2)}%
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionForm;

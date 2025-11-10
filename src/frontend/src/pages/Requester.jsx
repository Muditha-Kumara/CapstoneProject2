import { useState } from "react";
import {api} from "../lib/api";

export default function Requester({ user }) {
  const [form, setForm] = useState({
    foodType: "",
    quantity: 1,
    requiredTime: "",
    location: "",
    dietaryNeeds: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Basic validation
    if (!form.foodType || !form.quantity || !form.requiredTime || !form.location) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }
    try {
      // Call backend API
      await api.post("/requests", {
        food_type: form.foodType,
        quantity: Number(form.quantity),
        required_time: form.requiredTime,
        location: form.location,
        dietary_needs: form.dietaryNeeds,
        notes: form.notes,
        user_id: user?.id
      });
      setSuccess("Request submitted successfully!");
      setForm({ foodType: "", quantity: 1, requiredTime: "", location: "", dietaryNeeds: "", notes: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit request.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl border p-8 shadow-2xl animate-fadein relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold" style={{pointerEvents: 'none'}} tabIndex={-1}>×</button>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-4 drop-shadow-lg">Requester Home</h1>
          <p className="text-slate-600 text-lg font-medium">Welcome, {user?.name || "Requester"}!</p>
        </div>
        <h2 className="text-xl font-semibold text-green-800 mb-2 text-center">Submit Food Request</h2>
        <p className="text-xs text-gray-500 mb-4 text-center">Children's identities are anonymized. All requests are private and secure.</p>
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Food Request Form">
          <div>
            <label htmlFor="foodType" className="block font-medium text-green-700">Food Type *</label>
            <input type="text" id="foodType" name="foodType" value={form.foodType} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" placeholder="e.g. Rice, Sandwich" aria-required="true" />
          </div>
          <div>
            <label htmlFor="quantity" className="block font-medium text-green-700">Quantity *</label>
            <input type="number" id="quantity" name="quantity" min="1" value={form.quantity} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" aria-required="true" />
          </div>
          <div>
            <label htmlFor="requiredTime" className="block font-medium text-green-700">Required Time *</label>
            <input type="datetime-local" id="requiredTime" name="requiredTime" value={form.requiredTime} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" aria-required="true" />
          </div>
          <div>
            <label htmlFor="location" className="block font-medium text-green-700">Location *</label>
            <input type="text" id="location" name="location" value={form.location} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" placeholder="Address or GPS coordinates" aria-required="true" />
          </div>
          <div>
            <label htmlFor="dietaryNeeds" className="block font-medium text-green-700">Dietary Needs/Preferences</label>
            <input type="text" id="dietaryNeeds" name="dietaryNeeds" value={form.dietaryNeeds} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" placeholder="e.g. Vegetarian, Nut-free" />
          </div>
          <div>
            <label htmlFor="notes" className="block font-medium text-green-700">Additional Notes</label>
            <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-200" placeholder="Any extra info" rows={2} />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" className="w-full py-3 font-bold text-lg rounded-lg transition duration-200 shadow-md bg-green-600 text-white hover:bg-green-700 hover:scale-105 disabled:opacity-60" disabled={loading} aria-busy={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

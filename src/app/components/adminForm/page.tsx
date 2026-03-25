"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CollegeForm() {
  const [college, setCollege] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();

  // Fetch states (India)
  useEffect(() => {
    async function fetchStates() {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "India" }),
        }
      );
      const data = await res.json();
      setStates(data.data.states.map((s: any) => s.name));
    }

    fetchStates();
  }, []);

  // Fetch cities when state changes
  async function fetchCities(selectedState: string) {
    setCity("");
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: "India",
          state: selectedState,
        }),
      }
    );
    const data = await res.json();
    setCities(data.data);
  }

  async function handleSubmit() {
    try {
      setLoading(true);
      const token = await getToken();

      const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/addAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          college,
          state,
          city,
        }),
      });

      if (!result.ok) {
        throw new Error("Failed to submit");
      }
      router.push("/admin");
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>College Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* College Name */}
        <div className="space-y-1">
          <Label>College / University Name</Label>
          <Input
            placeholder="Enter college name"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          />
        </div>

        {/* State */}
        <div className="space-y-1">
          <Label>State</Label>
          <Select
            value={state}
            onValueChange={(value) => {
              setState(value);
              fetchCities(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-1">
          <Label>City</Label>
          <Select value={city} onValueChange={setCity} disabled={!state}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          Submit
        </Button>
      </CardContent>
    </Card>
  );
}

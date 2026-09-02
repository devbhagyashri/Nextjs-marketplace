"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { COMPANY_IMAGES_BUCKET, INDUSTRIES, MAX_IMAGE_SIZE_BYTES, MAX_IMAGE_SIZE_MB } from "@/lib/constants";

const listingSchema = z.object({
  name: z.string().trim().min(2, "Enter a company name"),
  description: z.string().trim().min(10, "Add at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  industry: z.string().min(1, "Select an industry"),
});

export function SellCompanyForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [industry, setIndustry] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(file: File | null) {
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const parsed = listingSchema.safeParse({ name, description, price, industry });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    if (image && image.size > MAX_IMAGE_SIZE_BYTES) {
      setError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setLoading(false);
      setError("You must be signed in to list a company.");
      return;
    }

    let imageUrl = "";
    if (image) {
      const extension = image.name.split(".").pop();
      const fileName = `${userData.user.id}-${Date.now()}.${extension}`;
      const { data: imageData, error: imageError } = await supabase.storage
        .from(COMPANY_IMAGES_BUCKET)
        .upload(fileName, image);

      if (imageError) {
        setLoading(false);
        setError("Image upload failed: " + imageError.message);
        return;
      }

      const { data } = supabase.storage.from(COMPANY_IMAGES_BUCKET).getPublicUrl(imageData.path);
      imageUrl = data.publicUrl;
    }

    const { error: insertError } = await supabase.from("companies").insert({
      name: parsed.data.name,
      description: parsed.data.description,
      price: parsed.data.price,
      industry: parsed.data.industry,
      seller_id: userData.user.id,
      seller_email: userData.user.email,
      image_url: imageUrl,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/my-listings");
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Sell your company</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Company name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="CloudNest Analytics"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What does the company do, and why is it a good acquisition?"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Asking price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="250000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <select
                id="industry"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                required
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Cover image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
            />
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="h-40 w-full rounded-md object-cover" />
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "List company"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

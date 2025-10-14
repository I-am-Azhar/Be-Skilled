"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(3),
  subtitle: z.string().optional().nullable(),
  price: z.coerce.number().min(0),
  discount_price: z.coerce.number().min(0).optional().nullable(),
  tag: z.string().optional().nullable(),
  whatsapp_link: z.string().url().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
});

type Values = z.infer<typeof schema>;

export function CourseForm({ initial }: { initial?: Partial<Values> & { id?: string } }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      subtitle: (initial?.subtitle as string | undefined) ?? "",
      price: (initial?.price as number | undefined) ?? 0,
      discount_price: (initial?.discount_price as number | undefined) ?? undefined,
      tag: (initial?.tag as string | undefined) ?? "",
      whatsapp_link: (initial?.whatsapp_link as string | undefined) ?? "",
      thumbnail_url: (initial?.thumbnail_url as string | undefined) ?? "",
    },
  });

  async function onSubmit(values: Values) {
    try {
      setSubmitting(true);
      const payload = {
        title: values.title,
        subtitle: values.subtitle || null,
        price: values.price,
        discount_price: values.discount_price ?? null,
        tag: values.tag || null,
        whatsapp_link: values.whatsapp_link || null,
        thumbnail_url: values.thumbnail_url || null,
      };
      const { error } = initial?.id
        ? await supabase.from("courses").update(payload).eq("id", initial.id)
        : await supabase.from("courses").insert(payload);
      if (error) throw error;
      toast.success(initial?.id ? "Course updated" : "Course created");
      router.push("/");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Popular, New, Limited" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp Link</FormLabel>
              <FormControl>
                <Input placeholder="https://wa.me/xxxxxxxxxx?text=..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnail_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Create course"}
        </Button>
      </form>
    </Form>
  );
}



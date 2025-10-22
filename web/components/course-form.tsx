"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, ChevronDown } from "lucide-react";

const schema = z.object({
  title: z.string().min(3),
  subtitle: z.string().optional().nullable(),
  price: z.coerce.number().min(0),
  discount_price: z.coerce.number().min(0).optional().nullable(),
  tag: z.string().optional().nullable(),
  category_id: z.string().min(1, "Please select a category"),
  whatsapp_link: z.string().url().optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
});

type Values = z.infer<typeof schema>;

export function CourseForm({ initial }: { initial?: Partial<Values> & { id?: string } }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      subtitle: (initial?.subtitle as string | undefined) ?? "",
      price: (initial?.price as number | undefined) ?? 0,
      discount_price: (initial?.discount_price as number | undefined) ?? 0,
      tag: (initial?.tag as string | undefined) ?? "",
      category_id: (initial?.category_id as string | undefined) ?? "",
      whatsapp_link: (initial?.whatsapp_link as string | undefined) ?? "",
      thumbnail_url: (initial?.thumbnail_url as string | undefined) ?? "",
    },
  });

  // Fetch categories from database - only show the 3 specified categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData, error } = await supabase
          .from('course_categories')
          .select('id, name')
          .eq('is_active', true)
          .in('name', ['Digital Marketing', 'Graphic Designing', 'Freelancing & Growth'])
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          // Fallback to hardcoded categories if database fetch fails
          const fallbackCategories = [
            { id: 'digital-marketing', name: 'Digital Marketing' },
            { id: 'graphic-designing', name: 'Graphic Designing' },
            { id: 'freelancing-growth', name: 'Freelancing & Growth' }
          ];
          setCategories(fallbackCategories);
        } else {
          // Ensure we have the 3 required categories, add them if missing
          const requiredCategories = [
            { id: 'digital-marketing', name: 'Digital Marketing' },
            { id: 'graphic-designing', name: 'Graphic Designing' },
            { id: 'freelancing-growth', name: 'Freelancing & Growth' }
          ];
          
          const existingNames = categoriesData?.map(c => c.name) || [];
          const missingCategories = requiredCategories.filter(req => 
            !existingNames.includes(req.name)
          );
          
          setCategories([...categoriesData, ...missingCategories]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories
        const fallbackCategories = [
          { id: 'digital-marketing', name: 'Digital Marketing' },
          { id: 'graphic-designing', name: 'Graphic Designing' },
          { id: 'freelancing-growth', name: 'Freelancing & Growth' }
        ];
        setCategories(fallbackCategories);
      }
    };

    fetchCategories();
  }, [supabase]);

  // Calculate dropdown position based on available space
  const calculateDropdownPosition = () => {
    if (!dropdownRef.current) return;
    
    const rect = dropdownRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 200; // Approximate height of dropdown with all options
    
    // Check if there's enough space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // If not enough space below but enough space above, position upward
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition('top');
    } else {
      setDropdownPosition('bottom');
    }
  };

  // Close dropdown when clicking outside and recalculate position on scroll/resize
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (isDropdownOpen) {
        calculateDropdownPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize);
    window.addEventListener('resize', handleScrollOrResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isDropdownOpen]);

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      // Create a new category in the database
      const { data: newCategory, error } = await supabase
        .from('course_categories')
        .insert({
          name: newCategoryName.trim(),
          slug: newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'),
          description: `Custom category: ${newCategoryName.trim()}`,
          is_active: true,
          sort_order: 999 // Put custom categories at the end
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        toast.error("Failed to create category");
        return;
      }
      
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName("");
      setShowNewCategoryDialog(false);
      toast.success("New category added!");
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error("Failed to create category");
    }
  };

  async function onSubmit(values: Values) {
    try {
      setSubmitting(true);
      const payload = {
        title: values.title,
        subtitle: values.subtitle || null,
        price: values.price,
        discount_price: values.discount_price ?? null,
        tag: values.tag || null,
        category_id: values.category_id,
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
                <Textarea placeholder="Short description" {...field} value={field.value || ""} />
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
                  <Input type="number" step="1" min="0" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => {
                      if (!isDropdownOpen) {
                        calculateDropdownPosition();
                      }
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                  >
                    <span className={field.value ? "text-foreground" : "text-muted-foreground"}>
                      {field.value ? categories.find(c => c.id === field.value)?.name || "Select a category" : "Select a category"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className={`absolute z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md ${
                      dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}>
                      <div className="p-1">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={() => {
                              field.onChange(category.id);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {category.name}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground text-primary font-medium"
                          onClick={() => {
                            setShowNewCategoryDialog(true);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Category
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Popular, New, Limited" {...field} value={field.value || ""} />
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
                <Input placeholder="https://wa.me/xxxxxxxxxx?text=..." {...field} value={field.value || ""} />
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
                <Input placeholder="https://..." {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Create course"}
        </Button>
      </form>

      {/* New Category Dialog */}
      <Dialog open={showNewCategoryDialog} onOpenChange={setShowNewCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category Name</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewCategoryDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNewCategory}>
                Create Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
}



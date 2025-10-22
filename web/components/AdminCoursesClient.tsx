"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Course = {
  id: string;
  title: string;
  price: number;
  discount_price: number | null;
  tag: string | null;
  category_id: string | null;
};

type AdminCoursesClientProps = {
  courses: Course[];
};

export function AdminCoursesClient({ courses }: AdminCoursesClientProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData, error } = await supabase
          .from('course_categories')
          .select('id, name')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          setCategories(categoriesData || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [supabase]);

  // Helper function to get category name from category_id
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'No Category';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete course");
      }

      toast.success("Course deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course");
    } finally {
      setIsDeleting(false);
      setDeletingCourseId(null);
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto max-w-4xl grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin • Courses</h1>
          <Link href="/admin">
            <Button size="sm">New course</Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {(courses ?? []).map((c) => (
              <div key={c.id} className="flex items-center gap-3 border p-3 rounded">
                <div className="flex-1">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm text-muted-foreground">
                    ₹{c.discount_price ?? c.price} {c.discount_price ? <span className="line-through ml-2">₹{c.price}</span> : null}
                    {c.tag ? <span className="ml-3 text-xs px-2 py-0.5 rounded bg-muted">{c.tag}</span> : null}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Category: <Badge variant="outline" className="text-xs">{getCategoryName(c.category_id)}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/courses/${c.id}`}>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  
                  <Dialog open={deletingCourseId === c.id} onOpenChange={(open) => !open && setDeletingCourseId(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => setDeletingCourseId(c.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Delete Course
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete <strong>"{c.title}"</strong>? This action cannot be undone and will permanently remove the course from the system.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setDeletingCourseId(null)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeleteCourse(c.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete Course"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
            {(!courses || courses.length === 0) ? (
              <p className="text-sm text-muted-foreground">No courses yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

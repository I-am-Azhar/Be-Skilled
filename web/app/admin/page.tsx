import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseForm } from "@/components/course-form";
import AdminAnalytics from "@/components/AdminAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SetupCategories } from "@/components/SetupCategories";

export default async function AdminPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen w-full">
      <Tabs defaultValue="analytics" className="w-full">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-6">
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="courses">Manage Courses</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="analytics" className="mt-0">
          <AdminAnalytics />
        </TabsContent>
        
        <TabsContent value="courses" className="container mx-auto p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Create Course</CardTitle>
              </CardHeader>
              <CardContent>
                <CourseForm />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="setup" className="container mx-auto p-6">
          <div className="mx-auto max-w-2xl">
            <SetupCategories />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}




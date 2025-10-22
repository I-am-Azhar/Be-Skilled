"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Database, CheckCircle, XCircle, Loader2 } from "lucide-react";

export function SetupCategories() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSetupCategories = async () => {
    try {
      setIsLoading(true);
      setResults([]);
      
      const response = await fetch('/api/admin/setup-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
        toast.success(data.message || 'Categories and courses updated successfully!');
      } else {
        toast.error(data.error || 'Failed to setup categories');
      }
    } catch (error) {
      console.error('Error setting up categories:', error);
      toast.error('Failed to setup categories');
    } finally {
      setIsLoading(false);
    }
  };

  const courseUpdates = [
    // Digital Marketing courses
    { title: 'Meta Ads Mastery', category: 'Digital Marketing', tag: 'Paid Advertising' },
    { title: 'Google Ads Mastery', category: 'Digital Marketing', tag: 'Paid Advertising' },
    { title: 'Social Media Marketing Strategy', category: 'Digital Marketing', tag: 'Social Media' },
    { title: 'Content Creation & Branding', category: 'Digital Marketing', tag: 'Content Marketing' },
    { title: 'Reels & Short-Form Video Growth', category: 'Digital Marketing', tag: 'Video Marketing' },
    
    // Graphic Designing courses
    { title: 'Adobe Photoshop for Social Media & Marketing', category: 'Graphic Designing', tag: 'Adobe Tools' },
    { title: 'Canva Design Masterclass', category: 'Graphic Designing', tag: 'Design Tools' },
    { title: 'Motion Graphics', category: 'Graphic Designing', tag: 'Animation' },
    { title: 'CapCut Pro', category: 'Graphic Designing', tag: 'Video Editing' },
    { title: 'CapCut Mastery for Reels & Ads', category: 'Graphic Designing', tag: 'Video Editing' },
    
    // Freelancing & Growth courses
    { title: 'Freelancing with Digital Marketing Skills', category: 'Freelancing & Growth', tag: 'Career Development' },
    { title: 'Portfolio Building & Personal Branding', category: 'Freelancing & Growth', tag: 'Personal Branding' }
  ];

  const getResultStatus = (courseTitle: string) => {
    const result = results.find(r => r.course === courseTitle);
    return result?.status || 'pending';
  };

  const getResultError = (courseTitle: string) => {
    const result = results.find(r => r.course === courseTitle);
    return result?.error;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Setup Categories & Update Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This will create the new categories (Digital Marketing, Graphic Designing, Freelancing & Growth) 
            and update existing courses with appropriate categories and tags.
          </div>
          
          <Button 
            onClick={handleSetupCategories} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Setting up categories...
              </>
            ) : (
              'Setup Categories & Update Courses'
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Update Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {courseUpdates.map((course) => {
                const status = getResultStatus(course.title);
                const error = getResultError(course.title);
                
                return (
                  <div key={course.title} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {course.category} • {course.tag}
                      </div>
                      {error && (
                        <div className="text-sm text-red-600 mt-1">{error}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {status === 'failed' && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      {status === 'pending' && (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>New Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Digital Marketing</Badge>
            <Badge variant="secondary">Graphic Designing</Badge>
            <Badge variant="secondary">Freelancing & Growth</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



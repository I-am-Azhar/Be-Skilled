"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Clock, CheckCircle } from "lucide-react";

export function WhatsAppCommunityCTA() {
  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "15+ Active Communities",
      description: "Join specialized groups for React, Node.js, Python, and more"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "24/7 Support",
      description: "Get help from instructors and peers anytime, anywhere"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Job Placements",
      description: "Exclusive job opportunities shared by our hiring partners"
    }
  ];

  const stats = [
    { label: "Active Members", value: "2,500+" },
    { label: "Daily Messages", value: "500+" },
    { label: "Jobs Posted", value: "50+" }
  ];

  return (
    <div className="w-full py-16 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-3xl">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <MessageCircle className="w-3 h-3 mr-1" />
                WhatsApp Communities
              </Badge>
              
              <h2 className="text-4xl font-bold">
                Join India&apos;s Largest Developer Community
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Connect with 2,500+ developers, get instant help, share projects, 
                and land your dream job. All through WhatsApp groups.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-5 h-5 mr-2" />
                Join WhatsApp Community
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative hidden md:block">
            <Card className="p-6 bg-white dark:bg-gray-900 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">BeSkilled Community</h3>
                    <p className="text-sm text-muted-foreground">2,500+ members online</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      A
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Just landed a job at Google! Thanks to the React course 🎉</p>
                      <p className="text-xs text-muted-foreground mt-1">2:30 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      S
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Can someone help with this error? Getting stuck on useState</p>
                      <p className="text-xs text-muted-foreground mt-1">2:32 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      R
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Check the dependency array in your useEffect. That&apos;s usually the issue!</p>
                      <p className="text-xs text-muted-foreground mt-1">2:33 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      M
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">New job posting: Frontend Developer at Amazon. Apply now!</p>
                      <p className="text-xs text-muted-foreground mt-1">2:35 PM</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>500+ messages today</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
              🚀
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-xl">
              💼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

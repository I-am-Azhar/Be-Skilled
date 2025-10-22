// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Download, CheckCircle, AlertCircle } from "lucide-react";
// // import { cn } from "@/lib/utils";
// import { trackLeadSubmit } from "@/lib/analytics";

// export function LeadMagnet() {
//   const [email, setEmail] = useState("");
//   const [consent, setConsent] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !consent) {
//       setStatus("error");
//       setErrorMessage("Please provide a valid email and accept the terms");
//       return;
//     }

//     setIsLoading(true);
//     setStatus("idle");

//     try {
//       const response = await fetch("/api/leads", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           source: "lead_magnet",
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setStatus("success");
//         setEmail("");
//         setConsent(false);
//         trackLeadSubmit(true);
//       } else {
//         setStatus("error");
//         setErrorMessage(data.error || "Something went wrong");
//         trackLeadSubmit(false, data.error);
//       }
//     } catch {
//       setStatus("error");
//       setErrorMessage("Network error. Please try again.");
//       trackLeadSubmit(false, "Network error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (status === "success") {
//     return (
//       <div className="w-full py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
//         <div className="mx-auto max-w-4xl px-4">
//           <Card className="text-center">
//             <CardContent className="p-8">
//               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold mb-2">Check Your Email!</h3>
//               <p className="text-muted-foreground mb-4">
//                 We&apos;ve sent you the &quot;Complete Web Development Roadmap&quot; guide. 
//                 Don&apos;t forget to check your spam folder.
//               </p>
//               <Button 
//                 onClick={() => setStatus("idle")}
//                 variant="outline"
//               >
//                 Get Another Guide
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
//       <div className="mx-auto max-w-4xl px-4">
//         <Card>
//           <CardHeader className="text-center">
//             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Download className="w-8 h-8 text-primary" />
//             </div>
//             <CardTitle className="text-3xl font-bold">
//               Get Your Free Web Development Roadmap
//             </CardTitle>
//             <CardDescription className="text-lg max-w-2xl mx-auto">
//               Join 10,000+ developers who used this step-by-step guide to land their first job. 
//               Includes project ideas, interview tips, and WhatsApp community access.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="text-lg"
//                   required
//                 />
//               </div>

//               <div className="flex items-start space-x-2">
//                 <Checkbox
//                   id="consent"
//                   checked={consent}
//                   onCheckedChange={(checked) => setConsent(checked as boolean)}
//                   required
//                 />
//                 <Label 
//                   htmlFor="consent" 
//                   className="text-sm text-muted-foreground leading-relaxed"
//                 >
//                   I agree to receive the free guide and occasional updates about new courses and tips. 
//                   You can unsubscribe at any time.
//                 </Label>
//               </div>

//               {status === "error" && (
//                 <div className="flex items-center gap-2 text-red-600 text-sm">
//                   <AlertCircle className="w-4 h-4" />
//                   {errorMessage}
//                 </div>
//               )}

//               <Button 
//                 type="submit" 
//                 size="lg" 
//                 className="w-full text-lg"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   "Sending Guide..."
//                 ) : (
//                   <>
//                     <Download className="w-5 h-5 mr-2" />
//                     Get Free Guide Now
//                   </>
//                 )}
//               </Button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-muted-foreground">
//                 🔒 We respect your privacy. No spam, ever.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

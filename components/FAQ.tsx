"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much do the courses cost?",
    answer: "Our courses range from ₹299 to ₹2,999. We also offer bundle deals and seasonal discounts. Check our pricing page for current offers and use code WELCOME10 for 10% off your first purchase."
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer: "Yes! You'll receive a verified certificate of completion for each course you finish. These certificates are recognized by industry professionals and can be shared on LinkedIn and your resume."
  },
  {
    question: "How long do I have access to the course materials?",
    answer: "You get lifetime access to all course materials, including video lessons, code files, and resources. You can learn at your own pace and revisit the content anytime."
  },
  {
    question: "What kind of support do you provide?",
    answer: "We provide 24/7 support through our WhatsApp communities. You'll get instant help from instructors and fellow students. We also offer weekly live Q&A sessions and code review sessions."
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If you're not satisfied with the course content or teaching quality, you can request a full refund within 30 days of purchase, no questions asked."
  },
  {
    question: "Are the courses suitable for beginners?",
    answer: "Absolutely! Our courses are designed for all skill levels. We start with fundamentals and gradually progress to advanced topics. Each course includes prerequisites and learning paths to guide you."
  },
  {
    question: "How do I join the WhatsApp communities?",
    answer: "After purchasing a course, you'll receive an invitation link to join the relevant WhatsApp community. You can also join our general developer community by signing up for our newsletter."
  },
  {
    question: "Do you offer job placement assistance?",
    answer: "Yes! We have partnerships with 50+ companies and regularly share job opportunities in our WhatsApp communities. We also provide resume review, interview preparation, and career guidance sessions."
  }
];

export function FAQ() {
  return (
    <div className="w-full py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. Find everything you need to know about our courses and community.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions? We&apos;re here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@beskilled.com" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
            >
              Email Support
            </a>
            <a 
              href="https://wa.me/919876543210" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

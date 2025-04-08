"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "What is PropCloud.io?",
      answer:
        "PropCloud.io is an autonomous property management platform for short-term rental hosts. We automate sales, operations, and guest communications to help hosts save time and increase revenue.",
    },
    {
      question: "How does the waitlist work?",
      answer:
        "Join our waitlist by submitting your email. You'll receive a confirmation with your position in line. As we roll out access, we'll invite users in the order they joined, with priority given to property managers with multiple listings.",
    },
    {
      question: "How much does PropCloud.io cost?",
      answer:
        "We offer tiered pricing based on the number of properties you manage, with volume discounts available for larger portfolios. Detailed pricing will be announced at launch.",
    },
    {
      question: "Which booking platforms do you integrate with?",
      answer:
        "We integrate with all major OTAs including Airbnb, Booking.com, Vrbo, Expedia, and more. We also provide a direct booking engine for your website.",
    },
    {
      question: "Can I import my existing properties?",
      answer:
        "Yes, PropCloud.io makes it easy to import your properties from other platforms. You can connect your accounts or manually add properties with our streamlined onboarding process.",
    },
    {
      question: "How does the AI messaging work?",
      answer:
        "Our AI system handles routine guest inquiries automatically, using natural language processing to understand and respond appropriately. You can customize response templates and set rules for when human intervention is needed.",
    },
    {
      question: "Is PropCloud.io suitable for my property management business?",
      answer:
        "PropCloud.io is designed for property managers handling 5-50 properties who want to scale efficiently. Whether you manage urban apartments or vacation homes, our platform adapts to your specific needs.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We take security seriously. PropCloud.io uses enterprise-grade encryption, secure authentication, and follows industry best practices for data protection. Your data is backed up regularly and stored securely in the cloud.",
    },
  ]

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          Everything you need to know about PropCloud.io
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

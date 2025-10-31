import SpotlightCard from "@/components/SpotlightCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Tech Corp",
    avatar: "SJ",
    rating: 5,
    comment: "Kabat Jobs truly changed my career! Found my dream position within 2 weeks. The platform is intuitive and the job matches are incredibly accurate.",
    date: "2 months ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "Innovate Inc",
    avatar: "MC",
    rating: 5,
    comment: "Best job search platform I've ever used. The AI matching is spot-on and saved me so much time. Highly recommend to anyone job hunting!",
    date: "1 month ago",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Design Studio",
    avatar: "ER",
    rating: 5,
    comment: "I was skeptical at first, but Kabat Jobs exceeded my expectations. The process was smooth, and I connected with amazing companies. Thank you!",
    date: "3 weeks ago",
  },
];

const faqs = [
  {
    id: 1,
    question: "How does Kabat Jobs match me with relevant job opportunities?",
    answer: "Kabat Jobs uses advanced AI technology to analyze your skills, experience, and preferences. Our intelligent matching system reviews your profile, work history, and career goals to recommend positions that align perfectly with your expertise and aspirations. The more complete your profile, the more accurate our matches become."
  },
  {
    id: 2,
    question: "Is Kabat Jobs free to use for job seekers?",
    answer: "Yes! Kabat Jobs offers a completely free tier for job seekers with access to thousands of job listings, AI-powered matching, and application tools. We also offer premium plans with additional features like priority application reviews, personalized career coaching, and insider insights from companies."
  },
  {
    id: 3,
    question: "How long does it typically take to find a job through Kabat Jobs?",
    answer: "The timeline varies depending on your industry, experience level, and job market conditions. On average, our users find suitable positions within 2-8 weeks. Our AI matching system significantly reduces this time by connecting you with the right opportunities faster than traditional job boards."
  },
  {
    id: 4,
    question: "Can I upload my resume and apply directly through Kabat Jobs?",
    answer: "Absolutely! You can upload and store multiple resume versions on Kabat Jobs. Our platform allows you to apply directly to job postings with just one click. We also provide resume optimization suggestions to help you stand out to employers."
  },
  {
    id: 5,
    question: "What types of companies and positions are available on Kabat Jobs?",
    answer: "Kabat Jobs partners with thousands of companies ranging from startups to Fortune 500 organizations across all industries. Whether you're looking for full-time, part-time, contract, or remote positions, we have opportunities for professionals at every career stage - from entry-level to executive roles."
  }
];

const Reviews = () => {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-full bg-gray-900 shadow-[0_-5px_60px_0_rgba(59,130,246,0.6)] overflow-hidden py-20 px-8">
        {/* Customer Reviews Section */}
        <div className="flex justify-center mb-16">
          <p className="text-secondary text-5xl font-semibold tracking-tight font-poppins">
            Customer Reviews
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4 mb-20">
          {reviews.map((review) => (
            <SpotlightCard
              key={review.id}
              className="
                custom-spotlight-card p-8 flex flex-col 
                rounded-2xl bg-gray-800/70 border border-gray-700 
                hover:scale-[1.03] transition-all duration-300 backdrop-blur-md
                h-full
              "
            >
              {/* Header dengan avatar dan rating */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{review.name}</h4>
                    <p className="text-gray-400 text-sm">{review.role}</p>
                    <p className="text-gray-500 text-xs">{review.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="text-white text-lg font-semibold">{review.rating}</span>
                </div>
              </div>

              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-300 text-base leading-relaxed mb-6 flex-grow">
                "{review.comment}"
              </p>

              {/* Footer */}
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-500 text-xs italic">{review.date}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full max-w-4xl h-px bg-gray-700 mb-16"></div>

        {/* FAQ Section */}
        <div className="flex justify-center mb-12">
          <p className="text-secondary text-5xl font-semibold tracking-tight font-poppins">
            Frequently Asked Questions
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="relative z-20 w-full max-w-4xl px-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={`item-${faq.id}`}
                className="border-gray-700 rounded-lg mb-4 bg-gray-800/50 border backdrop-blur-md hover:bg-gray-800/70 transition-colors"
              >
                <AccordionTrigger className="text-white font-semibold px-6 py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 px-6 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Gradient overlay bawah */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
};

export default Reviews;
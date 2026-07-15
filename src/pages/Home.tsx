import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { Check, Star, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  const testimonials = [
    {
      quote: "SHIVIL AI completely streamlined our grading and registration portals. Tasks that used to take faculty hours are completed in seconds using simple search commands.",
      author: "Dr. Sarah Jenkins",
      role: "Dean of Computer Science",
      org: "Apex Tech University",
      rating: 5
    },
    {
      quote: "The interface is gorgeous and ultra-responsive. Our students immediately adapted to it. It feels like Stripe met Linear and built an education operating system.",
      author: "Marcus Vance",
      role: "VP of Operations",
      org: "Nexus Global Academy",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter Campus",
      price: "$1,499",
      period: "month",
      desc: "For regional colleges looking to modernise academic registries.",
      features: [
        "Up to 2,000 active students",
        "Standard student/faculty managers",
        "Attendance shortage logs",
        "Email support response < 24h",
        "Local database backups"
      ],
      cta: "Launch Trial",
      popular: false
    },
    {
      name: "Enterprise University",
      price: "$4,999",
      period: "month",
      desc: "For leading research universities requiring advanced NLP insights.",
      features: [
        "Unlimited students & faculty logs",
        "Autonomous AI Assistant interface",
        "Predictive grade curve analytics",
        "Automated notice & draft builders",
        "Dedicated SLA support manager",
        "Custom API ledger endpoints"
      ],
      cta: "Contact Sales",
      popular: true
    }
  ];

  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 flex flex-col justify-between">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />

        {/* Testimonials */}
        <section className="py-20 bg-[#050814] relative border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-purple-400 font-bold">Endorsements</h2>
              <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Trusted by Progressive Educators
              </p>
              <p className="text-slate-400 text-sm">
                Hear from leading deans and operations directors who upgraded from legacy systems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t, idx) => (
                <div 
                  key={idx}
                  className="p-8 rounded-3xl border border-white/5 bg-slate-900/10 backdrop-blur-md flex flex-col justify-between space-y-6 relative hover:border-slate-800 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-slate-300 italic text-sm leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-900">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-none">{t.author}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{t.role}, <span className="text-slate-400">{t.org}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-xs uppercase tracking-widest text-blue-400 font-bold">Pricing Models</h2>
              <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Predictable SaaS Plans for Any Size
              </p>
              <p className="text-slate-400 text-sm">
                No hidden setup costs. Complete pricing designed to scale cleanly with student volume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan, idx) => (
                <div 
                  key={idx}
                  className={`p-8 md:p-10 rounded-[2rem] border backdrop-blur-md flex flex-col justify-between relative hover:scale-[1.01] transition-transform ${
                    plan.popular 
                      ? "border-blue-500/40 bg-blue-950/5 shadow-[0_0_50px_rgba(59,130,246,0.1)]" 
                      : "border-white/5 bg-slate-900/10"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute top-4 right-4 bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full">
                      Most Active
                    </span>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{plan.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-1 text-white">
                      <span className="text-4xl font-extrabold tracking-tight font-mono">{plan.price}</span>
                      <span className="text-sm text-slate-500">/{plan.period}</span>
                    </div>

                    <ul className="space-y-3.5 border-t border-slate-900 pt-6">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                            <Check size={12} className="text-blue-400" />
                          </div>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    to="/login"
                    className={`w-full py-3 rounded-2xl font-semibold text-center text-xs transition-all duration-300 mt-8 ${
                      plan.popular 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25" 
                        : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
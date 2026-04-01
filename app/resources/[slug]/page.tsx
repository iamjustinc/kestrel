import Link from "next/link"
import { notFound } from "next/navigation"

const articles: Record<
  string,
  {
    title: string
    intro: string
    sections: { heading: string; body: string[] }[]
  }
> = {
  "break-into-pm": {
    title: "How to break into product management",
    intro:
      "Breaking into product management is less about already having the title and more about showing that you can think in terms of problems, priorities, tradeoffs, and outcomes.",
    sections: [
      {
        heading: "Start with proof, not labels",
        body: [
          "A lot of people get stuck because they think they need official PM experience before applying. What actually matters is whether your past work already shows PM-like thinking.",
          "If you have ever identified a user problem, organized messy information, aligned people around a plan, or made decisions based on impact, you already have material you can work with.",
        ],
      },
      {
        heading: "Translate your experience into product language",
        body: [
          "Instead of describing tasks, describe the problem you were solving, the decision you made, and the outcome that followed.",
          "Hiring managers want to see how you think. They are looking for evidence that you can prioritize, communicate clearly, and connect work to results.",
        ],
      },
      {
        heading: "Build signal deliberately",
        body: [
          "You do not need ten side projects. You need a few strong examples that show structured thinking.",
          "A good portfolio project, product critique, roadmap exercise, or case writeup can go much further than vague claims that you are passionate about product.",
        ],
      },
    ],
  },

  "what-hiring-managers-look-for": {
    title: "What hiring managers actually look for",
    intro:
      "Most hiring managers are not just reading for qualifications. They are scanning for signal. They want to know whether you understand the role, whether your experience is relevant, and whether you can create confidence quickly.",
    sections: [
      {
        heading: "Clear relevance",
        body: [
          "The fastest way to lose attention is to make the reviewer do translation work for you.",
          "Your resume and portfolio should make it obvious why your background fits the role, even if your exact title has been different.",
        ],
      },
      {
        heading: "Evidence over effort",
        body: [
          "Hiring managers do not reward effort alone. They care about outcomes, ownership, and judgment.",
          "That means strong bullets usually explain what changed because of your work, not just what you were responsible for.",
        ],
      },
      {
        heading: "Communication and prioritization",
        body: [
          "A lot of candidates seem smart. Fewer candidates seem organized, focused, and easy to trust.",
          "That is why clarity matters so much. Strong candidates reduce noise and make their strongest evidence easy to spot.",
        ],
      },
    ],
  },

  "portfolio-that-gets-interviews": {
    title: "Building a portfolio that gets interviews",
    intro:
      "A portfolio works when it helps someone quickly understand how you think, what you can do, and why your work matters.",
    sections: [
      {
        heading: "Do not just show deliverables",
        body: [
          "A screenshot alone is rarely persuasive. The stronger move is to explain the context, the problem, the choices you made, and the result.",
          "The point is not to show that you made something. The point is to show that you made good decisions.",
        ],
      },
      {
        heading: "Focus on signal",
        body: [
          "A strong portfolio usually has fewer, better projects. Each one should have a clear takeaway.",
          "What skill does this project prove? What kind of role does it support? Why should a recruiter remember it?",
        ],
      },
      {
        heading: "Make it easy to scan",
        body: [
          "Good portfolios are not dense. They guide the reader.",
          "Use clean structure, clear headings, and short explanations that bring attention to your strongest thinking.",
        ],
      },
    ],
  },

  "understanding-role-readiness": {
    title: "Understanding role readiness",
    intro:
      "Role readiness is not the same thing as being perfect. It is about understanding how closely your current experience matches what a target role actually demands.",
    sections: [
      {
        heading: "Readiness is about gaps and strengths",
        body: [
          "A useful readiness assessment does two things at once. It identifies where you are already strong and where you still need more evidence.",
          "That makes it easier to move strategically instead of applying randomly.",
        ],
      },
      {
        heading: "Not every gap matters equally",
        body: [
          "Some missing pieces are critical and some are minor. The goal is not to fix everything at once.",
          "The goal is to identify which gaps most affect your fit and then work on those first.",
        ],
      },
      {
        heading: "Use readiness to choose next steps",
        body: [
          "Once you know your strongest gaps, you can make smarter decisions about projects, resume edits, interview prep, and where to spend your time.",
          "That is what turns vague ambition into a real roadmap.",
        ],
      },
    ],
  },
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = articles[slug]

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F6F1E7] px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <Link href="/resources" className="text-sm text-[#6B6F8E] hover:text-[#3C4166]">
          ← Back to resources
        </Link>

        <article className="mt-8 rounded-[2rem] border border-[#3C4166]/10 bg-white/75 p-8 backdrop-blur-sm sm:p-10">
          <h1 className="text-3xl font-semibold leading-tight text-[#3C4166] sm:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-[#6B6F8E]">
            {article.intro}
          </p>

          <div className="mt-10 space-y-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold text-[#3C4166]">
                  {section.heading}
                </h2>

                <div className="mt-3 space-y-4">
                  {section.body.map((paragraph, index) => (
                    <p key={index} className="text-[17px] leading-relaxed text-[#6B6F8E]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[#A8D0D0] bg-[#F8FCFC] p-6">
            <h3 className="text-lg font-semibold text-[#3C4166]">
              Ready to see where you stand?
            </h3>
            <p className="mt-2 text-[#6B6F8E]">
              Use Kestrel to analyze your role readiness and turn gaps into next steps.
            </p>

            <div className="mt-5">
              <Link href="/sign-up">
                <button className="rounded-full bg-[#4FA7A7] px-6 py-3 font-medium text-white transition hover:bg-[#4FA7A7]/90">
                  Start free analysis
                </button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
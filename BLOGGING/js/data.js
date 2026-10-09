/**
 * InkSpace - Default Sample Data
 * 9 high-quality, realistic editorial blog articles across diverse categories.
 */

const CATEGORIES = [
  { id: 'all', name: 'All Categories', count: 9 },
  { id: 'Technology', name: 'Technology', count: 2, description: 'Artificial intelligence, cloud systems, and cutting-edge hardware breakthroughs.' },
  { id: 'Programming', name: 'Programming', count: 2, description: 'Modern software engineering, clean code principles, and frontend crafts.' },
  { id: 'Productivity', name: 'Productivity', count: 2, description: 'Deep work, cognitive systems, and sustainable habits for knowledge workers.' },
  { id: 'Design', name: 'Design', count: 1, description: 'UI/UX systems, visual hierarchy, typography, and human-centric interaction.' },
  { id: 'Cybersecurity', name: 'Cybersecurity', count: 1, description: 'Zero-trust architecture, privacy rights, and safeguarding digital infrastructure.' },
  { id: 'Travel', name: 'Travel', count: 1, description: 'Slow journeys, cultural immersion, and discovering untamed corners of the world.' }
];

const INITIAL_BLOGS = [
  {
    id: "blog-001",
    title: "The Future of Artificial Intelligence: Beyond Large Language Models",
    slug: "future-of-artificial-intelligence-beyond-llms",
    category: "Technology",
    author: "Elena Rostova",
    authorBio: "Senior AI Researcher and Technology Columnist based in Zurich. Writing on neural dynamics and autonomous agent architectures.",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    date: "2026-10-02",
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80",
    excerpt: "As token-prediction models approach their fundamental physical scaling limits, researchers are pioneering neuro-symbolic systems, spatial reasoning, and continuous cognitive state loops.",
    content: `
      <p>The generative AI revolution transformed software over the past four years, but an undeniable architectural plateau is taking shape. While autoregressive transformers excel at predicting subsequent tokens across vast linguistic corpora, true generalized intelligence demands more than statistical extrapolation.</p>

      <h2>The Limits of Brute-Force Scaling</h2>
      <p>Compute clusters consuming megawatts to shave fractional percentage points off benchmark tests have revealed diminishing returns. True semantic comprehension requires an internal world model—a structure capable of maintaining physical causality, spatial reasoning, and dynamic hypothesis evaluation under conditions of extreme uncertainty.</p>

      <blockquote>
        "Intelligence is not merely remembering what language looked like in the past; it is the capacity to synthesize novel causal models of what has never occurred before."
      </blockquote>

      <h2>The Rise of Neuro-Symbolic Synthesis</h2>
      <p>The next frontier is the unification of connectionist neural networks with deterministic symbolic engines. By marrying the fluid pattern recognition of transformers with rigorous formal logic systems, researchers can construct agents capable of mathematical verification and auditable reasoning pathways.</p>

      <h3>Key Structural Shifts Underway</h3>
      <ul>
        <li><strong>Continuous Memory State Spaces:</strong> Moving beyond fixed context windows toward dynamic, associative long-term knowledge graphs.</li>
        <li><strong>Embodied Spatial Priors:</strong> Grounding machine comprehension in three-dimensional physical constraints rather than isolated text strings.</li>
        <li><strong>Deterministic Verifiers:</strong> Automated theorem provers acting as guardrails during runtime generation.</li>
      </ul>

      <p>As we transition into this next epoch, the emphasis shifts away from sheer parameter counts toward architectural elegance, verifiable provenance, and thermodynamic efficiency.</p>
    `,
    tags: ["Artificial Intelligence", "Deep Learning", "Future Tech", "Neural Networks"],
    featured: true,
    likes: 142,
    views: 1240,
    status: "published"
  },
  {
    id: "blog-002",
    title: "Why Every Developer Should Master Vanilla JavaScript First",
    slug: "master-vanilla-javascript-first",
    category: "Programming",
    author: "Marcus Chen",
    authorBio: "Staff Frontend Architect and open-source contributor. Advocate for minimalist web tooling and web platform standards.",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-28",
    readingTime: 5,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Modern frameworks come and go with startling frequency, but the foundational mechanics of the Document Object Model, event loops, and prototypes remain perpetual superpowers.",
    content: `
      <p>In modern web engineering, new developers are often plunged straight into complex component meta-frameworks before they understand how the browser parses an HTML document or dispatches a simple keyboard event. This inversion of learning creates brittle engineers dependent on abstractions they cannot troubleshoot.</p>

      <h2>The Cost of Abstracting the Browser</h2>
      <p>When you understand the native Web APIs—the MutationObserver, the IntersectionObserver, custom events, and the event loop queue—you stop fighting your tools. Frameworks become optional delivery mechanisms rather than mystical black boxes.</p>

      <blockquote>
        "Frameworks change with the season; standards evolve over decades. Invest your cognitive capital where the returns compound indefinitely."
      </blockquote>

      <h2>What True Fluency Looks Like</h2>
      <p>Mastering Vanilla JavaScript isn't about avoiding tooling out of dogmatism; it's about possessing the architectural diagnostic acuity to solve hard performance problems:</p>

      <ul>
        <li><strong>Understanding Memory Leaks:</strong> Knowing how closures and detached DOM nodes retain memory in V8.</li>
        <li><strong>Event Delegation:</strong> Handling thousands of interactive elements with a single listener on an ancestor container.</li>
        <li><strong>Layout Thrashing:</strong> Discerning read and write operations that trigger costly browser reflows.</li>
      </ul>

      <p>Take the time to build a project from scratch with nothing but an index.html file, clean CSS variables, and modern JavaScript modules. You will emerge with clarity that no framework tutorial can provide.</p>
    `,
    tags: ["JavaScript", "Web Development", "Frontend", "Software Engineering"],
    featured: false,
    likes: 98,
    views: 890,
    status: "published"
  },
  {
    id: "blog-003",
    title: "Building Atomic Habits in an Age of Hyper-Distraction",
    slug: "building-atomic-habits-in-hyper-distraction",
    category: "Productivity",
    author: "Dr. Sarah Jenkins",
    authorBio: "Cognitive psychologist and author exploring focus restoration and behavior design in digital work environments.",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-24",
    readingTime: 4,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Willpower is a depletable biological reserve. Sustainable personal momentum is engineered not through sheer discipline, but through intentional environmental scaffolding.",
    content: `
      <p>The modern professional environment is engineered for interruption. High-frequency notification chimes, infinite algorithmic timelines, and fragmented workflows fragment attention into micro-intervals. Surviving this landscape requires shifting from willpower to deliberate environmental design.</p>

      <h2>The Myth of Iron Willpower</h2>
      <p>Behavioral research consistently demonstrates that high performers do not possess superhuman self-control; they simply encounter fewer temptations. They design their friction points so that the desirable action is the path of least biological resistance.</p>

      <blockquote>
        "You do not rise to the level of your ambitions; you fall to the operational level of your daily systems."
      </blockquote>

      <h2>Designing Friction Asymmetrically</h2>
      <p>To establish durable routines, manipulate kinetic resistance:</p>

      <ul>
        <li><strong>Make Bad Habits Hard:</strong> Put physical obstacles between impulse and execution. Log out of social apps every session.</li>
        <li><strong>Habit Stacking:</strong> Anchor the new behavior directly to an ingrained neurological trigger (e.g., "After pouring my morning coffee, I will write 200 words").</li>
        <li><strong>The Two-Minute Threshold:</strong> Scale any prospective ritual down until it feels almost laughably simple to execute.</li>
      </ul>

      <p>Small, consistent increments compound imperceptibly until their cumulative momentum becomes an undeniable force.</p>
    `,
    tags: ["Habits", "Productivity", "Psychology", "Focus"],
    featured: false,
    likes: 112,
    views: 1105,
    status: "published"
  },
  {
    id: "blog-004",
    title: "Designing Better Digital Experiences: Principles of Human-Centric UI",
    slug: "designing-better-digital-experiences-human-centric-ui",
    category: "Design",
    author: "Julian Vance",
    authorBio: "Design Director with 12 years of experience crafting editorial interfaces, typography systems, and accessible design languages.",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-20",
    readingTime: 5,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80",
    excerpt: "True luxury in software design is quietness. In an era overwhelmed by visual noise and gaudy animations, clarity, hierarchy, and typographic restraint reign supreme.",
    content: `
      <p>For the past few years, interface design fell victim to an obsession with novelty over utility. Endless glassmorphic blurs, neon gradients, and hyperactive micro-interactions competed for ocular dominance. The pendulum is now swinging decisively back toward editorial composure.</p>

      <h2>The Principle of Visual Equilibrium</h2>
      <p>Great digital design behaves like an invisible butler. It presents information with effortless cadence, anticipates user intent without intrusion, and retreats gracefully into the periphery when its presence is no longer needed.</p>

      <blockquote>
        "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."
      </blockquote>

      <h2>Key Pillars of Modern Editorial UI</h2>
      <ul>
        <li><strong>Hierarchical Typography:</strong> Using scale, weight, and line-height deliberately so readers can parse structural logic at a glance.</li>
        <li><strong>Generous Spatial Breathing Room:</strong> White space is not empty void; it is the structural scaffolding that lets content resonate.</li>
        <li><strong>Purposeful Micro-interactions:</strong> Animations must provide physical feedback for state changes, never mere gratuitous decoration.</li>
      </ul>

      <p>When you respect the user's attention, your product immediately communicates respect, maturity, and enduring craftsmanship.</p>
    `,
    tags: ["UI/UX", "Design", "Typography", "Minimalism"],
    featured: true,
    likes: 230,
    views: 1840,
    status: "published"
  },
  {
    id: "blog-005",
    title: "Cybersecurity in an Interconnected World: Safeguarding Personal Privacy",
    slug: "cybersecurity-safeguarding-personal-privacy",
    category: "Cybersecurity",
    author: "Elena Rostova",
    authorBio: "Senior AI Researcher and Technology Columnist based in Zurich. Writing on neural dynamics and autonomous agent architectures.",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-15",
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Personal threat modeling is no longer paranoia—it is basic digital hygiene. Explore passwordless authentication, metadata hygiene, and encrypted enclaves.",
    content: `
      <p>Every digital interaction leaves an indelible footprint. We conduct our financial affairs, intimate correspondences, and professional work across protocols engineered before malicious actors weaponized automated surveillance and credential stuffing.</p>

      <h2>Zero Trust as a Personal Philosophy</h2>
      <p>In enterprise security, the 'Zero Trust' doctrine dictates that no entity—whether inside or outside the local network perimeter—is trusted by default. Applying this mindset to personal workflows dramatically diminishes attack surfaces.</p>

      <blockquote>
        "Privacy is not about having something to hide; it is the fundamental human right to select who has access to your thoughts and habits."
      </blockquote>

      <h2>Actionable Defenses for Everyone</h2>
      <ul>
        <li><strong>Passkeys Over Passwords:</strong> FIDO2-based cryptographic hardware credentials neutralize remote phishing vectors entirely.</li>
        <li><strong>DNS-Level Ad and Tracker Filtering:</strong> Prevent telemetry collectors from correlating your browsing patterns across disparate domains.</li>
        <li><strong>Segmented Identity:</strong> Employ disposable email aliases for non-critical accounts to prevent cross-service database breaches from exposing your primary identity.</li>
      </ul>

      <p>Proactive security is not a one-time configuration; it is an ongoing awareness of where your credentials flow and who retains authority over them.</p>
    `,
    tags: ["Cybersecurity", "Privacy", "Zero Trust", "Tech Safety"],
    featured: false,
    likes: 85,
    views: 740,
    status: "published"
  },
  {
    id: "blog-006",
    title: "The Architecture of the Modern Web: Moving Beyond Framework Fatigue",
    slug: "architecture-of-the-modern-web-beyond-frameworks",
    category: "Programming",
    author: "Marcus Chen",
    authorBio: "Staff Frontend Architect and open-source contributor. Advocate for minimalist web tooling and web platform standards.",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-10",
    readingTime: 5,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
    excerpt: "How server components, edge compute, and native browser APIs are converging to create a lighter, faster, and more resilient internet.",
    content: `
      <p>Over the last decade, frontend bundles bloated exponentially. Simple informational websites shipped megabytes of minified JavaScript to render static sentences. Today, a necessary corrective movement is underway.</p>

      <h2>The Renaissance of the Platform</h2>
      <p>Browsers in 2026 feature native capabilities that previously required heavy libraries: CSS container queries, subgrid, native dialog elements, view transitions, and popover APIs. The gap between vanilla capabilities and framework convenience has narrowed dramatically.</p>

      <blockquote>
        "The fastest JavaScript code is the code you never deliver over the wire in the first place."
      </blockquote>

      <h2>Architecting for Resilience</h2>
      <p>Modern engineering teams are discovering that simplicity is the ultimate scalability factor:</p>
      <ul>
        <li><strong>Progressive Enhancement:</strong> Core user flows must remain operational even when cellular connections degrade.</li>
        <li><strong>Island Architecture:</strong> Hydrating only the discrete interactive widgets rather than the entire page DOM.</li>
        <li><strong>Standards-First Development:</strong> Writing code that aligns with W3C specifications rather than proprietary vendor runtimes.</li>
      </ul>

      <p>When you construct applications upon the durable foundations of the web platform, your code outlasts the transient hype cycles of the software industry.</p>
    `,
    tags: ["Web Architecture", "Frontend", "JavaScript", "Standards"],
    featured: false,
    likes: 164,
    views: 1420,
    status: "published"
  },
  {
    id: "blog-007",
    title: "The Psychology of Deep Work and Cognitive Renewal",
    slug: "psychology-of-deep-work-and-cognitive-renewal",
    category: "Productivity",
    author: "Dr. Sarah Jenkins",
    authorBio: "Cognitive psychologist and author exploring focus restoration and behavior design in digital work environments.",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-05",
    readingTime: 4,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80",
    excerpt: "True productivity is not measured in hours spent staring at glowing displays, but in the intensity of uninterrupted cognitive engagement followed by deliberate restorative downtime.",
    content: `
      <p>In our hyper-connected knowledge economy, busyness is frequently conflated with impact. Slack statuses broadcast availability; calendars brim with thirty-minute synchronizations. Yet high-value creative and analytical breakthroughs emerge only during sustained periods of undisturbed immersion.</p>

      <h2>The Cost of Attention Residue</h2>
      <p>Every time you glance at an incoming notification or switch between tasks, a portion of your cognitive capacity remains stranded on the previous context. This 'attention residue' degrades analytical depth and increases mental fatigue.</p>

      <blockquote>
        "Deep work is the superpower of the twenty-first century. Those who cultivate this discipline will thrive in an increasingly fragmented world."
      </blockquote>

      <h2>Establishing Sacred Focus Blocks</h2>
      <ul>
        <li><strong>Bimodal Scheduling:</strong> Protecting inviolable three-hour windows where communication channels are completely severed.</li>
        <li><strong>Active Rest:</strong> Cognitive renewal does not occur while mindlessly doom-scrolling. Engage in non-screen activities—walking, tactile crafts, or silence.</li>
        <li><strong>Shutdown Rituals:</strong> Establishing a crisp psychological boundary that marks the conclusion of the workday and releases working memory.</li>
      </ul>

      <p>Reclaim your cognitive sovereignty by honoring the natural rhythm between intense concentration and deliberate stillness.</p>
    `,
    tags: ["Deep Work", "Mental Health", "Productivity", "Mindfulness"],
    featured: false,
    likes: 120,
    views: 980,
    status: "published"
  },
  {
    id: "blog-008",
    title: "Slow Travel: Discovering Authenticity Beyond the Tourist Trail",
    slug: "slow-travel-authenticity-beyond-tourist-trail",
    category: "Travel",
    author: "Julian Vance",
    authorBio: "Design Director with 12 years of experience crafting editorial interfaces, typography systems, and accessible design languages.",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    date: "2026-08-30",
    readingTime: 5,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Why exchanging breathless checklist vacations for extended stays in quiet villages revitalizes the soul and uncovers genuine cultural connections.",
    content: `
      <p>Modern mass tourism has transformed travel into an exercise in high-velocity consumption. Travelers rush between iconic monuments, queue for synchronized photo opportunities, and return home more exhausted than when they departed.</p>

      <h2>The Antidote: Deep Immersion</h2>
      <p>Slow travel proposes an entirely different relationship with unfamiliar geography. Instead of consuming destinations like fast food, it encourages settling into the local tempo—shopping at neighborhood markets, greeting the same barista every morning, and letting serendipity govern the schedule.</p>

      <blockquote>
        "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes."
      </blockquote>

      <h2>How to Practice Slow Travel</h2>
      <ul>
        <li><strong>Stay in One Place:</strong> Choose a single village or neighborhood for two to four weeks instead of hopping across three countries.</li>
        <li><strong>Learn the Vernacular:</strong> Mastering even fifty basic phrases transforms you from a bystander into a welcomed guest.</li>
        <li><strong>Walk Everywhere:</strong> Foot travel exposes the subtle textures, aromas, and conversations that vehicular transport bypasses entirely.</li>
      </ul>

      <p>When you slow down, the world reveals layers of beauty that no checklist could ever catalog.</p>
    `,
    tags: ["Travel", "Culture", "Slow Living", "Adventure"],
    featured: false,
    likes: 175,
    views: 1390,
    status: "published"
  },
  {
    id: "blog-009",
    title: "The Architecture of Clean Code: Writing for the Future You",
    slug: "architecture-of-clean-code-writing-for-future-you",
    category: "Programming",
    author: "Aakash Keshari",
    authorBio: "Software artisan and writer focused on building elegant, performant frontend architectures with zero dependencies.",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    date: "2026-08-25",
    readingTime: 6,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80",
    excerpt: "Code is read ten times more often than it is written. Practical strategies for crafting transparent interfaces, self-documenting codebases, and maintainable systems.",
    content: `
      <p>Any competent developer can write code that a compiler understands. Extraordinary engineers write code that humans can effortlessly comprehend six months later under high-pressure debugging conditions.</p>

      <h2>The Illusion of Cleverness</h2>
      <p>Early-career developers often fall into the trap of writing dense, hyper-terse expressions to show off language features. True senior craftsmanship is the exact opposite: choosing the most legible, straightforward formulation so that the system's intent leaps off the screen.</p>

      <blockquote>
        "Simplicity is prerequisite for reliability."
      </blockquote>

      <h2>Tenets of Maintainable Systems</h2>
      <ul>
        <li><strong>Descriptive Naming:</strong> Never abbreviate identifiers to save keystrokes. Variable names are your code's primary documentation.</li>
        <li><strong>Single Responsibility:</strong> A function should do one thing, do it cleanly, and do it reliably.</li>
        <li><strong>Defensive Interfaces:</strong> Validate inputs at system boundaries and fail early with actionable error diagnostics.</li>
      </ul>

      <p>Treat your fellow engineers—and your future self—with empathy by making clarity your highest architectural priority.</p>
    `,
    tags: ["Programming", "Clean Code", "Best Practices", "Software Engineering"],
    featured: false,
    likes: 195,
    views: 1610,
    status: "published"
  }
];

// Expose globally
window.CATEGORIES = CATEGORIES;
window.INITIAL_BLOGS = INITIAL_BLOGS;

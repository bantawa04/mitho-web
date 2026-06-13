export interface LegalSection {
  id: string
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface LegalDoc {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

const LOREM_A =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."

const LOREM_B =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const LOREM_C =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."

export const privacyDoc: LegalDoc = {
  title: "Privacy Policy",
  lastUpdated: "January 12, 2026",
  intro:
    "This is placeholder copy for demonstration purposes only. The text below is Lorem ipsum and does not describe any real data practices.",
  sections: [
    {
      id: "introduction",
      heading: "1. Introduction",
      paragraphs: [LOREM_A, LOREM_B],
    },
    {
      id: "information-we-collect",
      heading: "2. Information We Collect",
      paragraphs: [
        LOREM_C,
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt:",
      ],
      bullets: [
        "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.",
        "Consectetur adipisci velit, sed quia non numquam eius modi tempora.",
        "Incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      ],
    },
    {
      id: "how-we-use-it",
      heading: "3. How We Use It",
      paragraphs: [LOREM_B, LOREM_A],
    },
    {
      id: "cookies",
      heading: "4. Cookies",
      paragraphs: [
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
        LOREM_C,
      ],
    },
    {
      id: "sharing",
      heading: "5. Sharing",
      paragraphs: [LOREM_A],
      bullets: [
        "Et harum quidem rerum facilis est et expedita distinctio.",
        "Nam libero tempore, cum soluta nobis est eligendi optio.",
      ],
    },
    {
      id: "your-rights",
      heading: "6. Your Rights",
      paragraphs: [LOREM_B, LOREM_C],
    },
    {
      id: "changes",
      heading: "7. Changes to This Policy",
      paragraphs: [LOREM_A],
    },
    {
      id: "contact",
      heading: "8. Contact Us",
      paragraphs: [
        "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet. Reach our placeholder team at hello@mithocha.com.",
      ],
    },
  ],
}

export const termsDoc: LegalDoc = {
  title: "Terms & Conditions",
  lastUpdated: "January 12, 2026",
  intro:
    "This is placeholder copy for demonstration purposes only. The text below is Lorem ipsum and does not constitute a real legal agreement.",
  sections: [
    {
      id: "acceptance",
      heading: "1. Acceptance of Terms",
      paragraphs: [LOREM_A, LOREM_B],
    },
    {
      id: "use-of-service",
      heading: "2. Use of Service",
      paragraphs: [LOREM_C],
      bullets: [
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit.",
        "Ut enim ad minima veniam, quis nostrum exercitationem ullam.",
      ],
    },
    {
      id: "accounts",
      heading: "3. Accounts",
      paragraphs: [LOREM_B, LOREM_A],
    },
    {
      id: "content-conduct",
      heading: "4. Content & Conduct",
      paragraphs: [
        LOREM_C,
        "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "5. Intellectual Property",
      paragraphs: [LOREM_A],
    },
    {
      id: "disclaimers",
      heading: "6. Disclaimers",
      paragraphs: [LOREM_B, LOREM_C],
    },
    {
      id: "limitation-of-liability",
      heading: "7. Limitation of Liability",
      paragraphs: [LOREM_A],
    },
    {
      id: "governing-law",
      heading: "8. Governing Law",
      paragraphs: [LOREM_C],
    },
    {
      id: "changes",
      heading: "9. Changes to These Terms",
      paragraphs: [LOREM_B],
    },
    {
      id: "contact",
      heading: "10. Contact Us",
      paragraphs: [
        "Quis autem vel eum iure questions can reach our placeholder team at hello@mithocha.com.",
      ],
    },
  ],
}

export const legalDocs = {
  privacy: privacyDoc,
  terms: termsDoc,
} as const

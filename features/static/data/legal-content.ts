export interface LegalLink {
  label: string
  href: string
}

export interface LegalSection {
  id: string
  heading: string
  paragraphs: string[]
  bullets?: string[]
  links?: LegalLink[]
}

export interface LegalDoc {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

export const privacyDoc: LegalDoc = {
  title: "Privacy Policy",
  lastUpdated: "June 14, 2026",
  intro:
    "This Privacy Policy explains how Mitho Cha collects, uses, shares, and protects information when you use our food discovery, review, business listing, and business management services.",
  sections: [
    {
      id: "scope-and-operator",
      heading: "1. Scope and Operator",
      paragraphs: [
        'Mitho Cha ("Mitho Cha", "we", "us", or "our") operates the Mitho Cha website, applications, APIs, and related services. This policy applies when you browse the service, create an account, publish content, submit or claim a business, manage a business listing, or contact us.',
        "This policy does not govern the independent privacy practices of restaurants, cafes, other listed businesses, or third-party services that you choose to visit.",
      ],
    },
    {
      id: "age-requirements",
      heading: "2. Age Requirements",
      paragraphs: [
        "Mitho Cha is not intended for children under 16. You must be at least 16 years old to create an account. If you are 16 or 17, you may use the service only with permission from a parent or legal guardian.",
        "If we reasonably believe an account belongs to a child under 16, we may suspend the account and delete or anonymize its personal information. A parent or guardian may contact us to request review of a child's information.",
      ],
      links: [
        {
          label: "Nepal Act Relating to Children, 2075",
          href: "https://lawcommission.gov.np/content/12933/12933-the-act-relating-to-children/",
        },
      ],
    },
    {
      id: "information-we-collect",
      heading: "3. Information We Collect",
      paragraphs: [
        "The information we collect depends on how you use Mitho Cha. Some information is required to provide the service, while other information is optional.",
      ],
      bullets: [
        "Google account information: when you sign in with Google, we receive information made available through the sign-in flow, such as your name, verified email address, profile image, and stable Google account identifier. We do not receive your Google password.",
        "Profile information: username, display name, avatar, biography, phone number, and address or location details that you choose to provide.",
        "Community activity: reviews, ratings, tips, photographs, public collections, saved collection items, follows, replies, and related activity.",
        "Business listing information: business name, description, phone numbers, email address, website and social links, category, cuisine, hours, amenities, prices, address, map coordinates, and photographs.",
        "Business claim and management information: claimant name, role, business phone and email, PAN/VAT number, verification documents, notes, invitations, memberships, and moderation or approval records.",
        "Technical and security information: session records, IP address, browser or device user agent, request path, request identifier, timestamps, response status, and temporary rate-limit or security records.",
        "Support information: information you send directly to us in a support, privacy, legal, or moderation request. The contact form and newsletter field currently displayed on the site are demo interfaces and do not transmit information to us.",
      ],
    },
    {
      id: "public-information",
      heading: "4. Information Visible to Others",
      paragraphs: [
        "Mitho Cha is a public food discovery and review platform. Information you publish may be indexed by search engines, shared by other users, or viewed by people who do not have an account.",
        "Public profile information may include your display name, username, avatar, biography, follower and following counts, approved reviews, public collections, and public activity. Your account email address, phone number, and private street address are not part of your public customer profile.",
        "Published business listings may display business contact details, address, map location, operating information, photographs, ownership status, and other listing information. Claim documents, PAN/VAT details, claim review notes, and private verification information are restricted to authorized reviewers and are not published as part of the business listing.",
      ],
    },
    {
      id: "how-we-use-information",
      heading: "5. How We Use Information",
      paragraphs: ["We use information to operate, protect, improve, and administer Mitho Cha, including to:"],
      bullets: [
        "Create accounts, authenticate users, maintain sessions, and provide account and business workspace access.",
        "Publish and organize business listings, reviews, collections, profiles, and discovery results.",
        "Review business submissions, verify ownership claims, manage invitations, and support business teams.",
        "Moderate reviews, media, listings, and other content; investigate reports; enforce our Terms; and prevent spam, fraud, abuse, and security incidents.",
        "Send essential service, security, moderation, account, claim, or business-management communications when those communication features are available.",
        "Respond to support, privacy, legal, and rights requests.",
        "Measure aggregate site traffic and performance, diagnose errors, maintain logs, and improve the service.",
        "Comply with applicable law, lawful requests, and obligations necessary to establish, exercise, or defend legal claims.",
      ],
    },
    {
      id: "sharing",
      heading: "6. How We Share Information",
      paragraphs: [
        "We do not sell personal information. We do not use personal information for third-party behavioral advertising.",
        "We may disclose information in the following limited circumstances:",
      ],
      bullets: [
        "Service providers: infrastructure, storage, authentication, maps, analytics, security, and other vendors process information for us under their own terms and privacy commitments. Current providers include Google, Vercel, and Cloudflare.",
        "Authorized personnel: Mitho Cha administrators and moderators may access information when needed to operate the service, review claims, moderate content, provide support, or protect users.",
        "Business teams: authorized owners, managers, or staff may receive information necessary to manage their business workspace, invitations, reviews, and team access. Private claim documents are not made generally available to business teams.",
        "Legal and safety reasons: we may preserve or disclose information when reasonably necessary to comply with law or lawful process, protect rights and safety, investigate abuse, or defend legal claims.",
        "Business transfer: information may be transferred as part of a merger, financing, reorganization, sale of assets, or transfer of the Mitho Cha service, subject to applicable law and continued protection of the information.",
        "At your direction: we may share information when you request or clearly authorize us to do so.",
      ],
      links: [
        { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
        { label: "Vercel Web Analytics Privacy", href: "https://vercel.com/docs/analytics/privacy-policy" },
        { label: "Cloudflare Privacy Policy", href: "https://www.cloudflare.com/privacypolicy/" },
      ],
    },
    {
      id: "cookies-and-analytics",
      heading: "7. Cookies and Analytics",
      paragraphs: [
        "Mitho Cha uses an essential HTTP-only session cookie to keep you signed in. This cookie is not available to ordinary browser scripts and is used for authentication and security. We may also use limited preference cookies, such as remembering whether a navigation panel is open.",
        "Our current Vercel Web Analytics integration is designed to provide anonymized, aggregate traffic information without placing analytics cookies. Google sign-in and Google Maps are third-party services and may process technical information under Google's policies when their components load or you interact with them.",
        "You can block or delete cookies through your browser settings, but blocking the essential session cookie will prevent sign-in and other authenticated features from working.",
      ],
      links: [
        { label: "Google Identity Services", href: "https://developers.google.com/identity/gsi/web/guides/overview" },
        { label: "Google Maps Privacy and Security", href: "https://developers.google.com/maps/security/compliance/security-compliance" },
      ],
    },
    {
      id: "retention-and-deletion",
      heading: "8. Retention and Account Deletion",
      paragraphs: [
        "We retain information for as long as reasonably necessary to provide the service, maintain security and integrity, comply with law, resolve disputes, and enforce agreements. Retention periods vary by the type and purpose of the information.",
      ],
      bullets: [
        "Authentication sessions normally expire after 30 days and may end earlier when you log out, request account deletion, or we revoke a session for security or enforcement reasons.",
        "API error and operational logs that may include an IP address and user agent are normally retained for approximately 30 days.",
        "When you request account deletion, a 30-day cancellation period begins. Your sessions are revoked and your account is marked as pending deletion. Signing in during this period allows you to cancel the request and reactivate the account.",
        "After the cancellation period, we anonymize your customer profile and remove its direct account identifiers. Pending or rejected reviews, collections, follow relationships, public activity records, business memberships, pending invitations you sent, roles, and active sessions are removed or revoked.",
        "Approved reviews and public media attached to them may remain to preserve the integrity and context of business ratings and community discussions. They will no longer identify you through your Mitho Cha profile and will be associated with an anonymized account.",
        "Account deletion may be delayed while you are the only active owner of a business. You must transfer, release, or otherwise resolve that ownership responsibility first.",
        "Business claim documents are private verification assets. We normally attempt to permanently delete them after a claim is approved or rejected. Deletion may be delayed by a technical failure, security investigation, backup lifecycle, legal obligation, or the need to establish or defend a legal claim.",
        "Business listing records may remain after a submitter deletes their account because they describe a public establishment rather than the submitter's personal profile.",
      ],
    },
    {
      id: "your-choices-and-rights",
      heading: "9. Your Choices and Rights",
      paragraphs: [
        "Depending on applicable law and the nature of your request, you may ask us to provide access to information associated with your account, correct inaccurate information, delete or anonymize information, or explain how it is being used. You may also object to certain processing or withdraw a consent where processing depends on that consent.",
        "You can update available profile fields through account settings and can request account deletion through the deletion controls. During the 30-day cancellation period, you can sign in and cancel the request.",
        "To make another privacy request, email hello@mithocha.com from the address associated with your account. We may ask for information reasonably necessary to verify your identity and protect the account. We may deny or limit a request where permitted by law, including when information must be retained for security, legal compliance, public-interest records, or legal claims.",
        "You may raise a complaint with the appropriate authority or seek another remedy available under applicable Nepal law.",
      ],
      links: [
        {
          label: "Nepal Privacy Act, 2075",
          href: "https://lawcommission.gov.np/content/12261/12261-the-privacy-act-2075/",
        },
      ],
    },
    {
      id: "security",
      heading: "10. Security",
      paragraphs: [
        "We use reasonable administrative, technical, and organizational measures intended to protect information, including server-side sessions, HTTP-only cookies, access controls, private storage for claim documents, limited-duration signed links, rate limiting, and encrypted transport where supported.",
        "No online service or storage system can guarantee absolute security. You are responsible for protecting access to your Google account and devices and for notifying us if you believe your Mitho Cha account has been compromised.",
      ],
      links: [
        { label: "Cloudflare R2 Data Security", href: "https://developers.cloudflare.com/r2/reference/data-security/" },
      ],
    },
    {
      id: "international-processing",
      heading: "11. International Processing",
      paragraphs: [
        "Mitho Cha is focused on users and businesses in Nepal, but our service providers may process or store information in other countries. Those countries may have privacy laws different from Nepal's laws.",
        "When we use providers outside Nepal, we rely on their contractual, technical, and organizational safeguards and take reasonable steps appropriate to the nature of the information and applicable law.",
      ],
    },
    {
      id: "third-party-services",
      heading: "12. Third-Party Services",
      paragraphs: [
        "Mitho Cha may contain links to business websites, social networks, map directions, or other third-party services. We do not control their content or privacy practices. Review the relevant third party's terms and privacy policy before providing information to it.",
        "Use of Google Maps features is also subject to Google's applicable terms.",
      ],
      links: [
        { label: "Google Maps/Google Earth Additional Terms", href: "https://maps.google.com/help/terms_maps/" },
      ],
    },
    {
      id: "policy-changes",
      heading: "13. Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy to reflect product, provider, legal, or operational changes. We will update the date at the top of the policy and, when a change materially affects your rights or how we use personal information, provide additional notice through the service or another reasonable channel.",
        "Your continued use of Mitho Cha after the effective date of an updated policy means the updated policy applies to your future use. Where law requires consent for a change, we will request it.",
      ],
    },
    {
      id: "contact",
      heading: "14. Contact Us",
      paragraphs: [
        "For privacy questions, account-data requests, or concerns about this policy, contact Mitho Cha at hello@mithocha.com.",
      ],
      links: [{ label: "Email hello@mithocha.com", href: "mailto:hello@mithocha.com" }],
    },
  ],
}

export const termsDoc: LegalDoc = {
  title: "Terms of Service",
  lastUpdated: "June 14, 2026",
  intro:
    "These Terms of Service govern your access to and use of Mitho Cha's food discovery, review, business listing, and business management services. Please read them carefully.",
  sections: [
    {
      id: "acceptance",
      heading: "1. Acceptance of These Terms",
      paragraphs: [
        'These Terms form an agreement between you and Mitho Cha ("Mitho Cha", "we", "us", or "our"). By accessing or using our website, applications, APIs, or related services, you agree to these Terms and our Privacy Policy.',
        "If you do not agree, do not use the service. If you use Mitho Cha on behalf of a business or organization, you confirm that you have authority to bind it to these Terms.",
      ],
    },
    {
      id: "eligibility-and-accounts",
      heading: "2. Eligibility and Accounts",
      paragraphs: [
        "You must be at least 16 years old to create an account. If you are 16 or 17, you must have permission from a parent or legal guardian. A parent or guardian who permits use is responsible for supervising that use.",
        "Accounts use Google sign-in. You must provide accurate information, use a Google account you are authorized to use, keep access to your Google account and devices secure, and promptly notify us of suspected unauthorized access.",
        "You may not impersonate another person, create an account for someone without permission, share account access in a way that creates security or accountability risks, or evade a suspension. Unless we approve another arrangement, each person should maintain only one personal Mitho Cha account.",
      ],
    },
    {
      id: "service-role",
      heading: "3. What Mitho Cha Provides",
      paragraphs: [
        "Mitho Cha is a discovery, review, listing, and business-management platform. We help users find food businesses and share community information. We are not the restaurant, cafe, food seller, delivery provider, payment processor, employer, or agent of a listed business.",
        "Business details, prices, menus, hours, availability, dietary claims, amenities, and other information can change or be submitted by third parties. We do not guarantee that every listing, review, map location, or other item is complete, current, or error-free. Confirm important information directly with the business before relying on it.",
      ],
    },
    {
      id: "business-listings-and-claims",
      heading: "4. Business Listings and Ownership Claims",
      paragraphs: [
        "When you submit, edit, or claim a business, you must provide truthful, current information and have any authority or permissions needed to submit it. Do not submit private personal contact details as public business information without permission.",
        "Submitting a business does not make you its verified owner and does not grant access to a business workspace. Ownership or management access is granted only after the applicable claim, invitation, membership, and administrator review process.",
      ],
      bullets: [
        "We may verify, edit, combine, reject, suspend, or remove listings to protect accuracy, safety, legal rights, and service quality.",
        "Claimants may be required to provide business contact details, PAN/VAT information, and supporting documents. False documents or misrepresentations may result in rejection, suspension, or legal action.",
        "Verified owners and business team members must keep listing information accurate and protect workspace access.",
        "Businesses remain solely responsible for their products, food safety, licensing, taxes, regulatory compliance, prices, promotions, customer service, employment practices, and transactions with customers.",
        "An account that is the only active owner of a business may need to transfer or release ownership before account deletion can be completed.",
      ],
    },
    {
      id: "reviews-and-conduct",
      heading: "5. Reviews and Community Conduct",
      paragraphs: [
        "Reviews should reflect genuine, relevant experiences and help the community make informed decisions. You are responsible for what you submit.",
        "You must not submit or encourage:",
      ],
      bullets: [
        "Fake, purchased, coordinated, duplicate, retaliatory, or misleading reviews.",
        "Reviews affected by an undisclosed ownership, employment, payment, gift, family, competitor, or other material conflict of interest.",
        "Harassment, bullying, hate, threats, stalking, doxxing, sexual exploitation, or content that creates a credible safety risk.",
        "Impersonation, fraud, unlawful activity, malicious links, spam, scraping, automated abuse, or attempts to manipulate rankings and ratings.",
        "Content that infringes copyright, trademark, privacy, publicity, confidentiality, or another person's rights.",
        "Personal data about another person without a lawful and appropriate reason to share it.",
        "Content that is irrelevant to the business or experience, contains prohibited media, or otherwise undermines the usefulness and safety of the service.",
      ],
    },
    {
      id: "moderation-and-enforcement",
      heading: "6. Moderation and Enforcement",
      paragraphs: [
        "Reviews and other submissions may be held for moderation before publication. We may investigate reports and approve, reject, edit for formatting, restrict, remove, or restore content at our discretion where reasonably necessary to apply these Terms and our moderation standards.",
        "We may warn users, limit features, revoke sessions, suspend or ban accounts, restrict business access, suspend listings, preserve relevant evidence, or refer matters to appropriate authorities. Enforcement may occur without advance notice when needed to address fraud, abuse, security, legal risk, or harm.",
        "Moderation is not a guarantee that all objectionable, inaccurate, or unlawful content will be detected. Users and businesses remain responsible for their own content and conduct.",
      ],
    },
    {
      id: "user-content",
      heading: "7. Your Content and the License You Grant",
      paragraphs: [
        "You retain ownership of reviews, photographs, collection descriptions, business information, replies, and other original content you submit.",
        "By submitting content, you grant Mitho Cha a non-exclusive, worldwide, royalty-free, sublicensable license to host, store, reproduce, resize, crop, format, translate, adapt for technical or editorial presentation, moderate, publish, display, distribute, and promote that content in connection with operating, improving, and marketing Mitho Cha. This license allows us, for example, to show a review on a business page, generate a thumbnail, include public content in discovery features, or promote a Mitho Cha page.",
        "You confirm that you own the content or have all rights, permissions, and releases needed to submit it and grant this license. You also confirm that the content and our permitted use of it will not violate law or another person's rights.",
        "The license ends when content is deleted from our active systems, except to the extent it has been shared by others, is retained in backups or legal records, or must remain for security, integrity, or legal reasons. Approved reviews and their public media may remain under an anonymized author after account deletion to preserve rating and community context.",
      ],
    },
    {
      id: "sponsored-content",
      heading: "8. Sponsored and Featured Placement",
      paragraphs: [
        "Mitho Cha may offer clearly labelled sponsored, promoted, or featured placement for businesses. Payment for placement does not allow a business to purchase positive reviews, remove legitimate criticism, bypass moderation, or receive a guaranteed rating or outcome.",
        "If paid business services are introduced, the applicable price, term, renewal, cancellation, refund, and other commercial conditions will be presented in separate terms before purchase.",
      ],
    },
    {
      id: "intellectual-property",
      heading: "9. Mitho Cha Intellectual Property",
      paragraphs: [
        "The Mitho Cha name, logos, design, software, databases, page layouts, and service content created by us are owned by or licensed to Mitho Cha and are protected by applicable intellectual-property laws.",
        "We give you a limited, revocable, non-exclusive, non-transferable right to access and use the service for its intended purposes. You may not copy, sell, license, reverse engineer, interfere with, or commercially exploit the service except as permitted by law or with our written permission.",
        "If you believe content on Mitho Cha infringes your copyright, trademark, or other rights, send a detailed notice to hello@mithocha.com identifying the protected work, the disputed content and location, your contact details, your basis for the claim, and a statement that the notice is accurate and made in good faith.",
      ],
      links: [{ label: "Email an intellectual-property notice", href: "mailto:hello@mithocha.com" }],
    },
    {
      id: "third-party-services",
      heading: "10. Third-Party Services and Links",
      paragraphs: [
        "The service may use or link to Google sign-in, Google Maps, business websites, social networks, directions, storage, analytics, and other third-party services. Their terms and privacy policies govern your use of their services, and Mitho Cha is not responsible for their content, availability, security, or independent actions.",
        "By using Google Maps features through Mitho Cha, you also agree to be bound by the applicable Google Maps/Google Earth terms.",
      ],
      links: [
        { label: "Google Maps/Google Earth Additional Terms", href: "https://maps.google.com/help/terms_maps/" },
        { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
      ],
    },
    {
      id: "availability-and-changes",
      heading: "11. Service Availability and Changes",
      paragraphs: [
        "We may add, change, suspend, or discontinue features; impose reasonable limits; or restrict access to all or part of the service. We do not promise that Mitho Cha will always be available, uninterrupted, secure, or free from errors.",
        "We may correct or remove information and are not required to preserve every draft, submission, listing, or account indefinitely. You should keep your own copies of content or business records that you need.",
      ],
    },
    {
      id: "disclaimers",
      heading: "12. Disclaimers",
      paragraphs: [
        'To the maximum extent permitted by applicable law, Mitho Cha is provided on an "as is" and "as available" basis. We disclaim implied warranties or conditions of merchantability, fitness for a particular purpose, title, and non-infringement.',
        "Ratings and reviews are opinions of their authors, not statements or endorsements by Mitho Cha. We do not guarantee the identity, authority, conduct, quality, safety, legality, or reliability of a user or listed business.",
        "Food, allergy, dietary, health, price, location, and availability information may be incomplete or inaccurate. Contact the business directly and exercise appropriate judgment, especially for allergies, medical needs, personal safety, and financial decisions.",
      ],
    },
    {
      id: "limitation-of-liability",
      heading: "13. Limitation of Liability",
      paragraphs: [
        "To the maximum extent permitted by applicable law, Mitho Cha and its operators, personnel, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive loss, or for lost profits, revenue, data, reputation, opportunities, or business interruption arising from or related to the service.",
        "Mitho Cha is not responsible for disputes, losses, illness, injury, transactions, or conduct involving a listed business, user, advertiser, or third party. Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited.",
      ],
    },
    {
      id: "indemnity",
      heading: "14. Indemnity",
      paragraphs: [
        "To the extent permitted by law, you agree to defend, indemnify, and hold harmless Mitho Cha and its operators and personnel from claims, damages, liabilities, losses, and reasonable costs arising from your content, your business or commercial activity, your misuse of the service, your breach of these Terms, or your violation of law or another person's rights.",
        "This section does not require you to indemnify Mitho Cha for conduct for which indemnification cannot lawfully be required.",
      ],
    },
    {
      id: "termination-and-deletion",
      heading: "15. Suspension, Termination, and Account Deletion",
      paragraphs: [
        "You may stop using Mitho Cha at any time and may request account deletion through the available account controls. Account deletion is subject to a 30-day cancellation period and any unresolved sole-owner business responsibilities described in our Privacy Policy.",
        "We may suspend or terminate access, revoke business permissions, or remove content when we reasonably believe these Terms have been violated or action is necessary for safety, security, legal compliance, or service integrity.",
        "Provisions that by their nature should survive termination will continue to apply, including provisions concerning licenses for retained content, intellectual property, disclaimers, liability, indemnity, disputes, and miscellaneous terms.",
      ],
    },
    {
      id: "changes-to-terms",
      heading: "16. Changes to These Terms",
      paragraphs: [
        "We may update these Terms as Mitho Cha, our providers, or applicable laws change. We will update the date at the top and provide additional notice when changes are material.",
        "Unless a different effective date is stated, updated Terms apply when published. Continued use after they take effect means you accept them. If you do not agree to an update, you must stop using the service.",
      ],
    },
    {
      id: "governing-law",
      heading: "17. Governing Law and Disputes",
      paragraphs: [
        "These Terms are governed by the laws of Nepal, without regard to conflict-of-law principles.",
        "Before filing a formal claim, you and Mitho Cha agree to make a good-faith effort to resolve the dispute by written notice and discussion for at least 30 days. Send notices to hello@mithocha.com with enough information to understand the issue and requested resolution.",
        "If the dispute is not resolved, it will be submitted to the competent courts located in Kathmandu, Nepal, subject to any mandatory rights or venue rules that applicable law does not allow the parties to change.",
      ],
    },
    {
      id: "miscellaneous",
      heading: "18. Miscellaneous",
      paragraphs: [
        "If a provision of these Terms is found unenforceable, it will be limited or removed only to the minimum extent necessary, and the remaining provisions will continue in effect.",
        "Our failure to enforce a provision is not a waiver. You may not transfer your rights or obligations under these Terms without our written permission. We may transfer these Terms as part of a reorganization, financing, sale, or transfer of the service.",
        "These Terms and the Privacy Policy are the entire agreement between you and Mitho Cha concerning the general use of the service, except where separate written terms apply to a specific feature or purchase.",
      ],
    },
    {
      id: "contact",
      heading: "19. Contact Us",
      paragraphs: [
        "For questions about these Terms, legal notices, or rights complaints, contact Mitho Cha at hello@mithocha.com.",
      ],
      links: [{ label: "Email hello@mithocha.com", href: "mailto:hello@mithocha.com" }],
    },
  ],
}

export const legalDocs = {
  privacy: privacyDoc,
  terms: termsDoc,
} as const

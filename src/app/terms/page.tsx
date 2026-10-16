import type { Metadata } from "next";
import { Document } from "@/components/document";
import { business } from "@/lib/business";

export const metadata: Metadata = { title: "Terms of service · Stilbe" };

/** DRAFT for review by a lawyer before Stilbe launches. */
export default function TermsPage() {
  return (
    <Document title="Terms of service" updated={business.updated}>
      <p>
        These terms are an agreement between you and {business.operator} (&ldquo;we&rdquo;), which runs Stilbe: the Stilbe browser for Mac,
        its AI features, and our AI service, accounts and subscriptions. By using Stilbe you agree to them. If you don&rsquo;t agree, don&rsquo;t
        use Stilbe.
      </p>

      <h2>Stilbe and its AI</h2>
      <p>
        Stilbe is a web browser with an AI agent built in. When you ask, the agent reads pages and acts in your browser on your behalf: it clicks,
        types, fills in forms and moves between tabs, and with screen control turned on it can use your mouse and keyboard in other apps.
      </p>
      <ul>
        <li>
          <strong>You&rsquo;re responsible for what you ask it to do,</strong> and for what it does on your behalf on the sites and apps you use.
          It asks before actions that can&rsquo;t easily be undone (buying, sending, deleting); read those requests before you approve them.
        </li>
        <li>
          <strong>AI makes mistakes.</strong> Its answers, summaries and actions can be wrong or incomplete. Check anything important, and
          don&rsquo;t rely on it for legal, medical, financial or safety decisions.
        </li>
        <li>
          Websites have their own terms. Using the agent on a site doesn&rsquo;t change what that site allows; follow its rules.
        </li>
        <li>
          What you ask the AI to work on is sent to our AI provider to answer you, as the <a href="/privacy">privacy policy</a> explains.
        </li>
      </ul>

      <h2>Accounts</h2>
      <p>
        You can use Stilbe without an account. If you sign in, keep access to your email secure: signing in works through links we send there.
        You&rsquo;re responsible for activity on your account. You must be at least 13, and old enough to agree to these terms where you live.
      </p>

      <h2>Allowances and subscriptions</h2>
      <ul>
        <li>Stilbe comes with a free monthly allowance of AI use. Stilbe Pro raises it, as described on the <a href="/pricing">pricing page</a>.</li>
        <li>
          Pro costs {business.pro.price} a {business.pro.period} plus applicable tax, billed in advance through Stripe, and{" "}
          <strong>renews automatically each month until you cancel</strong>. Cancel any time from Settings → Account → Manage subscription;
          Pro stays on until the end of the month you&rsquo;ve paid for.
        </li>
        <li>Allowances reset each month and don&rsquo;t carry over. Unused allowance isn&rsquo;t refunded.</li>
        <li>
          We may change prices or allowances. We&rsquo;ll tell subscribers by email at least 30 days before a price change, which applies from
          the next billing period; you can cancel before then.
        </li>
        <li>Refunds follow the <a href="/refunds">refund policy</a>.</li>
      </ul>

      <h2>Acceptable use</h2>
      <p>Don&rsquo;t use Stilbe to:</p>
      <ul>
        <li>break the law, or infringe others&rsquo; rights;</li>
        <li>attack, overload or gain unauthorised access to any site, service or account;</li>
        <li>send spam, or collect others&rsquo; personal information without their permission;</li>
        <li>create harmful content, or get around the AI&rsquo;s safety measures;</li>
        <li>get around the allowances, for example by creating installations or accounts to collect more, or reselling access to our AI service.</li>
      </ul>
      <p>We may suspend or end access for anyone who does, and may limit use that threatens the service for others.</p>

      <h2>Your content</h2>
      <p>
        What you ask and the content you give the AI stay yours. You give us permission to process them only as needed to run Stilbe for you.
        The AI&rsquo;s replies are yours to use, subject to the law and others&rsquo; rights.
      </p>

      <h2>Our software</h2>
      <p>
        We license Stilbe to you for personal or business use on your Macs. Don&rsquo;t copy, sell or reverse engineer it except where the law
        allows. Stilbe updates itself to fix problems and add features.
      </p>

      <h2>Disclaimers</h2>
      <p>
        Stilbe is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the extent the law allows, we disclaim all warranties, express
        or implied, including merchantability, fitness for a particular purpose and non-infringement. We don&rsquo;t promise Stilbe will be
        uninterrupted, error-free, or that the AI will be accurate.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, we aren&rsquo;t liable for indirect, incidental, special, consequential or punitive damages, or for lost
        profits, data or goodwill, arising from your use of Stilbe or actions the AI takes for you. Our total liability for any claim is limited to
        what you paid us in the 12 months before it arose, or $50 if more. Some places don&rsquo;t allow these limits, so they may not apply to
        you.
      </p>

      <h2>Ending</h2>
      <p>
        You can stop using Stilbe and cancel any time. We may end or change the service; if we stop providing Pro, we&rsquo;ll refund the unused
        part of any paid period.
      </p>

      <h2>Law and disputes</h2>
      <p>
        These terms are governed by the laws of the State of {business.state}, USA, without regard to conflict of laws rules. Disputes go to the
        state or federal courts in {business.state}, unless the law where you live gives you the right to bring them where you are.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. If a change matters, we&rsquo;ll say so on this page and, if you have an account, by email before it takes
        effect. Using Stilbe after that means you accept them.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${business.email}`}>{business.email}</a>
      </p>

      <p className="note">This is a draft and isn&rsquo;t legal advice; it should be reviewed by a lawyer before Stilbe launches.</p>
    </Document>
  );
}

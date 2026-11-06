import type { Metadata } from "next";
import { Document } from "@/components/document";
import { business } from "@/lib/business";

export const metadata: Metadata = { title: "Privacy policy · Stilbe" };

/**
 * DRAFT for review by a lawyer. Written from what the app and its AI service
 * actually do (see browser/ and server/ in the repo); keep it in step with
 * them when either changes.
 */
export default function PrivacyPage() {
  return (
    <Document title="Privacy policy" updated={business.updated}>
      <p>
        This policy explains what Stilbe, the browser and its AI features, does with your information. Stilbe is run by {business.operator}
        {" "}(&ldquo;we&rdquo;), based in {business.state}, USA. Questions: <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>
      <p>The short version: your browsing stays on your Mac. What you ask the AI to work on is sent to an AI provider to answer you. We don&rsquo;t sell your data, show you ads, or track you.</p>

      <h2>What stays on your Mac</h2>
      <p>
        Your history, bookmarks, open tabs, reading list, downloads, PDF notes, settings and the agent&rsquo;s memory are stored on your Mac and
        aren&rsquo;t sent to us. Saved passwords are kept in your Mac&rsquo;s Keychain and filled in by the browser itself; the AI never
        sees them. Saved addresses are kept on your Mac too; once the agent fills one into a form you asked it to complete, the AI can see
        that form like the rest of the page. Stilbe has no analytics or tracking.
      </p>

      <h2>What&rsquo;s sent when you use the AI</h2>
      <p>
        When you ask the agent to do something, or use AI features such as summarising, explaining or translating a page, what it needs is sent
        through our AI service to our AI provider so it can answer. That can include:
      </p>
      <ul>
        <li>the text of the pages it&rsquo;s working on, and text you&rsquo;ve selected;</li>
        <li>screenshots of the page, when it needs to see something;</li>
        <li>your whole screen, only if you turn on screen control in Settings and approve it for a task;</li>
        <li>files you attach or ask it to read;</li>
        <li>what you type or say to it. Spoken requests are turned into text by Apple&rsquo;s speech recognition on your Mac first, under Apple&rsquo;s privacy policy.</li>
      </ul>
      <p>
        Our AI provider is <strong>DeepSeek</strong>, a company based in China. It processes this content to produce the AI&rsquo;s replies,
        and it may process and store it on servers in China, under{" "}
        <a href="https://cdn.deepseek.com/policies/en-US/deepseek-open-platform-terms-of-service.html">DeepSeek&rsquo;s terms</a> and{" "}
        <a href="https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html">privacy policy</a>. Don&rsquo;t ask the AI to work on
        anything you aren&rsquo;t comfortable sending to it. Our own AI service passes this content through and doesn&rsquo;t keep it.
      </p>

      <h2>What our AI service keeps</h2>
      <ul>
        <li>
          <strong>For each installation of Stilbe:</strong> a random identifier, and how much AI it has used each month, to apply the
          allowance. We also count new installations per network (by IP address) for a day, to prevent abuse.
        </li>
        <li>
          <strong>If you sign in:</strong> your email address, the Macs you&rsquo;re signed in on, and your plan. Sign-in links are stored only
          in a form that can&rsquo;t be used to sign in, and expire after 15 minutes.
        </li>
        <li>
          <strong>If you subscribe:</strong> your Stripe customer and subscription identifiers, and the plan&rsquo;s status.
        </li>
        <li>Short error logs, which can include an identifier but not the content you sent.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Subscriptions are processed by <a href="https://stripe.com/privacy">Stripe</a>. Your card details go to Stripe, not to us. Stripe tells
        us whether your subscription is active; we don&rsquo;t see your card number.
      </p>

      <h2>Other services Stilbe uses</h2>
      <ul>
        <li>Sign-in emails are sent through Resend, which receives your email address to deliver them.</li>
        <li>Our AI service runs on Cloudflare, and this website on Vercel. Like any web host, they handle the requests and IP addresses that reach them.</li>
        <li>If search suggestions are on, what you type in the address bar is sent to your chosen search engine (Google, DuckDuckGo or Bing) to suggest searches. You can turn this off in Settings.</li>
        <li>The ad blocker downloads public filter lists, and Stilbe downloads its updates from GitHub. These downloads don&rsquo;t include your browsing.</li>
        <li>The websites you visit see what any browser sends them, as in any browser.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        Usage counts are kept for the current month. Account and subscription records are kept while you have an account, and afterwards only as
        long as the law requires for tax and accounting. To delete your account, email us from the address you signed in with.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can use Stilbe without an account, and without the AI. You can turn off screen control, the agent&rsquo;s memory and search
        suggestions in Settings. Depending on where you live, you may have the right to access, correct or delete your information, or object to
        how it&rsquo;s used; email us and we&rsquo;ll help.
      </p>

      <h2>Children</h2>
      <p>Stilbe isn&rsquo;t meant for children under 13, and we don&rsquo;t knowingly collect information from them.</p>

      <h2>Changes</h2>
      <p>If this policy changes in a way that matters, we&rsquo;ll say so on this page and, if you have an account, by email.</p>

      <p className="note">This is a draft and isn&rsquo;t legal advice; it should be reviewed by a lawyer before Stilbe launches.</p>
    </Document>
  );
}

// TermsAndConditions.js
import React from "react";
import { getSEO } from "../../constants/seo";

function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-4xl p-6 py-28 text-gray-800 sm:p-10">
      <h1 className="mb-4 text-3xl font-bold">Terms and Conditions</h1>
      <p className="mb-8 text-sm text-gray-500">
        Last updated: 06 November 2024
      </p>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">1. Introduction</h2>
        <p>
          Welcome to Freeluencers. By accessing or using our platform at{" "}
          <a
            className="text-blue-600 hover:underline"
            href="https://freeluencers.com"
          >
            freeluencers.com
          </a>
          , you agree to be bound by these Terms and Conditions, along with our
          Privacy Policy. If you do not agree to these terms, please do not use
          our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">2. Eligibility</h2>
        <p>
          To use Freeluencers, you must be at least 13 years old and have the
          authority to agree to these Terms and Conditions. By registering, you
          confirm that you meet these eligibility requirements.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">3. Account Registration</h2>
        <p>
          When creating an account, you agree to provide accurate and up-to-date
          information. You are responsible for keeping your login credentials
          secure and for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">4. Platform Usage</h2>
        <p>
          Freeluencers provides a platform to facilitate collaborations between
          brands and influencers. You agree to use the platform solely for
          lawful purposes and in accordance with these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">5. User Content</h2>
        <p>
          You retain ownership of any content you post on Freeluencers but grant
          us a non-exclusive license to use, display, and share this content on
          our platform. You are solely responsible for the content you post and
          agree not to post any unlawful, misleading, or infringing material.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">6. Fees and Payments</h2>
        <p>
          Freeluencers is currently available at no cost. However, we reserve
          the right to introduce fees in the future. Users will be notified in
          advance of any changes to our pricing structure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">7. Privacy</h2>
        <p>
          Our Privacy Policy governs how we collect, use, and share your
          personal information. By using Freeluencers, you consent to the
          practices described in our Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">8. Intellectual Property</h2>
        <p>
          All content on Freeluencers, including text, graphics, logos, and
          software, is our property or the property of our licensors and is
          protected by intellectual property laws. You may not reproduce or
          distribute any part of our platform without our permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">9. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at our
          discretion if we determine you have violated these Terms and
          Conditions or engaged in harmful behavior on the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">
          10. Limitation of Liability
        </h2>
        <p>
          Freeluencers is provided "as is" without warranties of any kind. We
          are not liable for any damages or losses arising from your use of the
          platform. This limitation of liability applies to the fullest extent
          permitted by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">11. Changes to Terms</h2>
        <p>
          We may update these Terms and Conditions periodically. By continuing
          to use Freeluencers after any changes, you accept the revised terms.
          We encourage you to review this page regularly for updates.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">12. Contact Us</h2>
        <p>
          If you have any questions or concerns about these Terms and
          Conditions, please contact us at{" "}
          <a
            className="text-blue-600 hover:underline"
            href="mailto:support@freeluencers.com"
          >
            abhinaypandey02@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}

export default TermsAndConditions;
export const metadata = getSEO("Terms and Conditions");
import { getRoute } from "../constants/routes";

export const NAVBAR_COMMON_ROUTES = [
  { label: "Home", href: getRoute("Home") },
  { label: "Search", href: getRoute("Search") },
  { label: "Collaborations", href: getRoute("Postings") },
  { label: "FAQ", href: "/#faq" },
];

export const UNAUTHORISED_NAVBAR_SECTIONS = {
  primaryLinks: NAVBAR_COMMON_ROUTES,
  secondaryLinks: [
    {
      label: "Sign In",
      href: getRoute("Login"),
    },
  ],
  cta: {
    button: {
      children: "Join Us",
    },
    href: getRoute("SignUp"),
  },
};
export const AUTHORISED_USER_NAVBAR_SECTIONS = {
  primaryLinks: NAVBAR_COMMON_ROUTES,
  secondaryLinks: [
    {
      label: "Account",
      href: getRoute("Account"),
    },
  ],
  cta: {
    button: {
      children: "List yourself",
      outline: true,
    },
    href: getRoute("Onboarding"),
  },
};
export const AUTHORISED_SELLER_NAVBAR_SECTIONS = {
  ...AUTHORISED_USER_NAVBAR_SECTIONS,
  cta: undefined,
};

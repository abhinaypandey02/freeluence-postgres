export enum Route {
  Home = "/",
  Login = "/login",
  Forgot = "/forgot",
  SignUp = "/join",
  Account = "/account",
  Onboarding = "/onboarding",
  Profile = "/profile",
  Blogs = "/blogs",
  Chat = "/chat",
  Search = "/search",
  PrivacyPolicy = "/privacy-policy",
  TermsConditions = "/terms-and-conditions",
  Postings = "/campaigns",
  AccountPostings = `${Account}/campaigns`,
  AccountApplications = `/applications`,
  AccountPostingsEdit = `${AccountPostings}/edit`,
  AccountPostingsNew = `${AccountPostings}/new`,
  AccountPostingsApplications = `${AccountPostings}/applications`,
}

export function getRoute(route: keyof typeof Route) {
  return process.env.NEXT_PUBLIC_BASE_URL + Route[route];
}

export function getMeURL(username: string, clean?: boolean) {
  return `${clean ? "" : "https://"}${username}.sociocube.me`;
}

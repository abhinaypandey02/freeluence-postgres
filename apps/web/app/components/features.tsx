import {
  Binoculars,
  ChatsTeardrop,
  PiggyBank,
  UserCheck,
  ChartLine,
  Smiley,
} from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    name: "Advanced Search Filters",
    description:
      "Easily find influencers who align with your brand using precise filters like age, location, follower count, category, and starting price.",
    href: "#",
    icon: Binoculars,
  },
  {
    name: "100% Free Access for All Users",
    description:
      "Freeluencers offers full access to all features without any fees for both brands and influencers. Connect, collaborate, and grow without any costs.",
    href: "#",
    icon: PiggyBank,
  },
  {
    name: "In-Platform Messaging",
    description:
      "Connect directly with influencers through our secure chat feature, or link directly to their Instagram for seamless communication.",
    href: "#",
    icon: ChatsTeardrop,
  },
  {
    name: "Simple Onboarding for Influencers",
    description:
      "Influencers can join quickly by connecting their Instagram and filling in essential details, ensuring verified, authentic profiles for brands to browse.",
    href: "#",
    icon: UserCheck,
  },
  {
    name: "Real-Time Insights",
    description:
      "Get insights into influencers' engagement rates, audience demographics, and follower growth to make informed collaboration decisions.",
    href: "#",
    icon: ChartLine,
  },
  {
    name: "Intuitive & Easy-to-Use Interface",
    description:
      "Freeluencers' intuitive design makes it simple for brands and influencers to connect and collaborate effortlessly.",
    href: "#",
    icon: Smiley,
  },
];

export default function Features() {
  return (
    <div className=" py-16 sm:my-16" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-accent">
            Key Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need for Successful Collaborations
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explore our powerful features designed to make collaboration
            effortless.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div className="flex flex-col" key={feature.name}>
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <feature.icon
                    aria-hidden="true"
                    className="size-5 flex-none text-accent"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
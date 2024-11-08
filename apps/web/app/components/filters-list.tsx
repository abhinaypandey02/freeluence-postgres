import { Check } from "@phosphor-icons/react/dist/ssr";

const features = [
  {
    name: "Location",
    description:
      "Search by geographic area to find influencers with local relevance for your brand’s audience.",
  },
  {
    name: "Gender",
    description:
      "Filter by gender to ensure your campaigns resonate with the right demographics.",
  },
  {
    name: "Categories",
    description:
      "Choose from various categories such as Fashion, Travel, and Cooking to find influencers who specialize in your brand’s niche.",
  },
  {
    name: "Price",
    description:
      "Adjust your search by collaboration cost to find influencers within your budget range.",
  },
  {
    name: "Followers & Reach",
    description:
      "Select influencers based on follower count and reach to match your brand’s desired reach and engagement.",
  },
  {
    name: "Age",
    description:
      "Find influencers in specific age ranges to appeal to your target audience effectively.",
  },
];

export default function FiltersList() {
  return (
    <div className=" py-16 sm:my-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Precise discovery
            </h2>
            <p className="mt-2 font-poppins text-3xl font-bold text-gray-900 sm:text-4xl">
              Find Your Perfect Match with Advanced Search Filters
            </p>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Effortlessly refine your search to find influencers who align with
              your brand’s goals. Our diverse set of filters allows you to
              pinpoint the perfect partners based on specific needs and
              criteria.
            </p>
          </div>
          <dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div className="relative pl-9" key={feature.name}>
                <dt className="font-poppins font-semibold text-gray-900">
                  <Check
                    aria-hidden="true"
                    className="absolute left-0 top-1 size-5 text-indigo-500"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-2">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";

type UseCaseType = {
  custom_fields: {
    tag: string;
    name: string;
    slug: string;
  };
};

const UseCaseCard: React.FC<{ useCase: UseCaseType }> = ({ useCase }) => (
  <Link
    href={`/use-cases/${useCase.custom_fields.slug}`}
    className="demo-card"
  >
    <span className="demo-card__tag">{useCase.custom_fields.tag}</span>
    <span className="demo-card__title">{useCase.custom_fields.name}</span>
  </Link>
);

const CategorySection: React.FC<{
  title: string;
  items: UseCaseType[];
}> = ({ title, items }) => (
  <section>
    <h3 className="section-eyebrow mb-4">{title}</h3>
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((useCase) => (
        <li key={useCase.custom_fields.slug} className="list-none">
          <UseCaseCard useCase={useCase} />
        </li>
      ))}
    </ul>
  </section>
);

const UseCases = ({ data }) => {
  if (Object.keys(data).length === 0) return null;

  const namedCategories = Object.keys(data)
    .filter((key) => key !== "others")
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-12">
      {namedCategories.map((key) => (
        <CategorySection
          key={key}
          title={key.replace(/_/g, " ")}
          items={data[key]}
        />
      ))}
      {data?.others && (
        <CategorySection title="Others" items={data.others} />
      )}
    </div>
  );
};

export default UseCases;

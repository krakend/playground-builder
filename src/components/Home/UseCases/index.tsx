import Accordion from "@/components/Accordion";
import IconBookOpen from "@/image/icons/icons-docs-open-api.svg";
import Link from "next/link";

type UseCaseType = {
  custom_fields: {
    name: string;
    slug: string;
  };
};

/**
 * UseCases component to display categorized API use cases with an accordion structure.
 *
 * @param {UseCasesProps} props - The component props.
 * @param {Record<string, UseCaseType[]>} props.data - The categorized use case data.
 * @returns {JSX.Element | null} The rendered component or null if no data is present.
 */
const UseCases = ({ data }) => {
  if (Object.keys(data).length === 0) return null;

  return (
    <div>
      <h2 className="heading--h5 text-white mb-4">
        Explore demos for these use cases:
      </h2>

      <ul className="space-y-4">
        {Object.keys(data).map((key: string) => {
          if (key === "others") return null;
          return (
            <li key={key}>
              <Accordion heading={key.replace("_", " ")}>
                <ul className="space-y-3.5">
                  {data[key].map((useCase: UseCaseType) => {
                    return (
                      <li key={useCase.custom_fields.slug}>
                        <Link
                          href={`/use-cases/${useCase.custom_fields.slug}`}
                          className="text-brand-blue-500 hover:opacity-80 text-base inline-flex gap-2 rounded-md shadow--xs shadow-md break-words"
                        >
                          <IconBookOpen className="text-brand-neutral-300 inline" />
                          <span>{useCase.custom_fields.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Accordion>
            </li>
          );
        })}
        {data?.others && (
          <li>
            <Accordion heading="Others">
              <ul className="space-y-3.5">
                {data?.others?.map((useCase: UseCaseType) => {
                  return (
                    <li key={useCase.custom_fields.slug}>
                      <Link
                        href={`/use-cases/${useCase.custom_fields.slug}`}
                        className="text-brand-blue-500 hover:opacity-80 text-base inline-flex gap-2 rounded-md shadow--xs shadow-md break-words"
                      >
                        <IconBookOpen className="text-brand-neutral-300 inline" />
                        <span>{useCase.custom_fields.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Accordion>
          </li>
        )}
      </ul>
    </div>
  );
};

export default UseCases;

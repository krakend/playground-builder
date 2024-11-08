import Link from "next/link";

const UseCases = ({ data }) => {
  return Object.keys(data).length > 0 ? (
    <div className="py-5 px-6 rounded-xl" style={{ background: "#171921" }}>
      <p className="text-white mb-4 font-medium">
        Explore demos for these use cases:
      </p>

      {Object.keys(data).map((key: string) => {
        if (key === "others") return null;
        return (
          <div
            className="p-4 rounded-md mb-6 border border-brand-neutral-600"
            key={key}
          >
            <p className="text-white font-medium mb-4 capitalize">
              {key.replace("_", " ")}
            </p>
            <div className="flex flex-col gap-4">
              {data[key].map((useCase: any, index: number) => {
                return (
                  <Link
                    href={`/use-cases/${useCase.custom_fields.slug}`}
                    className="text-white text-base p-3 rounded-md hover:outline hover:outline-brand-neutral-300 transition-colors shadow-md break-words"
                    key={`${useCase.custom_fields.slug}-${index}`}
                    style={{ background: "#272B3A" }}
                  >
                    {useCase.custom_fields.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="flex flex-col gap-4">
        <p className="text-white font-medium">Others</p>
        {data["others"].map((useCase: any, index: number) => {
          return (
            <Link
              href={`/use-cases/${useCase.custom_fields.slug}`}
              key={`others-${useCase.custom_fields.slug}-${index}`}
              className="text-white text-base p-3 rounded-md hover:outline hover:outline-brand-neutral-300 transition-colors shadow-md break-words"
              style={{ background: "#272B3A" }}
            >
              {useCase.custom_fields.name}
            </Link>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default UseCases;

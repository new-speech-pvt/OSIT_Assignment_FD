import { Helmet } from "react-helmet";
const MetaDescriptionComponent = ({
  metaTitle,
  keywordName,
  descriptionName,
  link = null,
  href,
}) => {
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="keywords" content={keywordName} />
        <meta name="description" content={descriptionName} />
        {link && <link rel="canonical" href={href} />}
      </Helmet>
    </>
  );
};

export default MetaDescriptionComponent;

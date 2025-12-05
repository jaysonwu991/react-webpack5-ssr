import "./CalloutBanner.scss";

const CalloutBanner = () => {
  return (
    <section className="callout-banner">
      <p className="callout-banner__label">Secondary Section</p>
      <h2 className="callout-banner__title">Client hydration is ready</h2>
      <p className="callout-banner__copy">
        This banner lives in its own component with scoped styling for clarity.
      </p>
    </section>
  );
};

export default CalloutBanner;

import "./ContentComponent.scss";
import type { ContentProps } from '@shared';

const ContentComponent = ({ message = 'Personalized greeting with URL parameters' }: ContentProps) => {
  return (
    <div className="content-component">
      <span className="content-icon">🚀</span>
      <p className="content-text">{message}</p>
      <span className="content-badge">SSR Powered</span>
    </div>
  );
};

export default ContentComponent;

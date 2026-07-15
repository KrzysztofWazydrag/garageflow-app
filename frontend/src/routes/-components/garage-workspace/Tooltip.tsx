import { ReactElement, cloneElement, useId } from 'react';

type TooltipProps = {
  children: ReactElement;
  text: string;
};

export const Tooltip = ({ children, text }: TooltipProps) => {
  const tooltipId = useId();
  const describedChild = cloneElement(children, {
    'aria-describedby': tooltipId,
    tabIndex: children.props.tabIndex ?? 0,
  });

  return (
    <span className="garage-workspace__tooltip-wrap">
      {describedChild}
      <span className="garage-workspace__tooltip" id={tooltipId} role="tooltip">
        {text}
      </span>
    </span>
  );
};

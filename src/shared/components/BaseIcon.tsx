import Svg, { SvgProps } from 'react-native-svg'

export type IconContent = React.FC<SvgProps>;

interface BaseIconProps extends SvgProps {
  icon: IconContent;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const BaseIcon: React.FC<BaseIconProps> = ({
  icon: IconComponent,
  size = 20,
  strokeWidth = 1.5,
  color = '#838383',
  ...props
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <IconComponent />
    </Svg>
  );
};
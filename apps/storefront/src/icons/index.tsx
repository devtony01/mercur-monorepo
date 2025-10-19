interface IconProps {
  color?: string;
  size?: number;
  className?: string;
}

export function ArrowRightIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11.4697 4.46967C11.7626 4.17678 12.2374 4.17678 12.5303 4.46967L19.5303 11.4697C19.8232 11.7626 19.8232 12.2374 19.5303 12.5303L12.5303 19.5303C12.2374 19.8232 11.7626 19.8232 11.4697 19.5303C11.1768 19.2374 11.1768 18.7626 11.4697 18.4697L17.1893 12.75H5C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25H17.1893L11.4697 5.53033C11.1768 5.23744 11.1768 4.76256 11.4697 4.46967Z'
        fill={color}
      />
    </svg>
  );
}

export function ArrowLeftIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12.5303 4.46967C12.2374 4.17678 11.7626 4.17678 11.4697 4.46967L4.46967 11.4697C4.17678 11.7626 4.17678 12.2374 4.46967 12.5303L11.4697 19.5303C11.7626 19.8232 12.2374 19.8232 12.5303 19.5303C12.8232 19.2374 12.8232 18.7626 12.5303 18.4697L6.81066 12.75H19C19.4142 12.75 19.75 12.4142 19.75 12C19.75 11.5858 19.4142 11.25 19 11.25H6.81066L12.5303 5.53033C12.8232 5.23744 12.8232 4.76256 12.5303 4.46967Z'
        fill={color}
      />
    </svg>
  );
}

export function CloseIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L12 10.9393L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L13.0607 12L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L12 13.0607L6.53033 18.5303C6.23744 18.8232 5.76256 18.8232 5.46967 18.5303C5.17678 18.2374 5.17678 17.7626 5.46967 17.4697L10.9393 12L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z'
        fill={color}
      />
    </svg>
  );
}

export function ProfileIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 3.75C9.65279 3.75 7.75 5.65279 7.75 8C7.75 10.3472 9.65279 12.25 12 12.25C14.3472 12.25 16.25 10.3472 16.25 8C16.25 5.65279 14.3472 3.75 12 3.75Z'
        stroke={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.81282 14.8128C7.45376 13.1719 9.67936 12.25 12 12.25C14.3206 12.25 16.5462 13.1719 18.1872 14.8128C19.8281 16.4538 20.75 18.6794 20.75 21C20.75 21.4142 20.4142 21.75 20 21.75C19.5858 21.75 19.25 21.4142 19.25 21C19.25 19.0772 18.4862 17.2331 17.1265 15.8735C15.7669 14.5138 13.9228 13.75 12 13.75C10.0772 13.75 8.23311 14.5138 6.87348 15.8735C5.51384 17.2331 4.75 19.0772 4.75 21C4.75 21.4142 4.41421 21.75 4 21.75C3.58579 21.75 3.25 21.4142 3.25 21C3.25 18.6794 4.17187 16.4538 5.81282 14.8128Z'
        fill={color}
      />
    </svg>
  );
}

export function StarIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 1.25C12.2855 1.25 12.5462 1.41205 12.6726 1.66803L15.5882 7.57485L22.1085 8.52789C22.3909 8.56917 22.6254 8.76717 22.7135 9.03868C22.8015 9.31018 22.7278 9.60812 22.5233 9.80727L17.8059 14.402L18.9192 20.8932C18.9675 21.1746 18.8518 21.459 18.6208 21.6268C18.3898 21.7946 18.0836 21.8167 17.8309 21.6838L12 18.6174L6.16911 21.6838C5.91642 21.8167 5.6102 21.7946 5.37922 21.6268C5.14824 21.459 5.03255 21.1746 5.08082 20.8932L6.19413 14.402L1.47672 9.80727C1.27226 9.60812 1.19855 9.31018 1.28659 9.03868C1.37462 8.76717 1.60913 8.56917 1.89155 8.52789L8.41183 7.57485L11.3275 1.66803C11.4538 1.41205 11.7146 1.25 12 1.25Z'
        fill={color}
      />
    </svg>
  );
}

export function ForwardIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.46967 5.46967C8.76256 5.17678 9.23744 5.17678 9.53033 5.46967L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L9.53033 18.5303C9.23744 18.8232 8.76256 18.8232 8.46967 18.5303C8.17678 18.2374 8.17678 17.7626 8.46967 17.4697L13.9393 12L8.46967 6.53033C8.17678 6.23744 8.17678 5.76256 8.46967 5.46967Z'
        fill={color}
      />
    </svg>
  );
}

export function LoaderIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 17.5C15.0376 17.5 17.5 15.0376 17.5 12C17.5 8.96243 15.0376 6.5 12 6.5C8.96243 6.5 6.5 8.96243 6.5 12C6.5 15.0376 8.96243 17.5 12 17.5ZM19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z'
        fill={color}
      />
    </svg>
  );
}

export function MinusHeavyIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.75 12C3.75 11.3096 4.30964 10.75 5 10.75H19C19.6904 10.75 20.25 11.3096 20.25 12C20.25 12.6904 19.6904 13.25 19 13.25H5C4.30964 13.25 3.75 12.6904 3.75 12Z'
        fill={color}
      />
    </svg>
  );
}

export function TickThinIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15.5303 9.46967C15.8232 9.76256 15.8232 10.2374 15.5303 10.5303L11.5303 14.5303C11.2374 14.8232 10.7626 14.8232 10.4697 14.5303L8.46967 12.5303C8.17678 12.2374 8.17678 11.7626 8.46967 11.4697C8.76256 11.1768 9.23744 11.1768 9.53033 11.4697L11 12.9393L14.4697 9.46967C14.7626 9.17678 15.2374 9.17678 15.5303 9.46967Z'
        fill={color}
      />
    </svg>
  );
}

export function CollapseIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.46967 8.46967C5.76256 8.17678 6.23744 8.17678 6.53033 8.46967L12 13.9393L17.4697 8.46967C17.7626 8.17678 18.2374 8.17678 18.5303 8.46967C18.8232 8.76256 18.8232 9.23744 18.5303 9.53033L12.5303 15.5303C12.2374 15.8232 11.7626 15.8232 11.4697 15.5303L5.46967 9.53033C5.17678 9.23744 5.17678 8.76256 5.46967 8.46967Z'
        fill={color}
      />
    </svg>
  );
}

export function SearchIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11 3.75C6.99594 3.75 3.75 6.99594 3.75 11C3.75 15.0041 6.99594 18.25 11 18.25C15.0041 18.25 18.25 15.0041 18.25 11C18.25 6.99594 15.0041 3.75 11 3.75Z'
        stroke={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16.1697 16.1697C16.4626 15.8768 16.9374 15.8768 17.2303 16.1697L21.5303 20.4697C21.8232 20.7626 21.8232 21.2374 21.5303 21.5303C21.2374 21.8232 20.7626 21.8232 20.4697 21.5303L16.1697 17.2303C15.8768 16.9374 15.8768 16.4626 16.1697 16.1697Z'
        fill={color}
      />
    </svg>
  );
}

export function MessageIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        d='M13 8H7M17 12H7M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z'
        stroke={color}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function CartIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        d='M7.7 22.4402C8.6665 22.4402 9.45 21.6567 9.45 20.6902C9.45 19.7237 8.6665 18.9402 7.7 18.9402C6.7335 18.9402 5.95 19.7237 5.95 20.6902C5.95 21.6567 6.7335 22.4402 7.7 22.4402Z'
        fill={color}
      />
      <path
        d='M18.7 22.4402C19.6665 22.4402 20.45 21.6567 20.45 20.6902C20.45 19.7237 19.6665 18.9402 18.7 18.9402C17.7335 18.9402 16.95 19.7237 16.95 20.6902C16.95 21.6567 17.7335 22.4402 18.7 22.4402Z'
        fill={color}
      />
      <path
        d='M22.38 7.27022C22.24 7.09022 22.02 6.99022 21.8 6.99022H5.43L4.49 2.60022C4.48 2.54022 4.46 2.48022 4.43 2.42022C4.38 2.32022 4.31 2.23022 4.22 2.16022C4.14 2.09022 4.04 2.04022 3.93 2.02022C3.87 2.00022 3.8 2.00022 3.74 2.00022H1.75C1.34 1.99022 1 2.33022 1 2.74022C1 3.15022 1.34 3.49022 1.75 3.49022H3.14L4.08 7.90022C4.08 7.90022 4.08 7.92022 4.08 7.93022L5.66 15.3202C5.79 15.9402 6.14 16.5102 6.64 16.9002C7.13 17.2802 7.73 17.4902 8.33 17.4902C8.35 17.4902 8.37 17.4902 8.39 17.4902H18.17C18.79 17.4902 19.4 17.2702 19.89 16.8802C20.37 16.4902 20.72 15.9402 20.85 15.3302L22.5 7.90022C22.55 7.68022 22.5 7.45022 22.35 7.27022H22.38ZM19.41 15.0102C19.35 15.2902 19.19 15.5402 18.97 15.7202C18.75 15.9002 18.47 16.0002 18.19 16.0002H8.39C8.1 16.0202 7.81 15.9102 7.59 15.7302C7.36 15.5502 7.2 15.2902 7.14 15.0102L5.75 8.50022H20.86L19.41 15.0202V15.0102Z'
        fill={color}
      />
    </svg>
  );
}

export function HamburgerMenuIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.25 6C3.25 5.58579 3.58579 5.25 4 5.25H20C20.4142 5.25 20.75 5.58579 20.75 6C20.75 6.41421 20.4142 6.75 20 6.75H4C3.58579 6.75 3.25 6.41421 3.25 6ZM3.25 12C3.25 11.5858 3.58579 11.25 4 11.25H20C20.4142 11.25 20.75 11.5858 20.75 12C20.75 12.4142 20.4142 12.75 20 12.75H4C3.58579 12.75 3.25 12.4142 3.25 12ZM3.25 18C3.25 17.5858 3.58579 17.25 4 17.25H20C20.4142 17.25 20.75 17.5858 20.75 18C20.75 18.4142 20.4142 18.75 20 18.75H4C3.58579 18.75 3.25 18.4142 3.25 18Z'
        fill={color}
      />
    </svg>
  );
}

export function HeartIcon({
  color = '#090909',
  size = 24,
  className = '',
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.08058 4.08058C4.25269 2.90848 5.8424 2.25 7.5 2.25C8.45514 2.25 9.31239 2.38639 10.147 2.74989C10.7904 3.03013 11.3924 3.4332 12 3.96975C12.6076 3.4332 13.2096 3.03013 13.853 2.74989C14.6876 2.38639 15.5449 2.25 16.5 2.25C18.1576 2.25 19.7473 2.90848 20.9194 4.08058C22.0915 5.25269 22.75 6.8424 22.75 8.5C22.75 11.1289 21.0154 13.0749 19.5276 14.533L12.5303 21.5303C12.2374 21.8232 11.7626 21.8232 11.4697 21.5303L4.47414 14.5348C2.97096 13.0812 1.25 11.1372 1.25 8.5C1.25 6.8424 1.90848 5.25269 3.08058 4.08058ZM7.5 3.75C6.24022 3.75 5.03204 4.25045 4.14124 5.14124C3.25045 6.03204 2.75 7.24022 2.75 8.5C2.75 10.4601 4.02553 12.0149 5.52127 13.4608L5.53041 13.4696L12 19.9393L18.4751 13.4643C19.9667 12.0027 21.25 10.4495 21.25 8.5C21.25 7.24022 20.7496 6.03204 19.8588 5.14124C18.968 4.25045 17.7598 3.75 16.5 3.75C15.6951 3.75 15.0524 3.86361 14.452 4.12511C13.8467 4.38872 13.2376 4.82308 12.5303 5.53033C12.2374 5.82322 11.7626 5.82322 11.4697 5.53033C10.7624 4.82308 10.1533 4.38872 9.54802 4.12511C8.94761 3.86361 8.30486 3.75 7.5 3.75Z'
        fill={color}
      />
    </svg>
  );
}
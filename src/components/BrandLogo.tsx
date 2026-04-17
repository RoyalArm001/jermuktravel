interface BrandLogoProps {
  className?: string
  alt?: string
}

const brandLogoAsset = '/icons/jermuk-logo-v2.svg?v=20260330c'

export function BrandLogo({
  className,
  alt = 'Jermuk Travel logo',
}: BrandLogoProps) {
  return (
    <img
      className={className}
      src={brandLogoAsset}
      alt={alt}
      width={512}
      height={512}
    />
  )
}

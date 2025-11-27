import React from 'react'

type KartyaGombProps = {
	href: string
	label: string
	external?: boolean
	className?: string
	onClick?: () => void
}

const KartyaGomb: React.FC<KartyaGombProps> = ({ href, label, external, className, onClick }) => {
	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (onClick) {
			e.preventDefault()
			onClick()
		}
	}

	return (
		<a
			className={className ?? 'btn'}
			href={href}
			target={external ? '_blank' : undefined}
			rel={external ? 'noreferrer' : undefined}
			onClick={handleClick}
		>
			{label}
		</a>
	)
}

export default KartyaGomb


import React from 'react'

type KartyaGombProps = {
	href: string
	label: string
	external?: boolean
	className?: string
}

const KartyaGomb: React.FC<KartyaGombProps> = ({ href, label, external, className }) => {
	return (
		<a
			className={className ?? 'btn'}
			href={href}
			target={external ? '_blank' : undefined}
			rel={external ? 'noreferrer' : undefined}
		>
			{label}
		</a>
	)
}

export default KartyaGomb


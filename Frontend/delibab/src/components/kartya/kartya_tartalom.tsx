import React from 'react'

type KartyaTartalomProps = {
	text?: string
	children?: React.ReactNode
	className?: string
}

const KartyaTartalom: React.FC<KartyaTartalomProps> = ({ text, children, className }) => {
	if (text) return <p className={className}>{text}</p>

	return <>{children}</>
}

export default KartyaTartalom


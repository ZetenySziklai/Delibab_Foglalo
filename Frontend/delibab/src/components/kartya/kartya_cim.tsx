import React from 'react'

type KartyaCimProps = {
	title: string
	className?: string
}

const KartyaCim: React.FC<KartyaCimProps> = ({ title, className }) => {
	return (
		<h1 className={className}>
			{title}
		</h1>
	)
}

export default KartyaCim


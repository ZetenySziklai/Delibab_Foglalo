import React from 'react'
import KartyaCim from './kartya_cim'
import KartyaTartalom from './kartya_tartalom'
import KartyaGomb from './kartya_gomb'

type ButtonProps = {
	href: string
	label: string
	external?: boolean
	className?: string
	onClick?: () => void
}

type KartyaProps = {
	id?: string
	title: string
	text?: string
	children?: React.ReactNode
	buttons?: ButtonProps[]
}

const Kartya: React.FC<KartyaProps> = ({ id, title, text, children, buttons }) => {
	return (
		<section id={id}>
			<div className="container">
				<KartyaCim title={title} />
				<KartyaTartalom text={text}>{children}</KartyaTartalom>

				{buttons && buttons.length > 0 ? (
					<div className="kartya-buttons" style={{ marginTop: 12 }}>
						{buttons.map((b, i) => (
							<KartyaGomb key={i} href={b.href} label={b.label} external={b.external} className={b.className} onClick={b.onClick} />
						))}
					</div>
				) : null}
			</div>
		</section>
	)
}

export default Kartya


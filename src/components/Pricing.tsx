import { useId, useState } from 'react';

type Plan = {
	name: string;
	annual: number;
	lifetime?: number;
	licenses?: number | 'unlimited';
	text: string;
	features: string[];
	featured: boolean;
};

type Props = {
	plans: Plan[];
	freeUrl?: string;
	freeFeatures: string[];
	checkout: { productId: string; planId: string; publicKey: string };
	supportEmail: string;
};

type Cycle = 'annual' | 'lifetime';

declare global {
	interface Window {
		FS?: { Checkout: new (options: Record<string, unknown>) => { open: (options: Record<string, unknown>) => void } };
	}
}

const SCRIPT_URL = 'https://checkout.freemius.com/js/v1/';
let loading: Promise<void> | null = null;

/** Loads the Freemius checkout only when a visitor actually clicks "Acheter". */
function loadCheckout(): Promise<void> {
	if (window.FS?.Checkout) return Promise.resolve();
	loading ??= new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			loading = null;
			reject(new Error('checkout'));
		};
		document.head.append(script);
	});
	return loading;
}

const euro = (value: number) => `${value} €`;

export default function Pricing({ plans, freeUrl, freeFeatures, checkout, supportEmail }: Props) {
	const [cycle, setCycle] = useState<Cycle>('annual');
	const [error, setError] = useState(false);
	const name = useId();

	const buy = async (plan: Plan) => {
		setError(false);
		try {
			await loadCheckout();
			const handler = new window.FS!.Checkout({
				product_id: checkout.productId,
				plan_id: checkout.planId,
				public_key: checkout.publicKey,
			});
			handler.open({
				name: 'Saina Blocks',
				licenses: plan.licenses ?? 1,
				billing_cycle: cycle,
			});
		} catch {
			setError(true);
		}
	};

	return (
		<div className="pricing">
			<fieldset className="cycle glass">
				<legend className="visually-hidden">Durée de la licence</legend>
				{(
					[
						['annual', 'Annuel'],
						['lifetime', 'À vie'],
					] as const
				).map(([value, label]) => (
					<label key={value} className={cycle === value ? 'is-on' : undefined}>
						<input
							type="radio"
							name={name}
							value={value}
							checked={cycle === value}
							onChange={() => setCycle(value)}
						/>
						{label}
					</label>
				))}
			</fieldset>

			<ul className="plans" role="list">
				{plans.map((plan) => {
					const price = cycle === 'lifetime' && plan.lifetime ? plan.lifetime : plan.annual;
					const other =
						cycle === 'annual'
							? plan.lifetime && `par an · ou ${euro(plan.lifetime)} à vie`
							: `une fois · ou ${euro(plan.annual)} par an`;
					return (
						<li key={plan.name} className={`plan ${plan.featured ? 'glass is-featured' : 'outlined'}`}>
							<div className="plan-head">
								<h3>{plan.name}</h3>
								{plan.featured && <span className="label plan-tag">Recommandé</span>}
							</div>
							<p className="plan-price">
								<span className="figure">{euro(price)}</span>
								<span className="label plan-period">{other}</span>
							</p>
							<p className="plan-text muted">{plan.text}</p>
							<ul className="plan-features">
								{plan.features.map((f) => (
									<li key={f}>{f}</li>
								))}
							</ul>
							<button
								type="button"
								className={`btn btn--block ${plan.featured ? 'btn--light' : 'btn--ghost'}`}
								onClick={() => buy(plan)}
							>
								Acheter<span className="visually-hidden"> la licence {plan.name}</span>
							</button>
						</li>
					);
				})}
				<li className="plan outlined is-free">
					<div className="plan-head">
						<h3>Gratuit</h3>
					</div>
					<p className="plan-price">
						<span className="figure">0 €</span>
						<span className="label plan-period">pour toujours</span>
					</p>
					<p className="plan-text muted">9 blocs, la page d’accueil essentielle, mises à jour via WordPress.org.</p>
					<ul className="plan-features">
						{freeFeatures.map((f) => (
							<li key={f}>{f}</li>
						))}
					</ul>
					{freeUrl && (
						<a className="btn btn--ghost btn--block" href={freeUrl}>
							Télécharger<span className="visually-hidden"> la version gratuite</span>
						</a>
					)}
				</li>
			</ul>

			<p role="status" className="pricing-error">
				{error && (
					<>
						Le paiement n’a pas pu s’ouvrir. Réessayez, ou écrivez à <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
					</>
				)}
			</p>
		</div>
	);
}

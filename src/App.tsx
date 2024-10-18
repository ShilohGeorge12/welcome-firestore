import './App.css';

import { addDoc, collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { Dot } from './components/dot';
import db from './firebase';

type colorsType = DocumentData[] | { name: string; value: string; id: string }[];
function App() {
	const initFormState = {
		name: '',
		value: '',
	};
	const [colors, setColors] = useState<colorsType>([]);
	const [formState, setFormState] = useState<typeof initFormState>(initFormState);
	useEffect(
		() =>
			onSnapshot(collection(db, 'colors'), (snapshot) => {
				// setColors(snapshot.docs.map(doc=> doc.data()))
				let v: colorsType = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
				setColors(v);
			}),
		[]
	);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormState((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const collectionRef = collection(db, 'colors');
		const payload = { name: formState.name, value: formState.value };
		await addDoc(collectionRef, payload);
	};

	const onEdit = async (id: string) => {
		id;
	};

	return (
		<section className="root">
			<form onSubmit={onSubmit}>
				<input
					type="text"
					name="name"
					required
					value={formState.name}
					onChange={onInputChange}
				/>
				<input
					type="text"
					name="value"
					required
					value={formState.value}
					onChange={onInputChange}
				/>

				<button type="submit">New</button>
			</form>

			<ul>
				{colors.length > 0 &&
					colors.map((color) => (
						<li key={color.id}>
							<a
								href="/#"
								onClick={() => onEdit(color.id)}>
								edit
							</a>
							<Dot color={color.value} /> {color.name}
						</li>
					))}

				{colors.length === 0 && <li>loading colors.....</li>}
			</ul>
		</section>
	);
}

export default App;

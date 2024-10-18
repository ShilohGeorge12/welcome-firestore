import './App.css';

import { addDoc, collection, doc, DocumentData, onSnapshot, setDoc } from 'firebase/firestore';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { Dot } from './components/dot';
import db from './firebase';

type colorsType = DocumentData[] | { name: string; value: string; id: string }[];
function App() {
	const initFormState = {
		name: '',
		value: '',
	};
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const [colors, setColors] = useState<colorsType>([]);
	const [formState, setFormState] = useState<typeof initFormState>(initFormState);
	const [editFormState, setEditFormState] = useState<{ name: string; value: string; id: string }>({ id: '', name: '', value: '' });

	useEffect(
		() =>
			onSnapshot(collection(db, 'colors'), (snapshot) => {
				let v: colorsType = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
				setColors(v);
			}),
		[]
	);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormState((prev) => ({ ...prev, [name]: value }));
	};
	const onInputEditChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditFormState((prev) => ({ ...prev, [name]: value }));
	};

	const onEditColorSubmit = async (e: FormEvent<HTMLFormElement>, id: string) => {
		e.preventDefault();
		const docRef = doc(db, 'colors', id);
		const payload = { name: editFormState.name, value: editFormState.value };
		await setDoc(docRef, payload);
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const collectionRef = collection(db, 'colors');
		const payload = { name: formState.name, value: formState.value };
		await addDoc(collectionRef, payload);
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
							<button
								type="button"
								onClick={() => {
									dialogRef.current?.showModal();
									setEditFormState({ name: color.name, value: color.value, id: color.id });
									console.log(color.id);
								}}>
								edit
							</button>
							<Dot color={color.value} /> {color.name} {color.id}
							<dialog ref={dialogRef}>
								<form onSubmit={(e) => onEditColorSubmit(e, color.id)}>
									<input
										type="text"
										name="name"
										required
										value={editFormState.name ?? ''}
										onChange={onInputEditChange}
									/>
									<input
										type="text"
										name="value"
										required
										value={editFormState.value ?? ''}
										onChange={onInputEditChange}
									/>
									<button type="submit">finalize</button>
									<button
										type="button"
										onClick={() => {
											dialogRef.current?.close();
											setEditFormState({ id: '', name: '', value: '' });
										}}>
										close
									</button>
								</form>
							</dialog>
						</li>
					))}

				{colors.length === 0 && <li>loading colors.....</li>}
			</ul>
		</section>
	);
}

export default App;

import './App.css';

import { addDoc, collection, deleteDoc, doc, DocumentData, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { Dot } from './components/dot';
import db from './firebase';

type colorsType = DocumentData[] | { name: string; value: string; id: string }[];
function App() {
	const initFormState = {
		name: '',
		value: '',
	};
	const [showAddColorFormState, setShowAddColorFormState] = useState<boolean>(true);
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const [colors, setColors] = useState<colorsType>([]);
	const [addColorFormState, setAddColorFormState] = useState<typeof initFormState>(initFormState);
	const [editFormState, setEditFormState] = useState<{ name: string; value: string; id: string }>({ id: '', name: '', value: '' });
	const [deleteQueryState, setDeleteQueryState] = useState<{ name: string }>({ name: '' });

	useEffect(() => {
		const sortingQuery = query(collection(db, 'colors'), orderBy('timeStamp', 'desc'));
		const unSub = onSnapshot(sortingQuery, (snapshot) => {
			let v: colorsType = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
			setColors(v);
		});
		return unSub;
	}, []);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAddColorFormState((prev) => ({ ...prev, [name]: value }));
	};

	const onInputEditChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditFormState((prev) => ({ ...prev, [name]: value }));
	};

	const onDeleteInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setDeleteQueryState((prev) => ({ ...prev, name: value }));
	};

	const onEditColorSubmit = async (e: FormEvent<HTMLFormElement>, id: string) => {
		e.preventDefault();
		const docRef = doc(db, 'colors', id);
		const payload = { name: editFormState.name, value: editFormState.value };
		await updateDoc(docRef, payload);
	};

	const onSubmitNewColor = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const collectionRef = collection(db, 'colors');
		const payload = { name: addColorFormState.name, value: addColorFormState.value, timeStamp: serverTimestamp() };
		await addDoc(collectionRef, payload);
		setAddColorFormState(initFormState);
	};

	const onDeleteColor = async (id: string) => {
		const docRef = doc(db, 'colors', id);
		await deleteDoc(docRef);
	};

	const onQueryDelete = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		colors.forEach(async (color) => {
			if (color.name === deleteQueryState.name) {
				const docRef = doc(db, 'colors', color.id);
				await deleteDoc(docRef);
			}
		});

		setDeleteQueryState({ name: '' });
	};

	return (
		<section className="root">
			<button
				type="button"
				onClick={() => setShowAddColorFormState((prev) => !prev)}>
				{showAddColorFormState ? 'Show Color Delete Query' : 'Show Add Color Form'}
			</button>
			{showAddColorFormState && (
				<form onSubmit={onSubmitNewColor}>
					<input
						type="text"
						name="name"
						required
						value={addColorFormState.name}
						onChange={onInputChange}
					/>
					<input
						type="text"
						name="value"
						required
						value={addColorFormState.value}
						onChange={onInputChange}
					/>

					<button type="submit">New</button>
				</form>
			)}

			{!showAddColorFormState && (
				<form onSubmit={onQueryDelete}>
					<input
						required
						type="text"
						value={deleteQueryState.name}
						onChange={onDeleteInputChange}
					/>
					<button type="submit">Delete All Colors By Name</button>
				</form>
			)}

			<ul>
				{colors.length > 0 &&
					colors.map((color) => (
						<li key={color.id}>
							<button
								type="button"
								onClick={() => {
									dialogRef.current?.showModal();
									setEditFormState({ name: color.name, value: color.value, id: color.id });
								}}>
								edit
							</button>
							<button
								type="button"
								onClick={() => onDeleteColor(color.id)}>
								Delete
							</button>
							<Dot color={color.value} /> {color.name}
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

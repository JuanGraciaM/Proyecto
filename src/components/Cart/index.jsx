import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useCartContext } from "../../context/CartContext";
import ItemCart from '../ItemCart';
import './cart.css';
import { addDoc, collection, getFirestore } from "firebase/firestore";
import Swal from 'sweetalert2';

const Cart = () => {
	const { cart, totalPrice, clearCart } = useCartContext();

	const [newName, setNewName] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [newTel, setNewTel] = useState('');
	const [newDir, setNewDir] = useState('');

	const nameHandler = (event) => {
		setNewName(event.target.value);
	}

	const emailHandler = (event) => {
		setNewEmail(event.target.value);
	}

	const telHandler = (event) => {
		setNewTel(event.target.value);
	}

	const dirHandler = (event) => {
		setNewDir(event.target.value);
	}

	// const submitHandler = (event) => {
	// 	event.preventDefault();
	// }

	const order = {
		buyer: {
			name: newName,
			email: newEmail,
			phone: newTel,
			address: newDir,
		},
		items: cart.map((product) => ({
			id: product.id,
			title: product.title,
			price: product.price,
			quantity: product.quantity,
		})),
		total: totalPrice(),
	};

	const handleClick = () => {
		const db = getFirestore();
		const ordersCollection = collection(db, "orders");
		
		
		addDoc(ordersCollection, order).then(({ id }) => {
			console.log(id);
			Swal.fire(
				'Compra realizada!',
				`
				ID de compra: ${id}
				`,
				'success'
				)
		});
		clearCart();


	};


	if (cart.length === 0) {
		return (
			<div className="default-cart">
				<p>Todavía no hay elementos en el carrito</p>
				<Link to='/'>Hacer compras</Link>
			</div>
		);
	}

	return(
		<>
		<div className="cart-items-container">
			{
			cart.map(product => <ItemCart key={product.id} product={product}/>)
			}
			<p className="total">
				Total: ${totalPrice()}
			</p>

			<form className="cart-form" onSubmit={() => handleClick()}>
				<div>
					<label htmlFor="fname">Nombre:</label>
					<input 
					type="text"  
					id="fname" 
					className="name" 
					value={newName} 
					required 
					onChange={nameHandler}/>
				</div>
				<div>
					<label htmlFor="fmail">Email:</label>
					<input 
					type="email" 
					id="fmail" 
					className="email"
					value={newEmail} 
					required 
					onChange={emailHandler}/>
				</div>
				<div>
					<label htmlFor="fphone">Télefono:</label>
					<input 
					type="tel" 
					id="fphone" 
					className="phone"
					value={newTel}
					required 
					onChange={telHandler}/>
				</div>
				<div>
					<label htmlFor="faddress">Dirección:</label>
					<input 
					type="text" 
					id="faddress" 
					className="address" 
					value={newDir}
					required 
					onChange={dirHandler}/>
				</div>
				<input type="submit" value="Emitir compra" className="cart-clear"/>
				<button onClick={() => clearCart()} className="cart-clear">Limpiar Carrito</button>
			</form>

			{/* {<button onClick={() => clearCart()} className="cart-clear">Limpiar Carrito</button>
			<button onClick={() => handleClick()} className="cart-clear">Emitir compra</button>} */}
		</div>
		</>
	)
};

export default Cart;
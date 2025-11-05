document.addEventListener('DOMContentLoaded', () => {
	// ========== PAGE LOADER ==========
	const pageLoader = document.querySelector('.page-loader');

	window.addEventListener('load', () => {
		setTimeout(() => {
			pageLoader?.classList.add('hidden');
		}, 500);
	});

	// ========== VARIABLES GLOBALES ==========
	let cart = [];

	// ========== MODO OSCURO ==========
	const themeToggle = document.getElementById('theme-toggle');
	const body = document.body;
	const themeIcon = themeToggle?.querySelector('i');

	// Cargar tema guardado
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme === 'dark') {
		body.classList.add('dark-mode');
		if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
	}

	// Toggle tema
	themeToggle?.addEventListener('click', () => {
		body.classList.toggle('dark-mode');
		const isDark = body.classList.contains('dark-mode');

		if (themeIcon) {
			if (isDark) {
				themeIcon.classList.replace('fa-moon', 'fa-sun');
			} else {
				themeIcon.classList.replace('fa-sun', 'fa-moon');
			}
		}

		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	});

	// ========== SCROLL TO TOP ==========
	const scrollTopBtn = document.getElementById('scroll-top');
	const hero = document.getElementById('hero');

	window.addEventListener('scroll', () => {
		const scrolled = window.pageYOffset;

		// Scroll to top button
		if (scrolled > 300) {
			scrollTopBtn?.classList.add('visible');
		} else {
			scrollTopBtn?.classList.remove('visible');
		}

		// Header scroll effect
		const header = document.querySelector('header');
		if (scrolled > 100) {
			header?.classList.add('scrolled');
		} else {
			header?.classList.remove('scrolled');
		}

		// Parallax effect en hero
		if (hero && scrolled < hero.offsetHeight) {
			hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
		}
	});

	scrollTopBtn?.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});

	// ========== SCROLL REVEAL ANIMATIONS ==========
	const revealElements = document.querySelectorAll('.scroll-reveal');
	let statsAnimated = false;

	const revealOnScroll = () => {
		revealElements.forEach(element => {
			const elementTop = element.getBoundingClientRect().top;
			const windowHeight = window.innerHeight;

			if (elementTop < windowHeight - 100) {
				element.classList.add('revealed');
			}
		});

		// Animar estadísticas
		const statsSection = document.querySelector('.stats-section');
		if (statsSection && !statsAnimated) {
			const statsSectionTop = statsSection.getBoundingClientRect().top;
			if (statsSectionTop < window.innerHeight - 100) {
				animateNumbers();
				statsAnimated = true;
			}
		}
	};

	window.addEventListener('scroll', revealOnScroll);
	revealOnScroll(); // Initial check

	// ========== MOBILE MENU ==========
	const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
	const mainNav = document.querySelector('.main-nav');

	mobileMenuToggle?.addEventListener('click', () => {
		mainNav?.classList.toggle('active');
		const icon = mobileMenuToggle.querySelector('i');
		if (icon) {
			icon.classList.toggle('fa-bars');
			icon.classList.toggle('fa-times');
		}
	});

	// Cerrar menú al hacer click en un enlace
	document.querySelectorAll('.main-nav a').forEach(link => {
		link.addEventListener('click', () => {
			mainNav?.classList.remove('active');
			const icon = mobileMenuToggle?.querySelector('i');
			if (icon) {
				icon.classList.remove('fa-times');
				icon.classList.add('fa-bars');
			}
		});
	});

	// ========== HERO SCROLL INDICATOR ==========
	const scrollIndicator = document.querySelector('.hero-scroll-indicator');
	scrollIndicator?.addEventListener('click', () => {
		document.querySelector('#nosotros')?.scrollIntoView({
			behavior: 'smooth'
		});
	});

	// ========== FILTRADO Y BÚSQUEDA DE PRODUCTOS ==========
	const searchInput = document.getElementById('search-input');
	const filterButtons = document.querySelectorAll('.filter-btn');
	const sortSelect = document.getElementById('sort-select');
	const productCards = document.querySelectorAll('.product-card');

	// Búsqueda de productos
	searchInput?.addEventListener('input', (e) => {
		const searchTerm = e.target.value.toLowerCase();
		filterProducts(searchTerm, getCurrentFilter(), getCurrentSort());
	});

	// Filtrado por categoría
	filterButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			filterButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			const filter = btn.dataset.filter;
			filterProducts(getSearchTerm(), filter, getCurrentSort());
		});
	});

	// Ordenamiento
	sortSelect?.addEventListener('change', (e) => {
		const sortValue = e.target.value;
		filterProducts(getSearchTerm(), getCurrentFilter(), sortValue);
	});

	function getSearchTerm() {
		return searchInput?.value.toLowerCase() || '';
	}

	function getCurrentFilter() {
		return document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
	}

	function getCurrentSort() {
		return sortSelect?.value || 'default';
	}

	function filterProducts(searchTerm, category, sortValue) {
		let visibleProducts = Array.from(productCards);

		// Filtrar por búsqueda
		visibleProducts = visibleProducts.filter(card => {
			const name = (card.dataset.name || '').toLowerCase();
			return name.includes(searchTerm);
		});

		// Filtrar por categoría
		if (category !== 'all') {
			visibleProducts = visibleProducts.filter(card => {
				return card.dataset.category === category;
			});
		}

		// Ordenar
		if (sortValue === 'price-asc') {
			visibleProducts.sort((a, b) => {
				return parseFloat(a.dataset.price || 0) - parseFloat(b.dataset.price || 0);
			});
		} else if (sortValue === 'price-desc') {
			visibleProducts.sort((a, b) => {
				return parseFloat(b.dataset.price || 0) - parseFloat(a.dataset.price || 0);
			});
		} else if (sortValue === 'name') {
			visibleProducts.sort((a, b) => {
				return (a.dataset.name || '').localeCompare(b.dataset.name || '');
			});
		}

		// Mostrar/ocultar productos
		productCards.forEach(card => {
			if (visibleProducts.includes(card)) {
				card.classList.remove('hidden');
				card.style.animation = 'fadeIn 0.5s ease';
			} else {
				card.classList.add('hidden');
			}
		});

		// Reordenar en el DOM
		const grid = document.querySelector('.products-grid');
		if (grid && sortValue !== 'default') {
			visibleProducts.forEach(card => {
				grid.appendChild(card);
			});
		}
	}

	// ========== CARRITO DE COMPRAS ==========
	const cartModal = document.getElementById('cart-modal');
	const checkoutModal = document.getElementById('checkout-modal');
	const cartIcon = document.getElementById('cart-icon');
	const cartCount = document.getElementById('cart-count');
	const cartItemsContainer = document.getElementById('cart-items');
	const cartTotalPrice = document.getElementById('cart-total-price');
	const checkoutSummary = document.getElementById('checkout-summary');

	// Abrir y cerrar modales (protegido)
	if (cartIcon && cartModal) {
		cartIcon.addEventListener('click', () => {
			cartModal.style.display = 'block';
			renderCart();
		});
	}

	const closeBtn = document.querySelector('.close-btn');
	if (closeBtn && cartModal) {
		closeBtn.addEventListener('click', () => {
			cartModal.style.display = 'none';
		});
	}

	const closeCheckoutBtn = document.querySelector('.close-checkout-btn');
	if (closeCheckoutBtn && checkoutModal) {
		closeCheckoutBtn.addEventListener('click', () => {
			checkoutModal.style.display = 'none';
		});
	}

	window.addEventListener('click', (event) => {
		if (cartModal && event.target == cartModal) {
			cartModal.style.display = 'none';
		}
		if (checkoutModal && event.target == checkoutModal) {
			checkoutModal.style.display = 'none';
		}
	});

	// Añadir al carrito (protegido)
	document.querySelectorAll('.add-to-cart').forEach(button => {
		button.addEventListener('click', (e) => {
			const btn = e.currentTarget;
			const productCard = btn.closest('.product-card');
			if (!productCard) return;

			const productId = productCard.dataset.id;
			const productName = productCard.dataset.name;
			const productPrice = parseFloat(productCard.dataset.price) || 0;

			const existingItem = cart.find(item => item.id === productId);
			if (existingItem) {
				existingItem.quantity++;
			} else {
				cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
			}
			updateCartUI();

			// Animación del botón (si existe)
			btn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
			btn.style.background = '#28a745';

			setTimeout(() => {
				btn.innerHTML = '<i class="fas fa-cart-plus"></i> Añadir al Carrito';
				btn.style.background = '';
			}, 1500);

			// Notificación toast
			showToast(`${productName} añadido al carrito`);
		});
	});

	// Función para mostrar notificaciones toast
	function showToast(message) {
		const toast = document.createElement('div');
		toast.className = 'toast-notification';
		toast.innerHTML = `
			<i class="fas fa-check-circle"></i>
			<span>${message}</span>
		`;
		document.body.appendChild(toast);

		setTimeout(() => {
			toast.classList.add('show');
		}, 100);

		setTimeout(() => {
			toast.classList.remove('show');
			setTimeout(() => {
				toast.remove();
			}, 300);
		}, 3000);
	}

	// Renderizar carrito (con protecciones)
	function renderCart() {
		if (!cartItemsContainer || !cartTotalPrice) return;

		cartItemsContainer.innerHTML = '';
		let total = 0;

		if (cart.length === 0) {
			cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
		} else {
			cart.forEach(item => {
				const itemElement = document.createElement('div');
				itemElement.classList.add('cart-item');
				itemElement.innerHTML = `
					<h4>${item.name}</h4>
					<div class="item-quantity">
						<button class="decrease-quantity" data-id="${item.id}">-</button>
						<span>${item.quantity}</span>
						<button class="increase-quantity" data-id="${item.id}">+</button>
					</div>
					<span class="item-price">${(item.price * item.quantity).toFixed(2)}€</span>
				`;
				cartItemsContainer.appendChild(itemElement);
				total += item.price * item.quantity;
			});
		}
		cartTotalPrice.textContent = `${total.toFixed(2)}€`;
		attachQuantityListeners();
	}

	// Actualizar UI del carrito
	function updateCartUI() {
		if (cartCount) {
			const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
			cartCount.textContent = totalItems;
		}
		renderCart();
	}

	// Listeners para botones de cantidad
	function attachQuantityListeners() {
		document.querySelectorAll('.increase-quantity').forEach(btn => {
			btn.addEventListener('click', (e) => {
				const id = e.currentTarget.dataset.id;
				const item = cart.find(item => item.id === id);
				if (item) {
					item.quantity++;
					updateCartUI();
				}
			});
		});

		document.querySelectorAll('.decrease-quantity').forEach(btn => {
			btn.addEventListener('click', (e) => {
				const id = e.currentTarget.dataset.id;
				const itemIndex = cart.findIndex(item => item.id === id);
				if (itemIndex > -1) {
					cart[itemIndex].quantity--;
					if (cart[itemIndex].quantity === 0) {
						cart.splice(itemIndex, 1);
					}
					updateCartUI();
				}
			});
		});
	}

	// Proceder al checkout (protegido)
	const checkoutBtn = document.getElementById('checkout-btn');
	if (checkoutBtn) {
		checkoutBtn.addEventListener('click', () => {
			if (cart.length === 0) {
				alert('Tu carrito está vacío.');
				return;
			}
			if (cartModal) cartModal.style.display = 'none';
			renderCheckoutSummary();
			if (checkoutModal) checkoutModal.style.display = 'block';
		});
	}

	// Renderizar resumen del checkout (protegido)
	function renderCheckoutSummary() {
		if (!checkoutSummary) return;
		checkoutSummary.innerHTML = '<h3>Resumen del Pedido</h3>';
		let total = 0;
		cart.forEach(item => {
			checkoutSummary.innerHTML += `<p>${item.name} x ${item.quantity} - ${(item.price * item.quantity).toFixed(2)}€</p>`;
			total += item.price * item.quantity;
		});
		checkoutSummary.innerHTML += `<h4>Total: ${total.toFixed(2)}€</h4>`;
	}

	// Formulario de checkout (DEMO) (protegido)
	const checkoutForm = document.getElementById('checkout-form');
	if (checkoutForm) {
		checkoutForm.addEventListener('submit', (e) => {
			e.preventDefault();
			alert('¡Gracias por tu pedido! Esta es una demostración, no se ha realizado ningún cargo. Te contactaremos pronto.');
			cart = []; // Vaciar carrito
			updateCartUI();
			if (checkoutModal) checkoutModal.style.display = 'none';
		});
	}

	// Formulario de contacto (DEMO)
	const contactForm = document.getElementById('contact-form');
	contactForm?.addEventListener('submit', (e) => {
		e.preventDefault();

		// Animación de envío
		const submitBtn = contactForm.querySelector('button[type="submit"]');
		const originalText = submitBtn.textContent;
		submitBtn.textContent = 'Enviando...';
		submitBtn.disabled = true;

		setTimeout(() => {
			alert('¡Mensaje enviado! Esta es una demostración. Te responderemos a la mayor brevedad posible.');
			e.target.reset();
			submitBtn.textContent = originalText;
			submitBtn.disabled = false;
		}, 1000);
	});

	// ========== SMOOTH SCROLL PARA TODOS LOS ENLACES ==========
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			const href = this.getAttribute('href');
			if (href !== '#' && href !== '#inicio') {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) {
					target.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				}
			}
		});
	});

	// ========== ANIMACIÓN DE NÚMEROS (CONTADOR) ==========
	const animateNumbers = () => {
		const numbers = document.querySelectorAll('.stat-number');
		numbers.forEach(num => {
			const target = parseInt(num.getAttribute('data-target')) || 0;
			const duration = 2000;
			const increment = target / (duration / 16);
			let current = 0;

			const updateNumber = () => {
				current += increment;
				if (current < target) {
					num.textContent = Math.floor(current);
					requestAnimationFrame(updateNumber);
				} else {
					num.textContent = target;
					// Añadir símbolo + si es necesario
					if (target >= 100) {
						num.textContent = target + '+';
					}
				}
			};

			updateNumber();
		});
	};

	// ========== LAZY LOADING PARA IMÁGENES ==========
	const images = document.querySelectorAll('img[data-src]');
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const img = entry.target;
				img.src = img.dataset.src;
				img.removeAttribute('data-src');
				observer.unobserve(img);
			}
		});
	});

	images.forEach(img => imageObserver.observe(img));

	console.log('🚀 TeOric - Web mejorada cargada correctamente');
});

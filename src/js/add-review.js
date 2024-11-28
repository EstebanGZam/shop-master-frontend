document.addEventListener('DOMContentLoaded', function () {
    const reviewModal = new bootstrap.Modal(document.getElementById('reviewModal'));
    const addReviewBtn = document.getElementById('add-review-btn');
    const starButtons = document.querySelectorAll('.star-btn');
    const submitReviewBtn = document.getElementById('submit-review');

    let selectedRating = null;

    // Abrir modal
    addReviewBtn.addEventListener('click', function () {
        reviewModal.show();
    });

    // Selección de calificación
    starButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Quitar clase 'selected' de todos los botones
            starButtons.forEach(btn => btn.classList.remove('selected'));

            // Agregar clase 'selected' al botón clickeado
            this.classList.add('selected');

            // Guardar rating seleccionado
            selectedRating = parseFloat(this.getAttribute('data-rating'));
        });
    });

    // Enviar reseña
    submitReviewBtn.addEventListener('click', function () {
        const comment = document.getElementById('review-comment').value.trim();

        // Validaciones
        if (selectedRating === null) {
            alert('Por favor, selecciona una calificación');
            return;
        }

        if (!comment) {
            alert('Por favor, escribe un comentario');
            return;
        }

        // Preparar datos para enviar
        const reviewData = {
            rating: selectedRating,
            comment: comment,
            productId: sessionStorage.getItem('selectedProductId'),
        };

        // Enviar reseña (ejemplo de fetch)
        fetch('http://localhost:8080/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${document.cookie.split("=")[1]}`,
            },
            body: JSON.stringify(reviewData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al enviar la reseña');
                }
                return response.json();
            })
            .then(data => {
                alert('Reseña enviada exitosamente');
                reviewModal.hide();
                // Limpiar formulario
                document.getElementById('review-comment').value = '';
                starButtons.forEach(btn => btn.classList.remove('selected'));
                selectedRating = null;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un problema al enviar la reseña');
            });
    });
});

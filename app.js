let bookingModal;
let viewBookingModal;
let currentRoomType = '';
let currentRoomPrice = 0;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof bootstrap !== 'undefined') {
        const bookingModalElement = document.getElementById('bookingModal');
        if (bookingModalElement) {
            bookingModal = new bootstrap.Modal(bookingModalElement);
        }
        
        const viewBookingModalElement = document.getElementById('viewBookingModal');
        if (viewBookingModalElement) {
            viewBookingModal = new bootstrap.Modal(viewBookingModalElement);
        }
    }
    
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput) {
        const today = new Date().toISOString().split('T')[0];
        checkInInput.setAttribute('min', today);
        
        checkInInput.addEventListener('change', function() {
            checkOutInput.setAttribute('min', this.value);
            calculateTotal();
        });
    }
    
    if (checkOutInput) {
        checkOutInput.addEventListener('change', calculateTotal);
    }
    
    if (window.location.pathname.includes('bookings.html')) {
        loadBookings();
    }
});

function openBookingModal(roomType, price) {
    currentRoomType = roomType;
    currentRoomPrice = price;
    
    document.getElementById('roomType').value = roomType;
    document.getElementById('roomPrice').value = 'Rs. ' + price + '/night';
    
    document.getElementById('bookingForm').reset();
    document.getElementById('roomType').value = roomType;
    document.getElementById('roomPrice').value = 'Rs. ' + price + '/night';
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').setAttribute('min', today);
    
    if (bookingModal) {
        bookingModal.show();
    }
}

function calculateTotal() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    
    if (checkIn && checkOut) {
        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        
        if (endDate > startDate) {
            const timeDiff = endDate.getTime() - startDate.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const total = nights * currentRoomPrice;
            document.getElementById('totalAmount').value = 'Rs. ' + total + ' (' + nights + ' nights)';
        } else {
            document.getElementById('totalAmount').value = '';
            alert('Check-out date must be after check-in date');
        }
    }
}

function submitBooking() {
    const form = document.getElementById('bookingForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const guestName = document.getElementById('guestName').value.trim();
    const guestEmail = document.getElementById('guestEmail').value.trim();
    const guestPhone = document.getElementById('guestPhone').value.trim();
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const numGuests = document.getElementById('numGuests').value;
    const totalAmount = document.getElementById('totalAmount').value;
    
    if (!guestName || !guestEmail || !guestPhone || !checkIn || !checkOut || !totalAmount) {
        alert('Please fill in all required fields');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
        alert('Please enter a valid email address');
        return;
    }
    
    const booking = {
        id: Date.now().toString(),
        roomType: currentRoomType,
        roomPrice: currentRoomPrice,
        guestName: guestName,
        guestEmail: guestEmail,
        guestPhone: guestPhone,
        checkIn: checkIn,
        checkOut: checkOut,
        numGuests: numGuests,
        totalAmount: totalAmount,
        bookingDate: new Date().toISOString()
    };
    
    let bookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];
    bookings.push(booking);
    localStorage.setItem('hotelBookings', JSON.stringify(bookings));
    
    if (bookingModal) {
        bookingModal.hide();
    }
    
    alert('Booking confirmed successfully! Booking ID: ' + booking.id);
    form.reset();
    
    window.location.href = 'bookings.html';
}

function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];
    const bookingsBody = document.getElementById('bookingsBody');
    const noBookingsAlert = document.getElementById('noBookingsAlert');
    const bookingsTable = document.getElementById('bookingsTable');
    
    if (bookings.length === 0) {
        noBookingsAlert.style.display = 'block';
        bookingsTable.style.display = 'none';
        return;
    }
    
    noBookingsAlert.style.display = 'none';
    bookingsTable.style.display = 'table';
    
    bookingsBody.innerHTML = '';
    
    bookings.reverse().forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.guestName}</td>
            <td>${booking.guestEmail}</td>
            <td>${booking.guestPhone}</td>
            <td>${booking.roomType}</td>
            <td>${formatDate(booking.checkIn)}</td>
            <td>${formatDate(booking.checkOut)}</td>
            <td>${booking.numGuests}</td>
            <td>${booking.totalAmount}</td>
            <td>
                <button class="btn btn-sm btn-info" data-booking-id="${booking.id}">
                    <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteBooking('${booking.id}')">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </td>
        `;
        
        const viewButton = row.querySelector('.btn-info');
        viewButton.addEventListener('click', () => viewBooking(booking.id));
        
        bookingsBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function viewBooking(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];
    const booking = bookings.find(b => b.id === bookingId);
    
    if (!booking) {
        alert('Booking not found');
        return;
    }
    
    const detailsHtml = `
        <div class="booking-details">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Room Type:</strong> ${booking.roomType}</p>
            <p><strong>Price per Night:</strong> Rs. ${booking.roomPrice}</p>
            <hr>
            <p><strong>Guest Name:</strong> ${booking.guestName}</p>
            <p><strong>Email:</strong> ${booking.guestEmail}</p>
            <p><strong>Phone:</strong> ${booking.guestPhone}</p>
            <p><strong>Number of Guests:</strong> ${booking.numGuests}</p>
            <hr>
            <p><strong>Check-in Date:</strong> ${formatDate(booking.checkIn)}</p>
            <p><strong>Check-out Date:</strong> ${formatDate(booking.checkOut)}</p>
            <p><strong>Total Amount:</strong> ${booking.totalAmount}</p>
            <hr>
            <p><strong>Booking Date:</strong> ${formatDate(booking.bookingDate)}</p>
        </div>
    `;
    
    document.getElementById('bookingDetails').innerHTML = detailsHtml;
    
    if (viewBookingModal) {
        viewBookingModal.show();
    }
}

function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        let bookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];
        bookings = bookings.filter(b => b.id !== bookingId);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));
        loadBookings();
    }
}

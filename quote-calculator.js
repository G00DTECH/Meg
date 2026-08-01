// Quote Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Portland, Maine coordinates for distance calculation
    const PORTLAND_ME_LAT = 43.6591;
    const PORTLAND_ME_LNG = -70.2568;
    const TRAVEL_RATE_PER_MILE = 1.00;
    const FREE_TRAVEL_RADIUS = 30; // miles

    // Initialize calculator
    initializeQuoteCalculator();
    
    function initializeQuoteCalculator() {
        // Add event listeners for service checkboxes
        const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateQuote);
        });

        // Add event listeners for quantity and price inputs
        const qtyInputs = document.querySelectorAll('.qty-input');
        qtyInputs.forEach(input => {
            input.addEventListener('input', updateQuote);
        });

        const priceInputs = document.querySelectorAll('.price-input');
        priceInputs.forEach(input => {
            input.addEventListener('input', updateQuote);
        });

        // Add event listeners for location inputs
        const locationInput = document.getElementById('client-location');
        const distanceOverride = document.getElementById('distance-override');
        
        locationInput.addEventListener('input', debounce(handleLocationChange, 500));
        distanceOverride.addEventListener('input', updateQuote);

        // Add event listeners for buttons
        document.getElementById('calculate-distance').addEventListener('click', calculateDistanceFromLocation);
        document.getElementById('book-appointment').addEventListener('click', handleBookAppointment);
        document.getElementById('email-quote').addEventListener('click', handleEmailQuote);

        // Initial quote update
        updateQuote();
    }

    function updateQuote() {
        const selectedServices = getSelectedServices();
        const distance = getCurrentDistance();
        
        // Update selected services display
        updateSelectedServicesDisplay(selectedServices);
        
        // Calculate totals
        const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
        const travelCharge = calculateTravelCharge(distance);
        const totalQuote = servicesTotal + travelCharge;
        
        // Update displays
        document.getElementById('services-total').textContent = formatCurrency(servicesTotal);
        document.getElementById('travel-distance').textContent = distance > 0 ? `${distance.toFixed(1)} miles` : '-- miles';
        document.getElementById('travel-charge').textContent = formatCurrency(travelCharge);
        document.getElementById('total-quote').textContent = formatCurrency(totalQuote);
        
        // Enable/disable action buttons
        const hasServices = selectedServices.length > 0;
        document.getElementById('book-appointment').disabled = !hasServices;
        document.getElementById('email-quote').disabled = !hasServices;
        
        // Update button styling based on enabled state
        updateButtonStates();
    }

    function getSelectedServices() {
        const selectedServices = [];
        const serviceCheckboxes = document.querySelectorAll('.service-checkbox:checked');
        
        serviceCheckboxes.forEach(checkbox => {
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            const serviceName = label.querySelector('span').textContent;
            let basePrice = parseFloat(checkbox.dataset.price);
            let quantity = 1;
            let finalPrice = basePrice;

            // Handle custom pricing
            if (checkbox.dataset.custom === 'true') {
                const priceInput = label.querySelector('.price-input');
                if (priceInput && priceInput.value) {
                    basePrice = parseFloat(priceInput.value) || basePrice;
                }
            }

            // Handle quantity-based services
            if (checkbox.dataset.qty === 'true') {
                const qtyInput = label.querySelector('.qty-input');
                if (qtyInput && qtyInput.value) {
                    quantity = parseInt(qtyInput.value) || 1;
                }
            }

            finalPrice = basePrice * quantity;
            
            selectedServices.push({
                name: serviceName,
                basePrice: basePrice,
                quantity: quantity,
                price: finalPrice,
                id: checkbox.id,
                isBundle: checkbox.dataset.bundle === 'true',
                isCustom: checkbox.dataset.custom === 'true',
                hasQuantity: checkbox.dataset.qty === 'true'
            });
        });
        
        return selectedServices;
    }

    function updateSelectedServicesDisplay(services) {
        const container = document.getElementById('selected-services');
        
        if (services.length === 0) {
            container.innerHTML = '<p class="text-gray-600 italic">No services selected yet...</p>';
            return;
        }
        
        const servicesList = services.map(service => {
            let displayName = service.name;
            
            // Add quantity and pricing details for display
            if (service.hasQuantity && service.quantity > 1) {
                displayName += ` (${service.quantity}x ${formatCurrency(service.basePrice)})`;
            } else if (service.isCustom && service.basePrice !== parseFloat(document.querySelector(`#${service.id}`).dataset.price)) {
                displayName += ` (Custom: ${formatCurrency(service.basePrice)})`;
            }
            
            if (service.isBundle) {
                displayName += ' 📦';
            }
            
            return `<div class="flex justify-between">
                <span class="text-sm">${displayName}</span>
                <span class="font-medium">${formatCurrency(service.price)}</span>
            </div>`;
        }).join('');
        
        container.innerHTML = servicesList;
    }

    function getCurrentDistance() {
        const distanceOverride = document.getElementById('distance-override').value;
        if (distanceOverride && distanceOverride > 0) {
            return parseFloat(distanceOverride);
        }
        
        // Check if we have a calculated distance stored
        const calculatedDistance = document.getElementById('calculated-distance');
        if (calculatedDistance && calculatedDistance.value) {
            return parseFloat(calculatedDistance.value);
        }
        
        return 0;
    }

    function calculateTravelCharge(distance) {
        if (distance <= FREE_TRAVEL_RADIUS) {
            return 0;
        }
        return (distance - FREE_TRAVEL_RADIUS) * TRAVEL_RATE_PER_MILE;
    }

    function calculateDistanceFromLocation() {
        const locationInput = document.getElementById('client-location');
        const location = locationInput.value.trim();
        
        if (!location) {
            alert('Please enter your location first.');
            locationInput.focus();
            return;
        }
        
        // Show loading state
        const button = document.getElementById('calculate-distance');
        const originalText = button.textContent;
        button.textContent = 'Calculating...';
        button.disabled = true;
        
        // Use a simple geocoding approach with fallback to manual entry
        geocodeLocation(location)
            .then(coordinates => {
                const distance = calculateDistanceBetweenPoints(
                    PORTLAND_ME_LAT, PORTLAND_ME_LNG,
                    coordinates.lat, coordinates.lng
                );
                
                // Store the calculated distance
                let calculatedDistanceInput = document.getElementById('calculated-distance');
                if (!calculatedDistanceInput) {
                    calculatedDistanceInput = document.createElement('input');
                    calculatedDistanceInput.type = 'hidden';
                    calculatedDistanceInput.id = 'calculated-distance';
                    document.body.appendChild(calculatedDistanceInput);
                }
                calculatedDistanceInput.value = distance;
                
                updateQuote();
                
                // Show success message
                showNotification(`Distance calculated: ${distance.toFixed(1)} miles from Portland, ME`, 'success');
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                showDistanceInputDialog();
            })
            .finally(() => {
                button.textContent = originalText;
                button.disabled = false;
            });
    }

    async function geocodeLocation(location) {
        // Simple geocoding using a basic approach
        // In a production app, you'd want to use Google Maps API or similar
        
        // For demo purposes, we'll use a fallback approach
        // This would normally make an API call to a geocoding service
        
        // Check if location looks like a Maine city (basic heuristic)
        const maineCities = {
            'portland': { lat: 43.6591, lng: -70.2568 },
            'portland, me': { lat: 43.6591, lng: -70.2568 },
            'portland maine': { lat: 43.6591, lng: -70.2568 },
            'bangor': { lat: 44.8016, lng: -68.7712 },
            'bangor, me': { lat: 44.8016, lng: -68.7712 },
            'augusta': { lat: 44.3106, lng: -69.7795 },
            'augusta, me': { lat: 44.3106, lng: -69.7795 },
            'lewiston': { lat: 44.1001, lng: -70.2148 },
            'lewiston, me': { lat: 44.1001, lng: -70.2148 },
            'south portland': { lat: 43.6414, lng: -70.2409 },
            'biddeford': { lat: 43.4926, lng: -70.4533 },
            'sanford': { lat: 43.4389, lng: -70.7739 },
            'brunswick': { lat: 43.9142, lng: -69.9653 },
            'scarborough': { lat: 43.5781, lng: -70.3302 },
            'westbrook': { lat: 43.6773, lng: -70.3714 }
        };
        
        const locationKey = location.toLowerCase();
        if (maineCities[locationKey]) {
            return maineCities[locationKey];
        }
        
        // If not found, throw error to trigger manual input
        throw new Error('Location not found in database');
    }

    function showDistanceInputDialog() {
        const distance = prompt('Unable to automatically calculate distance. Please enter the distance in miles from Portland, Maine:', '');
        
        if (distance && !isNaN(distance) && distance > 0) {
            const distanceOverride = document.getElementById('distance-override');
            distanceOverride.value = distance;
            updateQuote();
            showNotification('Distance updated manually', 'success');
        }
    }

    function calculateDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
        // Haversine formula for calculating distance between two points
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function handleLocationChange() {
        // Clear any existing calculated distance when location changes
        const calculatedDistance = document.getElementById('calculated-distance');
        if (calculatedDistance) {
            calculatedDistance.value = '';
        }
        
        // Clear distance override if location is being typed
        const distanceOverride = document.getElementById('distance-override');
        if (distanceOverride.value) {
            distanceOverride.value = '';
        }
        
        updateQuote();
    }

    function handleBookAppointment() {
        const quote = generateQuoteText();
        const styleseatUrl = 'https://www.styleseat.com/m/v/meghanlaurahair';
        
        // Create a booking message
        const bookingMessage = `Hi Meghan! I used your quote calculator and would like to book an appointment.\n\n${quote}`;
        
        // For now, we'll copy to clipboard and redirect to StyleSeat
        if (navigator.clipboard) {
            navigator.clipboard.writeText(bookingMessage).then(() => {
                showNotification('Quote copied to clipboard! Redirecting to booking page...', 'success');
                setTimeout(() => {
                    window.open(styleseatUrl, '_blank');
                }, 1500);
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = bookingMessage;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            showNotification('Quote copied to clipboard! Redirecting to booking page...', 'success');
            setTimeout(() => {
                window.open(styleseatUrl, '_blank');
            }, 1500);
        }
    }

    function handleEmailQuote() {
        const clientEmail = document.getElementById('client-email').value.trim();
        const quote = generateQuoteText();
        const subject = encodeURIComponent('DJ/MC & Hair Styling Quote - Meghan Hair Studio');
        
        // If client provided their email, create a more personalized experience
        if (clientEmail) {
            // Create a professional email template
            const emailBody = `Hi there!

Thank you for using our quote calculator. Here's your personalized quote:

${quote}

To book your services or ask questions, please:
• Visit: https://www.styleseat.com/m/v/meghanlaurahair
• Reply to this email with your preferred dates
• Call/text for immediate assistance

We look forward to working with you!

Best regards,
Meghan Hair Studio
Portland, Maine

---
This quote was generated on ${new Date().toLocaleDateString()} and is valid for 30 days.`;

            // Use Gmail compose URL for better formatting
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(clientEmail)}&su=${subject}&body=${encodeURIComponent(emailBody)}`;
            
            // Try Gmail first, fallback to mailto
            const useGmail = confirm('Open in Gmail for better formatting? (Click Cancel to use your default email app)');
            
            if (useGmail) {
                window.open(gmailUrl, '_blank');
                showNotification('Gmail opened with formatted quote email', 'success');
            } else {
                createMailtoLink(quote, subject);
            }
        } else {
            // No email provided, use standard mailto
            createMailtoLink(quote, subject);
        }
    }

    function createMailtoLink(quote, subject) {
        // Truncate body if too long for mailto (2000 char limit)
        let body = quote;
        if (body.length > 1800) {
            body = body.substring(0, 1800) + '\n\n[Quote truncated - please contact for full details]';
        }
        
        const encodedBody = encodeURIComponent(body);
        const mailtoLink = `mailto:?subject=${subject}&body=${encodedBody}`;
        
        // Try to open mailto, fallback to copy if it fails
        try {
            window.location.href = mailtoLink;
            showNotification('Email client opened with quote details', 'success');
        } catch (error) {
            // Fallback to clipboard copy
            if (navigator.clipboard) {
                navigator.clipboard.writeText(quote).then(() => {
                    showNotification('Quote copied to clipboard! Paste into your email.', 'success');
                });
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = quote;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showNotification('Quote copied to clipboard! Paste into your email.', 'success');
            }
        }
    }

    function generateQuoteText() {
        const selectedServices = getSelectedServices();
        const distance = getCurrentDistance();
        const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
        const travelCharge = calculateTravelCharge(distance);
        const totalQuote = servicesTotal + travelCharge;
        const location = document.getElementById('client-location').value || 'Not specified';
        const notes = document.getElementById('additional-notes').value || 'None';
        
        let quoteText = `DJ/MC & HAIR STYLING QUOTE - MEGHAN HAIR STUDIO\n`;
        quoteText += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
        
        quoteText += `SELECTED SERVICES:\n`;
        selectedServices.forEach(service => {
            let serviceLine = `• ${service.name}`;
            
            if (service.hasQuantity && service.quantity > 1) {
                serviceLine += ` (${service.quantity} x ${formatCurrency(service.basePrice)})`;
            } else if (service.isCustom) {
                serviceLine += ` (Custom pricing)`;
            }
            
            if (service.isBundle) {
                serviceLine += ` [BUNDLE - DISCOUNTED]`;
            }
            
            serviceLine += `: ${formatCurrency(service.price)}\n`;
            quoteText += serviceLine;
        });
        
        quoteText += `\nLOCATION DETAILS:\n`;
        quoteText += `Client Location: ${location}\n`;
        quoteText += `Distance from Portland, ME: ${distance > 0 ? distance.toFixed(1) + ' miles' : 'Not calculated'}\n`;
        
        quoteText += `\nPRICING BREAKDOWN:\n`;
        quoteText += `Services Total: ${formatCurrency(servicesTotal)}\n`;
        quoteText += `Travel Charge: ${formatCurrency(travelCharge)}`;
        if (travelCharge > 0) {
            quoteText += ` (${(distance - FREE_TRAVEL_RADIUS).toFixed(1)} miles × $${TRAVEL_RATE_PER_MILE}/mile)`;
        }
        quoteText += `\nTOTAL QUOTE: ${formatCurrency(totalQuote)}\n`;
        
        if (notes !== 'None') {
            quoteText += `\nSPECIAL REQUESTS:\n${notes}\n`;
        }
        
        quoteText += `\nIMPORTANT NOTES:\n`;
        quoteText += `• This is an estimate - final pricing confirmed during consultation\n`;
        quoteText += `• Travel charges apply for distances over ${FREE_TRAVEL_RADIUS} miles from Portland, ME\n`;
        quoteText += `• Color service pricing may vary based on hair length and complexity\n\n`;
        
        quoteText += `To book your appointment, visit: https://www.styleseat.com/m/v/meghanlaurahair`;
        
        return quoteText;
    }

    function updateButtonStates() {
        const bookButton = document.getElementById('book-appointment');
        const emailButton = document.getElementById('email-quote');
        
        if (bookButton.disabled) {
            bookButton.classList.add('opacity-50', 'cursor-not-allowed');
            bookButton.classList.remove('hover:from-sky-600', 'hover:to-pink-600', 'transform', 'hover:scale-105');
        } else {
            bookButton.classList.remove('opacity-50', 'cursor-not-allowed');
            bookButton.classList.add('hover:from-sky-600', 'hover:to-pink-600', 'transform', 'hover:scale-105');
        }
        
        if (emailButton.disabled) {
            emailButton.classList.add('opacity-50', 'cursor-not-allowed');
            emailButton.classList.remove('hover:bg-sky-500', 'hover:text-white');
        } else {
            emailButton.classList.remove('opacity-50', 'cursor-not-allowed');
            emailButton.classList.add('hover:bg-sky-500', 'hover:text-white');
        }
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm transition-all duration-300 transform translate-x-full`;
        
        // Set color based on type
        if (type === 'success') {
            notification.className += ' bg-green-500 text-white';
        } else if (type === 'error') {
            notification.className += ' bg-red-500 text-white';
        } else {
            notification.className += ' bg-blue-500 text-white';
        }
        
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateDistanceBetweenPoints,
        formatCurrency
    };
}
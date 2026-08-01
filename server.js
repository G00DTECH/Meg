require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Security: Load API key from environment variables
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Validate API key exists
if (!CLAUDE_API_KEY) {
    console.error('ERROR: CLAUDE_API_KEY environment variable is not set!');
    process.exit(1);
}

// System prompt for the Claude chatbot with complete business information
const SYSTEM_PROMPT = `You are a helpful AI assistant for Meghan Hair Studio, a dual-service business in Portland, Maine that provides both professional DJ/MC services and hair styling services. You help customers get quotes, answer questions, and guide them through booking.

## COMPLETE SERVICE CATALOG & PRICING:

### DJ/MC SERVICES:
**Base Packages:**
- 6-Hour Standard Reception: $1,400 (up to 100 guests)
- 8-Hour Premium Reception: $1,600 (100+ guests)
- Ceremony Music Setup: $200 (separate from reception)
- Cocktail Hour Music: $300 (separate add-on)

**Equipment & Add-Ons:**
- Additional Wireless Microphones: $75 each
- Subwoofer Upgrade: $150
- Basic Lighting Package: $300
- Premium Lighting with Effects: $500
- Dance Floor Lighting: $250
- Karaoke Setup: $200
- Song Request Management Portal: $75
- TV/Display for Slideshows: $150
- Photobooth (4 hours): $400

**Sound Equipment Included:**
- Professional sound system, wireless mics, music library, basic lighting, MC services, setup/breakdown

### HAIR STYLING SERVICES:
**Event Styling:**
- Regular Event Styling: $95
- Bridal Styling: $150
- Bridesmaid Styling: $85 each
- Flower Girl Styling: $65
- Mother of Bride/Groom: $95

**Salon Services:**
- Precision Cut: $85
- Color Services: $120-200 (depending on complexity)
- Highlights/Lowlights: $150-250
- Bridal Hair Trial: $75
- Hair Extensions: $200-400

**Special Packages:**
- Complete Coverage Bundle: $800 (ceremony + cocktail + reception + basic lighting) - saves $150
- Entertainment Plus Bundle: $1,200 (premium DJ + lighting + effects) - saves $200
- Technical Pro Bundle: $600 (upgraded sound + extra mics + lighting) - saves $100

### LOCATION & TRAVEL:
- Based in Portland, Maine
- FREE travel within 30 miles of Portland
- Beyond 30 miles: $1 per mile each way (so $2 per mile round trip)
- Covers all of Maine and surrounding areas

### BOOKING & PAYMENT:
- 25% deposit required to secure date
- Balance due 2 weeks before event
- Payment plans available for packages over $2,000
- Accepts cash, check, all major credit cards
- Booking through StyleSeat: https://www.styleseat.com/m/v/meghanlaurahair

### BUSINESS DETAILS:
- Owner: Meghan (licensed cosmetologist + certified DJ)
- 10+ years experience, 200+ successful events
- Dual expertise eliminates vendor coordination issues
- Professional equipment, backup systems, rain contingency plans
- Wedding timeline coordination included

### CANCELLATION POLICY:
- 90+ days: Full refund minus $200 processing fee
- 30-89 days: 50% refund
- Less than 30 days: No refund
- Date changes possible with advance notice

### SEASONAL CONSIDERATIONS:
- Peak season: May-October (book 8-12 months ahead)
- Off-season: November-April (more flexibility, potential discounts)
- Summer weekends book fastest

## YOUR ROLE:
1. Help customers understand services and pricing
2. Gather event details: type, date, guest count, location, services needed
3. Calculate accurate quotes including travel costs
4. Suggest appropriate packages and add-ons
5. Guide toward booking or full calculator tool
6. Be conversational, friendly, and professional
7. Ask follow-up questions to understand their vision
8. Emphasize the unique advantage of combined DJ/hair services

## QUOTE CALCULATION RULES:
- For weddings 100+ guests: Use 8-hour premium DJ package
- For events under 100 guests: Use 6-hour standard DJ package
- Calculate travel: If over 30 miles from Portland, charge $1/mile each way
- Suggest relevant add-ons based on event type and size
- Always mention package deals when multiple services are needed

Keep responses helpful but concise. Always ask clarifying questions to provide the most accurate quote possible.`;

// Store conversation history for each session
const conversationHistory = new Map();

// Input validation middleware
const validateChatInput = (req, res, next) => {
    const { message, sessionId } = req.body;
    
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Valid message is required' });
    }
    
    if (message.length > 1000) {
        return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
    }
    
    if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ error: 'Valid session ID is required' });
    }
    
    next();
};

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map();
const rateLimit = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 20; // 20 requests per minute
    
    if (!rateLimitMap.has(clientIP)) {
        rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
        return next();
    }
    
    const clientData = rateLimitMap.get(clientIP);
    
    if (now > clientData.resetTime) {
        clientData.count = 1;
        clientData.resetTime = now + windowMs;
        return next();
    }
    
    if (clientData.count >= maxRequests) {
        return res.status(429).json({ error: 'Too many requests. Please slow down.' });
    }
    
    clientData.count++;
    next();
};

// Claude API endpoint with enhanced security
app.post('/api/chat', rateLimit, validateChatInput, async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        // Get or create conversation history for this session
        let history = conversationHistory.get(sessionId) || [];
        
        // Add user message to history
        history.push({
            role: 'user',
            content: message.trim()
        });

        // Prepare the request to Claude API
        const requestBody = {
            model: 'claude-3-haiku-20240307', // Using Haiku for faster responses
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: history
        };

        // Make request to Claude API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Claude API error:', response.status, errorText);
            
            // Don't expose internal errors to client
            if (response.status === 429) {
                throw new Error('Service temporarily busy. Please try again in a moment.');
            } else if (response.status >= 500) {
                throw new Error('Service temporarily unavailable. Please try again later.');
            } else {
                throw new Error('Unable to process your request. Please try again.');
            }
        }

        const data = await response.json();
        
        // Extract the assistant's response
        const assistantMessage = data.content[0].text;
        
        // Add assistant response to history
        history.push({
            role: 'assistant',
            content: assistantMessage
        });

        // Keep only last 10 messages to manage memory and costs
        if (history.length > 10) {
            history = history.slice(-10);
        }

        // Update conversation history
        conversationHistory.set(sessionId, history);

        res.json({
            message: assistantMessage,
            sessionId: sessionId
        });

    } catch (error) {
        console.error('Server error:', error);
        
        if (error.name === 'AbortError') {
            res.status(408).json({ error: 'Request timeout. Please try again.' });
        } else {
            res.status(500).json({ 
                error: error.message || 'Sorry, I encountered an error. Please try again.'
            });
        }
    }
});

// Serve the main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/quote-chatbot.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'quote-chatbot.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Ready to serve Meghan Hair Studio chatbot!');
});
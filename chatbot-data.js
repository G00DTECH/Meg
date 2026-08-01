// Chatbot Q&A Data Sheet - Meghan Hair Studio
// Enhanced with quote generation and conversation state management

const ChatbotData = {
    // Conversation state management with session persistence
    conversationState: {
        // Enhanced context tracking
        conversationContext: {
            previousIntents: [], // Track last 5 intents
            mentionedTopics: [], // Track all mentioned topics
            userPreferences: {}, // Remember stated preferences
            engagementLevel: 'neutral', // Track user enthusiasm
            conversationTurn: 0, // Track conversation length
            userCommunicationStyle: 'neutral', // formal, casual, enthusiastic
            lastUserInput: '',
            conversationStartTime: null,
            
            addIntent(intent) {
                this.previousIntents.unshift(intent);
                if (this.previousIntents.length > 5) {
                    this.previousIntents.pop();
                }
                this.conversationTurn++;
            },
            
            wasRecentlyMentioned(topic, turns = 3) {
                return this.previousIntents.slice(0, turns).includes(topic);
            },
            
            addTopic(topic) {
                if (!this.mentionedTopics.includes(topic)) {
                    this.mentionedTopics.push(topic);
                }
            },
            
            detectCommunicationStyle(input) {
                const inputLower = input.toLowerCase();
                const enthusiasticWords = ['amazing', 'love', 'perfect', 'awesome', 'fantastic', '!'];
                const formalWords = ['would like', 'please', 'thank you', 'appreciate'];
                
                const enthusiasticCount = enthusiasticWords.filter(word => inputLower.includes(word)).length;
                const formalCount = formalWords.filter(word => inputLower.includes(word)).length;
                
                if (enthusiasticCount > 1) this.userCommunicationStyle = 'enthusiastic';
                else if (formalCount > 0) this.userCommunicationStyle = 'formal';
                else this.userCommunicationStyle = 'casual';
            }
        },
        
        currentStep: 'initial', // initial, event_type, guest_count, location, services, quote_complete
        collectedData: {
            eventType: null,
            guestCount: null,
            location: null,
            services: [],
            travelDistance: null,
            customRequests: [],
            userName: null,
            cart: [] // Array of selected service items
        },
        
        nextRequiredStep() {
            if (!this.collectedData.eventType) return 'event_type';
            if (!this.collectedData.guestCount) return 'guest_count';
            if (this.collectedData.services.length === 0) return 'services';
            if (!this.collectedData.travelDistance) return 'travel_distance';
            return 'quote_complete';
        },
        
        canGenerateQuote() {
            return this.nextRequiredStep() === 'quote_complete';
        },
        
        // Save state to localStorage
        saveToStorage() {
            try {
                localStorage.setItem('meghan_chatbot_state', JSON.stringify({
                    currentStep: this.currentStep,
                    collectedData: this.collectedData,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.warn('Could not save chatbot state to localStorage:', e);
            }
        },
        
        // Load state from localStorage
        loadFromStorage() {
            try {
                const saved = localStorage.getItem('meghan_chatbot_state');
                if (saved) {
                    const data = JSON.parse(saved);
                    // Only load if less than 30 days old (wedding planning timeline)
                    if (Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000) {
                        this.currentStep = data.currentStep || 'initial';
                        this.collectedData = { ...this.collectedData, ...data.collectedData };
                        return true;
                    }
                }
            } catch (e) {
                console.warn('Could not load chatbot state from localStorage:', e);
            }
            return false;
        },
        
        // Add item to cart
        addToCart(item) {
            // Remove existing item of same type if present
            this.collectedData.cart = this.collectedData.cart.filter(cartItem => cartItem.id !== item.id);
            // Add new item
            this.collectedData.cart.push({
                id: item.id,
                name: item.name,
                basePrice: item.basePrice || item.price,
                quantity: item.quantity || 1,
                totalPrice: (item.basePrice || item.price) * (item.quantity || 1),
                category: item.category || 'misc',
                addedAt: Date.now()
            });
            this.saveToStorage();
        },
        
        // Remove item from cart
        removeFromCart(itemId) {
            this.collectedData.cart = this.collectedData.cart.filter(item => item.id !== itemId);
            this.saveToStorage();
        },
        
        // Get cart total
        getCartTotal() {
            return this.collectedData.cart.reduce((total, item) => total + item.totalPrice, 0);
        },
        
        // Get cart summary
        getCartSummary() {
            if (this.collectedData.cart.length === 0) return 'Cart is empty';
            
            let summary = 'Current cart items:\n';
            this.collectedData.cart.forEach((item, index) => {
                summary += `${index + 1}. ${item.name}`;
                if (item.quantity > 1) {
                    summary += ` (${item.quantity}x)`;
                }
                summary += `: $${item.totalPrice}\n`;
            });
            summary += `\nCart Total: $${this.getCartTotal()}`;
            return summary;
        },
        
        reset() {
            this.currentStep = 'initial';
            this.collectedData = {
                eventType: null,
                guestCount: null,
                location: null,
                services: [],
                travelDistance: null,
                customRequests: [],
                userName: null,
                cart: []
            };
            // Reset context but preserve communication style
            const style = this.conversationContext.userCommunicationStyle;
            this.conversationContext = {
                previousIntents: [],
                mentionedTopics: [],
                userPreferences: {},
                engagementLevel: 'neutral',
                conversationTurn: 0,
                userCommunicationStyle: style,
                lastUserInput: '',
                conversationStartTime: Date.now(),
                
                addIntent(intent) {
                    this.previousIntents.unshift(intent);
                    if (this.previousIntents.length > 5) {
                        this.previousIntents.pop();
                    }
                    this.conversationTurn++;
                },
                
                wasRecentlyMentioned(topic, turns = 3) {
                    return this.previousIntents.slice(0, turns).includes(topic);
                },
                
                addTopic(topic) {
                    if (!this.mentionedTopics.includes(topic)) {
                        this.mentionedTopics.push(topic);
                    }
                },
                
                detectCommunicationStyle(input) {
                    const inputLower = input.toLowerCase();
                    const enthusiasticWords = ['amazing', 'love', 'perfect', 'awesome', 'fantastic', '!'];
                    const formalWords = ['would like', 'please', 'thank you', 'appreciate'];
                    
                    const enthusiasticCount = enthusiasticWords.filter(word => inputLower.includes(word)).length;
                    const formalCount = formalWords.filter(word => inputLower.includes(word)).length;
                    
                    if (enthusiasticCount > 1) this.userCommunicationStyle = 'enthusiastic';
                    else if (formalCount > 0) this.userCommunicationStyle = 'formal';
                    else this.userCommunicationStyle = 'casual';
                }
            };
            this.saveToStorage();
        }
    },

    // Intent categories and their responses
    intents: {
        // Emotional/Social Intents
        excitement: {
            keywords: ['amazing', 'perfect', 'love it', 'excited', 'can\'t wait', 'wonderful', 'fantastic', 'awesome', 'incredible', 'dream'],
            responses: [
                "I absolutely love your enthusiasm! Your excitement is contagious - this is going to be such a special day. Let's make sure we capture every detail perfectly!",
                "Your excitement tells me everything I need to know about how important this event is to you! I can't wait to help make it absolutely perfect.",
                "That enthusiasm is exactly what every great event needs! Let's channel that energy into creating something truly amazing together.",
                "I'm getting excited just talking with you! Your joy is exactly why I love helping with special events like this."
            ]
        },

        uncertainty: {
            keywords: ['not sure', 'maybe', 'thinking about', 'considering', 'might need', 'undecided', 'torn between', 'on the fence'],
            responses: [
                "No pressure at all! I'm here to help you explore your options without any rush. What aspects are you most uncertain about?",
                "That's completely normal - there are so many decisions to make! Would it help if I shared what most people in your situation typically choose?",
                "I totally understand the uncertainty. Let me give you some information that might help clarify things. What's your biggest question right now?",
                "Take your time! Sometimes talking through the options helps. What would be most helpful to discuss first?"
            ]
        },

        overwhelmed: {
            keywords: ['too much', 'overwhelmed', 'confused', 'stressed', 'complicated', 'don\'t know where to start', 'so many options'],
            responses: [
                "I totally understand - event planning can feel overwhelming! Let's take this one step at a time. What feels like the most important thing to figure out first?",
                "Let me simplify this for you. We can break everything down into small, manageable pieces. What would be most helpful to focus on right now?",
                "I hear you! There really are a lot of moving pieces. Good news is, I can guide you through this step by step. Let's start with just the basics.",
                "Totally normal to feel that way! Let me help organize your thoughts. We'll tackle one thing at a time until it all makes sense."
            ]
        },

        budgetConcerns: {
            keywords: ['budget', 'expensive', 'afford', 'cost too much', 'money', 'price range', 'tight budget', 'looking to save'],
            responses: [
                "Budget is so important to get right! I completely understand wanting to be thoughtful about costs. Let me show you options at different price points - what's your comfort zone?",
                "I really appreciate you being upfront about budget! We have several packages designed for different spending levels. What range works best for you?",
                "Money conversations are always important! I'd rather help you find something perfect within your budget than suggest something that doesn't work. What are you thinking?",
                "Smart to think about budget early! We have options from basic to premium. Want me to show you ways to prioritize your spending for maximum impact?"
            ]
        },

        timelinePressure: {
            keywords: ['soon', 'last minute', 'short notice', 'rush', 'quick', 'asap', 'urgent', 'coming up fast'],
            responses: [
                "Short timeline? No problem! I specialize in making great things happen quickly. When exactly is your event?",
                "Last-minute bookings happen more than you'd think! Let me check immediate availability and see what we can make work. What's your date?",
                "I love a good challenge! Quick turnarounds can actually be really exciting. Tell me your date and I'll see what magic we can create.",
                "Don't worry - we've made amazing events happen with even shorter notice! What's your timeline and I'll tell you exactly what's possible."
            ]
        },

        gratitude: {
            keywords: ['thank you', 'thanks', 'appreciate', 'grateful', 'helpful', 'great service'],
            responses: [
                "You're so welcome! I really enjoy helping people plan special events. Is there anything else I can help you with?",
                "My pleasure! It makes my day when I can be helpful. What else can we figure out together?",
                "I'm just happy I could help! That's exactly what I'm here for. Any other questions?",
                "Thank you for saying that! I love what I do, and helping you makes it all worthwhile."
            ]
        },

        apology: {
            keywords: ['sorry', 'apologize', 'my bad', 'mistake', 'wrong'],
            responses: [
                "No need to apologize at all! These things happen. Let's figure out what you need - I'm here to help!",
                "Don't worry about it one bit! I'm just glad we can get things sorted out. What can I help clarify?",
                "No apology needed! I'd rather have you ask questions than leave confused. What would be helpful?",
                "Please don't apologize! Questions and clarifications are exactly what I'm here for."
            ]
        },

        greeting: {
            keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
            responses: [
                "Hello! Welcome to Meghan Hair Studio! I'm here to help you get a quote for DJ/MC and hair styling services. What can I help you with today?",
                "Hi there! Thanks for visiting Meghan Hair Studio. I can help you explore our DJ/MC and hair services. What are you looking for?",
                "Hey! Great to see you here. I'm your virtual assistant for DJ/MC and hair styling quotes. How can I assist you today?"
            ]
        },

        djServices: {
            keywords: ['dj', 'music', 'wedding reception', 'party music', 'sound system', 'mc', 'master of ceremonies'],
            responses: [
                "We offer comprehensive DJ/MC services! Our base packages include:\n• 6-hour Standard Reception ($1,400)\n• 8-hour Premium Reception ($1,600)\n\nTo give you an exact quote, what type of event are you planning?",
                "Our DJ services are perfect for weddings and events! We provide professional sound systems, music libraries, and MC services. Let me get some details to quote you exactly.",
                "Great choice! Our DJ/MC packages include everything from ceremony music to reception entertainment. What's your event type and guest count?"
            ]
        },

        hairServices: {
            keywords: ['hair', 'styling', 'bridal hair', 'bridesmaid', 'cut', 'color', 'wedding hair'],
            responses: [
                "Our hair services include both regular salon services and specialized bridal styling. To give you accurate pricing, what type of event and how many people need services?",
                "We specialize in wedding hair! From bridal trials to bridesmaid styling, we create beautiful looks. Let me get your details for a precise quote.",
                "Perfect! Our hair styling covers everything from precision cuts ($85) to complete bridal packages. What's your event type and guest count?"
            ]
        },

        pricing: {
            keywords: [
                'price', 'cost', 'how much', 'expensive', 'cheap', 'budget', 'quote',
                'estimate', 'total cost', 'what would it cost me', 'price for my event',
                'how much would I pay', 'what do I owe', 'final price', 'breakdown',
                'calculate my cost', 'specific quote', 'exact pricing', 'my total',
                'cost for', 'price out', 'figure out cost', 'ballpark figure'
            ],
            responses: [
                "I'd love to create a personalized quote for you! Let me gather some key details first. What type of event are you planning?",
                "Perfect! Let's build your custom quote step by step. First, tell me - is this for a wedding, party, or other special event?",
                "Great question! I can calculate an exact quote for you. What kind of event do you need services for?"
            ]
        },

        quoteBuilder: {
            keywords: [
                'build quote', 'calculate cost', 'estimate', 'specific price', 
                'what would it cost', 'price my event', 'custom quote', 'get quote',
                'quote me', 'price calculator', 'cost calculator', 'my quote'
            ],
            responses: [
                "Excellent! I'll build a personalized quote for you. Let's start with the basics - what type of event are you planning?",
                "I'd be happy to create your custom quote! First, help me understand your event. Is this a wedding, birthday party, corporate event, or something else?",
                "Let's get you a detailed quote! To start, what kind of celebration or event are you organizing?"
            ]
        },

        eventDetails: {
            keywords: [
                'wedding', 'party', 'reception', 'ceremony', 'celebration', 
                'birthday', 'anniversary', 'corporate event', 'quinceañera',
                'graduation', 'retirement', 'holiday party', 'fundraiser'
            ],
            responses: [
                "Perfect! A {EVENT_TYPE} sounds wonderful. Now, how many guests are you expecting?",
                "Great choice! For your {EVENT_TYPE}, I'll need to know the guest count to give you accurate pricing. How many people will be attending?",
                "Excellent! {EVENT_TYPE} celebrations are so special. What's your expected guest count?"
            ]
        },

        guestCount: {
            keywords: [
                'guests', 'people', 'attendees', 'about', 'around', 'approximately',
                '50', '100', '150', '200', 'small', 'medium', 'large', 'intimate'
            ],
            responses: [
                "Got it! {GUEST_COUNT} guests for your {EVENT_TYPE}. Now, what services do you need - DJ/MC, hair styling, or both?",
                "Perfect! {GUEST_COUNT} people - that helps me calculate the right equipment needs. Do you need DJ services, hair styling, or both?",
                "Excellent! With {GUEST_COUNT} guests, I can recommend the right package size. What services are you interested in?"
            ]
        },

        serviceSelection: {
            keywords: [
                'dj services', 'hair services', 'both', 'everything', 'all services',
                'just dj', 'only hair', 'music only', 'styling only', 'full package'
            ],
            responses: [
                "Perfect! {SERVICES} for your {EVENT_TYPE} with {GUEST_COUNT} guests. Now, how many miles from Portland, Maine will Meghan need to travel for your event?",
                "Excellent choice! {SERVICES} sounds great for {GUEST_COUNT} guests. How many miles from Portland, Maine is your event location?",
                "Great! I have {SERVICES} for your {EVENT_TYPE}. Last question - how many miles from Portland, Maine will Meghan need to travel?"
            ]
        },

        travelDistance: {
            keywords: [
                'miles', 'mile', 'distance', 'away', 'from portland', 'travel',
                '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'
            ],
            responses: [
                "Got it! {TRAVEL_DISTANCE} miles from Portland. Let me calculate your complete quote including round-trip travel.",
                "Perfect! {TRAVEL_DISTANCE} miles - I'll factor in the round-trip travel cost and give you your total quote.",
                "Excellent! {TRAVEL_DISTANCE} miles from Portland. Calculating your quote with travel fees now..."
            ]
        },

        distance: {
            keywords: ['travel', 'distance', 'location', 'far', 'drive', 'miles', 'portland'],
            responses: [
                "We're based in Portland, Maine. Travel within 30 miles is included, and we charge $1 per mile beyond that. Where is your event located?",
                "No problem! We travel throughout Maine and beyond. What city is your event in? I can calculate the travel cost for you.",
                "We love traveling for events! Our base is Portland, Maine. For events over 30 miles away, there's a $1/mile travel charge. Where are you located?"
            ]
        },

        booking: {
            keywords: ['book', 'schedule', 'appointment', 'available', 'date', 'reserve'],
            responses: [
                "Wonderful! To book your services, you can:\n• Visit our StyleSeat page: https://www.styleseat.com/m/v/meghanlaurahair\n• Get a detailed quote first using our calculator\n• Contact us directly\n\nWhat's your preferred next step?",
                "Great! I recommend getting a quote first, then booking through our StyleSeat page. What date are you planning for?",
                "Perfect! Let's get you set up. Would you like me to help you build a quote first, or do you want to go straight to booking?"
            ]
        },

        packages: {
            keywords: ['package', 'bundle', 'deal', 'discount', 'combo', 'everything'],
            responses: [
                "We have great package deals!\n• Complete Coverage Bundle: $800 (saves $150)\n• Entertainment Plus Bundle: $1,200 (saves $200)\n• Technical Pro Bundle: $600 (saves $100)\n\nWhich type of event package interests you?",
                "Our bundles offer significant savings! The Complete Coverage bundle includes ceremony music, cocktail hour, reception, lighting, and effects. Want to learn more?",
                "Smart thinking! Our packages combine popular services at discounted rates. Are you looking for a full wedding package or specific add-ons?"
            ]
        },

        equipment: {
            keywords: ['microphone', 'mic', 'sound', 'speaker', 'equipment', 'setup', 'lighting'],
            responses: [
                "We have extensive equipment options:\n• Professional sound systems (included in base packages)\n• Additional wireless mics ($75 each)\n• Ceremony sound setup ($200)\n• Lighting packages ($300-$500)\n\nWhat specific equipment do you need?",
                "Our equipment is professional-grade! Base packages include sound systems and mics. We also offer subwoofer upgrades, extra mics, and lighting. What's your venue like?",
                "Great question! We bring everything needed for professional events. Are you thinking about extra microphones, special lighting, or visual equipment like TVs?"
            ]
        },

        help: {
            keywords: ['help', 'confused', 'don\'t know', 'not sure', 'what do i need', 'guide me', 'walk me through'],
            responses: [
                "I'm here to help! Let me guide you step by step to get your quote:\n1. What type of event? (wedding, party, etc.)\n2. How many guests?\n3. Where is it located?\n4. What services do you need?\n\nJust tell me about your event and I'll handle the rest!",
                "No worries! Let's make this easy. Start by telling me what you're celebrating - a wedding, birthday, anniversary? I'll guide you from there.",
                "Happy to walk you through this! Think of it like this: I need to know WHAT (event type), WHO (guest count), WHERE (location), and WHICH services. Start anywhere!"
            ]
        },

        confirmation: {
            keywords: [
                'sounds good', 'that works', 'perfect', 'yes', 'correct', 'right',
                'proceed', 'next', 'continue', 'book it', 'let\'s do it'
            ],
            responses: [
                "Wonderful! Your quote is ready. Would you like me to email it to you or take you to our booking page?",
                "Perfect! I'll finalize your quote. How would you like to proceed - email the details or go straight to booking?",
                "Excellent! Your quote is complete. Ready to book or would you like me to send the details to your email first?"
            ]
        },

        rejection: {
            keywords: [
                'no', 'nope', 'not right', 'incorrect', 'wrong', 'not correct',
                'start over', 'restart', 'try again', 'different', 'not what i need',
                'that\'s not right', 'no that\'s wrong', 'not accurate', 'not quite'
            ],
            responses: [
                "No problem! Let me start fresh with you. What type of event are you planning?",
                "Of course! I'll restart your quote. Tell me, what kind of celebration or event do you need services for?",
                "Sure thing! Let's begin again. What type of event are you organizing?"
            ]
        },

        negativeResponse: {
            keywords: [
                'not interested', 'too expensive', 'too much', 'can\'t afford',
                'not in budget', 'out of my price range', 'too costly', 'never mind',
                'forget it', 'not for me', 'i\'ll pass', 'looking elsewhere'
            ],
            responses: [
                "I understand! Weddings and events can add up quickly. Would you like me to show you our most affordable options, or would you prefer to adjust your requirements?",
                "No worries at all! We have flexible options. Would you like to explore smaller packages or different service combinations that might work better for your budget?",
                "That's completely understandable! Let me know if you'd like to discuss modified options or if there's anything else I can help you with."
            ]
        },

        modifications: {
            keywords: [
                'change', 'modify', 'different', 'instead', 'rather', 'actually',
                'can we', 'what if', 'add', 'remove', 'without', 'plus'
            ],
            responses: [
                "Of course! What would you like to change about your quote? I can adjust any details.",
                "No problem! Tell me what you'd like to modify and I'll recalculate everything.",
                "Absolutely! What changes would you like to make? I can update your quote right away."
            ]
        },

        comparison: {
            keywords: [
                'compare', 'difference', 'versus', 'vs', 'which is better', 
                'what\'s the difference', 'recommend', 'suggest', 'best option'
            ],
            responses: [
                "Great question! Let me explain the differences between our options. What specifically would you like me to compare?",
                "I'd be happy to help you choose! Are you comparing DJ packages, hair services, or different combinations?",
                "Perfect! I can break down the options for you. What are you trying to decide between?"
            ]
        },

        timeline: {
            keywords: ['when to book', 'how far in advance', 'timeline', 'schedule', 'when should i', 'peak season', 'busy times'],
            responses: [
                "Great question! I recommend booking 6-12 months in advance for weddings. Peak season (May-October) books fastest. What's your wedding date?",
                "For the best availability, book 6-12 months ahead. Summer weekends fill up quickly! When are you planning your event?",
                "Wedding timeline tip: Book DJ services 6-12 months out, hair trials 6-8 weeks before. What's your event date?"
            ]
        },

        vendorCoordination: {
            keywords: ['other vendors', 'photographer', 'caterer', 'florist', 'work with vendors', 'coordinate', 'recommend'],
            responses: [
                "Absolutely! Meghan works closely with photographers, caterers, and planners. We can coordinate timelines and share vendor recommendations. Need referrals?",
                "Yes! We love collaborating with other wedding pros. Meghan can provide vendor recommendations and coordinate schedules. What vendors do you need?",
                "Definitely! Vendor coordination is included in our premium packages. We work seamlessly with photographers, planners, and venues."
            ]
        },

        dayOfLogistics: {
            keywords: ['day of wedding', 'when do you arrive', 'setup time', 'breakdown', 'timeline day', 'what time', 'rain plan'],
            responses: [
                "We typically arrive 2-3 hours before guests for setup. DJ equipment takes 1 hour, hair services vary by guest count. Need a detailed timeline?",
                "Setup timing: DJ arrives 2-3 hours early, hair team 4-6 hours before ceremony. We coordinate everything for seamless timing!",
                "Day-of logistics: Early arrival for setup, coordination with venue, backup plans ready. Want a customized timeline for your event?"
            ]
        },

        musicRequests: {
            keywords: ['song requests', 'guest requests', 'playlist', 'music list', 'do you have', 'can you play', 'dj music'],
            responses: [
                "Yes! We have an extensive library and take live requests. We also offer a song request portal for $75 where guests can submit songs in advance.",
                "Absolutely! Our DJ takes requests all night. We have 99% of popular songs, and can download anything special you need before your event.",
                "Music requests are welcome! We encourage them. Want to add our Song Request Management Portal to let guests submit favorites ahead of time?"
            ]
        },

        backupPlans: {
            keywords: ['what if', 'backup', 'equipment fails', 'rain', 'power outage', 'emergency', 'plan b'],
            responses: [
                "We always bring backup equipment! Spare mics, backup music sources, and power backups. For outdoor events, we have weather contingency plans.",
                "Great question! We carry backup equipment for everything and have rain plans for outdoor events. Your event will go smoothly regardless!",
                "Backup plans included: Duplicate sound systems, backup power, rain contingencies, and emergency contact protocols. We're prepared for anything!"
            ]
        },

        venueRequirements: {
            keywords: ['venue', 'space requirements', 'power needed', 'setup space', 'electrical', 'outlets', 'restrictions'],
            responses: [
                "We need 3-4 standard outlets within 100ft of the performance area. Setup space: 8x8ft minimum for DJ booth. Want me to send our venue requirements sheet?",
                "Space requirements: 8x8ft for DJ setup, access to power within 100ft, load-in access for equipment. Most venues work perfectly!",
                "Technical needs: Standard 110V power, 8x8ft DJ space, clear load-in path. We can review your venue specs together to ensure everything's perfect!"
            ]
        },

        included: {
            keywords: ['what\'s included', 'included in price', 'comes with', 'part of package', 'extras', 'additional'],
            responses: [
                "Base DJ packages include: Professional sound system, wireless mics, music library, basic lighting, MC services, setup/breakdown, and travel within 30 miles.",
                "Hair packages include: Styling, basic accessories, travel within 30 miles. Trials and additional services are separate. Want the full breakdown?",
                "Great question! Let me break down exactly what's included in your package versus optional add-ons. What service are you asking about?"
            ]
        },

        customization: {
            keywords: ['customize', 'special requests', 'unique needs', 'different', 'modify', 'adjust', 'personalize'],
            responses: [
                "Absolutely! We customize everything - music style, lighting colors, hair accessories, timing. Every event is unique. What special touches are you thinking?",
                "We love customizing! From signature cocktail hour playlists to matching hair accessories to wedding colors. Tell me about your vision!",
                "Customization is our specialty! Special music edits, themed lighting, coordinated styling - we make it uniquely yours. What ideas do you have?"
            ]
        },

        deposits: {
            keywords: ['deposit', 'down payment', 'how much up front', 'payment plan', 'when do i pay'],
            responses: [
                "We require a 25% deposit to book your date, with the balance due 2 weeks before your event. We accept cash, check, and all major credit cards.",
                "Booking deposit: 25% down holds your date. Final payment due 2 weeks prior. We also offer payment plans for larger packages.",
                "To secure your date: 25% deposit required. We'll send a contract and invoice. Payment plans available for packages over $2,000."
            ]
        },

        cancellation: {
            keywords: ['cancel', 'cancellation', 'refund', 'policy', 'what if we cancel', 'change date'],
            responses: [
                "Cancellation policy: 90+ days = full refund minus $200 processing fee. 30-89 days = 50% refund. Less than 30 days = no refund. Date changes may be possible.",
                "We understand plans change! Our cancellation policy is fair and flexible. Want me to send you the complete terms and conditions?",
                "Cancellation terms vary by timing. Early cancellations get better refunds. Rescheduling is often possible with advance notice. Need the full policy?"
            ]
        },

        experience: {
            keywords: ['experience', 'how long', 'credentials', 'qualifications', 'background', 'professional'],
            responses: [
                "Meghan has 10+ years in the industry with both professional DJ training and cosmetology certification. She's done 200+ weddings and counting!",
                "Great question! Meghan is dual-certified in cosmetology and professional DJing, with over a decade of wedding experience. Quality and reliability guaranteed!",
                "Professional credentials: Licensed cosmetologist, certified DJ, 10+ years experience, 200+ successful events. Meghan brings expertise you can trust!"
            ]
        },

        whyChoose: {
            keywords: ['why choose', 'what makes you different', 'better than', 'special about', 'unique', 'advantage'],
            responses: [
                "What makes us unique: You get ONE professional handling both DJ AND hair services! This means perfect coordination, timing, and no vendor conflicts.",
                "The Meghan advantage: Dual expertise in DJ/MC and hair styling, seamless vendor coordination, local Maine knowledge, and personalized service every time.",
                "Why clients choose us: Combined DJ/hair expertise saves money and stress, local reputation for reliability, and Meghan's personal touch on every detail."
            ]
        },

        seasonal: {
            keywords: ['peak season', 'summer pricing', 'winter wedding', 'holiday', 'busy season', 'off season'],
            responses: [
                "Peak season (May-October) books earliest and has highest demand. Off-season weddings (Nov-April) may have more availability and flexible pricing.",
                "Summer wedding tip: Book 8-12 months ahead! Fall foliage season is also very popular. Winter weddings offer unique charm and better availability.",
                "Seasonal considerations: Summer requires earliest booking, spring/fall are gorgeous but busy, winter offers unique beauty and flexibility."
            ]
        },

        preparation: {
            keywords: ['what do i need', 'prepare', 'checklist', 'bring', 'provide', 'ready for'],
            responses: [
                "For DJ services: Song requests list, timeline, special announcements. For hair: Clean hair, reference photos, hair accessories if desired.",
                "Preparation checklist: Music must-haves and do-not-plays, event timeline, hair inspiration photos, and any special requests. We'll guide you through everything!",
                "We make prep easy! I'll send you our planning packet with checklists, timeline templates, and everything you need for a perfect event."
            ]
        },

        availability: {
            keywords: ['available', 'availability', 'free', 'open', 'dates available', 'check calendar'],
            responses: [
                "I'd love to check availability for you! What's your event date? I can let you know what services are open and provide pricing.",
                "Great question! Availability varies by season and service. What date are you considering? I can check both DJ and hair availability.",
                "To check availability: I need your event date and location. Summer weekends book fastest, but we often have great options!"
            ]
        },

        cartManagement: {
            keywords: ['show cart', 'view cart', 'my cart', 'what\'s in cart', 'cart summary', 'current items'],
            responses: [
                "{CART_SUMMARY}\n\nWould you like to add more services, remove something, or proceed with this quote?"
            ]
        },

        addService: {
            keywords: ['add', 'include', 'want', 'need', 'get', 'with'],
            responses: [
                "I'd be happy to add that to your quote! What specific service would you like to add?",
                "Great! What service would you like to include? I can add DJ equipment, lighting, hair services, or any other options.",
                "Perfect! Tell me what you'd like to add and I'll update your quote."
            ]
        },

        removeService: {
            keywords: ['remove', 'take out', 'delete', 'don\'t want', 'without'],
            responses: [
                "No problem! What would you like to remove from your quote?",
                "I can remove that for you. What service should I take out?",
                "Sure! Tell me what to remove and I'll update your quote."
            ]
        },

        conspiracy: {
            keywords: ['911 was an inside job', '9/11 inside job', 'inside job'],
            responses: [
                "Obviously"
            ]
        },

        // Conversation Management Intents
        clarification: {
            keywords: ['what do you mean', 'can you explain', 'don\'t understand', 'clarify', 'confused about'],
            responses: [
                "Of course! Let me explain that better. What specifically would you like me to clarify?",
                "I'm happy to break that down for you! Which part didn't make sense?",
                "Absolutely! I want to make sure you have all the information you need. What can I explain better?",
                "Great question! Let me give you a clearer explanation. What would be most helpful to clarify?"
            ]
        },

        conversationRepair: {
            keywords: ['that\'s not what i meant', 'no that\'s wrong', 'you misunderstood', 'not what i asked'],
            responses: [
                "I apologize for the confusion! Let me try again. Can you help me understand what you were asking about?",
                "Sorry about that! I want to make sure I get this right. Could you rephrase what you're looking for?",
                "My mistake! Let me listen more carefully. What did you actually want to know about?",
                "I hear you - let me reset and focus on what you really need. Can you tell me again?"
            ]
        },

        pauseOrThinking: {
            keywords: ['hmm', 'let me think', 'give me a second', 'hold on', 'one moment'],
            responses: [
                "Take all the time you need! I'm here whenever you're ready to continue.",
                "No rush at all! Think it through, and I'll be right here when you're ready.",
                "Of course! Take your time thinking about it. I'm not going anywhere!",
                "Absolutely! These are important decisions. Take whatever time you need."
            ]
        },

        // Enhanced conversational responses
        smallTalk: {
            keywords: ['how are you', 'nice weather', 'busy day', 'how\'s business', 'how\'s your day'],
            responses: [
                "I'm doing great, thank you for asking! I love helping people plan their special events. Speaking of which, what brings you here today?",
                "Doing wonderful! Every day I get to help make someone's event dreams come true is a good day. What can I help you create today?",
                "I'm fantastic! There's nothing I enjoy more than talking about events and celebrations. What's your special occasion?",
                "Having a great day, thanks! I love connecting with people about their events. What are you planning?"
            ]
        },

        compliment: {
            keywords: ['you\'re helpful', 'great service', 'impressive', 'you\'re good at this', 'knowledgeable'],
            responses: [
                "That really means a lot to me! I genuinely love helping people create amazing events. What else can we plan together?",
                "Thank you so much! Your event is going to be incredible, and I'm excited to be part of making it happen.",
                "You're so kind! I'm passionate about what I do, and it shows when I'm helping create something special like your event.",
                "I really appreciate that! There's nothing better than knowing I've been helpful. What else can we figure out?"
            ]
        },

        // Enhanced error handling and fallbacks
        misunderstanding: {
            keywords: ['huh', 'what', 'say that again', 'didn\'t catch that'],
            responses: [
                "Let me try explaining that differently. I was saying that {LAST_TOPIC} - does that make more sense?",
                "Sorry, let me be clearer! I was talking about {LAST_TOPIC}. What specific part can I clarify?",
                "Good catch! Let me rephrase that. We were discussing {LAST_TOPIC} - what would you like to know about it?",
                "I should have been clearer! I was explaining {LAST_TOPIC}. Want me to break it down differently?"
            ]
        },

        technicalDifficulty: {
            keywords: ['not working', 'broken', 'error', 'glitch', 'problem with'],
            responses: [
                "I'm sorry you're experiencing technical issues! Let's work around that. Can you tell me what you were trying to do?",
                "Technical problems can be frustrating! Let me help you get what you need. What were you looking for?",
                "Sorry about that technical hiccup! I'm here to help however I can. What information do you need?",
                "Let's solve this together! Technical issues aside, what can I help you with regarding your event?"
            ]
        },

        unknown: {
            keywords: [], // Default fallback
            responses: [
                "I want to make sure I understand what you're looking for! Are you asking about DJ services, hair styling, pricing, or something else entirely?",
                "I'm here to help, but I want to make sure I answer the right question! Could you tell me a bit more about what you need?",
                "I'd love to help you out! I specialize in DJ/MC and hair styling services. What specific information would be most helpful?",
                "I might need a little more context to give you the best answer. Are you planning an event and looking for services, or do you have a different question?",
                "Let me make sure I can help you properly! I'm great with questions about:\n• DJ/MC services and music\n• Hair styling and bridal services\n• Pricing and packages\n• Booking and availability\n\nWhat interests you most?"
            ]
        }
    },

    // Systematic follow-ups based on conversation stage
    systematicFollowUps: {
        afterEventType: "Perfect! For a {EVENT_TYPE}, how many guests are you expecting?",
        afterGuestCount: "Great! {GUEST_COUNT} guests sounds wonderful. Do you need DJ/MC services, hair styling, or both?",
        afterServices: "Excellent! Now, how many miles from Portland, Maine will Meghan need to travel for your event?",
        afterTravelDistance: "Perfect! Let me calculate your complete quote including round-trip travel.",
        afterQuote: "Here's your quote: {TOTAL}. Would you like to book, email this quote, or see more options?"
    },

    // Enhanced contextual follow-up system
    followUps: {
        // Service-specific follow-ups with context awareness
        djServices: [
            "Do you need ceremony music in addition to reception services?",
            "Would you like to add any lighting or special effects?",
            "How many hours do you need DJ services?",
            "Any special music requests or requirements?",
            "Are you thinking about dance floor lighting?",
            "Would you like a song request portal for guests?",
            "Do you need microphones for speeches?"
        ],
        hairServices: [
            "How many people will need hair services?",
            "Do you need trials before the event?",
            "Would you prefer on-location services?",
            "Any specific styling preferences?",
            "Are you thinking updos or down styles?",
            "Do you need services for the bridal party too?",
            "Would you like hair accessories included?"
        ],
        pricing: [
            "Would you like to see package deals for potential savings?",
            "Any additional services you're considering?",
            "Do you have questions about what's included?",
            "Ready to move forward with booking?",
            "Should we explore payment plan options?",
            "Would you like to compare different package levels?",
            "Any budget concerns I can address?"
        ],
        quoteBuilder: [
            "Does this quote look accurate for your needs?",
            "Would you like to adjust anything?",
            "Any questions about the services included?",
            "Ready to proceed with this quote?",
            "Should we add or remove any services?",
            "Would you like to see alternative package options?",
            "Any questions about timing or logistics?"
        ],
        
        // Contextual follow-ups based on conversation state
        contextual: {
            // For users who seem excited
            excitement: [
                "I love your enthusiasm! What other details should we nail down?",
                "Your excitement is contagious! What else can we plan to make this perfect?",
                "This is going to be amazing! What other services are you considering?",
                "I can tell this means a lot to you! What else would make your day complete?"
            ],
            
            // For users who seem uncertain
            uncertainty: [
                "What questions can I answer to help you feel more confident?",
                "Would it help to hear what other couples typically choose?",
                "Are there specific concerns I can address for you?",
                "Would you like me to break down the options more simply?"
            ],
            
            // For budget-conscious users
            budgetConscious: [
                "Want to see our most popular budget-friendly options?",
                "Should we focus on the services that give you the biggest impact?",
                "Would package deals help stretch your budget further?",
                "Are there services you'd prefer to prioritize over others?"
            ],
            
            // For time-pressured users
            timePressed: [
                "What's the most urgent thing to figure out first?",
                "Should we focus on availability and booking?",
                "Do you need me to check immediate availability?",
                "What's your absolute must-have service if we're short on time?"
            ]
        },
        
        // Smart suggestions based on what's been discussed
        smartSuggestions: {
            // If they've mentioned wedding
            wedding: [
                "Most couples also book ceremony music - interested?",
                "Bridal hair trials are really popular - want to add one?",
                "Have you thought about lighting for your reception?",
                "Bridesmaid hair services make the day easier - need those too?"
            ],
            
            // If they've mentioned large guest count
            largeEvent: [
                "With that many guests, you might want extra microphones",
                "Larger events often benefit from upgraded sound systems",
                "Have you considered a song request portal for all your guests?",
                "Lighting really makes a difference with bigger crowds"
            ],
            
            // If they've mentioned outdoor event
            outdoor: [
                "Outdoor events need weather backup plans - want to discuss those?",
                "You'll definitely need power considerations for outdoor DJ setup",
                "Outdoor hair services require special planning - should we talk logistics?",
                "Wind can be a factor for both hair and sound - let's plan for that"
            ]
        }
    },

    // Dynamic follow-up generation based on context
    contextualFollowUps: {
        generateFollowUp(intent, conversationContext) {
            const context = conversationContext;
            
            // Determine user's emotional state
            if (context.engagementLevel === 'excited') {
                return this.getRandomFromArray(ChatbotData.followUps.contextual.excitement);
            }
            
            if (context.mentionedTopics.includes('budget') || context.mentionedTopics.includes('expensive')) {
                return this.getRandomFromArray(ChatbotData.followUps.contextual.budgetConscious);
            }
            
            if (context.mentionedTopics.includes('soon') || context.mentionedTopics.includes('urgent')) {
                return this.getRandomFromArray(ChatbotData.followUps.contextual.timePressed);
            }
            
            // Default to intent-based follow-ups
            const intentFollowUps = ChatbotData.followUps[intent];
            if (intentFollowUps && intentFollowUps.length > 0) {
                return this.getRandomFromArray(intentFollowUps);
            }
            
            return null;
        },
        
        getRandomFromArray(array) {
            if (!array || array.length === 0) return null;
            return array[Math.floor(Math.random() * array.length)];
        },
        
        // Generate smart suggestions based on collected data
        generateSmartSuggestion(collectedData) {
            const suggestions = [];
            
            // Wedding-specific suggestions
            if (collectedData.eventType === 'wedding') {
                if (collectedData.services.includes('dj') && !collectedData.services.includes('hair')) {
                    suggestions.push("Since you're getting DJ services, many couples also book bridal hair styling for convenience!");
                }
                if (collectedData.services.includes('hair') && !collectedData.services.includes('dj')) {
                    suggestions.push("Pairing hair services with our DJ packages often saves money and coordination hassles!");
                }
            }
            
            // Large event suggestions
            if (collectedData.guestCount && collectedData.guestCount > 150) {
                suggestions.push("With over 150 guests, you might want to consider our premium sound package for better coverage!");
            }
            
            // Return random suggestion
            return suggestions.length > 0 ? suggestions[Math.floor(Math.random() * suggestions.length)] : null;
        }
    },

    // Quick action buttons/suggestions
    quickActions: [
        { text: "Get a Quote", action: "quote" },
        { text: "View Cart", action: "cart" },
        { text: "DJ/MC Services", action: "dj" },
        { text: "Bridal Hair", action: "hair" },
        { text: "View Packages", action: "packages" },
        { text: "Check Availability", action: "availability" },
        { text: "Payment Info", action: "payment" },
        { text: "Book Consultation", action: "book" },
        { text: "Start Over", action: "restart" }
    ],

    // Quote generation templates
    quoteTemplates: {
        wedding: {
            baseServices: ['dj-base-1600', 'ceremony-music', 'bridal-styling'],
            recommendedAddOns: ['basic-lighting', 'cocktail-hour', 'bridesmaid-styling'],
            description: 'Complete wedding package with DJ/MC and bridal hair services'
        },
        party: {
            baseServices: ['dj-base-1400'],
            recommendedAddOns: ['premium-lighting', 'karaoke', 'photobooth-4hr'],
            description: 'Party package with DJ/MC services'
        },
        hairOnly: {
            baseServices: ['event-styling'],
            recommendedAddOns: ['precision-cut', 'color-services'],
            description: 'Professional hair styling services'
        }
    },

    // Advanced error handling and conversation recovery
    errorHandling: {
        // Intelligent error recovery based on context
        handleMisunderstanding(userInput, context) {
            const possibleIntents = this.fuzzyMatchIntents(userInput);
            
            if (possibleIntents.length > 0) {
                const topMatch = possibleIntents[0];
                return `I think you might be asking about ${this.formatIntentName(topMatch.intent)}. Did you mean to ask about ${topMatch.description}?`;
            }
            
            // Context-based suggestions
            if (context.currentStep === 'event_type') {
                return "I'm not sure I caught that. Are you planning a wedding, birthday party, corporate event, or something else?";
            }
            
            if (context.currentStep === 'guest_count') {
                return "I didn't quite get the guest count. How many people will be attending your event?";
            }
            
            if (context.currentStep === 'services') {
                return "I want to make sure I understand - are you interested in DJ services, hair styling, or both?";
            }
            
            return this.getHelpfulSuggestion(context);
        },
        
        // Fuzzy matching for partial understanding
        fuzzyMatchIntents(input) {
            const inputWords = input.toLowerCase().split(' ');
            const matches = [];
            
            for (const [intent, data] of Object.entries(ChatbotData.intents)) {
                if (intent === 'unknown') continue;
                
                let score = 0;
                for (const keyword of data.keywords) {
                    for (const word of inputWords) {
                        if (this.similarity(word, keyword) > 0.7) {
                            score += 1;
                        }
                    }
                }
                
                if (score > 0) {
                    matches.push({
                        intent: intent,
                        score: score,
                        description: this.getIntentDescription(intent)
                    });
                }
            }
            
            return matches.sort((a, b) => b.score - a.score);
        },
        
        // Simple string similarity calculation
        similarity(s1, s2) {
            const longer = s1.length > s2.length ? s1 : s2;
            const shorter = s1.length > s2.length ? s2 : s1;
            
            if (longer.length === 0) return 1.0;
            
            const distance = this.levenshteinDistance(longer, shorter);
            return (longer.length - distance) / longer.length;
        },
        
        // Levenshtein distance calculation
        levenshteinDistance(s1, s2) {
            const matrix = [];
            
            for (let i = 0; i <= s2.length; i++) {
                matrix[i] = [i];
            }
            
            for (let j = 0; j <= s1.length; j++) {
                matrix[0][j] = j;
            }
            
            for (let i = 1; i <= s2.length; i++) {
                for (let j = 1; j <= s1.length; j++) {
                    if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            
            return matrix[s2.length][s1.length];
        },
        
        // Get helpful suggestions based on conversation context
        getHelpfulSuggestion(context) {
            const suggestions = [
                "I can help with DJ/MC services, hair styling, pricing, and booking!",
                "Let me know if you'd like to hear about our packages or get a quote.",
                "Are you looking for information about our services or ready to start planning?",
                "Would it help if I explained our most popular services?"
            ];
            
            // Contextual suggestions
            if (context.conversationTurn > 5) {
                suggestions.unshift("We've been chatting for a bit - would you like me to summarize what we've covered?");
            }
            
            if (context.mentionedTopics.length > 0) {
                const lastTopic = context.mentionedTopics[context.mentionedTopics.length - 1];
                suggestions.unshift(`Going back to ${lastTopic}, what else would you like to know?`);
            }
            
            return suggestions[Math.floor(Math.random() * suggestions.length)];
        },
        
        // Format intent names for user display
        formatIntentName(intent) {
            const nameMap = {
                'djServices': 'DJ and music services',
                'hairServices': 'hair styling services',
                'pricing': 'pricing information',
                'booking': 'booking and scheduling',
                'packages': 'service packages',
                'equipment': 'equipment and setup'
            };
            
            return nameMap[intent] || intent.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
        },
        
        // Get intent descriptions for clarification
        getIntentDescription(intent) {
            const descriptions = {
                'djServices': 'our DJ and MC services',
                'hairServices': 'hair styling and bridal services',
                'pricing': 'costs and pricing information',
                'booking': 'scheduling and availability',
                'packages': 'service bundles and deals',
                'equipment': 'sound equipment and setup requirements'
            };
            
            return descriptions[intent] || 'that topic';
        },
        
        // Handle ambiguous input with clarification
        handleAmbiguousInput(input, possibleMeanings) {
            if (possibleMeanings.length === 2) {
                return `I want to make sure I understand - are you asking about ${possibleMeanings[0]} or ${possibleMeanings[1]}?`;
            }
            
            if (possibleMeanings.length > 2) {
                const options = possibleMeanings.map((meaning, i) => `${i + 1}. ${meaning}`).join('\n');
                return `I want to make sure I understand correctly. Are you asking about:\n${options}\n\nJust let me know which one!`;
            }
            
            return "Could you tell me a bit more about what you're looking for?";
        },
        
        // Recovery strategies for different scenarios
        recoveryStrategies: {
            // When conversation gets off track
            conversationRepair() {
                return "Let me refocus on helping you with your event! What's the most important thing you'd like to figure out right now?";
            },
            
            // When user seems confused
            simplification() {
                return "Let me make this super simple! I help with two main things: DJ/music services and hair styling. Which one interests you?";
            },
            
            // When technical issues arise
            technicalFallback() {
                return "If something's not working right, no worries! I can still help you get the information you need. What would you like to know?";
            },
            
            // When user provides incomplete information
            informationGathering(missingInfo) {
                const prompts = {
                    'eventType': 'What type of event are you planning?',
                    'guestCount': 'How many guests will be attending?',
                    'services': 'What services do you need - DJ, hair styling, or both?',
                    'location': 'Where is your event located?'
                };
                
                return prompts[missingInfo] || 'Could you provide a bit more information?';
            }
        }
    },

    // Proactive engagement system
    engagementSystem: {
        // Detect when to proactively engage
        shouldProactivelyEngage(context) {
            // Long conversation without progress
            if (context.conversationTurn > 10 && !context.collectedData.eventType) {
                return 'progress_check';
            }
            
            // User seems hesitant
            if (context.mentionedTopics.includes('uncertain') || context.mentionedTopics.includes('maybe')) {
                return 'reassurance';
            }
            
            // Ready for quote but hasn't asked
            if (context.collectedData.eventType && context.collectedData.guestCount && !context.mentionedTopics.includes('quote')) {
                return 'quote_suggestion';
            }
            
            return null;
        },
        
        // Generate proactive engagement messages
        generateProactiveMessage(type, context) {
            const messages = {
                'progress_check': [
                    "We've covered a lot of ground! Would you like me to put together a quote based on what we've discussed?",
                    "Let me check - do you have everything you need, or are there more questions I can answer?",
                    "How are we doing? Any other information that would be helpful for your planning?"
                ],
                
                'reassurance': [
                    "I sense you might have some concerns. What questions can I answer to help you feel more confident?",
                    "No pressure at all! Take your time, and let me know what information would be most helpful.",
                    "It's totally normal to have questions. What would help you feel more comfortable moving forward?"
                ],
                
                'quote_suggestion': [
                    "Based on what you've told me, I can put together a personalized quote! Would that be helpful?",
                    "You've given me great information! Want me to calculate some pricing options for you?",
                    "I have enough details to create a custom quote for your event. Interested in seeing the numbers?"
                ]
            };
            
            const messageArray = messages[type];
            return messageArray ? messageArray[Math.floor(Math.random() * messageArray.length)] : null;
        }
    },

    // Utility functions
    utils: {
        // Find best matching intent
        findIntent(userInput) {
            const input = userInput.toLowerCase().trim();
            
            // Give priority to single-word negative responses
            if (input === 'no' || input === 'nope' || input === 'wrong') {
                return 'rejection';
            }
            
            // Check for exact restart phrases
            const restartPhrases = ['start over', 'restart', 'try again', 'begin again'];
            if (restartPhrases.some(phrase => input.includes(phrase))) {
                return 'rejection';
            }
            
            let bestMatch = 'unknown';
            let maxMatches = 0;

            for (const [intent, data] of Object.entries(ChatbotData.intents)) {
                if (intent === 'unknown') continue;
                
                const matches = data.keywords.filter(keyword => 
                    input.includes(keyword.toLowerCase())
                ).length;

                if (matches > maxMatches) {
                    maxMatches = matches;
                    bestMatch = intent;
                }
            }

            return bestMatch;
        },

        // Get random response from intent with variable substitution
        getResponse(intent) {
            const intentData = ChatbotData.intents[intent];
            if (!intentData || !intentData.responses.length) {
                return ChatbotData.intents.unknown.responses[0];
            }
            
            const randomIndex = Math.floor(Math.random() * intentData.responses.length);
            let response = intentData.responses[randomIndex];
            
            // Substitute variables with collected data
            const data = ChatbotData.conversationState.collectedData;
            response = response.replace('{EVENT_TYPE}', data.eventType || 'event');
            response = response.replace('{GUEST_COUNT}', data.guestCount || 'your guests');
            response = response.replace('{LOCATION}', data.location || 'your location');
            response = response.replace('{SERVICES}', data.services.join(' and ') || 'your services');
            response = response.replace('{TRAVEL_DISTANCE}', data.travelDistance || 'distance');
            response = response.replace('{CART_SUMMARY}', ChatbotData.conversationState.getCartSummary());
            
            return response;
        },

        // Extract information from user input
        extractEventType(input) {
            const eventTypes = {
                'wedding': ['wedding', 'marry', 'bride', 'groom', 'ceremony', 'reception'],
                'birthday': ['birthday', 'bday', 'birth day', 'celebrating'],
                'anniversary': ['anniversary', 'years married', 'years together'],
                'corporate': ['corporate', 'company', 'business', 'work event'],
                'party': ['party', 'celebration', 'get together', 'bash']
            };
            
            const inputLower = input.toLowerCase();
            for (const [type, keywords] of Object.entries(eventTypes)) {
                if (keywords.some(keyword => inputLower.includes(keyword))) {
                    return type;
                }
            }
            return null;
        },

        // Extract guest count from input
        extractGuestCount(input) {
            const numbers = input.match(/\d+/);
            if (numbers) {
                return parseInt(numbers[0]);
            }
            
            const sizeKeywords = {
                'small': 25, 'intimate': 30, 'medium': 75, 'large': 150, 'huge': 250
            };
            
            const inputLower = input.toLowerCase();
            for (const [size, count] of Object.entries(sizeKeywords)) {
                if (inputLower.includes(size)) {
                    return count;
                }
            }
            return null;
        },

        // Extract location from input
        extractLocation(input) {
            const maineCities = [
                'portland', 'bangor', 'augusta', 'lewiston', 'brunswick', 
                'biddeford', 'sanford', 'scarborough', 'westbrook', 'south portland'
            ];
            
            const inputLower = input.toLowerCase();
            for (const city of maineCities) {
                if (inputLower.includes(city)) {
                    return city.charAt(0).toUpperCase() + city.slice(1);
                }
            }
            
            // Look for general location indicators
            if (inputLower.includes('maine') || inputLower.includes('me')) {
                return 'Maine';
            }
            
            return input.trim(); // Return as-is if not recognized
        },

        // Extract travel distance from input
        extractTravelDistance(input) {
            const inputLower = input.toLowerCase();
            
            // Look for number followed by miles
            const milesMatch = input.match(/(\d+)\s*(miles?|mi)/i);
            if (milesMatch) {
                return parseInt(milesMatch[1]);
            }
            
            // Look for just numbers
            const numberMatch = input.match(/(\d+)/);
            if (numberMatch) {
                const num = parseInt(numberMatch[1]);
                // If it's a reasonable distance (under 500), assume it's miles
                if (num <= 500) {
                    return num;
                }
            }
            
            // Look for distance phrases
            if (inputLower.includes('close') || inputLower.includes('nearby')) {
                return 10; // Assume close means 10 miles
            }
            if (inputLower.includes('far')) {
                return 50; // Assume far means 50 miles
            }
            
            return null;
        },

        // Generate quote based on conversation data
        generateQuote() {
            const data = ChatbotData.conversationState.collectedData;
            if (!ChatbotData.conversationState.canGenerateQuote()) {
                return null;
            }
            
            // Load services data if available
            if (typeof ServicesData === 'undefined') {
                return this.generateBasicQuote(data);
            }
            
            return this.generateDetailedQuote(data);
        },

        // Generate quote from cart
        generateBasicQuote(data) {
            if (data.cart && data.cart.length > 0) {
                // Use cart data
                const services = data.cart.map(item => 
                    `${item.name}: $${item.totalPrice}`
                );
                const total = ChatbotData.conversationState.getCartTotal();
                
                return {
                    services: services,
                    total: total,
                    breakdown: services.join('\n'),
                    cartItems: data.cart
                };
            }
            
            // Fallback to old method if cart is empty
            let total = 0;
            let services = [];
            
            if (data.services.includes('dj') || data.services.includes('both')) {
                const djPrice = data.guestCount > 100 ? 1600 : 1400;
                services.push(`DJ/MC Services (${data.guestCount > 100 ? '8' : '6'} hours): $${djPrice}`);
                total += djPrice;
            }
            
            if (data.services.includes('hair') || data.services.includes('both')) {
                const hairPrice = data.eventType === 'wedding' ? 150 : 95;
                services.push(`Hair Styling: $${hairPrice}`);
                total += hairPrice;
            }
            
            // Add travel based on user-provided distance (round trip)
            if (data.travelDistance && data.travelDistance > 0) {
                const roundTripDistance = data.travelDistance * 2;
                let travelCost = 0;
                
                // Free travel within 30 miles one way (60 miles round trip)
                if (roundTripDistance > 60) {
                    travelCost = (roundTripDistance - 60) * 1;
                }
                
                if (travelCost > 0) {
                    services.push(`Travel (${data.travelDistance} miles each way, ${roundTripDistance} miles total): $${travelCost}`);
                    total += travelCost;
                } else {
                    services.push(`Travel (${data.travelDistance} miles each way): No charge (within free radius)`);
                }
            }
            
            return {
                services: services,
                total: total,
                breakdown: services.join('\n')
            };
        },

        // Estimate distance for basic quote
        estimateDistance(location) {
            if (!location) return 0;
            const locationLower = location.toLowerCase();
            
            const distances = {
                'portland': 0, 'south portland': 5, 'westbrook': 10,
                'scarborough': 15, 'biddeford': 20, 'brunswick': 25,
                'lewiston': 35, 'augusta': 60, 'bangor': 140
            };
            
            for (const [city, miles] of Object.entries(distances)) {
                if (locationLower.includes(city)) {
                    return miles;
                }
            }
            
            return 50; // Default estimate for unknown locations
        },

        // Get follow-up question
        getFollowUp(intent) {
            const followUps = ChatbotData.followUps[intent];
            if (!followUps || !followUps.length) return null;
            
            const randomIndex = Math.floor(Math.random() * followUps.length);
            return followUps[randomIndex];
        },

        // Enhanced response formatting with advanced conversational logic
        formatResponse(intent, userInput) {
            const context = ChatbotData.conversationState.conversationContext;
            
            // Update conversation context
            context.lastUserInput = userInput;
            context.addIntent(intent);
            context.detectCommunicationStyle(userInput);
            
            // Extract topics for context tracking
            this.extractAndTrackTopics(userInput, context);
            
            // Handle restart requests first
            if (intent === 'rejection' || intent === 'negativeResponse') {
                ChatbotData.conversationState.reset();
                return {
                    intent: intent,
                    response: this.getPersonalizedResponse(intent, context),
                    followUp: null,
                    quote: null,
                    quickActions: ChatbotData.quickActions,
                    conversationStep: 'initial',
                    restart: true
                };
            }
            
            // Check for error conditions and handle intelligently
            if (intent === 'unknown') {
                const errorResponse = ChatbotData.errorHandling.handleMisunderstanding(userInput, {
                    currentStep: ChatbotData.conversationState.currentStep,
                    conversationTurn: context.conversationTurn,
                    mentionedTopics: context.mentionedTopics
                });
                
                return {
                    intent: 'error_recovery',
                    response: errorResponse,
                    followUp: "What would be most helpful to discuss?",
                    quote: null,
                    quickActions: ChatbotData.quickActions,
                    conversationStep: ChatbotData.conversationState.currentStep
                };
            }
            
            // Extract information from user input
            this.updateConversationState(userInput);
            
            // Generate personalized response based on communication style and context
            let response = this.getPersonalizedResponse(intent, context);
            
            // Generate contextual follow-up
            let followUp = ChatbotData.contextualFollowUps.generateFollowUp(intent, context);
            
            // Add smart suggestions based on conversation progress
            const smartSuggestion = ChatbotData.contextualFollowUps.generateSmartSuggestion(ChatbotData.conversationState.collectedData);
            if (smartSuggestion && Math.random() > 0.7) { // 30% chance to show smart suggestions
                followUp = smartSuggestion;
            }
            
            let quote = null;
            
            // Generate quote if we have enough information
            if (ChatbotData.conversationState.canGenerateQuote()) {
                quote = this.generateQuote();
                if (quote) {
                    response += `\n\n📋 **Your Quote:**\n${quote.breakdown}\n\n💰 **Total: $${quote.total}**`;
                    followUp = "Does this quote look good? I can email it to you or help you book your services!";
                }
            }
            
            // Check for proactive engagement opportunities
            const engagementType = ChatbotData.engagementSystem.shouldProactivelyEngage({
                conversationTurn: context.conversationTurn,
                mentionedTopics: context.mentionedTopics,
                collectedData: ChatbotData.conversationState.collectedData
            });
            
            if (engagementType && !followUp) {
                followUp = ChatbotData.engagementSystem.generateProactiveMessage(engagementType, context);
            }
            
            // Save updated state
            ChatbotData.conversationState.saveToStorage();
            
            return {
                intent: intent,
                response: response,
                followUp: followUp,
                quote: quote,
                quickActions: ChatbotData.quickActions,
                conversationStep: ChatbotData.conversationState.nextRequiredStep(),
                context: {
                    communicationStyle: context.userCommunicationStyle,
                    engagementLevel: context.engagementLevel,
                    conversationTurn: context.conversationTurn
                }
            };
        },

        // Extract and track conversation topics
        extractAndTrackTopics(userInput, context) {
            const inputLower = userInput.toLowerCase();
            
            // Track topic keywords
            const topicKeywords = [
                'budget', 'expensive', 'cost', 'price', 'wedding', 'party', 'dj', 'hair', 
                'music', 'styling', 'urgent', 'soon', 'available', 'booking', 'quote',
                'ceremony', 'reception', 'bridal', 'outdoor', 'indoor', 'lighting'
            ];
            
            topicKeywords.forEach(keyword => {
                if (inputLower.includes(keyword)) {
                    context.addTopic(keyword);
                }
            });
            
            // Detect engagement level
            const excitementWords = ['amazing', 'perfect', 'love', 'excited', 'wonderful', '!'];
            const uncertaintyWords = ['maybe', 'not sure', 'thinking', 'uncertain'];
            
            const excitementCount = excitementWords.filter(word => inputLower.includes(word)).length;
            const uncertaintyCount = uncertaintyWords.filter(word => inputLower.includes(word)).length;
            
            if (excitementCount > uncertaintyCount && excitementCount > 0) {
                context.engagementLevel = 'excited';
            } else if (uncertaintyCount > 0) {
                context.engagementLevel = 'uncertain';
            } else {
                context.engagementLevel = 'neutral';
            }
        },

        // Generate personalized responses based on communication style and context
        getPersonalizedResponse(intent, context) {
            let baseResponse = this.getResponse(intent);
            
            // Adapt response based on communication style
            if (context.userCommunicationStyle === 'enthusiastic') {
                baseResponse = this.addEnthusiasm(baseResponse);
            } else if (context.userCommunicationStyle === 'formal') {
                baseResponse = this.addFormality(baseResponse);
            }
            
            // Add contextual references
            baseResponse = this.addContextualReferences(baseResponse, context);
            
            return baseResponse;
        },

        // Add enthusiasm to responses
        addEnthusiasm(response) {
            const enthusiasticStarters = ['Awesome!', 'Perfect!', 'I love it!', 'Fantastic!'];
            const enthusiasticEnders = ['This is going to be amazing!', 'I\'m so excited for you!', 'It\'s going to be incredible!'];
            
            if (Math.random() > 0.5) {
                response = enthusiasticStarters[Math.floor(Math.random() * enthusiasticStarters.length)] + ' ' + response;
            }
            
            if (Math.random() > 0.7) {
                response += ' ' + enthusiasticEnders[Math.floor(Math.random() * enthusiasticEnders.length)];
            }
            
            return response;
        },

        // Add formality to responses
        addFormality(response) {
            // Replace casual terms with formal ones
            response = response.replace(/Hey!/g, 'Hello!');
            response = response.replace(/awesome/g, 'excellent');
            response = response.replace(/super/g, 'very');
            response = response.replace(/totally/g, 'certainly');
            
            return response;
        },

        // Add contextual references to responses
        addContextualReferences(response, context) {
            // Reference previous topics if relevant
            if (context.wasRecentlyMentioned('pricing') && response.includes('cost')) {
                response = response.replace('cost', 'cost (as we discussed)');
            }
            
            if (context.wasRecentlyMentioned('wedding') && response.includes('event')) {
                response = response.replace('event', 'wedding');
            }
            
            // Add conversation continuity
            if (context.conversationTurn > 3 && Math.random() > 0.8) {
                const continuityPhrases = [
                    'Building on what we\'ve discussed, ',
                    'Following up on our conversation, ',
                    'As we\'ve been talking about, '
                ];
                const phrase = continuityPhrases[Math.floor(Math.random() * continuityPhrases.length)];
                response = phrase + response.toLowerCase();
            }
            
            return response;
        },

        // Update conversation state based on user input
        updateConversationState(userInput) {
            const data = ChatbotData.conversationState.collectedData;
            let stateChanged = false;
            
            // Extract event type
            if (!data.eventType) {
                const eventType = this.extractEventType(userInput);
                if (eventType) {
                    data.eventType = eventType;
                    ChatbotData.conversationState.currentStep = 'event_type';
                    stateChanged = true;
                }
            }
            
            // Extract guest count
            if (!data.guestCount) {
                const guestCount = this.extractGuestCount(userInput);
                if (guestCount) {
                    data.guestCount = guestCount;
                    ChatbotData.conversationState.currentStep = 'guest_count';
                    stateChanged = true;
                }
            }
            
            // Extract services and add to cart
            if (data.services.length === 0) {
                const inputLower = userInput.toLowerCase();
                if (inputLower.includes('both') || (inputLower.includes('dj') && inputLower.includes('hair'))) {
                    data.services = ['dj', 'hair'];
                    this.addBaseServicesToCart(['dj', 'hair'], data);
                } else if (inputLower.includes('dj') || inputLower.includes('music')) {
                    data.services = ['dj'];
                    this.addBaseServicesToCart(['dj'], data);
                } else if (inputLower.includes('hair') || inputLower.includes('styling')) {
                    data.services = ['hair'];
                    this.addBaseServicesToCart(['hair'], data);
                }
                
                if (data.services.length > 0) {
                    ChatbotData.conversationState.currentStep = 'services';
                    stateChanged = true;
                }
            }
            
            // Extract travel distance
            if (!data.travelDistance) {
                const travelDistance = this.extractTravelDistance(userInput);
                if (travelDistance) {
                    data.travelDistance = travelDistance;
                    ChatbotData.conversationState.currentStep = 'travel_distance';
                    
                    // Add travel to cart if needed
                    const roundTripDistance = travelDistance * 2;
                    if (roundTripDistance > 60) {
                        const travelCost = (roundTripDistance - 60) * 1;
                        ChatbotData.conversationState.addToCart({
                            id: 'travel-fee',
                            name: `Travel (${travelDistance} miles each way)`,
                            price: travelCost,
                            category: 'travel'
                        });
                    }
                    stateChanged = true;
                }
            }
            
            // Save state if anything changed
            if (stateChanged) {
                ChatbotData.conversationState.saveToStorage();
            }
        },

        // Add base services to cart based on user selection
        addBaseServicesToCart(services, data) {
            services.forEach(service => {
                if (service === 'dj') {
                    const djPrice = data.guestCount > 100 ? 1600 : 1400;
                    const hours = data.guestCount > 100 ? 8 : 6;
                    ChatbotData.conversationState.addToCart({
                        id: 'dj-base',
                        name: `DJ/MC Services (${hours} hours)`,
                        price: djPrice,
                        category: 'dj'
                    });
                }
                
                if (service === 'hair') {
                    const hairPrice = data.eventType === 'wedding' ? 150 : 95;
                    ChatbotData.conversationState.addToCart({
                        id: 'hair-base',
                        name: 'Hair Styling',
                        price: hairPrice,
                        category: 'hair'
                    });
                }
            });
        },

        // Format currency
        formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotData;
} else if (typeof window !== 'undefined') {
    window.ChatbotData = ChatbotData;
}
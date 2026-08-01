// Services Data Sheet - Meghan Hair Studio
// All pricing and service information centralized for easy maintenance

const ServicesData = {
    // Base configuration
    config: {
        baseLocation: {
            city: "Portland",
            state: "ME",
            coordinates: { lat: 43.6591, lng: -70.2568 }
        },
        travel: {
            freeRadius: 30, // miles
            ratePerMile: 1.00,
            currency: "USD"
        },
        quoteValidityDays: 30
    },

    // DJ/MC Services
    djServices: {
        basePackages: {
            basic6hr: {
                id: "dj-base-1400",
                name: "Standard Wedding Reception (6 hrs) - Basic",
                description: "6 hours DJ/MC, sound system, music library, basic lighting, setup/breakdown",
                price: 1400,
                duration: 6,
                includes: [
                    "Professional DJ/MC services",
                    "Professional sound system and wireless microphones", 
                    "Comprehensive music library (all genres and eras)",
                    "Professional MC services for announcements and transitions",
                    "Basic lighting package",
                    "Setup and breakdown of all equipment",
                    "Travel fee included for events up to 222 miles from base location"
                ],
                category: "base",
                color: "purple"
            },
            premium8hr: {
                id: "dj-base-1600",
                name: "Standard Wedding Reception (8 hrs) - Premium", 
                description: "8 hours DJ/MC, sound system, music library, basic lighting, setup/breakdown",
                price: 1600,
                duration: 8,
                includes: [
                    "Professional DJ/MC services",
                    "Professional sound system and wireless microphones",
                    "Comprehensive music library (all genres and eras)", 
                    "Professional MC services for announcements and transitions",
                    "Basic lighting package",
                    "Setup and breakdown of all equipment",
                    "Travel fee included for events up to 222 miles from base location"
                ],
                category: "base",
                color: "purple"
            }
        },

        equipment: {
            subwoofer: {
                id: "subwoofer",
                name: "Professional Subwoofer Upgrade",
                description: "Enhanced bass and sound quality",
                price: 150,
                category: "sound",
                color: "blue"
            },
            wirelessMic: {
                id: "wireless-mic", 
                name: "Additional Wireless Handheld Microphones",
                description: "Professional wireless microphones",
                price: 75,
                quantityBased: true,
                maxQuantity: 10,
                category: "sound",
                color: "blue"
            },
            lapelMic: {
                id: "lapel-mic",
                name: "Lapel/Headset Microphones", 
                description: "Hands-free wireless microphones",
                price: 100,
                quantityBased: true,
                maxQuantity: 10,
                category: "sound",
                color: "blue"
            },
            ceremonySound: {
                id: "ceremony-sound",
                name: "Ceremony Location Sound System",
                description: "Separate sound setup for ceremony location", 
                price: 200,
                category: "sound",
                color: "blue"
            }
        },

        visual: {
            tv40: {
                id: "tv-40",
                name: "40\" TV/Monitor for Announcements",
                description: "Display for announcements and information",
                price: 300,
                category: "visual", 
                color: "green"
            },
            tv55: {
                id: "tv-55",
                name: "55\" TV/Monitor for Slideshow/Videos",
                description: "Large display for presentations and videos",
                price: 450,
                category: "visual",
                color: "green"
            },
            projector: {
                id: "projector",
                name: "Projector and Screen Setup",
                description: "Large projection display system",
                price: 400,
                category: "visual",
                color: "green"
            },
            laptop: {
                id: "laptop",
                name: "Laptop for Presentations", 
                description: "Dedicated laptop for slideshows and presentations",
                price: 150,
                category: "visual",
                color: "green"
            }
        },

        lighting: {
            basicUplighting: {
                id: "basic-lighting",
                name: "Basic Uplighting (8 lights)",
                description: "Ambient lighting to enhance venue atmosphere", 
                price: 300,
                lightCount: 8,
                category: "lighting",
                color: "yellow"
            },
            premiumUplighting: {
                id: "premium-lighting", 
                name: "Premium Uplighting (12+ lights)",
                description: "Enhanced lighting package with more coverage",
                price: 500,
                lightCount: 12,
                category: "lighting", 
                color: "yellow"
            },
            danceSpotlight: {
                id: "dance-spotlight",
                name: "Dance Floor Spotlighting", 
                description: "Focused lighting for dance floor",
                price: 200,
                category: "lighting",
                color: "yellow"
            },
            stringLighting: {
                id: "string-lighting",
                name: "String Lighting Installation",
                description: "Romantic string lighting setup",
                price: 250,
                category: "lighting",
                color: "yellow"
            },
            goboProjection: {
                id: "gobo-projection",
                name: "Gobo Monogram Projection",
                description: "Custom monogram or design projection", 
                price: 350,
                category: "lighting",
                color: "yellow"
            }
        },

        additionalServices: {
            extraHours: {
                id: "extra-hours",
                name: "Additional Hours Beyond Package",
                description: "Extended coverage beyond base package",
                price: 200,
                unit: "hour",
                quantityBased: true,
                maxQuantity: 6,
                category: "extended",
                color: "orange"
            },
            ceremonyMusic: {
                id: "ceremony-music", 
                name: "Ceremony Music Service",
                description: "Music for wedding ceremony processional/recessional",
                price: 300,
                category: "extended",
                color: "orange"
            },
            cocktailHour: {
                id: "cocktail-hour",
                name: "Cocktail Hour Background Music",
                description: "Ambient music during cocktail reception", 
                price: 150,
                category: "extended",
                color: "orange"
            },
            brunchMusic: {
                id: "brunch-music",
                name: "Brunch/Farewell Breakfast Music",
                description: "Background music for morning events",
                price: 250,
                category: "extended", 
                color: "orange"
            }
        },

        entertainment: {
            photobooth4hr: {
                id: "photobooth-4hr",
                name: "Photo Booth Rental (4 hours)",
                description: "Interactive photo booth with props and prints", 
                price: 600,
                duration: 4,
                category: "entertainment",
                color: "pink"
            },
            photobooth6hr: {
                id: "photobooth-6hr", 
                name: "Photo Booth Rental (6 hours)",
                description: "Extended photo booth rental with more time",
                price: 800,
                duration: 6,
                category: "entertainment",
                color: "pink"
            },
            karaoke: {
                id: "karaoke",
                name: "Karaoke Setup and Hosting",
                description: "Interactive karaoke entertainment",
                price: 300,
                category: "entertainment",
                color: "pink"
            },
            gaming: {
                id: "gaming",
                name: "Live Gaming Stations", 
                description: "Interactive gaming entertainment",
                price: 400,
                category: "entertainment",
                color: "pink"
            }
        },

        specialEffects: {
            fogMachine: {
                id: "fog-machine",
                name: "Fog Machine/Special Effects",
                description: "Atmospheric effects for dramatic moments",
                price: 200,
                category: "effects",
                color: "red"
            },
            bubbleMachine: {
                id: "bubble-machine",
                name: "Bubble Machine", 
                description: "Fun bubble effects for celebrations",
                price: 150,
                category: "effects",
                color: "red"
            },
            coldSparklers: {
                id: "cold-sparklers",
                name: "Cold Sparklers for First Dance",
                description: "Safe indoor sparkler effects",
                price: 250,
                category: "effects", 
                color: "red"
            },
            wirelessPartyLighting: {
                id: "wireless-party-lighting",
                name: "Wireless Party Lighting",
                description: "Dynamic color-changing party lights",
                price: 300,
                category: "effects",
                color: "red"
            }
        },

        premiumAddOns: {
            venueVisit: {
                id: "venue-visit",
                name: "Pre-wedding Venue Visit",
                description: "Site survey and planning visit",
                price: 200,
                category: "premium",
                color: "indigo"
            },
            timelineCreation: {
                id: "timeline-creation", 
                name: "Detailed Timeline Creation",
                description: "Professional event timeline development",
                price: 150,
                category: "premium",
                color: "indigo"
            },
            vendorCoordination: {
                id: "vendor-coordination",
                name: "Vendor Coordination Calls",
                description: "Coordination with other wedding vendors",
                price: 100,
                category: "premium",
                color: "indigo"
            },
            songRequestPortal: {
                id: "song-request-portal",
                name: "Song Request Management Portal",
                description: "Online portal for guest song requests",
                price: 75,
                category: "premium",
                color: "indigo"
            },
            liveStreaming: {
                id: "live-streaming",
                name: "Live Streaming Audio Feed", 
                description: "Audio streaming for remote guests",
                price: 300,
                category: "premium",
                color: "indigo"
            },
            ceremonyRecording: {
                id: "ceremony-recording",
                name: "Professional Recording of Ceremony",
                description: "High-quality audio recording",
                price: 400,
                category: "premium",
                color: "indigo"
            },
            customPlaylist: {
                id: "custom-playlist",
                name: "Custom Playlist Creation",
                description: "Personalized music curation",
                price: 150,
                category: "premium",
                color: "indigo"
            },
            musicEditing: {
                id: "music-editing",
                name: "Special Music Editing/Mixing",
                description: "Custom music editing and mixing",
                price: 200,
                category: "premium",
                color: "indigo"
            }
        },

        staffing: {
            assistantDJ: {
                id: "assistant-dj",
                name: "Assistant DJ/Technician",
                description: "Additional technical support staff",
                price: 300,
                category: "staffing",
                color: "gray"
            },
            dedicatedMC: {
                id: "dedicated-mc",
                name: "Dedicated MC (separate from DJ)",
                description: "Professional MC separate from DJ duties",
                price: 500,
                category: "staffing", 
                color: "gray"
            },
            setupCrew: {
                id: "setup-crew",
                name: "Setup Crew for Complex Installations",
                description: "Additional crew for complex setups",
                price: 250,
                category: "staffing",
                color: "gray"
            }
        },

        travelLogistics: {
            overnightFee: {
                id: "overnight-fee",
                name: "Overnight Accommodation Fee",
                description: "Hotel accommodation for distant events",
                price: 200,
                category: "travel",
                color: "teal"
            },
            ferryFee: {
                id: "ferry-fee",
                name: "Ferry Transportation Fee",
                description: "Ferry transportation costs",
                price: 150,
                category: "travel",
                color: "teal"
            },
            earlySetup: {
                id: "early-setup", 
                name: "Early Setup Day (day before)",
                description: "Setup day before event",
                price: 300,
                category: "travel",
                color: "teal"
            },
            loadInAssistance: {
                id: "load-in-assistance",
                name: "Load-in Assistance for Difficult Venues",
                description: "Additional help for challenging venues",
                price: 200,
                category: "travel",
                color: "teal"
            }
        }
    },

    // Hair Services
    hairServices: {
        regular: {
            precisionCut: {
                id: "precision-cut",
                name: "Precision Cut",
                description: "Expert cutting techniques that enhance your natural features",
                price: 85,
                category: "regular",
                color: "sky"
            },
            colorServices: {
                id: "color-services", 
                name: "Color Services",
                description: "Full color, highlights, lowlights, and color correction",
                price: 120,
                priceRange: { min: 120, max: 300 },
                category: "regular",
                color: "pink"
            },
            cutColorPackage: {
                id: "cut-color-package",
                name: "Cut & Color Package", 
                description: "Complete transformation with precision cut and color",
                price: 185,
                category: "regular",
                color: "cyan"
            },
            eventStyling: {
                id: "event-styling",
                name: "Special Event Styling",
                description: "Professional styling for weddings and special occasions",
                price: 95,
                category: "regular", 
                color: "purple"
            },
            consultation: {
                id: "consultation",
                name: "Style Consultation",
                description: "In-depth consultation to design your perfect look",
                price: 35,
                category: "regular",
                color: "green"
            },
            maintenance: {
                id: "maintenance",
                name: "Maintenance Touch-Up", 
                description: "Quick cuts and color touch-ups between appointments",
                price: 55,
                category: "regular",
                color: "indigo"
            }
        },

        bridal: {
            bridalStyling: {
                id: "bridal-styling",
                name: "Bridal Hair Styling",
                description: "Wedding day hair styling for the bride",
                basePrice: 150,
                priceRange: { min: 100, max: 500 },
                customPricing: true,
                category: "bridal",
                color: "purple"
            },
            bridalTrial: {
                id: "bridal-trial",
                name: "Bridal Hair Trial",
                description: "Practice session 6-8 weeks before wedding", 
                basePrice: 85,
                priceRange: { min: 50, max: 200 },
                customPricing: true,
                category: "bridal",
                color: "purple"
            },
            bridesmaidStyling: {
                id: "bridesmaid-styling",
                name: "Bridesmaid Hair Styling",
                description: "Hair styling for bridesmaids",
                basePrice: 75,
                priceRange: { min: 50, max: 150 },
                quantityBased: true,
                maxQuantity: 12,
                customPricing: true,
                category: "bridal",
                color: "purple"
            },
            motherStyling: {
                id: "mother-styling", 
                name: "Mother of Bride/Groom Hair Styling",
                description: "Hair styling for mothers of bride/groom",
                basePrice: 85,
                priceRange: { min: 60, max: 150 },
                quantityBased: true,
                maxQuantity: 4,
                customPricing: true,
                category: "bridal",
                color: "purple"
            },
            flowerGirlStyling: {
                id: "flower-girl-styling",
                name: "Flower Girl Hair Styling",
                description: "Hair styling for flower girls",
                basePrice: 45,
                priceRange: { min: 30, max: 80 },
                quantityBased: true,
                maxQuantity: 6,
                customPricing: true,
                category: "bridal", 
                color: "purple"
            }
        },

        onLocation: {
            travelFee: {
                id: "hair-travel-fee",
                name: "Travel Fee for On-Location Service",
                description: "Travel charges for on-site hair services",
                basePrice: 50,
                customPricing: true,
                category: "travel",
                color: "blue"
            },
            minimumService: {
                id: "minimum-service",
                name: "Minimum Service Requirement", 
                description: "Minimum booking for on-location services",
                basePrice: 300,
                customPricing: true,
                category: "policy",
                color: "gray"
            }
        }
    },

    // Package Bundles
    packageBundles: {
        completeCoverage: {
            id: "complete-coverage",
            name: "Complete Coverage Bundle",
            description: "Ceremony music + cocktail hour + reception + basic uplighting + fog machine",
            price: 800,
            savings: 150,
            originalPrice: 950,
            includes: [
                "ceremony-music",
                "cocktail-hour", 
                "dj-base-1400",
                "basic-lighting",
                "fog-machine"
            ],
            category: "bundle",
            color: "green"
        },
        entertainmentPlus: {
            id: "entertainment-plus",
            name: "Entertainment Plus Bundle",
            description: "Photo booth 4hrs + karaoke + premium uplighting + special effects",
            price: 1200,
            savings: 200,
            originalPrice: 1400,
            includes: [
                "photobooth-4hr",
                "karaoke", 
                "premium-lighting",
                "cold-sparklers"
            ],
            category: "bundle",
            color: "green"
        },
        technicalPro: {
            id: "technical-pro",
            name: "Technical Pro Bundle", 
            description: "40\" monitor + wireless mics + live streaming + custom playlist",
            price: 600,
            savings: 100,
            originalPrice: 700,
            includes: [
                "tv-40",
                "wireless-mic",
                "live-streaming",
                "custom-playlist"
            ],
            category: "bundle",
            color: "green"
        }
    },

    // Utility functions to work with the data
    utils: {
        // Get all services as flat array
        getAllServices() {
            const services = [];
            
            // Add DJ services
            Object.values(this.djServices).forEach(category => {
                Object.values(category).forEach(service => services.push(service));
            });
            
            // Add hair services  
            Object.values(this.hairServices).forEach(category => {
                Object.values(category).forEach(service => services.push(service));
            });
            
            // Add bundles
            Object.values(this.packageBundles).forEach(bundle => services.push(bundle));
            
            return services;
        },

        // Get service by ID
        getServiceById(id) {
            return this.getAllServices().find(service => service.id === id);
        },

        // Get services by category
        getServicesByCategory(category) {
            return this.getAllServices().filter(service => service.category === category);
        },

        // Calculate bundle savings
        calculateBundleSavings(bundleId) {
            const bundle = this.packageBundles[bundleId];
            if (!bundle) return 0;
            
            const individualTotal = bundle.includes.reduce((total, serviceId) => {
                const service = this.getServiceById(serviceId);
                return total + (service ? service.price : 0);
            }, 0);
            
            return individualTotal - bundle.price;
        },

        // Format currency
        formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        },

        // Calculate travel charge
        calculateTravelCharge(distance) {
            if (distance <= this.config.travel.freeRadius) return 0;
            return (distance - this.config.travel.freeRadius) * this.config.travel.ratePerMile;
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServicesData;
} else if (typeof window !== 'undefined') {
    window.ServicesData = ServicesData;
}
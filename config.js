// CONFIGURAZIONE SITO + E-COMMERCE

const CONFIG = {
    sito: {
        nome: "Libri d'Impresa",
        email: "info@libridimpresa.it",
        telefono: "+39 02 1234567",
        citta: "Milano"
    },
    
    // EMAIL (Formspree gratuito: formspree.io)
    formspreeEndpoint: "",
    
    // SOCIAL (lascia vuoto se non usi)
    social: {
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        whatsapp: ""
    },
    
    // E-COMMERCE
    // Per i pagamenti, crea Payment Links su Stripe o pulsanti PayPal
    // Incolla qui i link di checkout per ogni prodotto
    prodotti: [
        {
            id: "interfacce",
            nome: "Interfacce",
            autore: "",
            prezzo: 19.99,
            prezzoVecchio: 29.99,
            immagine: "Livro-bestseller-blog-Divirta-c.webp",
            descrizione: "Un libro sulle tecnologie digitali",
            inStock: true,
            // Link checkout Stripe/PayPal (lascia vuoto per ordine via email)
            checkoutUrl: ""
        },
        {
            id: "leadership-digitale",
            nome: "Leadership nel digitale",
            autore: "Marco Rossi",
            prezzo: 24.99,
            immagine: "",
            descrizione: "Guida alla leadership moderna",
            inStock: true,
            checkoutUrl: ""
        },
        {
            id: "crescita-personale",
            nome: "Crescita personale",
            autore: "Giulia Bianchi",
            prezzo: 18.99,
            immagine: "",
            descrizione: "Sviluppa il tuo potenziale",
            inStock: true,
            checkoutUrl: ""
        },
        {
            id: "marketing-strategico",
            nome: "Marketing strategico",
            autore: "Luca Verdi",
            prezzo: 22.99,
            immagine: "",
            descrizione: "Strategie di marketing efficaci",
            inStock: true,
            checkoutUrl: ""
        },
        {
            id: "mindset",
            nome: "Mindset",
            autore: "Anna Neri",
            prezzo: 16.99,
            immagine: "",
            descrizione: "La mentalità del successo",
            inStock: true,
            checkoutUrl: ""
        },
        {
            id: "finanza",
            nome: "Finanza per tutti",
            autore: "Paolo Blu",
            prezzo: 21.99,
            immagine: "",
            descrizione: "Gestione finanziaria semplificata",
            inStock: true,
            checkoutUrl: ""
        }
    ],
    
    // Impostazioni negozio
    negozio: {
        spedizioneGratuitaSopra: 30,
        costoSpedizione: 4.90,
        valuta: "EUR",
        simboloValuta: "€"
    }
};

if (typeof module !== 'undefined') module.exports = CONFIG;

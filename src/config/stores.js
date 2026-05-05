const stores = {
  labany: {
    name: "LABANY",
    title: "LABANY | Moda Feminina",
    tagline: "Moda feminina com estilo e elegância",
    logo: "/logoo.png",
    whatsapp: "5581999999999",

    colors: {
      primary: "#c5a19c",
      secondary: "#eee3cf",
      background: "#f8f1ec",
      text: "#4f3f3c",
    },

    checkout: {
      messageIntro: "Olá! Quero finalizar meu pedido:",
    },
  },

    adstore: {
    name: "ADSTORE",
    title: "ADSTORE | Loja Online",
    tagline: "Tecnologia, acessórios e smartphones",
    logo: "/logoo.png",
    whatsapp: "5581999999999",
    instagram: "https://instagram.com/adstorepe",
    email: "contato@adstore.com.br",
    productsCollection: 'stores/labany/products',
    bannersCollection: 'stores/labany/banners',

    colors: {
        primary: "#111111",
        secondary: "#e5e5e5",
        background: "#ffffff",
        text: "#222222",
    },

    checkout: {
        messageIntro: "Olá! Quero finalizar meu pedido na ADSTORE:",
    },
  },

    jmcamisas: {
      name: "JM Camisas",
      title: "JM Camisas | Loja Online",
      tagline: "Camisas esportivas premium",
      logo: "/stores/jmcamisas/logo.png",
      whatsapp: "5581999999999",
      instagram: "https://instagram.com/jmcamisas",
      email: "contato@jmcamisas.com",
      productsCollection: 'stores/jmcamisas/products',
      bannersCollection: 'stores/jmcamisas/banners',

      colors: {
        primary: "#0D0D0D",      
        secondary: "#D4AF37",   
        background: "#181818",   
        text: "#F5F5F5",
      },

      checkout: {
        messageIntro: "Olá! Quero comprar uma camisa na JM Camisas:",
      },
    },          
}

export default stores
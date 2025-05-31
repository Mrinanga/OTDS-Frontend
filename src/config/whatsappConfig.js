// WhatsApp Configuration
const whatsappConfig = {
    // WhatsApp Cloud API credentials
    accessToken: process.env.REACT_APP_WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.REACT_APP_WHATSAPP_PHONE_NUMBER_ID,
    businessAccountId: process.env.REACT_APP_WHATSAPP_BUSINESS_ACCOUNT_ID,
    apiVersion: 'v17.0',
    apiUrl: `https://graph.facebook.com/v17.0`,
};

export default whatsappConfig; 
import axios from 'axios';
import whatsappConfig from '../config/whatsappConfig';

class WhatsAppService {
    constructor() {
        this.baseUrl = whatsappConfig.apiUrl;
        this.accessToken = whatsappConfig.accessToken;
        this.phoneNumberId = whatsappConfig.phoneNumberId;
        this.businessAccountId = whatsappConfig.businessAccountId;
    }

    // Send a simple text message
    async sendMessage(to, message) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: to,
                    type: "text",
                    text: {
                        preview_url: true,
                        body: message
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            throw error;
        }
    }

    // Send a message with media (image, document, etc.)
    async sendMediaMessage(to, message, mediaUrl, mediaType = 'image') {
        try {
            const response = await axios.post(
                `${this.baseUrl}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: "whatsapp",
                    recipient_type: "individual",
                    to: to,
                    type: mediaType,
                    [mediaType]: {
                        link: mediaUrl,
                        caption: message
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp media message:', error);
            throw error;
        }
    }

    // Send a template message
    async sendTemplateMessage(to, templateName, parameters) {
        try {
            const response = await axios.post(
                `${this.baseUrl}/${this.phoneNumberId}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: to,
                    type: "template",
                    template: {
                        name: templateName,
                        language: {
                            code: "en"
                        },
                        components: [
                            {
                                type: "body",
                                parameters: parameters.map(param => ({
                                    type: "text",
                                    text: param
                                }))
                            }
                        ]
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error sending WhatsApp template message:', error);
            throw error;
        }
    }

    // Get message status
    async getMessageStatus(messageId) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/${messageId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting message status:', error);
            throw error;
        }
    }
}

export default new WhatsAppService(); 
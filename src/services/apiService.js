class ApiService {
    async getLabelData(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/shipment.php?action=label&id=${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching label data:', error);
            throw error;
        }
    }
} 
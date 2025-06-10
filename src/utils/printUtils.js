const { ipcRenderer } = window.require('electron');

export const printContent = async (options = {}) => {
  try {
    const result = await ipcRenderer.invoke('print-content', options);
    return result;
  } catch (error) {
    console.error('Print error:', error);
    throw error;
  }
};

export const generatePDF = async (content, filename) => {
  try {
    const result = await ipcRenderer.invoke('generate-pdf', { content, filename });
    return result;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

// Example usage in a React component:
/*
import { printContent, generatePDF } from '../utils/printUtils';

// For printing
const handlePrint = async () => {
  try {
    await printContent({
      silent: false,
      printBackground: true
    });
  } catch (error) {
    console.error('Print failed:', error);
  }
};

// For PDF generation
const handleGeneratePDF = async () => {
  try {
    const result = await generatePDF('Your content here', 'document.pdf');
    if (result.success) {
      console.log('PDF generated at:', result.filePath);
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
};
*/ 
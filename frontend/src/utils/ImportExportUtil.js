import axios from 'axios';
import {API_URL} from "../config";

export default class ImportExportUtil {
    static async importDatabase(file) {
        const formData = new FormData();
        formData.append('file', file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        return await axios.post(API_URL + 'import_documents_from_json', formData, config)
    }

    static async exportDatabase() {
        window.open(API_URL + 'export_documents_to_json', '_blank');
    }
}
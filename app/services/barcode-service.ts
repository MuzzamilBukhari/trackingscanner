import { BarcodeScanner } from '@nativescript/barcodescanner';
import axios from 'axios';

export class BarcodeService {
    private scanner: BarcodeScanner;
    
    constructor() {
        this.scanner = new BarcodeScanner();
    }

    public async scan(): Promise<string> {
        const available = await this.scanner.available();
        if (!available) {
            throw new Error("Barcode scanner not available");
        }

        const hasPermission = await this.scanner.hasCameraPermission();
        if (!hasPermission) {
            const granted = await this.scanner.requestCameraPermission();
            if (!granted) {
                throw new Error("Camera permission denied");
            }
        }

        const result = await this.scanner.scan({
            formats: "QR_CODE, EAN_13, CODE_128",
            message: "Place the barcode inside the scan area",
            showFlipCameraButton: true,
            showTorchButton: true,
            torchOn: false,
            resultDisplayDuration: 500,
        });

        return result.text;
    }

    public async updateGoogleSheet(trackingNumber: string, googleScriptUrl: string): Promise<boolean> {
        try {
            const response = await axios.post(googleScriptUrl, {
                trackingNumber: trackingNumber
            });
            return response.data.success;
        } catch (error) {
            console.error('Error updating Google Sheet:', error);
            throw error;
        }
    }
}
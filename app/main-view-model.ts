import { Observable } from "@nativescript/core";
import { BarcodeService } from "./services/barcode-service";

export class HelloWorldModel extends Observable {
  private barcodeService: BarcodeService;
  private _message: string;
  private _isScanning: boolean;

  // Replace this with your Google Apps Script Web App URL
  private readonly GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwPX5vZ_b771oCanC0Sx2FKyWmvf4NRAwmDWqHmUaQqDY9h8-W2LutOOxwfWLj8-SI2/exec";

  constructor() {
    super();
    this.barcodeService = new BarcodeService();
    this._message = "Tap to scan a barcode";
    this._isScanning = false;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    if (this._message !== value) {
      this._message = value;
      this.notifyPropertyChange("message", value);
    }
  }

  get isScanning(): boolean {
    return this._isScanning;
  }

  set isScanning(value: boolean) {
    if (this._isScanning !== value) {
      this._isScanning = value;
      this.notifyPropertyChange("isScanning", value);
    }
  }

  async onScanTap() {
    if (this.isScanning) return;

    try {
      this.isScanning = true;
      this.message = "Scanning...";

      const trackingNumber = await this.barcodeService.scan();
      this.message = `Scanned: ${trackingNumber}\nUpdating sheet...`;

      const success = await this.barcodeService.updateGoogleSheet(
        trackingNumber,
        this.GOOGLE_SCRIPT_URL
      );

      this.message = success
        ? `Order ${trackingNumber} marked as returned!`
        : "Failed to update sheet";
    } catch (error) {
      console.error("Scan error:", error);
      this.message = `Error: ${error.message}`;
    } finally {
      this.isScanning = false;
    }
  }
}

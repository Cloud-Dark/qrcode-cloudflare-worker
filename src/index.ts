import { imageSync } from "qr-image";

export interface Env {}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url: URL = new URL(request.url);
    const pathname = url.pathname;
    const size = parseInt(url.searchParams.get("size") || "200");

    if (pathname === "/") {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code Generator</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h1 class="text-center mb-4">QR Code Generator</h1>
        <div class="row">
            <div class="col-md-6">
                <ul class="nav nav-tabs" id="qrTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="text-tab" data-bs-toggle="tab" data-bs-target="#text" type="button" role="tab">Text</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="wifi-tab" data-bs-toggle="tab" data-bs-target="#wifi" type="button" role="tab">Wi-Fi</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="call-tab" data-bs-toggle="tab" data-bs-target="#call" type="button" role="tab">Call</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="sms-tab" data-bs-toggle="tab" data-bs-target="#sms" type="button" role="tab">SMS</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="whatsapp-tab" data-bs-toggle="tab" data-bs-target="#whatsapp" type="button" role="tab">WhatsApp</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="url-tab" data-bs-toggle="tab" data-bs-target="#url" type="button" role="tab">URL</button>
                    </li>
                </ul>
                <div class="tab-content mt-4" id="qrTabContent">
                    <div class="tab-pane fade show active" id="text" role="tabpanel">
                        <form class="qr-form" data-api="/api/qrcode_raw">
                            <label class="form-label">Text:</label>
                            <input type="text" name="text" class="form-control" required>
                            <button type="submit" class="btn btn-primary mt-3">Generate QR Code</button>
                        </form>
                    </div>
                    <div class="tab-pane fade" id="wifi" role="tabpanel">
                        <form class="qr-form" data-api="/api/qrcode_wifi">
                            <label class="form-label">SSID:</label>
                            <input type="text" name="ssid" class="form-control" required>
                            <label class="form-label">Password:</label>
                            <input type="text" name="password" class="form-control">
                            <label class="form-label">Encryption:</label>
                            <select name="encryption" class="form-select">
                                <option value="WPA">WPA</option>
                                <option value="WEP">WEP</option>
                                <option value="">None</option>
                            </select>
                            <button type="submit" class="btn btn-primary mt-3">Generate Wi-Fi QR Code</button>
                        </form>
                    </div>
                    <div class="tab-pane fade" id="call" role="tabpanel">
                        <form class="qr-form" data-api="/api/qrcode_call">
                            <label class="form-label">Phone:</label>
                            <input type="tel" name="phone" class="form-control" required>
                            <button type="submit" class="btn btn-primary mt-3">Generate Call QR Code</button>
                        </form>
                    </div>
                    <div class="tab-pane fade" id="sms" role="tabpanel">
                        <form class="qr-form" data-api="/api/qrcode_sms">
                            <label class="form-label">Phone:</label>
                            <input type="tel" name="phone" class="form-control" required>
                            <label class="form-label">Message:</label>
                            <input type="text" name="message" class="form-control">
                            <button type="submit" class="btn btn-primary mt-3">Generate SMS QR Code</button>
                        </form>
                    </div>
                    <div class="tab-pane fade" id="whatsapp" role="tabpanel">
                        <form class="qr-form" data-api="/api/qrcode_whatsapp">
                            <label class="form-label">Phone:</label>
                            <input type="tel" name="phone" class="form-control" required>
                            <label class="form-label">Message:</label>
                            <input type="text" name="message" class="form-control">
                            <button type="submit" class="btn btn-primary mt-3">Generate WhatsApp QR Code</button>
                        </form>
                    </div>
                    <div class="tab-pane fade" id="url" role="tabpanel">
                        <form class="qr-form" data-api="/api/qrcode_link">
                            <label class="form-label">URL:</label>
                            <input type="url" name="url" class="form-control" required>
                            <button type="submit" class="btn btn-primary mt-3">Generate Link QR Code</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-6 text-center">
                <h4>Generated QR Code</h4>
                <div id="qr-result" class="mt-3"></div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.querySelectorAll('.qr-form').forEach(function(form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                var apiEndpoint = form.getAttribute('data-api');
                var formData = new FormData(form);
                var params = new URLSearchParams(formData).toString();
                var qrImageUrl = apiEndpoint + "?" + params;
                
                document.getElementById('qr-result').innerHTML = '<img src="' + qrImageUrl + '" class="img-fluid" alt="QR Code">';
            });
        });
    </script>
</body>
</html>
`,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    let text: string;
    switch (pathname) {
      case "/api/qrcode_raw":
        text = url.searchParams.get("text") || "https://syahdandev.blogspot.com";
        break;
      case "/api/qrcode_wifi":
        const ssid = url.searchParams.get("ssid") || "";
        const password = url.searchParams.get("password") || "";
        const encryption = url.searchParams.get("encryption") || "WPA";
        text = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
        break;
      case "/api/qrcode_call":
        const phone = url.searchParams.get("phone") || "";
        text = `tel:${phone}`;
        break;
      case "/api/qrcode_sms":
        const smsPhone = url.searchParams.get("phone") || "";
        const message = url.searchParams.get("message") || "";
        text = `sms:${smsPhone}?body=${encodeURIComponent(message)}`;
        break;
      case "/api/qrcode_whatsapp":
        const waPhone = url.searchParams.get("phone") || "";
        const waMessage = url.searchParams.get("message") || "";
        text = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;
        break;
      case "/api/qrcode_link":
        text = url.searchParams.get("url") || "https://syahdandev.blogspot.com";
        break;
      default:
        return new Response("Invalid endpoint", { status: 400 });
    }

    try {
		const qrCodeImage = imageSync(text, { type: "png" });
		return new Response(qrCodeImage, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000"
        }
      });
    } catch (error) {
      return new Response("Error generating QR Code", { status: 500 });
    }
  },
};

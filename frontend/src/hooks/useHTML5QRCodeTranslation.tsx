'use client';

const translates = [
  { en: 'QR code parse error, error =', es: 'Lỗi phân tích mã QR, lỗi =' },
  {
    en: 'Error getting userMedia, error =',
    es: 'Lỗi khi lấy userMedia, lỗi =',
  },
  {
    en: "The device doesn't support navigator.mediaDevices , only supported cameraIdOrConfig in this case is deviceId parameter (string).",
    es: 'Thiết bị không hỗ trợ navigator.mediaDevices, chỉ hỗ trợ cameraIdOrConfig dưới dạng tham số deviceId (chuỗi).',
  },
  {
    en: 'Camera streaming not supported by the browser.',
    es: 'Trình duyệt không hỗ trợ truyền phát camera.',
  },
  {
    en: 'Unable to query supported devices, unknown error.',
    es: 'Không thể truy vấn thiết bị được hỗ trợ, lỗi không xác định.',
  },
  {
    en: 'Camera access is only supported in secure context like https or localhost.',
    es: 'Chỉ hỗ trợ truy cập camera trong ngữ cảnh bảo mật như https hoặc localhost.',
  },
  { en: 'Scanner paused', es: 'Trình quét đã tạm dừng' },
  { en: 'Scanning', es: 'Đang quét' },
  { en: 'Idle', es: 'Nhàn rỗi' },
  { en: 'Error', es: 'Lỗi' },
  { en: 'Permission', es: 'Quyền truy cập' },
  { en: 'No Cameras', es: 'Không có camera' },
  { en: 'Last Match:', es: 'Kết quả cuối:' },
  { en: 'Code Scanner', es: 'Máy quét mã' },
  { en: 'Request Camera Permissions', es: 'Yêu cầu quyền truy cập camera' },
  {
    en: 'Requesting camera permissions...',
    es: 'Đang yêu cầu quyền camera...',
  },
  { en: 'No camera found', es: 'Không tìm thấy camera' },
  { en: 'Stop Scanning', es: 'Dừng quét' },
  { en: 'Start Scanning', es: 'Bắt đầu quét' },
  { en: 'Switch On Torch', es: 'Bật đèn pin' },
  { en: 'Switch Off Torch', es: 'Tắt đèn pin' },
  { en: 'Failed to turn on torch', es: 'Không bật được đèn pin' },
  { en: 'Failed to turn off torch', es: 'Không tắt được đèn pin' },
  { en: 'Launching Camera...', es: 'Đang khởi động camera...' },
  { en: 'Scan an Image File', es: 'Quét tệp hình ảnh' },
  { en: 'Scan using camera directly', es: 'Quét bằng camera trực tiếp' },
  { en: 'Select Camera', es: 'Chọn camera' },
  { en: 'Choose Image', es: 'Chọn ảnh' },
  { en: 'Choose Another', es: 'Chọn ảnh khác' },
  { en: 'No image choosen', es: 'Chưa chọn ảnh nào' },
  { en: 'Anonymous Camera', es: 'Camera ẩn danh' },
  { en: 'Or drop an image to scan', es: 'Hoặc kéo ảnh vào để quét' },
  {
    en: 'Or drop an image to scan (other files not supported)',
    es: 'Kéo ảnh vào để quét (các tệp khác không được hỗ trợ)',
  },
  { en: 'zoom', es: 'thu phóng' },
  { en: 'Loading image...', es: 'Đang tải ảnh...' },
  { en: 'Camera based scan', es: 'Quét bằng camera' },
  { en: 'Fule based scan', es: 'Quét bằng tệp' },
  { en: 'Powered by ', es: 'Cung cấp bởi ' },
  { en: 'Report issues', es: 'Báo lỗi' },
  {
    en: 'NotAllowedError: Permission denied',
    es: 'Từ chối quyền truy cập camera',
  },
];

export class Html5QrcodeTranslate {
  private observer: MutationObserver | null = null;

  constructor(selector: string) {
    const element = document.querySelector(selector);
    if (!element) return;

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            this.translateNode(node as HTMLElement);
          });
        }
      });
    });

    const config = { childList: true, subtree: true };
    this.observer.observe(element, config);
    this.translateNode(element);
  }

  disconnect() {
    this.observer?.disconnect();
  }

  private translate(text: string): string {
    const item = translates.find((t) => t.en === text);
    return item ? item.es : text;
  }

  private translateNode(node: HTMLElement | ChildNode) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) node.textContent = this.translate(text);
    } else if (node.hasChildNodes()) {
      node.childNodes.forEach((child) => this.translateNode(child));
    }
  }
}

interface PayPalButtonActions {
  reject(): Promise<void>
  resolve(): Promise<void>
}

interface PayPalButtonsConfig {
  style?: Record<string, string | boolean | number>
  createOrder(): Promise<string>
  onApprove(data: { orderID: string }): Promise<void>
  onCancel(): void
  onError(error: unknown): void
  onClick?(data: unknown, actions: PayPalButtonActions): Promise<void>
}

interface PayPalButtonsComponent {
  close?(): Promise<void>
  render(container: HTMLElement): Promise<void>
}

interface PayPalNamespace {
  Buttons(config: PayPalButtonsConfig): PayPalButtonsComponent
}

interface Window {
  paypal?: PayPalNamespace
}

interface ImportMetaEnv {
  readonly VITE_CANONICAL_URL?: string
  readonly VITE_PAYPAL_CLIENT_ID?: string
}

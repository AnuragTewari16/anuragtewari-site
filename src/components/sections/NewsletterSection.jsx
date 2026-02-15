<form
  action="https://app.kit.com/forms/9092194/subscriptions"
  method="post"
  target="_blank"
  className="space-y-4"
  data-testid="newsletter-form"
>
  <div className="flex flex-col sm:flex-row gap-3">
    <Input
      type="email"
      name="email_address"
      placeholder="Your email"
      required
      className="h-12 px-4 bg-white border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 rounded-lg"
      data-testid="newsletter-email-input"
    />
    <Button
      type="submit"
      className="bg-brand-primary hover:bg-brand-primary-hover text-white font-medium px-6 h-12 rounded-lg transition-all whitespace-nowrap"
      data-testid="newsletter-submit-btn"
    >
      Join the newsletter
    </Button>
  </div>
</form>

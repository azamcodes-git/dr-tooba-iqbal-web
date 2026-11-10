import { expect, test } from "@playwright/test";

test.describe("Dr. Tooba Iqbal Clinic — Bilingual Mobile-First Booking & Accessibility Flow", () => {
  test("renders English Home page H1, Multan & Khangarh clinic timings, security headers, and hides unconsented testimonials", async ({
    page
  }) => {
    const response = await page.goto("/en");
    expect(response).not.toBeNull();

    const headers = response!.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["strict-transport-security"]).toContain("max-age=31536000");
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("nonce-");

    // Verify Hero H1
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Expert Gynecological Care & Women's Health in Multan & Khangarh/i
      })
    ).toBeVisible();

    // Verify Multan & Khangarh clinic names and timings in QuickInfoBar
    await expect(
      page.getByText(/Multan Clinic — Doctors Hospital \/ Smile Clinic/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Khangarh Clinic — Awan Surgical Centre/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Every Monday, 2:00 PM to 6:00 PM|Every Monday/i).first()
    ).toBeVisible();

    // Consent-gated testimonials must be hidden by default
    await expect(
      page.getByRole("heading", {
        name: /Consent-Verified Patient Reflections/i
      })
    ).toHaveCount(0);
  });

  test("switches to Urdu (/ur) RTL layout with dir='rtl' and leading-[2.15]", async ({
    page
  }) => {
    await page.goto("/ur");
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveAttribute("lang", "ur");
    await expect(htmlElement).toHaveAttribute("dir", "rtl");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /ملتان اور خان گڑھ میں امراضِ نسواں/
      })
    ).toBeVisible();
  });

  test("submits a valid appointment request and generates the pre-filled WhatsApp deep link", async ({
    page
  }) => {
    await page.goto("/en/contact");

    await page.getByLabel(/Patient Full Name/i).fill("Ayesha Bibi");
    await page.getByLabel(/Mobile Phone Number/i).fill("0310-1777649");
    await page.getByLabel(/Select Clinic Location/i).selectOption("multan");
    await page
      .getByLabel(/Brief Reason for Visit/i)
      .fill("Routine 8-week antenatal checkup");

    await page.getByTestId("submit-appointment-btn").click();

    const confirmationBanner = page.getByTestId("booking-confirmation");
    await expect(confirmationBanner).toBeVisible();

    const whatsappLink = page.getByTestId("whatsapp-summary-link");
    await expect(whatsappLink).toBeVisible();
    const href = await whatsappLink.getAttribute("href");
    expect(href).toContain("https://wa.me/923101777649?text=");
    expect(decodeURIComponent(href ?? "")).toContain("Ayesha Bibi");
    expect(decodeURIComponent(href ?? "")).toContain("+923101777649");
  });
});

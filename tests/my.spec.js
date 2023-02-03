import { test, expect, chromium } from "@playwright/test";
import path from "path";

export const createBrowserContext = () => {
  // assuming your extension is built to the 'public' directory
  // const pathToExtension = path.join(__dirname, "./public");
  const userDataDir = "/tmp/test-user-data-dir";
  return chromium.launchPersistentContext(userDataDir, {
    headless: false,
    // args: [`--disable-extensions-except=${pathToExtension}`],
    // ignoreDefaultArgs: ["--disable-component-extensions-with-background-pages"],
  });
};

test.describe("Test some behaviour of page and extension", () => {
  test("Go through", async () => {
    const browserContext = await createBrowserContext();
    const page = await browserContext.newPage();
    await page.goto("https://www.google.com/");

    const searchCombobox = await page.getByRole("combobox");
    expect(searchCombobox).toBeVisible();

    await searchCombobox.fill("planet earth wiki");
    await page.keyboard.press("Enter");

    await page.getByRole("link", { name: /Earth - Wikipedia/ }).click();
    await page.waitForURL("https://en.wikipedia.org/wiki/Earth");

    expect(page.getByText("Earth")).toBeVisible();

    browserContext.close();
  });
});

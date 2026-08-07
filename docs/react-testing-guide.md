# React Testing Guide for the APL Console

## 1. Why we test React code

React tests are not mainly about proving that a component renders.

Their real purpose is to protect **user-facing behaviour**.

A useful test answers questions such as:

- Can the user see the current data?
- Can the user change a value?
- Is the save button enabled or disabled at the correct time?
- Is the correct API payload submitted?
- Does the page preserve settings that are not visible in the form?
- Does the application show success or failure feedback?
- Does navigation happen only after the operation succeeds?

This matters because frontend bugs are often not isolated to one line of code. A small change in form defaults, API types, routing, validation, or state handling can silently break another part of the page.

A good test catches that before the change reaches users.

---

## 2. How testing benefits the console

The APL Console contains several areas where regressions are easy to introduce:

- forms generated from API data
- RTK Query mutations and refetching
- validation with Yup and React Hook Form
- permissions and role-based rendering
- team-aware routing
- loading and disabled states
- hidden settings that still need to be preserved
- API payload transformations
- reusable components used by many pages

Tests give us confidence that these pieces still work together.

For example, a platform settings form may display only:

```ts
version;
hasExternalDNS;
hasExternalIDP;
globalPullSecret;
nodeSelector;
```

But the API object may also contain:

```ts
adminPassword;
isMultitenant;
isPreInstalled;
aiEnabled;
useORCS;
git;
```

A careless implementation could overwrite or remove hidden settings when saving.

A test can explicitly verify that:

- hidden settings are preserved
- unsupported settings are omitted
- form-only values are transformed correctly
- empty values are converted to `null`
- whitespace is trimmed
- empty node selectors are removed

Without tests, these issues may only appear after someone saves settings on a real cluster.

---

## 3. What should be tested

A React test should focus on behaviour that matters to a user or to the application contract.

Good things to test:

```text
The page shows values returned by the API.
The save button is disabled before anything changes.
The save button becomes enabled after editing.
Submitting calls the mutation with the expected payload.
A successful save shows a snackbar.
A successful save navigates back to the overview page.
A failed save does not navigate away.
Loading data shows the loading state.
Fetching data temporarily disables saving.
Hidden API properties are preserved.
```

Less useful things to test:

```text
A component has exactly three div elements.
A MUI component receives an internal class name.
A helper function was called merely because implementation currently uses it.
A React state setter was called.
The component contains a specific internal wrapper.
```

The first group protects behaviour.

The second group mostly protects implementation details.

Implementation-detail tests are brittle. They break during harmless refactors even when the user-facing behaviour remains correct.

---

## 4. Test the component like a user

React Testing Library is designed around one central principle:

> Interact with the page in the same way a user would.

Prefer accessible queries:

```tsx
screen.getByRole("button", { name: "Save Changes" });
screen.getByLabelText("Platform version");
screen.getByRole("checkbox", { name: "Use external DNS" });
screen.getByText("Platform settings");
```

Avoid selecting elements by implementation details:

```tsx
container.querySelector(".MuiButton-root");
container.querySelector("#version-input");
container.querySelector("form > div:nth-child(2)");
```

Accessible queries are better because they verify two things at once:

1. The element exists.
2. The element is accessible to users and assistive technology.

For example:

```tsx
screen.getByRole("button", { name: "Save Changes" });
```

is stronger than:

```tsx
screen.getByTestId("save-button");
```

The first confirms that it is actually a button with a meaningful accessible name.

---

## 5. Query priority

A practical query order is:

### Prefer

```tsx
getByRole;
getByLabelText;
getByText;
getByPlaceholderText;
```

### Use when necessary

```tsx
getByTestId;
```

`data-testid` is acceptable for elements that do not have a meaningful accessible identity, such as a generated node-selector row:

```tsx
<div data-testid={`node-selector-${index}`}>
```

But it should not be the default for buttons, checkboxes, or fields.

---

## 6. `getBy`, `findBy`, and `queryBy`

These query families have different purposes.

### `getBy`

Use when the element should already exist.

```tsx
expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
```

It throws immediately if nothing is found.

### `findBy`

Use when the element appears asynchronously.

```tsx
const versionInput = await screen.findByLabelText("Platform version");
```

Internally, `findBy` waits until the element appears.

### `queryBy`

Use when asserting that something does not exist.

```tsx
expect(
  screen.queryByRole("button", { name: "Save Changes" }),
).not.toBeInTheDocument();
```

Do not use `getBy` for absence checks because it throws before the assertion runs.

---

## 7. `userEvent` versus `fireEvent`

Prefer `userEvent`.

```tsx
const user = userEvent.setup();

await user.clear(versionInput);
await user.type(versionInput, "v2.16.0");
await user.click(saveButton);
```

A common example is testing a file upload:

```tsx
const file = new File(["hello"], "example.txt", {
  type: "text/plain",
});

fireEvent.change(fileInput, {
  target: { files: [file] },
});

expect(screen.getByText("example.txt")).toBeInTheDocument();
```

`userEvent` simulates real interaction more accurately. It triggers focus, keyboard, input, and change behaviour in a realistic sequence.

`fireEvent` triggers one low-level browser event:

```tsx
fireEvent.change(input, {
  target: { value: "v2.16.0" },
});
```

Use `fireEvent` only when:

- testing a low-level event directly
- simulating an event that `userEvent` does not support
- deliberately bypassing pointer-event behaviour
- interacting with a heavily mocked component

Using `fireEvent.click` to bypass a disabled button should be rare. A disabled button cannot be clicked by a real user, so bypassing it can hide a real bug in the test setup or component.

---

## 8. Arrange, Act, Assert

Tests are easier to understand when split into three phases.

```tsx
it("submits the updated platform version", async () => {
  // Arrange
  const user = userEvent.setup();
  render(<PlatformSettingsPage />);

  const versionInput = await screen.findByLabelText("Platform version");

  // Act
  await user.clear(versionInput);
  await user.type(versionInput, "v2.16.0");
  await user.click(screen.getByRole("button", { name: "Save Changes" }));

  // Assert
  await waitFor(() => {
    expect(mockEditSettings).toHaveBeenCalledWith({
      settingId: "otomi",
      body: {
        otomi: expect.objectContaining({
          version: "v2.16.0",
        }),
      },
    });
  });
});
```

Comments are not always necessary, but the test should still clearly follow this structure.

---

## 9. Test names should describe behaviour

Good test names:

```tsx
it("disables saving while settings are being fetched");
it("preserves hidden Otomi settings when saving");
it("removes empty node selectors from the payload");
it("navigates to the settings overview after a successful save");
it("does not navigate when saving fails");
```

Weak test names:

```tsx
it("works");
it("test form");
it("calls handler");
it("renders correctly");
```

A reviewer should understand the expected behaviour by reading only the test names.

---

## 10. Mock external boundaries, not the component being tested

A component test should normally keep the component's own logic real and mock its external dependencies.

For a settings page, reasonable things to mock include:

- RTK Query hooks
- session context
- navigation
- snackbars
- expensive layout components
- complex reusable form controls when they are tested separately

Example:

```tsx
const mockEditSettings = jest.fn();
const mockUnwrap = jest.fn();

jest.mock("redux/otomiApi", () => ({
  useEditSettingsMutation: () => [
    mockEditSettings,
    {
      isLoading: false,
    },
  ],
}));
```

Then:

```tsx
mockEditSettings.mockReturnValue({
  unwrap: mockUnwrap,
});

mockUnwrap.mockResolvedValue(undefined);
```

This reproduces the RTK Query mutation pattern:

```tsx
await editSettings(args).unwrap();
```

---

## 11. A mock must match the real module shape

This is one of the most common causes of confusing test failures.

Suppose production code imports:

```tsx
import snack from "utils/snack";

snack.success("Saved");
```

The mock must provide a default export with a `success` function:

```tsx
const mockSnackSuccess = jest.fn();

jest.mock("utils/snack", () => ({
  __esModule: true,
  default: {
    success: (...args: unknown[]) => mockSnackSuccess(...args),
  },
}));
```

This mock is wrong:

```tsx
jest.mock("utils/snack", () => ({
  success: jest.fn(),
}));
```

because it represents a named export:

```tsx
import { success } from "utils/snack";
```

It does not represent:

```tsx
import snack from "utils/snack";
```

When mocking, always check the production import first.

---

## 12. Why `__esModule: true` sometimes matters

For default exports, Jest may need:

```tsx
{
  __esModule: true,
  default: ...
}
```

Example:

```tsx
jest.mock("layouts/Paper", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
```

Without it, the imported default can end up wrapped incorrectly.

This is especially relevant when Babel or TypeScript compiles ES modules into CommonJS for Jest.

---

## 13. The "Cannot use import statement outside a module" error

The error:

```text
SyntaxError: Cannot use import statement outside a module
```

did not mean the test contained invalid syntax.

The import chain was:

```text
PlatformSettingsPage
→ utils/snack
→ Iconify
→ @iconify/react
```

`@iconify/react` contained ESM syntax, while the Jest configuration ignored transformations inside `node_modules`.

The best fix for the component test was not to change all Jest transformation rules. The test did not need to render the real snackbar icon.

Instead, mock the boundary:

```tsx
jest.mock("utils/snack", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
  },
}));
```

This keeps the test focused and prevents unrelated dependencies from loading.

---

## 14. Mocking React Router navigation

Suppose the page uses:

```tsx
const history = useHistory();

history.push("/settings");
```

Mock it as follows:

```tsx
const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
```

The `jest.requireActual` spread preserves exports such as:

```tsx
Link;
Route;
Redirect;
MemoryRouter;
```

while replacing only `useHistory`.

Then test navigation:

```tsx
await waitFor(() => {
  expect(mockHistoryPush).toHaveBeenCalledWith("/settings");
});
```

---

## 15. Testing RTK Query mutations

RTK Query mutation hooks typically return:

```tsx
const [editSettings, { isLoading }] = useEditSettingsMutation();
```

Calling the mutation returns an object with `.unwrap()`:

```tsx
await editSettings(args).unwrap();
```

A realistic mock is:

```tsx
const mockEditSettings = jest.fn();
const mockUnwrap = jest.fn();

mockEditSettings.mockReturnValue({
  unwrap: mockUnwrap,
});

mockUnwrap.mockResolvedValue(undefined);
```

Then verify both:

```tsx
expect(mockEditSettings).toHaveBeenCalledWith(expectedArguments);
expect(mockUnwrap).toHaveBeenCalledTimes(1);
```

Testing `.unwrap()` matters because it confirms that the component waits for the mutation and handles rejected mutations as exceptions.

---

## 16. Testing successful saves

A successful save often performs several actions:

```tsx
await editSettings(...).unwrap()
await Promise.all([refetch(), refetchSettings()])
reset(values)
snack.success('Platform settings saved successfully')
history.push('/settings')
```

The test should verify the meaningful outcome:

```tsx
await waitFor(() => {
  expect(mockRefetch).toHaveBeenCalledTimes(1);
  expect(mockRefetchSettings).toHaveBeenCalledTimes(1);
  expect(mockSnackSuccess).toHaveBeenCalledWith(
    "Platform settings saved successfully",
  );
  expect(mockHistoryPush).toHaveBeenCalledWith("/settings");
});
```

It is usually unnecessary to test the exact internal order unless that order is functionally important.

---

## 17. Testing rejected saves

Success-only tests are incomplete.

A failed save should usually:

- leave the user on the page
- not display a success snackbar
- not navigate
- retain their form input
- allow global or local error handling to display the failure

Example:

```tsx
it("does not navigate when saving fails", async () => {
  const user = userEvent.setup();

  mockUnwrap.mockRejectedValue(new Error("Save failed"));

  render(<PlatformSettingsPage />);

  const versionInput = await screen.findByLabelText("Platform version");

  await user.clear(versionInput);
  await user.type(versionInput, "v2.16.0");
  await user.click(screen.getByRole("button", { name: "Save Changes" }));

  await waitFor(() => {
    expect(mockUnwrap).toHaveBeenCalledTimes(1);
  });

  expect(mockSnackSuccess).not.toHaveBeenCalled();
  expect(mockHistoryPush).not.toHaveBeenCalled();
});
```

This catches a common bug where navigation happens even though the API request failed.

---

## 18. Testing forms with React Hook Form

React Hook Form updates form state asynchronously.

After editing a field, it can be useful to wait for the UI state that depends on form state:

```tsx
await user.clear(versionInput);
await user.type(versionInput, "v2.16.0");

await waitFor(() => {
  expect(
    screen.getByRole("button", { name: "Save Changes" }),
  ).not.toBeDisabled();
});
```

Do not inspect React Hook Form internals.

Test the visible result:

```text
The button becomes enabled.
The error message appears.
The submitted payload is correct.
```

---

## 19. Testing validation

Validation tests can exist at two levels.

### Schema unit tests

Test the Yup schema directly:

```tsx
it("rejects an empty platform version", async () => {
  await expect(
    platformSettingsSchema.validate({
      version: "",
      hasExternalDNS: false,
      hasExternalIDP: false,
      globalPullSecret: null,
      nodeSelector: [],
    }),
  ).rejects.toThrow();
});
```

These tests are fast and precise.

### Component validation tests

Verify what the user sees:

```tsx
it("shows an error when the version is empty", async () => {
  const user = userEvent.setup();

  render(<PlatformSettingsPage />);

  const versionInput = await screen.findByLabelText("Platform version");

  await user.clear(versionInput);
  await user.click(screen.getByRole("button", { name: "Save Changes" }));

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Platform version is required",
  );
});
```

Schema tests verify validation rules.

Component tests verify that validation is wired into the UI.

Both can be valuable, but do not repeat every schema case through the full component.

---

## 20. Do not over-mock validation

A mock like this:

```tsx
jest.mock("@hookform/resolvers/yup", () => ({
  yupResolver: () => (values: unknown) => ({
    values,
    errors: {},
  }),
}));
```

effectively disables validation.

That can be useful when a test is focused purely on payload transformation or submission logic.

However, it also means the test cannot prove:

- invalid input is rejected
- validation messages are displayed
- required fields prevent submission

Use this mock deliberately.

Do not claim that a test covers validation when the resolver has been mocked to always return no errors.

---

## 21. Testing loading and fetching states

Loading and fetching are not necessarily the same.

For example:

```tsx
isLoading;
```

usually represents the initial request.

```tsx
isFetching;
```

may also become true during a refetch while old data remains visible.

The page may behave differently for each state.

Example tests:

```tsx
it("shows the layout loading state during the initial request", () => {
  mockIsLoading = true;

  render(<PlatformSettingsPage />);

  expect(screen.getByText("Loading platform settings")).toBeInTheDocument();
});
```

```tsx
it("disables saving while settings are being fetched", async () => {
  mockIsFetching = true;

  render(<PlatformSettingsPage />);

  expect(screen.getByRole("button", { name: "Save Changes" })).toBeDisabled();
});
```

---

## 22. Test payloads, not only UI output

For forms, checking visible values is not enough.

The API payload is often the most important part of the behaviour.

Example:

```tsx
expect(mockEditSettings).toHaveBeenCalledWith({
  settingId: "otomi",
  body: {
    otomi: {
      version: "v2.16.0",
      hasExternalDNS: false,
      hasExternalIDP: true,
      nodeSelector: [
        {
          name: "workload-type",
          value: "platform",
        },
      ],
    },
  },
});
```

This protects:

- property names
- nesting
- boolean conversions
- null handling
- hidden fields
- trimming
- filtering
- omission of unsupported values

A form can look correct while sending a broken payload.

---

## 23. Exact matching versus partial matching

Use exact matching when the full payload is part of the contract:

```tsx
expect(mockEditSettings).toHaveBeenCalledWith({
  settingId: "otomi",
  body: {
    otomi: {
      version: "v2.16.0",
      hasExternalDNS: false,
      hasExternalIDP: true,
    },
  },
});
```

Use partial matching when unrelated values make the test noisy:

```tsx
expect(mockEditSettings).toHaveBeenCalledWith(
  expect.objectContaining({
    settingId: "otomi",
    body: {
      otomi: expect.objectContaining({
        version: "v2.16.0",
      }),
    },
  }),
);
```

Do not default to `expect.anything()` everywhere. Overly loose assertions can allow broken payloads to pass.

---

## 24. Hidden settings deserve explicit tests

When a page edits only part of a larger API object, add a test for hidden values.

Example:

```tsx
mockSettingsData = {
  otomi: {
    version: "v2.15.0",
    adminPassword: "preserve-me",
    isMultitenant: true,
    aiEnabled: true,
    git: {
      repoUrl: "https://example.com/repo.git",
    },
  },
};
```

Then verify:

```tsx
expect(mockEditSettings).toHaveBeenCalledWith({
  settingId: "otomi",
  body: {
    otomi: expect.objectContaining({
      adminPassword: "preserve-me",
      isMultitenant: true,
      aiEnabled: true,
    }),
  },
});
```

Also explicitly verify intentionally excluded fields:

```tsx
const submittedOtomi = mockEditSettings.mock.calls[0][0].body.otomi;

expect(submittedOtomi).not.toHaveProperty("git");
```

This documents the intended API behaviour for future reviewers.

---

## 25. Test transformations at boundaries

The most valuable tests are often around transformations between systems.

Examples:

```text
API object → form default values
Form values → API payload
Object → key/value array
Key/value array → object
Empty form values → null
Whitespace values → trimmed values
Route A → route B after changing team
```

These boundaries are where type mismatches and data loss often occur.

---

## 26. Reset mocks before every test

Use:

```tsx
beforeEach(() => {
  jest.clearAllMocks();
});
```

This removes previous call history.

Then reconfigure return values:

```tsx
mockUnwrap.mockResolvedValue(undefined);
mockRefetch.mockResolvedValue(undefined);
mockRefetchSettings.mockResolvedValue(undefined);
```

Without resetting mocks, one test can affect another.

Tests should pass independently and in any order.

---

## 27. `clearAllMocks`, `resetAllMocks`, and `restoreAllMocks`

These are not identical.

### `jest.clearAllMocks()`

Clears calls and results but keeps mock implementations.

Useful in most test suites.

### `jest.resetAllMocks()`

Also removes custom mock implementations.

This can require rebuilding all mocked return values in every test.

### `jest.restoreAllMocks()`

Restores functions replaced with `jest.spyOn`.

Example:

```tsx
jest.spyOn(console, "error").mockImplementation(() => undefined);

afterEach(() => {
  jest.restoreAllMocks();
});
```

---

## 28. Why console errors appear even when tests pass

An error such as:

```text
console.error
Error: AggregateError
at XMLHttpRequest...
```

usually means something in the rendered component tree attempted a real HTTP request.

Common causes:

- an unmocked API hook
- a provider performing initialization
- a translation library loading resources
- an icon or asset loader
- a component not covered by the test mocks
- a mock returning incomplete data and triggering fallback network logic

Do not blindly suppress it.

Find the request source and mock the relevant boundary.

Temporarily adding a strict console guard can help:

```tsx
let consoleErrorSpy: jest.SpyInstance;

beforeEach(() => {
  consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation((...args) => {
      throw new Error(`Unexpected console.error: ${args.join(" ")}`);
    });
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});
```

This makes the test fail exactly when unexpected console output occurs.

Some libraries intentionally use `console.error`, so known messages may need to be filtered carefully.

---

## 29. Avoid arbitrary sleeps

Do not write:

```tsx
await new Promise((resolve) => setTimeout(resolve, 500));
```

This makes tests slow and unreliable.

Wait for the actual expected condition:

```tsx
await waitFor(() => {
  expect(mockEditSettings).toHaveBeenCalledTimes(1);
});
```

Or:

```tsx
expect(await screen.findByText("Saved")).toBeInTheDocument();
```

Tests should wait for behaviour, not time.

---

## 30. Do not put everything inside `waitFor`

Bad:

```tsx
await waitFor(() => {
  expect(versionInput).toHaveValue("v2.16.0");
  expect(mockEditSettings).toHaveBeenCalledTimes(1);
  expect(mockRefetch).toHaveBeenCalledTimes(1);
  expect(mockSnackSuccess).toHaveBeenCalled();
  expect(mockHistoryPush).toHaveBeenCalled();
});
```

This makes failures harder to understand.

Prefer:

```tsx
expect(versionInput).toHaveValue("v2.16.0");

await waitFor(() => {
  expect(mockEditSettings).toHaveBeenCalledTimes(1);
});

expect(mockEditSettings).toHaveBeenCalledWith(expectedPayload);

await waitFor(() => {
  expect(mockHistoryPush).toHaveBeenCalledWith("/settings");
});
```

Use `waitFor` only for behaviour that is actually asynchronous.

---

## 31. Keep tests independent

A test should not depend on another test having already run.

Bad:

```tsx
it('edits settings', ...)
it('then saves those settings', ...)
```

Each test should arrange its own data and render its own component.

Good:

```tsx
it('edits and saves settings', async () => {
  mockSettingsData = ...
  render(...)
  ...
})
```

---

## 32. Avoid giant tests where possible

A single test that verifies every field, every validation rule, every transformation, loading state, failure state, snackbar, and navigation becomes difficult to review.

Split by behaviour:

```tsx
it("populates the form from current settings");
it("trims node selectors before submitting");
it("removes empty node selectors");
it("submits null for an empty pull secret");
it("preserves hidden Otomi settings");
it("omits Git settings");
it("shows a success snackbar after saving");
it("navigates to the settings overview after saving");
it("does not navigate after a failed save");
```

Some overlap is acceptable, but each test should have one clear reason to fail.

---

## 33. Avoid excessive setup duplication

When several tests use the same default API response, define it once:

```tsx
const createDefaultSettings = () => ({
  otomi: {
    version: "v2.15.0",
    hasExternalDNS: true,
    hasExternalIDP: false,
    globalPullSecret: null,
    nodeSelector: [],
  },
});
```

Then:

```tsx
beforeEach(() => {
  mockSettingsData = createDefaultSettings();
});
```

Use a factory rather than a shared mutable object. Otherwise, one test may mutate data used by another test.

---

## 34. Reusable render helpers

When many providers are required, create a local helper:

```tsx
function renderPage() {
  return render(
    <MemoryRouter>
      <PlatformSettingsPage />
    </MemoryRouter>,
  );
}
```

For application-wide use, create a shared helper:

```tsx
renderWithProviders(<PlatformSettingsPage />);
```

It may include:

- Redux provider
- router
- theme
- translation provider
- snackbar provider
- query clients

Do not include every application provider by default when a lightweight mock is sufficient. More providers mean more unrelated behaviour and slower tests.

---

## 35. Component mock trade-offs

Mocking complex shared components can simplify a page test.

For example, a `KeyValue` component may have its own comprehensive test suite. The page test may replace it with a minimal implementation that still integrates with React Hook Form.

This is reasonable when the mock preserves the behaviour the page depends on:

```tsx
useFieldArray({
  control,
  name: "nodeSelector",
});
```

But a mock that simply renders:

```tsx
<div>KeyValue</div>
```

would make it impossible to test node-selector editing.

The mock should be minimal, but functionally meaningful.

---

## 36. Review the test as documentation

A strong test explains the component's contract.

A reviewer should be able to learn:

- what data the page displays
- what fields users can change
- what values are hidden
- how empty values are handled
- what payload the API expects
- what happens after success
- what happens after failure

If a test is too complicated to understand, the production code may also be doing too much.

---

## 37. What reviewers should look for

When reviewing React tests, ask:

### Does the test protect meaningful behaviour?

Would a real regression cause this test to fail?

### Does the test interact through the UI?

Or is it calling component internals directly?

### Are accessible queries used?

```tsx
getByRole;
getByLabelText;
```

rather than fragile selectors?

### Are asynchronous actions awaited?

```tsx
await user.click(...)
await waitFor(...)
```

### Does the mock match the real import?

Default export versus named export is especially important.

### Is the API payload checked?

A rendered form alone does not prove saving works.

### Are success and failure both considered?

A happy-path-only test leaves important behaviour unprotected.

### Is validation real or mocked out?

The test description should not overstate what it covers.

### Is the test too tightly coupled to implementation?

Would renaming a helper or changing a wrapper break it unnecessarily?

### Does the test produce console errors?

Passing tests should generally not make real network requests or log unexpected errors.

### Is the assertion strict enough?

Avoid vague assertions that allow malformed data to pass.

---

## 38. Common weak patterns

### Testing only that rendering does not crash

```tsx
it("renders", () => {
  render(<PlatformSettingsPage />);
});
```

This gives very little confidence.

Better:

```tsx
it("shows the current platform version", async () => {
  render(<PlatformSettingsPage />);

  expect(await screen.findByLabelText("Platform version")).toHaveValue(
    "v2.15.0",
  );
});
```

### Verifying only that a function was called

```tsx
expect(mockEditSettings).toHaveBeenCalled();
```

Better:

```tsx
expect(mockEditSettings).toHaveBeenCalledWith(expectedPayload);
```

### Using test IDs for everything

```tsx
screen.getByTestId("save");
```

Better:

```tsx
screen.getByRole("button", { name: "Save Changes" });
```

### Mocking the entire component under test

```tsx
jest.mock("./PlatformSettingsPage");
```

This tests nothing meaningful.

### Ignoring rejected requests

Only mocking:

```tsx
mockUnwrap.mockResolvedValue(undefined);
```

without any failure-path test.

---

## 39. Example: a focused settings save test

```tsx
it("saves platform settings and returns to the overview", async () => {
  const user = userEvent.setup();

  mockSettingsData = {
    otomi: {
      version: "v2.15.0",
      hasExternalDNS: false,
      hasExternalIDP: false,
      globalPullSecret: null,
      nodeSelector: [],
      adminPassword: "preserve-me",
    },
  };

  render(<PlatformSettingsPage />);

  const versionInput = await screen.findByLabelText("Platform version");

  await user.clear(versionInput);
  await user.type(versionInput, "v2.16.0");

  await user.click(
    screen.getByRole("button", {
      name: "Save Changes",
    }),
  );

  await waitFor(() => {
    expect(mockEditSettings).toHaveBeenCalledWith({
      settingId: "otomi",
      body: {
        otomi: {
          version: "v2.16.0",
          hasExternalDNS: false,
          hasExternalIDP: false,
          globalPullSecret: null,
          nodeSelector: [],
          adminPassword: "preserve-me",
        },
      },
    });
  });

  expect(mockUnwrap).toHaveBeenCalledTimes(1);

  await waitFor(() => {
    expect(mockRefetch).toHaveBeenCalledTimes(1);
    expect(mockRefetchSettings).toHaveBeenCalledTimes(1);
    expect(mockSnackSuccess).toHaveBeenCalledWith(
      "Platform settings saved successfully",
    );
    expect(mockHistoryPush).toHaveBeenCalledWith("/settings");
  });
});
```

This test protects a complete user flow:

```text
load → edit → save → refresh → feedback → navigation
```

---

## 40. Recommended testing layers

A healthy frontend test suite usually contains several layers.

### Utility tests

Test pure transformations:

```tsx
mapObjectToKeyValueArray;
valueArrayToObject;
normalizeRepoUrl;
filterEmptyNodeSelectors;
```

These are fast and precise.

### Schema tests

Test Yup validation independently.

```tsx
platformSettingsSchema;
createSealedSecretApiResponseSchema;
```

### Component tests

Test one page or component with mocked external boundaries.

```tsx
PlatformSettingsPage;
ConfigureGitModal;
Header;
ListTable;
```

### Integration tests

Use more real providers and multiple components together.

These are useful for routing, Redux state, and API interaction.

### End-to-end tests

Run the real application in a browser and verify critical user journeys.

Examples:

```text
Log in
Switch teams
Edit platform settings
Create a secret
Install an application
```

Not every feature needs all layers. Use the cheapest layer that can reliably protect the behaviour.

---

## 41. Practical definition of a good test

A good React test is:

- easy to understand
- focused on behaviour
- resistant to harmless refactors
- strict about important contracts
- independent from other tests
- free from real network calls
- explicit about asynchronous work
- realistic in how the user interacts
- useful as documentation

The goal is not maximum test count.

The goal is confidence that the console still behaves correctly after changes.

---

## 42. Quick review checklist

Before approving a React test, check:

```text
[ ] The test name clearly describes behaviour.
[ ] The component under test is not mocked.
[ ] External dependencies are mocked at clear boundaries.
[ ] Mocks match the actual export shape.
[ ] Accessible queries are preferred.
[ ] userEvent is used for normal interaction.
[ ] Async interactions are awaited.
[ ] The expected API payload is verified.
[ ] Hidden or preserved fields are considered.
[ ] Loading and error paths are considered where relevant.
[ ] Success feedback and navigation are verified where relevant.
[ ] The test does not make real network requests.
[ ] The test does not rely on arbitrary timeouts.
[ ] The test is not coupled to CSS classes or DOM structure.
[ ] Validation is either tested properly or clearly mocked out.
```

## Final principle

The most useful question when writing or reviewing a test is:

> What realistic regression would this test catch?

When there is no clear answer, the test is probably not adding much value.

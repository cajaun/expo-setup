# Toast

The toast package is a local React Native notification system. It solves one UI problem: how to show short, temporary feedback messages from anywhere in the app without coupling every screen to one fixed toast design.

The package has no backend dependency. It does not fetch data, store data remotely, or know about Firebase, media cards, search, history, or account state. It only manages transient UI messages.

## Purpose

The package acts as both a reusable notification runtime and a small visual component system.

The provider and runtime live in `provider`.

The visible components live in `components`.

The animation behavior lives in `animation`.

The default color and typography rules live in `styles`.

The public TypeScript API lives in `types`.

The app-specific look is injected from the host app through `ToastProvider.toastOptions`.

## Stack

### Runtime stack

React renders the toast component tree.

React Native renders the toast surfaces, text, pressables, and layout views.

React Native Reanimated owns toast entry, exit, stack movement, height animation, and swipe movement.

React Native Gesture Handler owns swipe gestures.

React Native Safe Area Context gives the provider screen edge insets.

React Native Screens provides `FullWindowOverlay` on iOS when available so toasts can appear above more native surfaces.

Expo Symbols renders SF Symbol icons when the host app has `expo-symbols` installed.

### Styling stack

React Native `StyleSheet` provides portable defaults.

Provider `toastOptions.styles` lets the host app inject React Native style objects.

Provider `toastOptions.classNames` lets the host app inject utility classes when its styling system supports class names.

Variant-specific provider options let the host app style only one variant without changing the rest.

## Why This Package Exists

The app needs feedback after actions such as copy, save, share, logout, and delete account.

Those actions happen in different parts of the tree.

Passing a local toast state setter through every route and component would couple unrelated UI.

Mounting one provider near the root gives every child one shared feedback channel.

Keeping styling configurable at the provider boundary lets the package travel between apps without editing internals.

## Public API

The public entry point is `components/toast/index.ts`.

Import from the folder root:

```tsx
import { ToastProvider, useToast, Toast } from "@/components/toast";
```

Do not import provider, component, style, primitive, or animation internals from app screens.

## Provider Setup

`ToastProvider` owns the visible toast list and renders the overlay.

It should be mounted once near the app root.

Example:

```tsx
<ToastProvider>
  <App />
</ToastProvider>
```

App-specific styling belongs in `toastOptions`.

Example:

```tsx
<ToastProvider
  toastOptions={{
    colorScheme: "dark",
    styles: {
      title: { fontFamily: "Or-semibold" },
      description: { fontFamily: "Or-medium" },
    },
    variants: {
      default: {
        styles: {
          toast: {
            backgroundColor: "#202020",
            borderColor: "transparent",
          },
          outline: {
            boxShadow: "inset 0px 0px 0px 0.5px rgba(255,255,255,0.1)",
          },
        },
      },
    },
  }}
>
  <App />
</ToastProvider>
```

## Runtime Architecture

The toast runtime has four layers.

### 1. Provider layer

`provider/provider.tsx` owns the toast list.

It exposes `toast.show` and `toast.hide`.

It stores toast entries in a reducer.

It creates a component function for each toast request.

It renders the overlay only when at least one toast exists.

Why it works this way:

The provider is the only layer that needs to know the full toast queue.

Screens only need a small command API.

The reducer keeps show and hide transitions explicit.

### 2. Config layer

`provider/toast-config.context.ts` exposes global toast config.

The config includes default placement, default variant, swipe behavior, animation behavior, and `toastOptions`.

Why it exists:

The visual component needs styling and default behavior, but it should not import app code.

Context lets the provider pass those decisions downward without prop drilling every slot.

### 3. Component layer

`components/toast.tsx` owns the compound toast component.

It defines:

`Toast.Root`

`Toast.Title`

`Toast.Description`

`Toast.Action`

`Toast.Close`

It also exports `DefaultToast`, which is the layout used by `toast.show({ label, description })`.

Why it exists:

Most app toasts use the same visual structure.

Custom toasts can still use the compound pieces directly.

### 4. Animation layer

`animation/toast.animation.ts` owns motion and swipe behavior.

It computes animated style for each toast.

It controls stack offset, opacity, scale, height, entry, exit, and gesture dismissal.

Why it exists:

Motion state is separate from content.

The title and description should not know how the toast enters or exits.

## Folder Map

```txt
components/toast/
  index.ts                       public exports
  README.md                      package documentation
  toast.md                       compact API notes

  provider/
    provider.tsx                 ToastProvider and useToast
    reducer.ts                   toast state reducer
    toast-config.context.ts      global config context
    toast-item-renderer.tsx      memoized toast renderer
    insets-container.tsx         safe area wrapper
    full-window-overlay.tsx      iOS overlay wrapper

  components/
    toast.tsx                    compound Toast and DefaultToast
    button.tsx                   portable action/close button
    text.tsx                     portable text component
    icons.tsx                    close and variant icon rendering
    toast.constants.ts           display names
    toast.hooks.ts               layout helper hooks

  styles/
    toast.styles.ts              default variant colors and base styles
    theme.ts                     small local color helper

  animation/
    toast.animation.ts           root animation and swipe handling
    animation-settings.tsx       animation disable context

  primitives/
    toast.primitive.tsx          low-level primitive components
    slot.tsx                     asChild slot helpers
    toast.primitive.types.ts     primitive types

  types/
    types.ts                     provider and show API types
    toast.types.ts               compound component types
    portable.types.ts            portable RN helper types

  utils/
    utils.ts                     cn, createContext, animation helpers
```

## Toast Variants

The variant model is semantic.

`default` means neutral feedback.

`info` means useful information.

`success` means an action completed.

`warning` means the user needs to take care or grant permission.

`danger` means an action failed or is destructive.

Example:

```tsx
toast.show({
  label: "Photo access needed",
  description: "Allow photo access to save the card.",
  variant: "warning",
});
```

## Default Icons

Semantic variants can show icons without every call site repeating the same symbol.

`info` uses `info.circle.fill`.

`success` uses `checkmark.circle.fill`.

`warning` uses `exclamationmark.triangle.fill`.

`danger` uses `exclamationmark.circle.fill`.

`default` does not show an icon unless an icon is passed.

Explicit icons always win.

Example:

```tsx
toast.show({
  label: "Saved",
  variant: "success",
  icon: "checkmark.seal.fill",
});
```

## Toast Show API

Simple string:

```tsx
toast.show("Copied");
```

Configured toast:

```tsx
toast.show({
  label: "Saved",
  description: "Image saved to your gallery.",
  variant: "success",
  placement: "top",
  duration: 2500,
});
```

Custom component:

```tsx
toast.show({
  component: (props) => (
    <Toast variant="info" {...props}>
      <Toast.Title>Custom toast</Toast.Title>
      <Toast.Description>Custom content.</Toast.Description>
    </Toast>
  ),
});
```

## Typography

The toast package exposes a typography scale through `ToastTextSize`.

Available values:

```ts
type ToastTextSize =
  | "largeTitle"
  | "title"
  | "title2"
  | "title3"
  | "headline"
  | "body"
  | "callout"
  | "subheadline"
  | "footnote"
  | "caption"
  | "caption2";
```

Default label size is `subheadline`.

Default description size is `footnote`.

Set both text sizes:

```tsx
toast.show({
  label: "Copied",
  description: "Text copied to clipboard.",
  textSize: "callout",
});
```

Set each text size separately:

```tsx
toast.show({
  label: "Copied",
  description: "Text copied to clipboard.",
  labelTextSize: "headline",
  descriptionTextSize: "caption",
});
```

## Provider Styling API

`toastOptions.styles` applies to all variants.

`toastOptions.classNames` applies class names to all variants.

`toastOptions.variants` applies overrides to one variant.

Variant overrides run after global provider options.

Supported slots:

`toast`

`title`

`description`

`content`

`icon`

`actionButton`

`closeButton`

`outline`

Example:

```tsx
<ToastProvider
  toastOptions={{
    colorScheme: "light",
    styles: {
      toast: { borderRadius: 20 },
      title: { color: "#111111" },
      description: { color: "#666666" },
    },
    variants: {
      default: {
        styles: {
          toast: { backgroundColor: "#F8F8F8" },
        },
      },
    },
  }}
>
  <App />
</ToastProvider>
```

## Animation Model

Each toast receives an index and the total visible count.

The animation hook uses those values to compute stack position.

The root supports top and bottom placement.

Swipe dismissal calls `hide(id)`.

Height measurement happens with a hidden copy of the toast.

The hidden copy exists so the visible toast can animate height changes without guessing content size.

## Insets And Overlay

`provider/insets-container.tsx` applies safe area padding.

On iOS, `provider/full-window-overlay.tsx` uses `FullWindowOverlay` when available.

The provider accepts `disableFullWindowOverlay` for debugging with the React Native inspector.

## Boundaries

The toast package should not import app screens.

The toast package should not know about Firebase.

The toast package should not know about media cards.

The toast package should not know about history.

The toast package should not hard-code app fonts or app default surfaces when those can be passed through `toastOptions`.

The toast package may own reusable semantic defaults such as success, warning, info, and danger colors.

## How To Add A Toast At A Call Site

Import the hook.

```tsx
import { useToast } from "@/components/toast";
```

Read the toast controller.

```tsx
const { toast } = useToast();
```

Call `toast.show` after the action resolves.

```tsx
await Clipboard.setStringAsync(text);

toast.show({
  label: "Copied",
  description: "Text copied to clipboard.",
  variant: "success",
});
```

## Summary

The toast package is a root-mounted feedback system for React Native. The provider owns queue state and app-level styling. Components own the visible toast pieces. Animation owns entry, exit, stacking, and swipe dismissal. Call sites only ask for feedback with `toast.show`, which keeps action logic and notification rendering separate.

# Toast API Notes

## 1. What This File Is

1. This file is a short API companion for `README.md`.
2. The full first-principles explanation lives in `README.md`.
3. This file exists for quick lookup when editing toast calls.

## 2. Public Import

```tsx
import { ToastProvider, useToast, Toast } from "@/components/toast";
```

## 3. Provider Setup

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
          toast: { backgroundColor: "#202020" },
        },
      },
    },
  }}
>
  <App />
</ToastProvider>
```

## 4. Simple Toast

```tsx
const { toast } = useToast();

toast.show("Copied");
```

## 5. Config Toast

```tsx
toast.show({
  label: "Saved",
  description: "Image saved to your gallery.",
  variant: "success",
  placement: "top",
  duration: 2500,
});
```

## 6. Variants

1. `default`
2. `info`
3. `success`
4. `warning`
5. `danger`

## 7. Typography

```tsx
toast.show({
  label: "Copied",
  description: "Text copied to clipboard.",
  labelTextSize: "headline",
  descriptionTextSize: "caption",
});
```

## 8. Icons

```tsx
toast.show({
  label: "Saved",
  variant: "success",
  iconSize: 18,
});
```

## 9. Custom Component

```tsx
toast.show({
  component: (props) => (
    <Toast variant="info" {...props}>
      <Toast.Title>Custom</Toast.Title>
      <Toast.Description>Custom toast layout.</Toast.Description>
    </Toast>
  ),
});
```

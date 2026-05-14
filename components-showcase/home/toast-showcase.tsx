import React from "react";
import * as AC from "@bacons/apple-colors";

import { useToast } from "@/components/toast";
import * as Form from "@/components/ui/form";
import { metrics } from "./constants";

export function ToastShowcase() {
  const { toast } = useToast();

  return (
    <>
      <Form.Section
        title="Toast variants"
        footer="Tap a row to preview the variant and its default treatment."
        outerStyle={{ paddingHorizontal: 0 }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: metrics.panelRadius,
        }}
        separatorInset="content"
      >
        <Form.Text
          systemImage={{ name: "text.bubble.fill", color: AC.systemGray }}
          hint="Default"
          onPress={() => toast.show("Copied")}
        >
          String toast
        </Form.Text>
        <Form.Text
          systemImage={{ name: "info.circle.fill", color: AC.systemBlue }}
          hint="Info"
          onPress={() =>
            toast.show({
              label: "Sync started",
              description: "We will let you know when it finishes.",
              variant: "info",
              icon: "info.circle.fill",
              duration: 3000,
            })
          }
        >
          Info toast
        </Form.Text>
        <Form.Text
          systemImage={{ name: "checkmark.circle.fill", color: AC.systemGreen }}
          hint="Success"
          onPress={() =>
            toast.show({
              label: "Saved",
              description: "Your settings were updated.",
              variant: "success",
              icon: "checkmark.seal.fill",
              placement: "top",
              duration: 2500,
            })
          }
        >
          Success toast
        </Form.Text>
        <Form.Text
          systemImage={{
            name: "exclamationmark.triangle.fill",
            color: AC.systemOrange,
          }}
          hint="Warning"
          onPress={() =>
            toast.show({
              label: "Photo access needed",
              description: "Allow photo access before saving images.",
              variant: "warning",
              duration: 4000,
            })
          }
        >
          Warning toast
        </Form.Text>
        <Form.Text
          systemImage={{ name: "xmark.octagon.fill", color: AC.systemRed }}
          hint="Danger"
          onPress={() =>
            toast.show({
              label: "Upload failed",
              description: "Check your connection and try again.",
              variant: "danger",
              duration: 3500,
            })
          }
        >
          Danger toast
        </Form.Text>
      </Form.Section>

      <Form.Section
        title="Rich toasts"
        footer="Rich toasts can stay persistent, include actions, or stack with other messages."
        outerStyle={{ paddingHorizontal: 0 }}
        style={{
          backgroundColor: "#f8f8f8",
          borderRadius: metrics.panelRadius,
        }}
        separatorInset="content"
      >
        <Form.Text
          systemImage={{ name: "arrow.down.circle.fill", color: AC.systemBlue }}
          hint="Persistent"
          onPress={() =>
            toast.show({
              label: "Download in progress",
              description: "This toast stays until dismissed.",
              variant: "info",
              icon: "arrow.down.circle.fill",
              actionLabel: "Dismiss",
              onActionPress: () => toast.hide(),
              duration: "persistent",
            })
          }
        >
          Persistent rich toast
        </Form.Text>
        <Form.Text
          systemImage={{ name: "square.stack.3d.up.fill", color: AC.systemTeal }}
          hint="Stack"
          onPress={() => {
            toast.show({
              label: "First toast",
              description: "Stacked feedback stays readable.",
              variant: "info",
            });
            toast.show({
              label: "Second toast",
              description: "Newer messages join the stack.",
              variant: "success",
            });
          }}
        >
          Show stacked toasts
        </Form.Text>
      </Form.Section>
    </>
  );
}
